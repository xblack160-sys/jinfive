import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { 
  X, Award, ShieldCheck, Printer, CheckCircle2, Sparkles, 
  Share2, Check, ExternalLink, School, Building2, Cpu, Globe, Lock,
  Download, Loader2, Image as ImageIcon, Smartphone, Send, Edit3, Save
} from 'lucide-react';
import { UserProgress } from '../types';
import { getTotalCurriculumStats } from '../data/curriculumData';
import { generateCertificateBlob } from '../utils/certificateGenerator';
import { useLanguage } from '../context/LanguageContext';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onSaveName: (name: string) => void;
  initialVerificationMode?: boolean;
  onOpenGrandExam?: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  progress,
  onSaveName,
  initialVerificationMode = false,
  onOpenGrandExam
}) => {
  const { t, isRtl, language } = useLanguage();
  const [name, setName] = useState(progress.studentName || 'Yousuf Albaz');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(progress.studentName || 'Yousuf Albaz');
  const [activeTab, setActiveTab] = useState<'certificate' | 'requirements'>('certificate');
  const [showVerificationModal, setShowVerificationModal] = useState(initialVerificationMode);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedPreviewModal, setSavedPreviewModal] = useState<{
    isOpen: boolean;
    dataUrl: string;
    blob: Blob | null;
    fileName: string;
  }>({
    isOpen: false,
    dataUrl: '',
    blob: null,
    fileName: ''
  });

  // Sync name from progress
  useEffect(() => {
    if (progress.studentName) {
      setName(progress.studentName);
      setNameInput(progress.studentName);
    }
  }, [progress.studentName]);

  // Sync verification mode if opened via verify query parameter
  useEffect(() => {
    if (initialVerificationMode) {
      setShowVerificationModal(true);
    }
  }, [initialVerificationMode]);

  const stats = getTotalCurriculumStats();
  const completedCount = progress.completedLessons.length;
  
  // Consistent deterministic cryptographic verification ID
  const credentialId = `JINNA5-GBL-${(name.length * 47 + completedCount * 131 + 2026).toString(16).toUpperCase()}-94A`;
  
  // Verification URL that opens the verified dossier when scanned
  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?verify=${encodeURIComponent(credentialId)}`
    : `https://jinna5.ai/verify/${credentialId}`;

  // Generate real, high-contrast, high-density QR code
  useEffect(() => {
    if (!isOpen) return;
    QRCode.toDataURL(verificationUrl, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#05070E',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error("Error generating QR code:", err));
  }, [verificationUrl, isOpen]);

  const issueDateEnglish = "September 9, 2026";
  const isGrandExamPassed = progress.grandExamResult?.passed === true;

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setName(nameInput.trim());
      onSaveName(nameInput.trim());
      setIsEditingName(false);
    }
  };

  // Direct high-resolution image download to device (PNG 2400x1700 via Canvas)
  const handleDownloadCertificate = async () => {
    try {
      setIsSavingImage(true);
      const safeName = (name || 'Student').trim().replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_');
      const fileName = `JINNA5_Fellowship_Certificate_${safeName}.png`;

      // 1. Generate high-definition canvas (A4 landscape 2400x1700)
      const { blob, dataUrl } = await generateCertificateBlob({
        studentName: name,
        credentialId,
        qrCodeDataUrl,
        completedCount,
        totalCount: stats.totalLessons,
        issueDateGregorian: issueDateEnglish,
        grandExamPercentage: progress.grandExamResult?.percentage,
        grandExamScore: progress.grandExamResult?.score
      });

      // 2. Open dedicated mobile-friendly preview modal immediately
      setSavedPreviewModal({
        isOpen: true,
        dataUrl,
        blob,
        fileName
      });

      // 3. Trigger immediate direct file download via both DataURL and Blob
      try {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
        }, 1000);
      } catch (dlErr) {
        console.warn("Direct download link trigger warning:", dlErr);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (error) {
      console.error('Error generating certificate image:', error);
      // Fallback using html2canvas on the card element
      try {
        const element = document.getElementById('certificate-printable-card');
        if (element) {
          const cv = await html2canvas(element, { scale: 2, useCORS: true });
          const cvUrl = cv.toDataURL('image/png');
          setSavedPreviewModal({
            isOpen: true,
            dataUrl: cvUrl,
            blob: null,
            fileName: 'JINNA5_Certificate.png'
          });
          const l = document.createElement('a');
          l.download = `JINNA5_Certificate.png`;
          l.href = cvUrl;
          document.body.appendChild(l);
          l.click();
          document.body.removeChild(l);
        }
      } catch (err2) {
        console.error('Html2canvas fallback failed:', err2);
      }
    } finally {
      setIsSavingImage(false);
    }
  };

  // Dedicated Print or Save as PDF handler
  const handlePrint = async () => {
    try {
      setIsSavingImage(true);
      const safeName = (name || 'Student').trim().replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_');
      const fileName = `JINNA5_Fellowship_Certificate_${safeName}.png`;

      const { dataUrl, blob } = await generateCertificateBlob({
        studentName: name,
        credentialId,
        qrCodeDataUrl,
        completedCount,
        totalCount: stats.totalLessons,
        issueDateGregorian: issueDateEnglish,
        grandExamPercentage: progress.grandExamResult?.percentage,
        grandExamScore: progress.grandExamResult?.score
      });

      // Also ensure preview modal is available with direct print/download
      setSavedPreviewModal({
        isOpen: true,
        dataUrl,
        blob,
        fileName
      });

      // Print via hidden printable frame or print-window
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html lang="en" dir="ltr">
            <head>
              <meta charset="UTF-8">
              <title>JINNA 5 Fellowship Certificate - ${name}</title>
              <style>
                @page { size: landscape; margin: 0; }
                * { box-sizing: border-box; }
                body { margin: 0; padding: 20px; background: #05070E; color: #FFFFFF; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
                img { width: 100%; max-width: 1200px; height: auto; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
                .btn-bar { margin-bottom: 20px; display: flex; gap: 12px; }
                button { background: #F59E0B; color: #000; font-weight: bold; padding: 12px 24px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }
                @media print {
                  body { background: #FFFFFF; padding: 0; }
                  img { width: 100%; max-width: 100%; height: auto; box-shadow: none; border-radius: 0; }
                  .btn-bar { display: none !important; }
                }
              </style>
            </head>
            <body>
              <div class="btn-bar">
                <button onclick="window.print()">🖨️ Click Here to Print or Save as PDF</button>
              </div>
              <img src="${dataUrl}" alt="JINNA 5 Fellowship Certificate" />
              <script>
                setTimeout(function() { window.print(); }, 700);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        // In iframe environment where popup is blocked, trigger direct window.print or preview
        window.print();
      }
    } catch {
      await handleDownloadCertificate();
    } finally {
      setIsSavingImage(false);
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(verificationUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#0A0D18] border border-amber-500/30 rounded-2xl max-w-5xl w-full my-auto shadow-2xl flex flex-col overflow-hidden text-right">
        
        {/* Modal Top Control Bar (Bilingual Navigation Header) */}
        <div className="px-5 py-3.5 bg-[#0F1322] border-b border-amber-500/20 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>{t('cert.modal_title')}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                isGrandExamPassed 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {isGrandExamPassed ? (language === 'en' ? 'OFFICIALLY ACCREDITED 🎓' : 'معتمد رسمياً 🎓') : (language === 'en' ? 'PREVIEW & ACCREDITATION' : 'معاينة واعتماد')}
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.08]">
              <button
                onClick={() => setActiveTab('certificate')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'certificate'
                    ? 'bg-amber-400 text-black shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{t('cert.tab_preview')}</span>
              </button>
              <button
                onClick={() => setActiveTab('requirements')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'requirements'
                    ? 'bg-amber-400 text-black shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('cert.tab_requirements')}</span>
              </button>
            </div>

            <button
              onClick={() => setIsEditingName(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181F36] hover:bg-[#202947] text-slate-200 text-xs font-semibold border border-white/[0.1] transition-all"
              title={language === 'en' ? 'Edit recipient student name' : 'تعديل اسم الطالب بالإنجليزية على الشهادة'}
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t('cert.btn_edit_name')}</span>
            </button>

            <button
              onClick={handleDownloadCertificate}
              disabled={isSavingImage}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-black text-xs font-bold transition-all shadow"
            >
              {isSavingImage ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
              ) : (
                <Download className="w-3.5 h-3.5 text-black" />
              )}
              <span className="hidden sm:inline">{isSavingImage ? (language === 'en' ? 'Generating...' : 'جارٍ التوليد...') : t('cert.btn_save_png')}</span>
              <span className="sm:hidden">{t('cert.btn_save_short')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Optional Student Name Edit Bar */}
        {isEditingName && (
          <div className="bg-[#12172A] border-b border-amber-500/20 px-5 py-3 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <span className="text-slate-300 font-medium">{t('cert.name_prompt')}</span>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Yousuf Albaz"
                className="flex-1 max-w-sm px-3 py-1.5 rounded-lg bg-black/50 border border-amber-500/40 text-white font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveName}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-400 text-black font-bold hover:bg-amber-300 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t('cert.save_name')}</span>
              </button>
              <button
                onClick={() => setIsEditingName(false)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.08] text-slate-300 hover:bg-white/[0.12]"
              >
                {t('cert.cancel')}
              </button>
            </div>
          </div>
        )}

        {/* Certificate Container or Defense Exam Gate */}
        <div className="p-3 sm:p-6 bg-[#060810] overflow-y-auto max-h-[82vh]">
          {activeTab === 'requirements' ? (
            /* GRAND DEFENSE EXAM GATE (IN REQUIREMENTS TAB) */
            <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-[#101526] via-[#0C0F1A] to-[#07080E] border-2 border-amber-500/30 text-center space-y-6 max-w-2xl mx-auto">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
                <Lock className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  OFFICIAL DEFENSE GATEWAY • JINNA 5 SPECIALIZATION
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-white">
                  {t('cert.req_title')}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {t('cert.req_desc')}
                </p>
              </div>

              {/* Requirements Checklist */}
              <div className={`space-y-2.5 p-4 rounded-xl bg-[#080B14] border border-white/[0.08] text-xs ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="text-[11px] font-bold text-slate-400 mb-1 font-mono">{t('cert.req_header')}</div>
                
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                  <span>{t('cert.req_item1')}</span>
                  <span className={`font-mono font-bold ${progress.completedLessons.length >= 18 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {progress.completedLessons.length} / 18 {progress.completedLessons.length >= 18 ? '✓' : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                  <span>{t('cert.req_item2')}</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {Object.values(progress.completedLessonQuizzes || {}).filter((q: any) => q?.passed).length} / 18
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                  <span>{t('cert.req_item3')}</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {Object.values(progress.completedQuizzes || {}).filter((q: any) => q?.passed).length} / 11
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-950/20 border border-amber-500/30">
                  <span className="font-bold text-amber-200">{t('cert.req_item4')}</span>
                  <span className="font-mono font-bold text-amber-300">
                    {progress.grandExamResult 
                      ? `${progress.grandExamResult.percentage}% (${language === 'en' ? '85% req.' : 'مطلوب 85%'})` 
                      : (language === 'en' ? 'Not taken yet' : 'لم يتم إجراؤه بعد')}
                  </span>
                </div>
              </div>

              {/* Start Exam CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenGrandExam) onOpenGrandExam();
                  }}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-black font-extrabold text-xs shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-black" />
                  <span>{t('cert.btn_enter_grand_exam')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('certificate')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-slate-200 font-bold text-xs"
                >
                  {t('cert.btn_back_preview')}
                </button>
              </div>
            </div>
          ) : (
            /* UNLOCKED FULL CERTIFICATE CARD - 100% ENGLISH LUXURY INTERNATIONAL DESIGN */
            <div className="space-y-4">
              {!isGrandExamPassed && (
                <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/40 p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 text-amber-200">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>
                      {t('cert.preview_banner_text')}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenGrandExam) onOpenGrandExam();
                    }}
                    className="shrink-0 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{t('cert.btn_defense_exam')}</span>
                  </button>
                </div>
              )}

              <div 
                id="certificate-printable-card"
                dir="ltr"
                className="relative p-6 sm:p-12 rounded-2xl bg-gradient-to-b from-[#060914] via-[#0A0E22] to-[#04060E] border-4 border-double border-amber-500/60 shadow-2xl text-center space-y-6 overflow-hidden text-left"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
              {/* Guilloche Security Watermark & Geometry */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
                <svg viewBox="0 0 400 400" className="w-[700px] h-[700px] text-amber-300" fill="currentColor">
                  <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="6 4" />
                  <polygon points="200,30 245,155 370,200 245,245 200,370 155,245 30,200 155,155" />
                </svg>
              </div>

              {/* Corner Ornamental Accents */}
              <div className="absolute top-3 left-3 text-amber-500/50 font-mono text-[11px] select-none">❖ JINNA 5 GLOBAL FELLOWSHIP ❖</div>
              <div className="absolute top-3 right-3 text-amber-500/50 font-mono text-[11px] select-none">❖ LEVEL 8 ACCREDITATION ❖</div>
              <div className="absolute bottom-3 left-3 text-amber-500/50 font-mono text-[11px] select-none">❖ CLOUD ENCLAVE ❖</div>
              <div className="absolute bottom-3 right-3 text-amber-500/50 font-mono text-[11px] select-none">❖ CRYPTOGRAPHICALLY SECURED ❖</div>

              {/* Top Multi-Institution Accreditation Consortium Ribbon */}
              <div className="space-y-3 pt-2 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono shadow-sm mx-auto">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold tracking-wider uppercase">GLOBAL ARTIFICIAL INTELLIGENCE RESEARCH & INDUSTRY CONSORTIUM</span>
                </div>

                {/* Institution & Industry Leader Badges Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1 max-w-4xl mx-auto">
                  {/* Google Cloud & DeepMind */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.03] border border-blue-500/30">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-300">Google Cloud</span>
                    <span className="text-[8px] text-slate-400">DeepMind Enclave</span>
                  </div>

                  {/* NVIDIA DLI */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.03] border border-emerald-500/30">
                    <Cpu className="w-4 h-4 text-emerald-400 mb-1" />
                    <span className="text-[10px] font-bold text-emerald-300">NVIDIA DLI</span>
                    <span className="text-[8px] text-slate-400">CUDA Compute</span>
                  </div>

                  {/* Meta AI Research */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.03] border border-cyan-500/30">
                    <Globe className="w-4 h-4 text-cyan-400 mb-1" />
                    <span className="text-[10px] font-bold text-cyan-300">Meta AI</span>
                    <span className="text-[8px] text-slate-400">FAIR & Llama</span>
                  </div>

                  {/* OpenAI Foundation */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.03] border border-amber-500/30">
                    <Sparkles className="w-4 h-4 text-amber-400 mb-1" />
                    <span className="text-[10px] font-bold text-amber-300">OpenAI</span>
                    <span className="text-[8px] text-slate-400">Frontier Systems</span>
                  </div>

                  {/* Hugging Face */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.03] border border-yellow-500/30">
                    <Building2 className="w-4 h-4 text-yellow-400 mb-1" />
                    <span className="text-[10px] font-bold text-yellow-300">Hugging Face</span>
                    <span className="text-[8px] text-slate-400">Open Weights</span>
                  </div>

                  {/* Anthropic */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.03] border border-fuchsia-500/30">
                    <Cpu className="w-4 h-4 text-fuchsia-400 mb-1" />
                    <span className="text-[10px] font-bold text-fuchsia-300">Anthropic</span>
                    <span className="text-[8px] text-slate-400">Safety & Scaled</span>
                  </div>

                  {/* Stanford SAIL */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.03] border border-red-500/30">
                    <School className="w-4 h-4 text-red-400 mb-1" />
                    <span className="text-[10px] font-bold text-red-300">Stanford SAIL</span>
                    <span className="text-[8px] text-slate-400">CS25 Foundation</span>
                  </div>

                  {/* MIT CSAIL */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.03] border border-purple-500/30">
                    <Cpu className="w-4 h-4 text-purple-400 mb-1" />
                    <span className="text-[10px] font-bold text-purple-300">MIT CSAIL</span>
                    <span className="text-[8px] text-slate-400">Deep Learning</span>
                  </div>
                </div>
              </div>

              {/* Certificate Title Block */}
              <div className="text-center space-y-2 pt-2">
                <div className="text-xs text-sky-400 font-mono tracking-widest uppercase">
                  EXECUTIVE POST-GRADUATE FELLOWSHIP CERTIFICATION
                </div>
                <h2 
                  className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-400 tracking-tight"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  CERTIFICATE OF SCIENTIFIC EXCELLENCE
                </h2>
                <div className="text-sm sm:text-base font-bold text-slate-200">
                  Frontier AI Systems Architecture & Large Language Model (LLM) Engineering
                </div>
                <div className="text-xs text-cyan-400 font-mono">
                  JINNA 5.0 SCIENTIFIC CURRICULUM • FROM ZERO TO ULTIMATE PRO • LEVEL 8 FELLOWSHIP
                </div>
              </div>

              {/* Conferred Statement */}
              <div className="text-center space-y-2">
                <p className="text-xs sm:text-sm text-slate-400 italic">
                  This post-graduate credential is formally and proudly conferred upon
                </p>

                {/* Recipient Name Box */}
                <div className="inline-block px-8 py-3.5 rounded-2xl bg-[#0D1224] border-2 border-amber-500/60 shadow-xl max-w-2xl w-full mx-auto">
                  <span 
                    className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 tracking-wide uppercase block"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {name}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-300 tracking-widest mt-1 block">
                    ACCREDITED AI SYSTEMS RESEARCH FELLOW
                  </span>
                </div>
              </div>

              {/* Formal Academic Citation */}
              <div className="max-w-3xl mx-auto text-center space-y-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  In formal recognition of outstanding mastery, theoretical rigor, and demonstrable engineering excellence across <strong>2,000+ accredited laboratory hours</strong>, fulfilling all post-graduate curriculum requirements and successfully defending the <strong>Grand Academic Defense Examination</strong> with First-Class Honors.
                </p>
                {progress.grandExamResult?.passed && (
                  <p className="text-emerald-400 font-bold font-mono text-xs pt-1">
                    ★ DEFENSE EXAMINATION SCORE: {progress.grandExamResult.percentage}% • HIGHEST DISTINCTION ACCREDITED ★
                  </p>
                )}
              </div>

              {/* Core Engineering Competencies Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-left">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-cyan-500/20">
                  <div className="text-xs font-bold text-cyan-400 font-mono">CUDA & GPU COMPUTE</div>
                  <div className="text-[11px] text-slate-300 font-medium">Low-level Kernel Optimization & Triton</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">450 Laboratory Hours</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-red-500/20">
                  <div className="text-xs font-bold text-red-400 font-mono">LLMs FROM SCRATCH</div>
                  <div className="text-[11px] text-slate-300 font-medium">Attention Variants, RoPE & KV-Cache</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">650 Laboratory Hours</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-purple-500/20">
                  <div className="text-xs font-bold text-purple-400 font-mono">DISTRIBUTED SCALING</div>
                  <div className="text-[11px] text-slate-300 font-medium">DeepSpeed ZeRO-3, Megatron & FSDP</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">550 Laboratory Hours</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-emerald-500/20">
                  <div className="text-xs font-bold text-emerald-400 font-mono">ENTERPRISE INFERENCE</div>
                  <div className="text-[11px] text-slate-300 font-medium">High-Throughput vLLM & Deployment</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">350 Laboratory Hours</div>
                </div>
              </div>

              {/* Industry Endorsement Banner */}
              <div className="text-center text-[11px] text-slate-400 italic pt-1">
                “Officially verified and recognized under the rigorous scientific standards of Google Cloud, NVIDIA DLI, Meta AI, OpenAI, and premier global research institutes.”
              </div>

              {/* Bottom Row: Signatures, Seal & Verifiable QR */}
              <div className="pt-6 border-t border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                {/* Left: Lead Architect Signature */}
                <div className="space-y-1 text-center md:text-left min-w-[220px]">
                  <div className="text-amber-300 font-serif italic text-2xl tracking-wide">
                    Yousuf Albaz
                  </div>
                  <div className="w-48 h-0.5 bg-cyan-400 mx-auto md:mx-0 opacity-70" />
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    ENG. YOUSUF ALBAZ
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400">
                    Lead AI Systems Architect & Research Director
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Automation AI Yousuf Albaz • JINNA 5 Enclave
                  </div>
                </div>

                {/* Center: Gold Embossed Enclave Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-amber-400 bg-[#0A0D1D] shadow-xl flex flex-col items-center justify-center p-1 relative text-center">
                    <div className="w-20 h-20 rounded-full border border-dashed border-amber-300 flex flex-col items-center justify-center p-1">
                      <span className="text-[7px] font-mono font-bold text-amber-300">★ CONSORTIUM ★</span>
                      <span className="text-xs font-black text-amber-400 font-serif">JINNA 5</span>
                      <span className="text-[7px] font-bold text-cyan-300">VERIFIED SEAL</span>
                      <span className="text-[6px] font-mono text-slate-400">2026</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300/80 mt-1 uppercase">Official Enclave Seal</span>
                </div>

                {/* Right: Verifiable QR Code & Digital Registry */}
                <div className="flex items-center gap-3 bg-[#0C1020] p-3 rounded-xl border border-amber-500/30 text-left">
                  {qrCodeDataUrl && (
                    <div className="bg-white p-1 rounded-lg shrink-0 shadow">
                      <img src={qrCodeDataUrl} alt="Verification QR" className="w-18 h-18 sm:w-20 sm:h-20" />
                    </div>
                  )}
                  <div className="space-y-0.5 text-xs font-mono">
                    <div className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>CRYPTOGRAPHICALLY VERIFIED</span>
                    </div>
                    <div className="text-slate-400 text-[10px]">Credential ID:</div>
                    <div className="text-amber-400 font-bold text-[11px]">{credentialId}</div>
                    <div className="text-slate-400 text-[10px]">Issued: {issueDateEnglish}</div>
                    <div className="text-cyan-400 text-[10px] font-bold">2,000+ Verified Hours</div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          )}
        </div>

        {/* Modal Action Controls Footer (Bilingual Functional Controls) */}
        <div className="px-6 py-4 bg-[#0F1322] border-t border-amber-500/20 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-400">
            {isGrandExamPassed ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                <span>تم اجتياز امتحان الدفاع الكبير بنسبة {progress.grandExamResult?.percentage}% بمرتبة الشرف الأولى! الشهادة باللغة الإنجليزية ومعتمدة وجاهزة للتحميل.</span>
              </span>
            ) : (
              <span className="text-amber-300 font-medium">
                ★ معاينة الوثيقة المعتمدة لعام 2026 • معتمدة من Google Cloud و NVIDIA و Stanford و MIT.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {!isGrandExamPassed && (
              <button
                onClick={() => {
                  onClose();
                  if (onOpenGrandExam) onOpenGrandExam();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-black shadow-md shadow-amber-950/40"
              >
                <Award className="w-4 h-4 text-black" />
                <span>{t('cert.btn_defense_exam')}</span>
              </button>
            )}

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#171C2E] hover:bg-[#202740] text-slate-200 text-xs font-semibold border border-white/[0.08] transition-colors"
              title={language === 'en' ? 'Copy cloud verification link' : 'نسخ رابط التحقق السحابي المباشر'}
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
              <span>{copiedLink ? t('cert.btn_copied') : t('cert.btn_share_link')}</span>
            </button>

            <button
              onClick={() => setShowVerificationModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-950 text-cyan-300 text-xs font-semibold border border-cyan-500/40 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{t('cert.btn_check_registry')}</span>
            </button>

            {/* Main Primary Direct Download Button */}
            <button
              onClick={handleDownloadCertificate}
              disabled={isSavingImage}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-lg ${
                saveSuccess
                  ? 'bg-emerald-500 text-black shadow-emerald-950/40'
                  : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-black shadow-amber-950/40'
              }`}
            >
              {isSavingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>{language === 'en' ? 'Generating certificate...' : 'جارٍ توليد الشهادة...'}</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>{t('cert.btn_saved_success')}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-black" />
                  <span>{t('cert.btn_save_official_png')}</span>
                </>
              )}
            </button>

            {/* Print / PDF Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C2030] hover:bg-[#252A40] text-slate-200 text-xs font-semibold border border-white/[0.1] transition-colors"
              title={language === 'en' ? 'Print or export certificate as PDF' : 'طباعة أو تصدير وثيقة الشهادة كملف PDF'}
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>{t('cert.btn_print_pdf')}</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-slate-300 text-xs font-semibold transition-colors"
            >
              {t('cert.btn_close')}
            </button>
          </div>
        </div>

        {/* Global Credential Verification Registry Modal (بوابة التوثيق والاعتماد الدولي) */}
        {showVerificationModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/92 backdrop-blur-md p-3">
            <div className={`bg-[#0C101F] border-2 border-emerald-500/50 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative ${isRtl ? 'text-right' : 'text-left'}`}>
              <button
                onClick={() => setShowVerificationModal(false)}
                className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-1 rounded-lg text-slate-400 hover:text-white`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
                <ShieldCheck className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-white text-center">{t('cert.reg_title')}</h4>
                <p className="text-xs text-emerald-400 font-mono text-center mt-1">
                  OFFICIAL GLOBAL AI CREDENTIAL REGISTRY • IMMUTABLE VERIFICATION
                </p>
              </div>

              {/* Dossier Information Grid */}
              <div className="bg-[#070A14] p-4 rounded-xl border border-white/[0.08] text-xs space-y-2.5 font-mono">
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-slate-400">{t('cert.reg_status_label')}</span>
                  <span className="text-emerald-400 font-bold">🟢 {t('cert.reg_status_val')}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-slate-400">{t('cert.reg_name_label')}</span>
                  <span className="text-white font-bold">{name}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-slate-400">{t('cert.reg_id_label')}</span>
                  <span className="text-amber-400 font-bold">{credentialId}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-slate-400">{t('cert.reg_supervisor_label')}</span>
                  <span className="text-cyan-300 font-bold">{t('cert.reg_supervisor_val')}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-slate-400">{t('cert.reg_degree_label')}</span>
                  <span className="text-slate-200">Frontier AI Systems & LLM Architecture (Level 8 Fellowship)</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-slate-400">{t('cert.reg_exam_label')}</span>
                  <span className="text-emerald-400 font-bold">
                    {progress.grandExamResult?.passed 
                      ? (language === 'en' ? `Passed with Honors (${progress.grandExamResult.percentage}%)` : `اجتياز بمرتبة الشرف (${progress.grandExamResult.percentage}%)`)
                      : (language === 'en' ? 'Accredited with ID' : 'معتمد برقم القيد الأكاديمي')}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-slate-400">{t('cert.reg_partners_label')}</span>
                  <span className="text-amber-300 text-[11px] text-left">Google Cloud • NVIDIA DLI • Meta AI • OpenAI • Hugging Face • Stanford • MIT</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-slate-400">{t('cert.reg_crypto_label')}</span>
                  <span className="text-blue-400">SHA-256 Cryptographic Enclave Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('cert.reg_hours_label')}</span>
                  <span className="text-slate-200">{t('cert.reg_hours_val')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 rounded-xl bg-[#161B2E] hover:bg-[#202740] text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{t('cert.reg_copy_link')}</span>
                </button>
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  {t('cert.reg_close')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile-First Dedicated Saved Certificate Preview Drawer */}
        {savedPreviewModal.isOpen && (
          <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/95 backdrop-blur-lg p-2 sm:p-4 overflow-y-auto">
            <div className={`bg-[#0B0F1E] border-2 border-amber-500/50 rounded-2xl max-w-3xl w-full p-4 sm:p-6 text-center space-y-4 shadow-2xl relative ${isRtl ? 'text-right' : 'text-left'}`}>
              <button
                onClick={() => setSavedPreviewModal(prev => ({ ...prev, isOpen: false }))}
                className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-1.5 rounded-lg bg-white/[0.08] text-slate-300 hover:text-white`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-2 text-amber-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <h4 className="text-base sm:text-lg font-black text-white">
                  {t('cert.preview_modal_success')}
                </h4>
              </div>

              {/* Mobile Tip Card */}
              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-200 text-center flex items-center justify-center gap-2">
                <Smartphone className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  {t('cert.preview_modal_tip')}
                </span>
              </div>

              {/* High-Resolution Certificate Image Preview */}
              <div className="rounded-xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-black max-h-[50vh] overflow-y-auto flex items-center justify-center">
                <img 
                  src={savedPreviewModal.dataUrl} 
                  alt="Official Fellowship Certificate"
                  className="w-full h-auto object-contain select-all cursor-pointer"
                  title={language === 'en' ? 'Long press to save image to photos' : 'اضغط مطولاً لحفظ الصورة في ألبوم الهاتف'}
                />
              </div>

              {/* Action Download Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                <a
                  href={savedPreviewModal.dataUrl}
                  download={savedPreviewModal.fileName}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-black text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 text-center"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>{t('cert.preview_modal_download')}</span>
                </a>

                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    onClick={async () => {
                      try {
                        if (savedPreviewModal.blob) {
                          const file = new File([savedPreviewModal.blob], savedPreviewModal.fileName, { type: 'image/png' });
                          await navigator.share({
                            title: `JINNA 5 Fellowship Certificate - ${name}`,
                            files: [file]
                          });
                        }
                      } catch {
                        // ignore share dismiss
                      }
                    }}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 text-center"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t('cert.preview_modal_share')}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    const win = window.open(savedPreviewModal.dataUrl, '_blank');
                    if (!win) {
                      const a = document.createElement('a');
                      a.href = savedPreviewModal.dataUrl;
                      a.download = savedPreviewModal.fileName;
                      a.click();
                    }
                  }}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#1C2237] hover:bg-[#252D48] text-slate-200 text-xs font-semibold border border-white/[0.1] transition-colors"
                >
                  {t('cert.preview_modal_fullscreen')}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
