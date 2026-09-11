import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  X, 
  Star, 
  Download, 
  CheckCircle, 
  ChevronLeft, 
  Bookmark, 
  Sparkles, 
  Code2, 
  Layers, 
  ArrowRight,
  Search
} from 'lucide-react';
import { translatedBooks, TranslatedBook, BookChapter } from '../data/booksData';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface BooksLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BooksLibraryModal: React.FC<BooksLibraryModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { language, isRtl } = useLanguage();
  const isLight = theme === 'light';

  const [selectedBook, setSelectedBook] = useState<TranslatedBook>(translatedBooks[0]);
  const [selectedChapter, setSelectedChapter] = useState<BookChapter>(translatedBooks[0].chapters[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredBooks = translatedBooks.filter(b => 
    b.titleArabic.includes(searchQuery) || 
    b.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectBook = (book: TranslatedBook) => {
    setSelectedBook(book);
    setSelectedChapter(book.chapters[0]);
  };

  const handleDownloadNotes = (book: TranslatedBook) => {
    const textContent = language === 'en'
      ? `=====================================================
JINNA 5 AI ACADEMY - REFERENCE LIBRARY
Book: ${book.titleEnglish}
Arabic Title: ${book.titleArabic}
Author: ${book.author}
Publisher: ${book.publisher} (${book.year})
=====================================================

Overview:
${book.descriptionArabic}

Key Takeaways:
${book.keyTakeaways.map(t => `• ${t}`).join('\n')}

Chapters:
${book.chapters.map(c => `
-----------------------------------------------------
Chapter ${c.chapterNumber}: ${c.titleEnglish} (${c.titleArabic})
Summary:
${c.summaryArabic}

Excerpt:
"${c.translatedExcerpt}"
-----------------------------------------------------
`).join('\n')}
`
      : `=====================================================
مكتبة منصة JINNA 5 للذكاء الاصطناعي - المراجع المترجمة
الكتاب: ${book.titleArabic}
العنوان الأصلي: ${book.titleEnglish}
المؤلف: ${book.author}
دار النشر: ${book.publisher} (${book.year})
=====================================================

نبذة عن الكتاب:
${book.descriptionArabic}

أهم المخرجات والنتائج المستفادة:
${book.keyTakeaways.map(t => `• ${t}`).join('\n')}

فصول الكتاب المترجمة:
${book.chapters.map(c => `
-----------------------------------------------------
الفصل ${c.chapterNumber}: ${c.titleArabic} (${c.titleEnglish})
ملخص الفصل:
${c.summaryArabic}

اقتباس مترجم:
"${c.translatedExcerpt}"
-----------------------------------------------------
`).join('\n')}
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.id}-${language === 'en' ? 'english' : 'arabic'}-summary.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(book.id);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md" 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`w-full max-w-6xl h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0B1120] border-slate-800 text-slate-100'
        }`}
      >
        {/* Modal Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between gap-4 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0F172A] border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                  {language === 'en' ? 'Frontier AI Academic Library' : 'مكتبة الذكاء الاصطناعي الأكاديمية المترجمة'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {language === 'en' ? 'Core References' : 'مراجع عالمية حصرية'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'en' 
                  ? 'Standard textbooks from Stanford & MIT with dual-language summaries & practical code'
                  : 'كتب معتمدة في MIT وStanford مترجمة بتدقيق أكاديمي للعربية'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block w-52">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search books & authors...' : 'ابحث في الكتب والمؤلفين...'}
                className={`w-full text-xs rounded-lg px-3 py-1.5 ${isRtl ? 'pl-8' : 'pr-8'} border transition-all focus:outline-none focus:ring-1 ${
                  isLight 
                    ? 'bg-white border-slate-300 text-slate-800 focus:border-blue-500 focus:ring-blue-500/30' 
                    : 'bg-[#1E293B] border-slate-700 text-slate-200 focus:border-blue-500 focus:ring-blue-500/30'
                }`}
              />
              <Search className={`w-3.5 h-3.5 text-slate-400 absolute ${isRtl ? 'left-2.5' : 'right-2.5'} top-2.5`} />
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all ${
                isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Split Body: Book Selector / Chapters & Reader */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Books Sidebar */}
          <div className={`w-full md:w-80 lg:w-96 border-b md:border-b-0 ${isRtl ? 'md:border-l' : 'md:border-r'} flex flex-col overflow-hidden ${
            isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#0E1526] border-slate-800'
          }`}>
            <div className="p-3 font-semibold text-xs text-slate-400 border-b border-slate-800/40 flex items-center justify-between">
              <span>{language === 'en' ? `Available Books (${filteredBooks.length})` : `قائمة الكتب المتاحة (${filteredBooks.length})`}</span>
              <span className="text-[11px] text-cyan-400 font-mono">{language === 'en' ? 'Full Edition' : 'ترجمة كاملة'}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {filteredBooks.map((book) => {
                const isSelected = selectedBook.id === book.id;
                const bookTitle = language === 'en' ? book.titleEnglish : book.titleArabic;
                const bookSub = language === 'en' ? book.titleArabic : book.titleEnglish;
                return (
                  <motion.div
                    key={book.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectBook(book)}
                    className={`p-3 rounded-xl border ${isRtl ? 'text-right' : 'text-left'} cursor-pointer transition-all ${
                      isSelected
                        ? isLight
                          ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500/20'
                          : 'bg-[#1A243B] border-blue-500/80 shadow-lg shadow-blue-950/40'
                        : isLight
                          ? 'bg-white hover:bg-slate-100 border-slate-200'
                          : 'bg-[#131C2E] hover:bg-[#18233A] border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {book.badge}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{book.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold leading-snug mb-1">{bookTitle}</h3>
                    <p className="text-[11px] text-slate-400 font-mono mb-2 truncate" dir={language === 'en' ? 'rtl' : 'ltr'}>{bookSub}</p>
                    
                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-700/40">
                      <span className="truncate max-w-[150px]">{book.author.split('(')[0]}</span>
                      <span className="font-mono text-cyan-400">
                        {book.pages} {language === 'en' ? 'pages' : 'صفحة'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Book Reader & Chapters Area */}
          <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Book Meta Banner */}
            <div className={`p-4 sm:p-5 rounded-2xl border relative overflow-hidden ${
              isLight ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-r from-[#111A30] to-[#152244] border-blue-900/40'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                      {selectedBook.publisher} • {selectedBook.year}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {language === 'en' ? selectedBook.titleArabic : selectedBook.titleEnglish}
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-2xl font-black">
                    {language === 'en' ? selectedBook.titleEnglish : selectedBook.titleArabic}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                    {selectedBook.descriptionArabic}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDownloadNotes(selectedBook)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex-shrink-0 self-start"
                >
                  {downloadSuccess === selectedBook.id ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-300" />
                      <span>{language === 'en' ? 'Summary Downloaded!' : 'تم تنزيل الملخص الأكاديمي!'}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>{language === 'en' ? 'Download Summary (TXT)' : 'تحميل ملخص وفصول الكتاب (TXT)'}</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Key Takeaways Pills */}
              <div className="mt-4 pt-3 border-t border-blue-500/20 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {selectedBook.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="leading-snug">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chapters Navigator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-slate-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>
                    {language === 'en' ? 'Book Chapters for Deep Study:' : 'فصول الكتاب المترجمة للدراسة:'}
                  </span>
                </h3>
                <span className="text-xs text-slate-400">
                  {language === 'en' ? 'Select chapter for reading & code implementation' : 'اختر الفصل لقراءة الترجمة والشرح التفصيلي'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {selectedBook.chapters.map((chap) => {
                  const isChapActive = selectedChapter.id === chap.id;
                  const chapTitle = language === 'en' ? chap.titleEnglish : chap.titleArabic;
                  return (
                    <button
                      key={chap.id}
                      onClick={() => setSelectedChapter(chap)}
                      className={`${isRtl ? 'text-right' : 'text-left'} p-3 rounded-xl border text-xs transition-all flex flex-col justify-between gap-1.5 ${
                        isChapActive
                          ? isLight
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-lg shadow-blue-950/50'
                          : isLight
                            ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                            : 'bg-[#121A2D] hover:bg-[#18233C] border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full text-[11px] opacity-80">
                        <span>{language === 'en' ? `Chapter ${chap.chapterNumber}` : `الفصل ${chap.chapterNumber}`}</span>
                        <ChevronLeft className={`w-3.5 h-3.5 ${!isRtl ? 'rotate-180' : ''}`} />
                      </div>
                      <span className="font-bold line-clamp-1">{chapTitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Chapter Reading Pane */}
            <div className={`p-5 sm:p-6 rounded-2xl border space-y-5 ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#101728] border-slate-800'
            }`}>
              <div className="border-b border-slate-700/50 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>
                      {language === 'en' 
                        ? `Chapter ${selectedChapter.chapterNumber} • Deep Study` 
                        : `الفصل ${selectedChapter.chapterNumber} • القراءة والتعمق`}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-xl font-black">
                    {language === 'en' ? selectedChapter.titleEnglish : selectedChapter.titleArabic}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    {language === 'en' ? selectedChapter.titleArabic : selectedChapter.titleEnglish}
                  </p>
                </div>

                {/* Key Concepts Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedChapter.keyConcepts.map((concept, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400">
                  {language === 'en' ? 'Chapter Summary & Core Concepts:' : 'ملخص ومحاور الفصل:'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedChapter.summaryArabic}
                </p>
              </div>

              {/* Translated Excerpt (Featured Quote) */}
              <div className={`p-4 rounded-xl ${isRtl ? 'border-r-4 border-r-blue-500' : 'border-l-4 border-l-blue-500'} ${
                isLight ? 'bg-blue-50/60 border border-blue-200/60 text-slate-800' : 'bg-[#131D33] border border-blue-900/30 text-slate-200'
              }`}>
                <span className="text-[11px] font-bold text-blue-400 block mb-1">
                  {language === 'en' ? 'Direct Book Excerpt:' : 'ترجمة حصرية من النص الأصلي للكتاب:'}
                </span>
                <p className="text-xs sm:text-sm leading-relaxed italic font-serif">
                  "{selectedChapter.translatedExcerpt}"
                </p>
              </div>

              {/* Practical Python Implementation if present */}
              {selectedChapter.practicalCodeSummary && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Code2 className="w-4 h-4" />
                    <span>
                      {language === 'en' ? 'Practical Python Implementation:' : 'التطبيق البرمجي المباشر لمفاهيم الفصل:'}
                    </span>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto" dir="ltr">
                    {selectedChapter.practicalCodeSummary}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
