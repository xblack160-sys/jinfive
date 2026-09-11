import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Sparkles, Send, Bot, User, Lightbulb, 
  Copy, Check 
} from 'lucide-react';
import { ChatMessage, Lesson, Chapter } from '../types';
import { getLocalMentorResponse } from '../utils/aiMentorFallback';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface AiMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLesson?: Lesson;
  currentChapter?: Chapter;
  isDevMode?: boolean;
}

export const AiMentorDrawer: React.FC<AiMentorDrawerProps> = ({
  isOpen,
  onClose,
  currentLesson,
  currentChapter,
  isDevMode = false
}) => {
  const { theme } = useTheme();
  const { language, isRtl, getLessonContent } = useLanguage();
  const isLight = theme === 'light';

  const defaultGreeting = language === 'en'
    ? 'Welcome! I am your AI Engineering Coach. How can I assist you today with frontier systems architecture, CUDA, code optimization, or AI interview prep? ☕'
    : 'يا هلا بيك! أنا المساعد الذكي للأكاديمية (AI Coach). كيف يمكنني مساعدتك في استيعاب المفاهيم الهندسية، الأكواد البرمجية، أو الاستعداد للمقابلات اليوم؟ ☕';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: defaultGreeting,
      timestamp: new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'ar-EG', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      let replyText = '';
      const conversationHistory = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));

      // Live client wall-clock data
      const now = new Date();
      const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Cairo';
      const timeInfo = {
        currentTime: now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true }),
        currentDate: now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        timeZone: userZone,
        cairoTime: now.toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', hour12: true }),
        riyadhTime: now.toLocaleTimeString('ar-EG', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: true }),
        tokyoTime: now.toLocaleTimeString('ar-EG', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: true }),
        dubaiTime: now.toLocaleTimeString('ar-EG', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', hour12: true }),
        londonTime: now.toLocaleTimeString('ar-EG', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hour12: true }),
        newYorkTime: now.toLocaleTimeString('ar-EG', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: true })
      };

      // Call secure server-side proxy (Never exposes or asks for API key)
      const res = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: conversationHistory,
          chapterTitle: currentChapter?.title,
          lessonTitle: currentLesson?.title,
          contextCode: currentLesson?.pythonCode?.code,
          timeInfo,
          useThinking
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          replyText = data.reply;
        }
      }

      if (!replyText) {
        replyText = getLocalMentorResponse(
          query,
          currentLesson?.title,
          currentChapter?.title,
          currentLesson?.pythonCode?.code
        );
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isThinking: useThinking
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (networkErr) {
      console.warn('API endpoint error, falling back gracefully:', networkErr);
      const fallbackMsg = getLocalMentorResponse(
        query,
        currentLesson?.title,
        currentChapter?.title,
        currentLesson?.pythonCode?.code
      );
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackMsg,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isThinking: useThinking
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = language === 'en'
    ? [
        { label: "How are you doing today? 🌟", prompt: "Hello mentor! How are you doing today and what frontier AI topics are on your mind?" },
        { label: "How to prep for an OpenAI / DeepMind interview? 💼", prompt: "What core systems engineering and LLM architecture topics should I master to ace engineering interviews at OpenAI or Google DeepMind?" },
        { label: "How to build an exceptional AI Portfolio? 🏆", prompt: "How do I build real-world AI systems projects that make top global labs and frontier companies recruit me?" },
        { label: "Explain this lesson intuitively 💡", prompt: `Could you explain the real-world intuition and systems application of (${currentLesson ? getLessonContent(currentLesson).title : 'this lesson'})?` },
        { label: "Current time in Cairo, Riyadh & Tokyo? 🕒", prompt: "What time is it currently in Cairo, Riyadh, London, and Tokyo?" }
      ]
    : [
        { label: "كيف حالك وماذا يدور ببالك؟ 🌟", prompt: "كيف حالك يا بطل وماذا يدور ببالك اليوم؟" },
        { label: "كيف أستعد لمقابلة OpenAI؟ 💼", prompt: "ما هي أهم المحاور والأسئلة التقنية التي يجب أن أتقنها لاجتياز مقابلات هندسة الأنظمة والنماذج اللغوية في شركات كبرى مثل OpenAI وGoogle DeepMind؟" },
        { label: "كيف أبني Portfolio استثنائي يلفت الانتباه؟ 🏆", prompt: "كيف أبني بورتفوليو ومشاريع عملية واقعية في هندسة الذكاء الاصطناعي تجعل الشركات العالمية تسعى لتوظيفي؟" },
        { label: "اشرح فكرة الدرس بأسلوب مبسط وواقعي 💡", prompt: `اشرح لي بأسلوب واقعي وشيق كزميل مهندس فكرة وتطبيق درس (${currentLesson?.title || 'هذا الدرس'}) ولماذا هو مهم في عالم الذكاء الاصطناعي؟` },
        { label: "الساعة كام الآن في القاهرة وطوكيو؟ 🕒", prompt: "الساعة كام دلوقتي في القاهرة وفي طوكيو؟" }
      ];

  const lessonContent = currentLesson ? getLessonContent(currentLesson) : null;

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`fixed inset-y-0 ${isRtl ? 'left-0 border-r' : 'right-0 border-l'} z-50 w-full max-w-lg shadow-2xl flex flex-col transition-all duration-300 ${
        isLight 
          ? 'bg-[#F8FAFC] border-slate-200 text-slate-900' 
          : 'bg-[#0B0F19] border-slate-800/80 text-slate-100'
      }`}
    >
      {/* Calm & Modern Executive Header */}
      <div className={`px-4 py-3.5 border-b flex items-center justify-between backdrop-blur-md ${
        isLight ? 'bg-white/90 border-slate-200' : 'bg-[#0E1424]/90 border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold">JINNA AGI Core</h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                General AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {lessonContent ? lessonContent.title : (language === 'en' ? 'Superintelligent General AI Coach & Technical Engineering Mentor' : 'ذكاء اصطناعي عام فائق الذكاء، يجيبك بكل اللهجات وفي كل التخصصات')}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className={`p-1.5 rounded-lg transition-colors ${
            isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
          title={language === 'en' ? 'Close' : 'إغلاق'}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages List */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
        isLight ? 'bg-slate-100/60' : 'bg-[#090D16]'
      }`}>
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isCopied = copiedId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? (isRtl ? 'flex-row-reverse' : 'flex-row-reverse') : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                  isUser
                    ? 'bg-gradient-to-tr from-teal-600 to-cyan-600 text-white shadow-xs'
                    : isLight 
                      ? 'bg-white text-slate-700 border border-slate-300 shadow-xs' 
                      : 'bg-[#151C2C] text-teal-300 border border-teal-500/25'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-teal-700 via-cyan-700 to-sky-700 text-white rounded-tr-none shadow-md shadow-cyan-950/30 border border-cyan-400/20'
                    : isLight
                      ? 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-xs'
                      : 'bg-[#131826] text-slate-100 border border-white/[0.08] rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap selection:bg-teal-500/30 leading-relaxed font-sans">
                  {msg.content}
                </div>

                <div className={`flex items-center justify-between gap-2 mt-2.5 pt-1.5 text-[10px] border-t ${
                  isUser 
                    ? 'border-white/20 text-white/80' 
                    : isLight 
                      ? 'border-slate-100 text-slate-400' 
                      : 'border-white/[0.06] text-slate-400'
                }`}>
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="hover:text-teal-300 flex items-center gap-1 transition-colors cursor-pointer"
                      title={language === 'en' ? 'Copy message' : 'نسخ الإجابة'}
                    >
                      {isCopied ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? (language === 'en' ? 'Copied' : 'تم النسخ') : (language === 'en' ? 'Copy' : 'نسخ')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className={`border rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-2.5 ${
              isLight 
                ? 'bg-white border-slate-200 text-slate-700 shadow-xs' 
                : 'bg-[#131826] border-white/[0.08] text-slate-300 shadow-sm'
            }`}>
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
              <span className="text-slate-300">
                {language === 'en' ? 'JINNA AI Engine is thinking and synthesizing response...' : 'محرك JINNA الذكي يفكر ويصيغ الرد...'}
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className={`p-2 border-t overflow-x-auto flex gap-1.5 no-scrollbar ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0B101D] border-slate-800'
      }`}>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt)}
            disabled={isLoading}
            className={`flex-shrink-0 px-2.5 py-1 rounded-lg border text-[11px] whitespace-nowrap transition-colors flex items-center gap-1 disabled:opacity-50 cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-teal-500/50'
                : 'bg-[#121829] hover:bg-[#182036] text-slate-300 border-slate-700/80 hover:border-teal-400/50'
            }`}
          >
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className={`p-3 border-t ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#0D1220] border-slate-800'
      }`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={language === 'en' ? 'Ask anything.. code, systems architecture, life, interview prep...' : 'اسألني في أي شيء.. كود، هندسة نظم، حياة، أفكار، أو أي استفسار يدور ببالك...'}
            disabled={isLoading}
            className={`flex-1 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 transition-all border ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:ring-teal-500/20 focus:bg-white'
                : 'bg-[#070B13] border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:ring-teal-500/20'
            }`}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`p-2.5 rounded-xl transition-all shadow-xs ${
              !inputValue.trim() || isLoading
                ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white shadow-cyan-950/40 cursor-pointer'
            }`}
          >
            <Send className={`w-4 h-4 ${!isRtl ? 'rotate-0' : ''}`} />
          </button>
        </form>
      </div>
    </div>
  );
};
