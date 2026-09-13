import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Mail, Lock, LogIn, UserPlus, CheckCircle2, 
  AlertCircle, Sparkles, LogOut, ShieldCheck
} from 'lucide-react';
import { registerStudent, loginStudent, logoutStudent } from '../lib/firebase';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import type { User as FirebaseUser } from 'firebase/auth';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
  currentStudentName: string;
  onStudentUpdated: (user: FirebaseUser | null, name: string) => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentStudentName,
  onStudentUpdated
}) => {
  const { language, isRtl } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState(currentStudentName || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAnonymous = currentUser?.isAnonymous ?? true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'register' && !name.trim()) {
      setErrorMsg(language === 'en' ? 'Please enter your full legal name.' : 'يرجى إدخال اسمك الكامل للاعتماد على الشهادة.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(language === 'en' ? 'Please enter a valid email address.' : 'يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg(language === 'en' ? 'Password must be at least 6 characters.' : 'يجب ألا تقل كلمة المرور عن 6 أحرف.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        const user = await registerStudent(name, email, password);
        onStudentUpdated(user, name.trim());
        setSuccessMsg(language === 'en' ? 'Account registered successfully! Welcome to JINNA 5.' : 'تم تسجيل حسابك الأكاديمي بنجاح وحفظ بياناتك في قاعدة البيانات السحابية!');
        setTimeout(() => onClose(), 1500);
      } else {
        const user = await loginStudent(email, password);
        const displayName = user.displayName || name || user.email?.split('@')[0] || 'Student';
        onStudentUpdated(user, displayName);
        setSuccessMsg(language === 'en' ? 'Logged in successfully!' : 'تم تسجيل الدخول واسترجاع تقدمك الأكاديمي بنجاح!');
        setTimeout(() => onClose(), 1200);
      }
    } catch (err: any) {
      console.error(err);
      let msg = err?.message || 'Authentication error';
      if (msg.includes('email-already-in-use')) {
        msg = language === 'en' ? 'Email is already registered. Please login instead.' : 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول.';
      } else if (msg.includes('wrong-password') || msg.includes('user-not-found') || msg.includes('invalid-credential')) {
        msg = language === 'en' ? 'Invalid email or password.' : 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      } else if (msg.includes('weak-password')) {
        msg = language === 'en' ? 'Password is too weak.' : 'كلمة المرور ضعيفة، يرجى اختيار كلمة مرور أقوى.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutStudent();
      onStudentUpdated(null, '');
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0C101C] border-slate-800 text-slate-100'
        }`}
      >
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0F1424] border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold">
                {language === 'en' ? 'Student Account & Cloud Profile' : 'حساب الطالب وقاعدة البيانات السحابية'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'en' ? 'Official JINNA 5 Student Registry' : 'السجل الأكاديمي الرسمي لمنصة JINNA 5'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 rounded-lg ${isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Active Status Card if already signed in with non-anonymous */}
          {!isAnonymous && currentUser ? (
            <div className={`p-4 rounded-xl border space-y-3 ${
              isLight ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-emerald-950/20 border-emerald-600/30 text-emerald-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{language === 'en' ? 'Active Certified Student Profile' : 'ملف طالب مسجل ومعتمد في السحابة'}</span>
              </div>
              <div className="text-xs space-y-1">
                <div><strong>{language === 'en' ? 'Name:' : 'الاسم:'}</strong> {currentUser.displayName || currentStudentName || 'Accredited Fellow'}</div>
                <div><strong>{language === 'en' ? 'Email:' : 'البريد:'}</strong> {currentUser.email}</div>
                <div className="font-mono text-[11px] opacity-80">UID: {currentUser.uid.slice(0, 14)}...</div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Sign Out' : 'تسجيل الخروج'}</span>
              </button>
            </div>
          ) : (
            <>
              {/* Tab Selector: Register or Login */}
              <div className="flex items-center p-1 rounded-xl bg-black/20 border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(null); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'register'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow'
                      : isLight ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Create Account' : 'تسجيل طالب جديد'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(null); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'login'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow'
                      : isLight ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Log In' : 'دخول بحسابي'}</span>
                </button>
              </div>

              {/* Status Messages */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'register' && (
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      {language === 'en' ? 'Full Legal Name (as on Certificate):' : 'الاسم الكامل المعتمد (الذي يظهر على الشهادة):'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={language === 'en' ? 'e.g. Yousuf Albaz' : 'مثال: يوسف الباز'}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-medium transition-all ${
                          isLight 
                            ? 'bg-white border-slate-300 text-slate-900 focus:border-cyan-600' 
                            : 'bg-[#080B14] border-white/[0.1] text-slate-100 focus:border-cyan-500'
                        }`}
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {language === 'en' ? 'Email Address:' : 'البريد الإلكتروني:'}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      dir="ltr"
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-medium transition-all text-left ${
                        isLight 
                          ? 'bg-white border-slate-300 text-slate-900 focus:border-cyan-600' 
                          : 'bg-[#080B14] border-white/[0.1] text-slate-100 focus:border-cyan-500'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {language === 'en' ? 'Password:' : 'كلمة المرور (6 أحرف على الأقل):'}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      dir="ltr"
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-medium transition-all text-left ${
                        isLight 
                          ? 'bg-white border-slate-300 text-slate-900 focus:border-cyan-600' 
                          : 'bg-[#080B14] border-white/[0.1] text-slate-100 focus:border-cyan-500'
                      }`}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-cyan-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>{language === 'en' ? 'Connecting to Cloud...' : 'جاري الاتصال بالسحابة...'}</span>
                  ) : mode === 'register' ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Create Verified Profile' : 'إنشاء وتوثيق الحساب الأكاديمي'}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Sign In & Restore Progress' : 'دخول ومزامنة التقدم'}</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
