import React, { useState } from 'react';
import { 
  X, Megaphone, DollarSign, Building2, CheckCircle2, 
  HelpCircle, Shield, AlertTriangle, Globe, ArrowRight,
  Sparkles, Sliders, ExternalLink, Save, Power, Wallet, CreditCard
} from 'lucide-react';
import { AdsConfig } from '../types';
import { useTheme } from '../context/ThemeContext';

interface AdsControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AdsConfig;
  onSaveConfig: (updated: AdsConfig) => void;
}

export const AdsControlModal: React.FC<AdsControlModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'settings' | 'bank_guide' | 'adsense_setup' | 'no_bank'>('settings');
  const [form, setForm] = useState<AdsConfig>(config);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync initial state on open
  React.useEffect(() => {
    setForm(config);
    setSavedSuccess(false);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleToggleGlobal = () => {
    setForm(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0E1017] border-white/[0.1] text-slate-100'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141620] border-white/[0.08]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              form.enabled
                ? isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : isLight ? 'bg-slate-200 text-slate-600' : 'bg-slate-800 text-slate-400'
            }`}>
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                <span>إدارة الإعلانات والأرباح الشهرية</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium border ${
                  form.enabled
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {form.enabled ? '🟢 الإعلانات مفعلة' : '⚪ متوقفة'}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                التحكم الكامل في تشغيل/إيقاف الإعلانات وربط الحساب البنكي لتحويل الأرباح
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-white/[0.08] text-slate-400'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={`px-4 pt-3 flex gap-2 border-b overflow-x-auto text-xs font-semibold ${
          isLight ? 'bg-slate-100/50 border-slate-200' : 'bg-[#11131C] border-white/[0.06]'
        }`}>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'settings'
                ? isLight ? 'border-blue-600 text-blue-600' : 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>لوحة التحكم والمفاتيح</span>
          </button>

          <button
            onClick={() => setActiveTab('bank_guide')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'bank_guide'
                ? isLight ? 'border-blue-600 text-blue-600' : 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>كيف يتم إرسال الفلوس للبنك شهرياً؟</span>
          </button>

          <button
            onClick={() => setActiveTab('adsense_setup')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'adsense_setup'
                ? isLight ? 'border-blue-600 text-blue-600' : 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>خطوات تفعيل Google AdSense</span>
          </button>

          <button
            onClick={() => setActiveTab('no_bank')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'no_bank'
                ? isLight ? 'border-emerald-600 text-emerald-600' : 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-emerald-500/80 hover:text-emerald-400'
            }`}
          >
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>معنديش حساب بنكي؟ (الحلول البديلة الأسهل)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {activeTab === 'settings' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Master Toggle */}
              <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                form.enabled
                  ? isLight ? 'bg-emerald-50/70 border-emerald-200' : 'bg-emerald-950/20 border-emerald-500/30'
                  : isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#151720] border-white/[0.06]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    form.enabled ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    <Power className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">
                      {form.enabled ? 'الإعلانات نشطة وتعمل الآن' : 'الإعلانات متوقفة تماماً'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {form.enabled 
                        ? 'الزوار يشاهدون المساحات الإعلانية ويتم احتساب الأرباح'
                        : 'الموقع خالٍ تماماً من أي إعلانات لتجربة قراءة أكاديمية 100%'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggleGlobal}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    form.enabled
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {form.enabled ? 'إيقاف الإعلانات الآن' : 'تفعيل الإعلانات الآن'}
                </button>
              </div>

              {/* Placements & Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  form.showLessonAd 
                    ? isLight ? 'bg-blue-50/60 border-blue-200' : 'bg-cyan-950/20 border-cyan-500/30' 
                    : isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#12141D] border-white/[0.06]'
                }`}>
                  <div className="space-y-0.5">
                    <span className="font-semibold text-xs sm:text-sm block">إعلان داخل الدروس (Inline)</span>
                    <span className="text-[11px] text-slate-500 block">يظهر بين مقدمة الدرس والأكواد البرمجية</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.showLessonAd}
                    onChange={e => setForm(prev => ({ ...prev, showLessonAd: e.target.checked }))}
                    className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
                  />
                </label>

                <label className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  form.showBottomAd 
                    ? isLight ? 'bg-blue-50/60 border-blue-200' : 'bg-cyan-950/20 border-cyan-500/30' 
                    : isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#12141D] border-white/[0.06]'
                }`}>
                  <div className="space-y-0.5">
                    <span className="font-semibold text-xs sm:text-sm block">إعلان أسفل المنصة (Footer)</span>
                    <span className="text-[11px] text-slate-500 block">شريط إعلاني خفيف في نهاية محتوى الصفحة</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.showBottomAd}
                    onChange={e => setForm(prev => ({ ...prev, showBottomAd: e.target.checked }))}
                    className="w-4 h-4 rounded text-cyan-500 cursor-pointer"
                  />
                </label>
              </div>

              {/* Google AdSense Credentials */}
              <div className={`p-4 rounded-xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#12141D] border-white/[0.06]'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs sm:text-sm flex items-center gap-1.5 text-cyan-400">
                    <Globe className="w-4 h-4" />
                    <span>بيانات حسابك في Google AdSense</span>
                  </h4>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.testMode}
                      onChange={e => setForm(prev => ({ ...prev, testMode: e.target.checked }))}
                      className="w-3.5 h-3.5 rounded text-cyan-500"
                    />
                    <span>وضع المعاينة التجريبي (Test Mode)</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      معرّف الناشر (Publisher ID):
                    </label>
                    <input
                      type="text"
                      value={form.publisherId}
                      onChange={e => setForm(prev => ({ ...prev, publisherId: e.target.value.trim() }))}
                      placeholder="ca-pub-1234567890123456"
                      className={`w-full px-3 py-2 rounded-lg text-xs font-mono border focus:outline-hidden transition-colors ${
                        isLight 
                          ? 'bg-white border-slate-300 focus:border-blue-500' 
                          : 'bg-[#0B0C11] border-white/[0.1] focus:border-cyan-500 text-cyan-300'
                      }`}
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      تجد هذا الرقم داخل حساب Google AdSense ➔ الحساب ➔ معلومات الحساب
                    </span>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      معرّف الوحدة الإعلانية (Ad Slot ID) - اختياري:
                    </label>
                    <input
                      type="text"
                      value={form.adSlotId}
                      onChange={e => setForm(prev => ({ ...prev, adSlotId: e.target.value.trim() }))}
                      placeholder="1234567890"
                      className={`w-full px-3 py-2 rounded-lg text-xs font-mono border focus:outline-hidden transition-colors ${
                        isLight 
                          ? 'bg-white border-slate-300 focus:border-blue-500' 
                          : 'bg-[#0B0C11] border-white/[0.1] focus:border-cyan-500 text-cyan-300'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bank_guide' && (
            <div className="space-y-4 animate-fadeIn">
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
              }`}>
                <Building2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed space-y-1">
                  <p className="font-bold text-sm">كيف تصل الأرباح لحسابك البنكي مباشرة؟</p>
                  <p>
                    تقوم جوجل بالتحويل التلقائي لحسابك البنكي عن طريق الحوالة المصرفية الدولية (Wire Transfer).
                    التحويل يحدث شهرياً بشكل آلي دون الحاجة لطلب سحب يدوي!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className={`p-3.5 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#12141D] border-white/[0.06]'
                }`}>
                  <span className="font-bold text-cyan-400 block mb-1">1. موعد التحويل الشهري</span>
                  <p className="text-slate-400 leading-relaxed">
                    ترسل جوجل الأرباح في الفترة بين <strong>21 إلى 26 من كل شهر ميلادي</strong> لأرباح الشهر السابق.
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#12141D] border-white/[0.06]'
                }`}>
                  <span className="font-bold text-cyan-400 block mb-1">2. الحد الأدنى للتحويل (Threshold)</span>
                  <p className="text-slate-400 leading-relaxed">
                    الحد الأدنى هو <strong>100 دولار أمريكي</strong> (أو ما يعادله بالعملة المحلية). إذا جمعت 70$ هذا الشهر مثلاً، تُرحل وتُضاف لأرباح الشهر التالي تلقائياً.
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#12141D] border-white/[0.06]'
                }`}>
                  <span className="font-bold text-cyan-400 block mb-1">3. البيانات المطلوبة في البنك</span>
                  <p className="text-slate-400 leading-relaxed">
                    - اسمك بالإنجليزية كما هو في البنك.<br/>
                    - كود السويفت للبنك (SWIFT BIC).<br/>
                    - رقم الحساب الدولي (IBAN).
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#12141D] border-white/[0.06]'
                }`}>
                  <span className="font-bold text-cyan-400 block mb-1">4. هل يمكن استخدام حساب محلي؟</span>
                  <p className="text-slate-400 leading-relaxed">
                    نعم، أي حساب بنكي مصري أو عربي (CIB، الأهلي، بنك مصر، الراجحي، إلخ) يقبل الحوالات الخارجية بالدولار أو بالجنيه بسعر الصرف الرسمي.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'adsense_setup' && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className={`p-4 rounded-xl border space-y-2 ${
                isLight ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-[#121522] border-cyan-500/20 text-slate-200'
              }`}>
                <h4 className="font-bold text-sm text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>خطوات التقديم على Google AdSense لموقعك:</span>
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed">
                  <li>
                    ادخل على موقع جوجل أدسنس الرسمي: 
                    <a 
                      href="https://adsense.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-cyan-400 font-semibold underline mx-1 inline-flex items-center gap-0.5"
                    >
                      <span>adsense.google.com</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    سجل دخولك بحساب Google AdSense الخاص بك.
                  </li>
                  <li>
                    في خانة الموقع الإلكتروني (Your Site)، اكتب رابطك الرسمي:
                    <div className="my-1 p-2 rounded bg-black/40 font-mono text-cyan-300 border border-white/[0.08]">
                      https://jinnafive.vercel.app
                    </div>
                  </li>
                  <li>
                    ستعطيك جوجل كود تحقق أو معرّف الناشر يبدأ بـ <code className="text-amber-400 font-mono">ca-pub-XXXXXXXX</code>.
                  </li>
                  <li>
                    انسخ هذا المعرّف وضعه في تبويب <strong>لوحة التحكم والمفاتيح</strong> هنا في المنصة، واضغط <strong>حفظ التغييرات</strong>.
                  </li>
                  <li>
                    تستغرق مراجعة جوجل عادة من <strong>24 إلى 48 ساعة</strong> وبعدها تبدأ الإعلانات الحقيقية بالظهور وتحقيق الأرباح!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'no_bank' && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100'
              }`}>
                <Wallet className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed space-y-1">
                  <p className="font-bold text-sm">لا تقلق يا باشمهندس يوسف! لديك 4 حلول قانونية وسريعة جداً:</p>
                  <p>
                    جوجل لا تشترط أن يكون لديك حساب بنكي حالياً لتبدأ الإعلانات وتحقيق الأرباح، فالأرباح تتجمع في حسابك على AdSense أولاً، ويمكنك ربط طريقة الاستلام في أي وقت قبل يوم 20 من الشهر.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Option 1 */}
                <div className={`p-4 rounded-xl border space-y-2 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#12141D] border-white/[0.06]'
                }`}>
                  <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs">1</span>
                    <span>الحل الأفضل والأسرع: حساب الشباب المجاني (بالرقم القومي فقط)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed pr-7">
                    يمكنك التوجه لأي فرع من فروع <strong>بنك مصر</strong> أو <strong>البنك الأهلي</strong> أو <strong>بنك الإسكندرية</strong> (أو CIB) وطلب فتح <strong>«حساب الشباب / الشمول المالي»</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 pr-7">
                    <li><strong className="text-slate-200">الأوراق المطلوبة:</strong> بطاقة الرقم القومي السارية فقط (من سن 16 حتى 35 سنة).</li>
                    <li><strong className="text-slate-200">المصاريف:</strong> مجاناً بدون أي رسوم فتح حساب وبدون حد أدنى للإيداع.</li>
                    <li><strong className="text-slate-200">بدون إثبات وظيفة:</strong> لا يطلبون مفردات مرتب أو شهادة دخل إطلاقاً.</li>
                    <li>تستلم فوراً كارت Debit card وورقة بها رقم الـ <strong>IBAN</strong> ورمز الـ <strong>SWIFT</strong> وتربطه بأدسنس فوراً.</li>
                  </ul>
                </div>

                {/* Option 2 */}
                <div className={`p-4 rounded-xl border space-y-2 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#12141D] border-white/[0.06]'
                }`}>
                  <div className="flex items-center gap-2 text-sm font-bold text-purple-400">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs">2</span>
                    <span>البنوك الإلكترونية الرقمية (تحويل لفودافون كاش أو إنستاباي)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed pr-7">
                    يمكنك تحميل تطبيق مثل <strong>Elevate Pay</strong> أو <strong>Payoneer</strong> من هاتفك وتفعيله بالبطاقة الشخصية في دقائق:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 pr-7">
                    <li>يعطيك حساب بنكي أمريكي رسمي كامل (Routing Number + Account Number).</li>
                    <li>تربطه في AdSense كحساب مصرفي معتمد.</li>
                    <li>عند وصول أرباح جوجل عليه بالدولار، يمكنك تحويلها بضغطة زر إلى <strong>محفظة فودافون كاش</strong> أو <strong>إنستاباي (InstaPay)</strong> أو كارت ميزة بالسعر الرسمي!</li>
                  </ul>
                </div>

                {/* Option 3 */}
                <div className={`p-4 rounded-xl border space-y-2 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#12141D] border-white/[0.06]'
                }`}>
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs">3</span>
                    <span>استخدام حساب بنكي لشخص موثوق (الوالد، الأخ، أو الشريك)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed pr-7">
                    جوجل أدسنس تسمح رسمياً بنسبة 100% أن يكون الحساب البنكي باسم شخص آخر موثوق من عائلتك:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 pr-7">
                    <li>في لوحة الدفعات، تضع اسمه بالإنجليزية ورقم الآيبان (IBAN) الخاص بحسابه.</li>
                    <li>الحوالة ستصل إلى حسابه شهرياً بشكل طبيعي تماماً ودون أي مخالفة.</li>
                  </ul>
                </div>

                {/* Option 4 */}
                <div className={`p-4 rounded-xl border space-y-2 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#12141D] border-white/[0.06]'
                }`}>
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs">4</span>
                    <span>حساب التوفير الذكي / إيزي باي (البريد المصري)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed pr-7">
                    في أقرب مكتب بريد مصري، تفتح حساب توفير ذكي أو فيزا إيزي باي بالبطاقة فقط وتطلب منهم بيانات الآيبان (IBAN) لاستقبال الحوالات.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t flex items-center justify-between gap-3 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141620] border-white/[0.08]'
        }`}>
          <div className="text-xs">
            {savedSuccess ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم حفظ إعدادات الإعلانات بنجاح!</span>
              </span>
            ) : (
              <span className="text-slate-500">الإعدادات تُحفظ محلياً في متصفحك بشكل فوري</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-white/[0.06] hover:bg-white/[0.1] text-slate-300'
              }`}
            >
              إغلاق
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التغييرات</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
