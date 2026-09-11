import React, { createContext, useContext, useState, useEffect } from 'react';
import { curriculumTranslationsEn } from '../data/curriculumTranslations';
import { Chapter, Lesson } from '../types';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  isRtl: boolean;
  t: (key: string) => string;
  getChapterContent: (chapter: Chapter) => {
    title: string;
    subtitle: string;
    description: string;
    badge: string;
    prefix: string;
  };
  getLessonContent: (lesson: Lesson, chapterId?: number) => {
    title: string;
    subtitle: string;
    duration: string;
    readTime: string;
    getSectionTitle: (secId: string, fallback: string) => string;
  };
}

const LANGUAGE_STORAGE_KEY = 'jinna5_platform_language_v1';

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Header & Brand
    'header.title': 'منصة JINNA 5 لنظم الذكاء الاصطناعي',
    'header.subtitle': 'هندسة وبحوث النماذج اللغوية الضخمة',
    'header.vram_calc': 'حاسبة VRAM',
    'header.certificate': 'الشهادة المعتمدة',
    'header.books': 'الكتب المترجمة',
    'header.ide': 'بيئة العمل (IDE)',
    'header.ads': 'الربح والإعلانات',
    'header.ai_coach': 'AI Coach',
    'header.ai_coach_sub': '(المساعد الذكي)',
    'header.admin': 'الإدارة',
    'header.admin_tooltip_active': 'لوحة الإدارة (مفعلة)',
    'header.admin_tooltip_locked': 'النظام المعماري',
    'header.books_tooltip': 'مكتبة أمهات كتب الذكاء الاصطناعي وهندسة الأنظمة',
    'header.ide_tooltip': 'بيئة التطوير المتكاملة للمشاريع الضخمة',
    'header.vram_tooltip': 'حاسبة ميزانية الذاكرة والعتاد',
    'header.certificate_tooltip': 'الشهادة المعتمدة والتوثيق الأكاديمي',
    'header.ads_tooltip': 'إدارة الأرباح والإعلانات والحساب البنكي',
    'header.ai_coach_tooltip': 'المساعد الذكي العام (JINNA AI Engine)',
    'header.curriculum_path': 'المسار التخصصي',
    'header.chapters_count': 'مقررات',
    'header.lessons_count': 'درساً تطبيقياً',
    'header.hours_count': 'ساعة معتمدة',
    'header.firestore_connected': 'قاعدة بيانات Firestore: متصلة',
    'header.progress': 'إنجاز',
    'header.theme_light': 'الوضع الفاتح',
    'header.theme_dark': 'الوضع الداكن',

    // Diploma Banner
    'diploma.title': 'دبلومة هندسة وبحوث أنظمة الذكاء الاصطناعي (منصة JINNA 5):',
    'diploma.subtitle': 'من الصفر إلى الاحتراف الفائق',
    'diploma.level_tag': 'Zero → Ultimate Pro',
    'diploma.accredited_tag': 'برنامج أكاديمي معتمد',
    'diploma.syllabus_btn': 'منهج التخصص (Syllabus)',
    'diploma.notes_btn': 'ملاحظاتي الدراسية',
    'diploma.certificate_btn': 'استحقاق الشهادة',
    'diploma.passed_quizzes': 'اختبارات',
    'diploma.details_show': 'عرض تفاصيل الاعتماد',
    'diploma.details_hide': 'إخفاء التفاصيل',
    'diploma.instructor_title': 'المشرف والمطور الأكاديمي',
    'diploma.instructor_desc': 'المهندس يوسف الباز (Automation Ai Yousuf Albaz) - باحث ومهندس نظم الذكاء الاصطناعي وبناء النماذج التوليدية.',
    'diploma.hours_title': 'ساعات معتمدة حقيقية',
    'diploma.hours_desc': 'مقررات تخصصية تعادل 401 ساعة من المحاضرات الجامعية وقوائم تشغيل YouTube ومعامل Colab.',
    'diploma.labs_title': 'مختبرات Google Colab و PyTorch',
    'diploma.labs_desc': 'محرر بايثون مباشر، محاكاة خوارزميات التدريب والمحاذاة DPO، ونوى CUDA، وحاسبة VRAM.',
    'diploma.conditions_title': 'شروط نيل شهادة التخصص',
    'diploma.conditions_desc': 'إتمام 100% من الدروس واجتياز اختبارات الفصول بنسبة 70% فأكثر لإصدار الشهادة الرقمية المعتمدة.',

    // General & Navigation
    'nav.courses': 'المقررات والتخصصات',
    'nav.back_to_student': 'عرض واجهة الطلاب (Student View)',
    'nav.mobile_view_lesson': 'عرض الدرس',
    'nav.mobile_view_curriculum': 'فصول المنهج',
    'common.engineer': 'المهندس يوسف الباز',
    'common.supervisor': 'بإشراف وبناء المهندس يوسف الباز',
    'common.close': 'إغلاق',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.loading': 'جاري التحميل...',
    'common.completed': 'مكتمل',
    'common.course': 'المقرر',
    'common.lessons': 'درس',
    'common.hours_abbr': 'س',

    // Sidebar & Lesson
    'sidebar.curriculum_title': 'منهج تخصص الذكاء الاصطناعي',
    'sidebar.search_placeholder': 'ابحث في محتوى المقررات والدروس والأكواد...',
    'sidebar.specialization_path': 'خريطة الدبلومة التخصصية',
    'sidebar.standards': 'معايير المعمارية الهندسية JINNA 5',
    'sidebar.progress_alert': 'تنبيه التقدم الأكاديمي:',
    'lesson.quiz_btn': 'اختبار الفهم الهندسي للدرس',
    'lesson.quiz_passed': 'تم تأكيد الاستيعاب (ناجح)',
    'lesson.quiz_take': 'اختبار تأكيد استيعاب الدرس 📝',
    'lesson.notes_btn': 'ملاحظاتي',
    'lesson.next': 'الدرس التالي',
    'lesson.prev': 'الدرس السابق',
    'lesson.tab_resources': 'المحاضرات والمعامل (YouTube & Labs)',
    'lesson.tab_theory': 'المفاهيم والشرح الأكاديمي',
    'lesson.tab_code': 'المعمل التفاعلي ومحرر الكود',
    'lesson.tab_practice': 'التطبيق العملي وتحدي المقابلة',
    'lesson.tab_simulator': 'مختبر المعمارية والذاكرة',
    'lesson.hours_breakdown': 'التوزيع المعتمد لساعات التعلم الحقيقية لهذا الدرس',
    'lesson.hours_verified': 'ساعات معتمدة وموثقة بالأدلة',
    'lesson.hours_sub': 'لا مجرد فيديو سريع؛ هذا منهاج مكثف يعادل مقرراً فصلياً كاملاً في أرقى جامعات العالم (Stanford, Harvard, MIT).',
    'lesson.accredited_hours': 'ساعة دراسية معتمدة',
    'lesson.video_lectures': 'محاضرات الفيديو الكاملة',
    'lesson.lab_work': 'المختبر والمعامل البرمجية',
    'lesson.reading_hours': 'القراءة والبحث الأكاديمي',
    'lesson.project_hours': 'المشروع البرمجي المستقل',
    'lesson.math_title': 'المعادلات الرياضية الصريحة (Mathematical Formulation):',
    'lesson.takeaway_title': 'الخلاصة الهندسية المركزة (Key Engineering Takeaway):',
    'lesson.video_summary_title': 'ملخص الفيديو والمحاضرة المرئية المعتمدة',
    'lesson.video_summary_sub': 'أهم النقاط الذهبية والمفاهيم المحورية المستخلصة من الشرح المرئي لتثبيت الفهم',
    'lesson.watch_video_btn': 'مشاهدة الفيديو كاملاً',
    'lesson.direct_link': 'رابط مباشر للمحاضرة',
    'lesson.instructor_label': 'المحاضر:',
    'lesson.deep_dive_title': 'الشرح المعمق والتشريح الهندسي الشامل للدرس',
    'lesson.deep_dive_badge': 'Deep Engineering Breakdown',
    'lesson.deep_dive_desc': 'تفكيك المفاهيم المعقدة وتبسيطها بأسلوب تطبيقي مباشر للمهندسين',
    'lesson.books_btn': 'مطالعة الكتب المترجمة ذات الصلة',
    'lesson.why_need': '1. لماذا نحتاج هذا المفهوم؟',
    'lesson.why_need_desc': 'في أنظمة الذكاء الاصطناعي الحديثة، لا يكفي معرفة الكود السطحي؛ بل يجب فهم مسار تدفق البيانات في الذاكرة وحسابات العمليات الرياضية (FLOPs) لكل عملية لتفادي الاختناقات وحجم الذاكرة المهدر.',
    'lesson.math_intuition': '2. الحدس الرياضي والنمذجة',
    'lesson.math_intuition_desc': 'يتم تحويل كل مسألة إلى مصفوفات كثيفة وعمليات ضرب قياسي متوازية تُنفذ على آلاف الأنوية المتزامنة في معالج الرسوميات (GPU)، حيث تعمل الخيوط (Threads) في حزم متناسقة تُدعى Warps.',
    'lesson.avoid_errors': '3. تجنب أخطاء الإنتاج القاتلة',
    'lesson.avoid_errors_desc': 'الخطأ الأكثر شيوعاً هو تسريب البيانات (Data Leakage) أو استهلاك كامل ذاكرة VRAM (CUDA Out of Memory) بسبب عدم تصفير التدرجات، أو عدم استخدام الحسابات المختلطة (BF16 / FP16).',
    'lesson.senior_tip_title': 'نصيحة ذهبية لكبار مهندسي الذكاء الاصطناعي:',
    'lesson.senior_tip_desc': 'اختبر دوماً صحة المصفوفات وأبعادها (Shape Constraints) قبل إطلاق أي تدريب، وراقب سقف أداء النطاق الترددي للذاكرة (Memory Bandwidth Roofline).',
    'lesson.try_code_title': 'هل تريد تجربة كود هذا الدرس ومحاكاته الآن؟',
    'lesson.try_code_sub': 'انتقل للمعمل التفاعلي لتعديل المعاملات وتشغيل الكود بضغطة زر.',
    'lesson.open_code_btn': 'فتح المحرر التفاعلي',
    'lesson.ide_title': 'بيئة المشاريع الضخمة (JINNA 5 Cloud AI Studio IDE)',
    'lesson.ide_desc': 'هل تريد بناء المشروع الضخم كاملاً (NanoGPT / CUDA C++ Kernels / LoRA Fine-Tuning) بملفاته وشاشات التيرمينال الحقيقية؟',
    'lesson.ide_launch_btn': 'تشغيل محطة العمل السحابية (IDE)',
    'lesson.papers_title': 'الأوراق البحثية التأسيسية والمستودعات المعتمدة (Foundational Papers & Repos)',
    'lesson.arxiv_link': 'رابط arXiv',
    'lesson.github_repo': 'مستودع GitHub',
    'lesson.challenge_title': 'تمرين تطبيقي مصغر (Hands-on Challenge)',
    'lesson.challenge_badge': 'تطبيق حقيقي',
    'lesson.hint_label': 'إشارة للحل (Hint):',
    'lesson.show_solution': 'إظهار الحل النموذجي',
    'lesson.hide_solution': 'إخفاء الحل النموذجي',
    'lesson.solution_title': 'كود الحل النموذجي (Reference Solution):',
    'lesson.interview_title': 'أسرار المقابلات التقنية لشركات الذكاء الاصطناعي (Meta / OpenAI / DeepMind)',
    'lesson.next_locked': 'الدرس التالي (مغلق 🔒 - اضغط لإجراء اختبار الدرس الحالي)',
    'lesson.quiz_to_unlock': 'اجتياز اختبار الدرس لفتح الدرس التالي',

    // Certificate Modal
    'cert.modal_title': 'وثيقة الاعتماد والزمالة الدولية المعتمدة',
    'cert.accredited_badge': 'معتمدة رسمياً 🎓',
    'cert.preview_badge': 'معاينة واعتماد',
    'cert.tab_preview': 'معاينة الشهادة',
    'cert.tab_requirements': 'شروط الاعتماد',
    'cert.edit_name': 'تعديل الاسم',
    'cert.save_name': 'حفظ الاسم',
    'cert.download_btn': 'تحميل الشهادة (PNG 300 DPI)',
    'cert.print_btn': 'طباعة أو حفظ PDF',
    'cert.copy_link': 'نسخ رابط التحقق',
    'cert.link_copied': 'تم نسخ الرابط بنجاح!',
    'cert.req_title': 'معايير استحقاق وتوثيق الزمالة الأكاديمية الدولية',
    'cert.req_desc': 'طبقاً للائحة الاعتماد الصارمة المقررة من المهندس يوسف الباز، فإن وثيقة التخرج والزمالة المعتمدة تتطلب اجتياز امتحان الدفاع الكبير الشامل بنسبة لا تقل عن 85% لتوثيق رقم القيد الرسمي على السجل السحابي العالمي.',
    'cert.req_step1': '1. إتمام كافة دروس الدبلومة الـ 18',
    'cert.req_step2': '2. اجتياز اختبارات تأكيد الاستيعاب للدروس',
    'cert.req_step3': '3. اجتياز الامتحانات الشاملة للمقررات',
    'cert.req_step4': '4. امتحان الدفاع الأكاديمي الكبير (25 سؤالاً - 85% للنجاح)',
    'cert.enter_defense_btn': 'دخول امتحان الدفاع الكبير (85% للنجاح)',
    'cert.defense_passed_msg': 'تم اجتياز امتحان الدفاع الكبير بمرتبة الشرف الأولى! الشهادة معتمدة وجاهزة للتحميل.',
    'cert.defense_preview_msg': '★ معاينة الوثيقة المعتمدة لعام 2026 • معتمدة من Google Cloud و NVIDIA و Stanford و MIT.',
  },
  en: {
    // Header & Brand
    'header.title': 'JINNA 5 AI Systems Platform',
    'header.subtitle': 'Large Language Models Engineering & Research',
    'header.vram_calc': 'VRAM Calculator',
    'header.certificate': 'Verified Certificate',
    'header.books': 'Translated Books',
    'header.ide': 'Workstation (IDE)',
    'header.ads': 'Monetization & Ads',
    'header.ai_coach': 'AI Coach',
    'header.ai_coach_sub': '(Engineering Mentor)',
    'header.admin': 'Admin',
    'header.admin_tooltip_active': 'Admin Console (Active)',
    'header.admin_tooltip_locked': 'Architectural Core',
    'header.books_tooltip': 'Classic AI & Systems Engineering Library',
    'header.ide_tooltip': 'Integrated Development Environment (IDE)',
    'header.vram_tooltip': 'VRAM & Hardware Budget Calculator',
    'header.certificate_tooltip': 'Verified Credential & Accreditation',
    'header.ads_tooltip': 'Monetization, AdSense & Bank Setup',
    'header.ai_coach_tooltip': 'JINNA AI Engine Intelligence Partner',
    'header.curriculum_path': 'Specialization Track',
    'header.chapters_count': 'Courses',
    'header.lessons_count': 'Applied Lessons',
    'header.hours_count': 'Accredited Hours',
    'header.firestore_connected': 'Firestore Cloud DB: Connected',
    'header.progress': 'Progress',
    'header.theme_light': 'Light Theme',
    'header.theme_dark': 'Dark Theme',

    // Diploma Banner
    'diploma.title': 'AI Systems Engineering & Research Diploma (JINNA 5 Platform):',
    'diploma.subtitle': 'From Zero to Ultimate Pro',
    'diploma.level_tag': 'Zero → Ultimate Pro',
    'diploma.accredited_tag': 'Accredited Academic Program',
    'diploma.syllabus_btn': 'Curriculum Syllabus',
    'diploma.notes_btn': 'Study Notes',
    'diploma.certificate_btn': 'Certificate Eligibility',
    'diploma.passed_quizzes': 'Quizzes',
    'diploma.details_show': 'View Accreditation Details',
    'diploma.details_hide': 'Hide Details',
    'diploma.instructor_title': 'Academic Supervisor & System Architect',
    'diploma.instructor_desc': 'Eng. Yousuf Albaz (Automation Ai Yousuf Albaz) - Generative AI Systems Architect & Frontier LLM Researcher.',
    'diploma.hours_title': 'Real Accredited Study Hours',
    'diploma.hours_desc': '11 Specialized courses equivalent to 401 verified hours of university lectures, YouTube curated series & Colab labs.',
    'diploma.labs_title': 'Google Colab & PyTorch Workstations',
    'diploma.labs_desc': 'Interactive Python kernels, DPO alignment simulators, CUDA kernels & VRAM memory profilers.',
    'diploma.conditions_title': 'Certification Requirements',
    'diploma.conditions_desc': 'Complete 100% of lessons and pass all course comprehensive quizzes with ≥70% score for verified credential issuance.',

    // General & Navigation
    'nav.courses': 'Courses & Tracks',
    'nav.back_to_student': 'Student Learning View',
    'nav.mobile_view_lesson': 'View Lesson',
    'nav.mobile_view_curriculum': 'Curriculum Tracks',
    'common.engineer': 'Eng. Yousuf Albaz',
    'common.supervisor': 'Architected & Built by Eng. Yousuf Albaz',
    'common.close': 'Close',
    'common.save': 'Save Changes',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'common.completed': 'Completed',
    'common.course': 'Course',
    'common.lessons': 'Lessons',
    'common.hours_abbr': 'h',

    // Sidebar & Lesson
    'sidebar.curriculum_title': 'AI Engineering Specialization Curriculum',
    'sidebar.search_placeholder': 'Search curriculum, lessons, codes, models...',
    'sidebar.specialization_path': 'Specialization Curriculum Map',
    'sidebar.standards': 'JINNA 5 System Architecture Standards',
    'sidebar.progress_alert': 'Academic Progress Notice:',
    'lesson.quiz_btn': 'Take Engineering Comprehension Quiz',
    'lesson.quiz_passed': 'Comprehension Verified (Passed)',
    'lesson.quiz_take': 'Take Lesson Comprehension Quiz 📝',
    'lesson.notes_btn': 'My Notes',
    'lesson.next': 'Next Lesson',
    'lesson.prev': 'Previous Lesson',
    'lesson.tab_resources': 'Lectures & Labs (YouTube & Colab)',
    'lesson.tab_theory': 'Academic Foundations & Architecture',
    'lesson.tab_code': 'Interactive Pipeline & Code Runner',
    'lesson.tab_practice': 'Applied Exercises & Interview Challenge',
    'lesson.tab_simulator': 'Architecture & Hardware Simulator',
    'lesson.hours_breakdown': 'Accredited Real Learning Hours Distribution for This Lesson',
    'lesson.hours_verified': 'Accredited & Evidence-Backed Hours',
    'lesson.hours_sub': 'Not just a short video; this is an intensive syllabus equivalent to a full semester course at Stanford, MIT, or Harvard.',
    'lesson.accredited_hours': 'Accredited Study Hours',
    'lesson.video_lectures': 'Full Video Lectures',
    'lesson.lab_work': 'Applied Labs & Code Execution',
    'lesson.reading_hours': 'Academic Reading & Papers',
    'lesson.project_hours': 'Independent Engineering Project',
    'lesson.math_title': 'Mathematical Formulation & Rigorous Proofs:',
    'lesson.takeaway_title': 'Key Engineering Takeaway:',
    'lesson.video_summary_title': 'Accredited Video Lecture Summary',
    'lesson.video_summary_sub': 'Key architectural mental models and golden insights extracted from the video lectures to solidify comprehension',
    'lesson.watch_video_btn': 'Watch Full Lecture',
    'lesson.direct_link': 'Direct Lecture Link',
    'lesson.instructor_label': 'Instructor:',
    'lesson.deep_dive_title': 'In-Depth Technical Exposition & Architectural Deconstruction',
    'lesson.deep_dive_badge': 'Deep Engineering Breakdown',
    'lesson.deep_dive_desc': 'Deconstructing intricate systems concepts with empirical engineering precision',
    'lesson.books_btn': 'Read Translated Classical Books',
    'lesson.why_need': '1. Why is this architectural primitive essential?',
    'lesson.why_need_desc': 'In modern frontier AI architectures, syntactic proficiency is insufficient; engineers must understand memory bandwidth traffic, FLOPs per parameter, and pipeline stalls to eliminate production OOM bottlenecks.',
    'lesson.math_intuition': '2. Mathematical Formulation & Parallel Tensor Dynamics',
    'lesson.math_intuition_desc': 'Every problem maps to dense matrix tensors and dot-product compute scheduled across thousands of SIMT CUDA cores inside GPU warps.',
    'lesson.avoid_errors': '3. Preventing Catastrophic Production Failures',
    'lesson.avoid_errors_desc': 'The most perilous production traps are silent data contamination, unzeroed gradient accumulation, and non-convergent mixed-precision underflow (FP16 vs BF16).',
    'lesson.senior_tip_title': 'Golden Rule for Principal AI Systems Architects:',
    'lesson.senior_tip_desc': 'Always mathematically verify tensor dimension constraints and roofline memory bandwidth limits before launching large-scale distributed training jobs.',
    'lesson.try_code_title': 'Ready to execute and experiment with this lesson\'s pipeline?',
    'lesson.try_code_sub': 'Launch the interactive sandbox to modify hyperparameters and run model code in real time.',
    'lesson.open_code_btn': 'Launch Interactive Runner',
    'lesson.ide_title': 'Frontier Systems Workstation (JINNA 5 Cloud AI Studio IDE)',
    'lesson.ide_desc': 'Ready to construct the complete multi-file project (NanoGPT / CUDA C++ Kernels / LoRA Fine-Tuning) with full terminal and file tree?',
    'lesson.ide_launch_btn': 'Launch Cloud Workstation (IDE)',
    'lesson.papers_title': 'Foundational Academic Papers & Verified Repositories',
    'lesson.arxiv_link': 'arXiv Paper',
    'lesson.github_repo': 'GitHub Repo',
    'lesson.challenge_title': 'Hands-on Applied Engineering Challenge',
    'lesson.challenge_badge': 'Applied Challenge',
    'lesson.hint_label': 'Engineering Hint:',
    'lesson.show_solution': 'Reveal Reference Solution',
    'lesson.hide_solution': 'Hide Reference Solution',
    'lesson.solution_title': 'Reference Solution Code:',
    'lesson.interview_title': 'Frontier Technical Interview Insights (Meta / OpenAI / DeepMind)',
    'lesson.next_locked': 'Next Lesson (Locked 🔒 - Pass current lesson quiz to unlock)',
    'lesson.quiz_to_unlock': 'Pass Lesson Quiz to Unlock Next Topic',

    // Certificate Modal
    'cert.modal_title': 'Verified International Executive Fellowship Credential',
    'cert.accredited_badge': 'OFFICIALLY ACCREDITED 🎓',
    'cert.preview_badge': 'PREVIEW & ACCREDITATION',
    'cert.tab_preview': 'Certificate Preview',
    'cert.tab_requirements': 'Accreditation Criteria',
    'cert.edit_name': 'Edit Name',
    'cert.save_name': 'Save Name',
    'cert.download_btn': 'Download Certificate (PNG 300 DPI)',
    'cert.print_btn': 'Print or Save as PDF',
    'cert.copy_link': 'Copy Verification Link',
    'cert.link_copied': 'Verification link copied!',
    'cert.req_title': 'International Academic Fellowship Verification Standards',
    'cert.req_desc': 'Pursuant to rigorous accreditation standards established by Eng. Yousuf Albaz, issuance of this post-graduate credential requires achieving ≥85% on the Grand Academic Defense Examination (25 advanced systems questions) for cryptographically registered cloud ledger entry.',
    'cert.req_step1': '1. Complete all 18 specialization curriculum lessons',
    'cert.req_step2': '2. Pass all lesson comprehension quizzes',
    'cert.req_step3': '3. Pass all comprehensive course examinations',
    'cert.req_step4': '4. Pass Grand Academic Defense Exam (25 questions - 85% required)',
    'cert.enter_defense_btn': 'Take Grand Defense Exam (85% required)',
    'cert.defense_passed_msg': 'Grand Academic Defense passed with First-Class Honors! Certificate is verified and ready for download.',
    'cert.defense_preview_msg': '★ Official 2026 Executive Credential Preview • Accredited by Google Cloud, NVIDIA, Stanford & MIT.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'ar' || saved === 'en') return saved;
    } catch {
      // ignore
    }
    return 'ar';
  });

  const isRtl = language === 'ar';

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // ignore
    }

    // Synchronize HTML lang and dir attributes dynamically
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('lang', language);
    htmlElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  }, [language, isRtl]);

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['ar']?.[key] || key;
  };

  // Helper to dynamically translate chapters
  const getChapterContent = (chapter: Chapter) => {
    if (language === 'en') {
      const en = curriculumTranslationsEn.chapters[chapter.id];
      if (en) {
        return {
          title: en.title,
          subtitle: en.subtitle,
          description: en.description,
          badge: en.badge,
          prefix: en.prefix,
        };
      }
    }
    return {
      title: chapter.title,
      subtitle: chapter.subtitle,
      description: chapter.description,
      badge: chapter.badge,
      prefix: chapter.id === 0 ? 'المقرر التمهيدي (من الصفر)' : `المقرر ${chapter.id}`,
    };
  };

  // Helper to dynamically translate lessons
  const getLessonContent = (lesson: Lesson, chapterId?: number) => {
    if (language === 'en') {
      const en = curriculumTranslationsEn.lessons[lesson.id];
      if (en) {
        return {
          title: en.title,
          subtitle: en.subtitle,
          duration: en.duration,
          readTime: en.readTime,
          getSectionTitle: (secId: string, fallback: string) => {
            return en.sections?.[secId] || fallback;
          }
        };
      }
    }
    return {
      title: lesson.title,
      subtitle: lesson.subtitle,
      duration: lesson.duration,
      readTime: lesson.readTime,
      getSectionTitle: (_secId: string, fallback: string) => fallback,
    };
  };

  return (
    <LanguageContext.Provider value={{
      language,
      toggleLanguage,
      setLanguage,
      isRtl,
      t,
      getChapterContent,
      getLessonContent
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
