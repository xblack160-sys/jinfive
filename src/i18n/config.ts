import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.courses': 'Courses',
      'nav.dashboard': 'Dashboard',
      'nav.community': 'Community',
      'nav.profile': 'Profile',
      'nav.settings': 'Settings',
      'nav.logout': 'Logout',
      'nav.login': 'Login',
      'nav.signup': 'Sign Up',
      
      // Auth
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.password_confirm': 'Confirm Password',
      'auth.name': 'Full Name',
      'auth.login': 'Login',
      'auth.signup': 'Create Account',
      'auth.forgot_password': 'Forgot Password?',
      'auth.remember_me': 'Remember me',
      'auth.terms': 'I agree to the Terms of Service',
      'auth.already_have_account': 'Already have an account?',
      'auth.no_account': 'Don\'t have an account?',
      'auth.signup_with_google': 'Sign up with Google',
      'auth.signup_with_github': 'Sign up with GitHub',
      
      // Dashboard
      'dashboard.welcome': 'Welcome back',
      'dashboard.progress': 'Your Progress',
      'dashboard.courses_enrolled': 'Courses Enrolled',
      'dashboard.hours_learned': 'Hours Learned',
      'dashboard.certificates': 'Certificates Earned',
      'dashboard.continue_learning': 'Continue Learning',
      'dashboard.my_courses': 'My Courses',
      'dashboard.recent_activity': 'Recent Activity',
      'dashboard.stats': 'Statistics',
      
      // Courses
      'courses.all_courses': 'All Courses',
      'courses.featured': 'Featured',
      'courses.difficulty': 'Difficulty',
      'courses.duration': 'Duration',
      'courses.students': 'Students',
      'courses.rating': 'Rating',
      'courses.enroll': 'Enroll Now',
      'courses.enrolled': 'Enrolled',
      'courses.chapters': 'Chapters',
      'courses.lessons': 'Lessons',
      
      // Lessons
      'lesson.theory': 'Theory',
      'lesson.practice': 'Practice',
      'lesson.exercise': 'Exercise',
      'lesson.resources': 'Resources',
      'lesson.quiz': 'Take Quiz',
      'lesson.complete': 'Mark as Complete',
      'lesson.completed': 'Completed',
      'lesson.notes': 'My Notes',
      'lesson.discussion': 'Discussion',
      
      // Subscription
      'subscription.plan': 'Plan',
      'subscription.starter': 'Starter',
      'subscription.pro': 'Professional',
      'subscription.unlimited': 'Unlimited',
      'subscription.per_month': 'per month',
      'subscription.per_year': 'per year',
      'subscription.upgrade': 'Upgrade Plan',
      'subscription.downgrade': 'Downgrade',
      'subscription.cancel': 'Cancel Subscription',
      'subscription.current_plan': 'Current Plan',
      'subscription.features': 'Features',
      
      // Pricing
      'pricing.title': 'Simple, Transparent Pricing',
      'pricing.monthly': 'Monthly',
      'pricing.yearly': 'Yearly (Save 20%)',
      'pricing.choose_plan': 'Choose Your Plan',
      'pricing.get_started': 'Get Started',
      
      // Community
      'community.forum': 'Forum',
      'community.discussions': 'Discussions',
      'community.ask_question': 'Ask Question',
      'community.my_posts': 'My Posts',
      'community.trending': 'Trending',
      'community.recent': 'Recent',
      'community.popular': 'Popular',
      'community.unanswered': 'Unanswered',
      'community.create_post': 'Create Post',
      'community.reply': 'Reply',
      'community.like': 'Like',
      'community.solved': 'Solved',
      
      // Certificates
      'certificate.earned': 'Certificate Earned!',
      'certificate.download': 'Download Certificate',
      'certificate.share': 'Share Certificate',
      'certificate.verify': 'Verify Certificate',
      'certificate.verified': 'Certificate Verified',
      'certificate.hours': 'Hours Completed',
      
      // Messages
      'message.success': 'Success!',
      'message.error': 'Error',
      'message.loading': 'Loading...',
      'message.confirm': 'Are you sure?',
      'message.delete': 'Delete',
      'message.cancel': 'Cancel',
      'message.save': 'Save',
      'message.update': 'Update',
      'message.apply': 'Apply',
      'message.submit': 'Submit',
      'message.close': 'Close',
      'message.next': 'Next',
      'message.previous': 'Previous',
      'message.back': 'Back',
      'message.not_found': 'Not found',
      'message.unauthorized': 'Unauthorized',
      'message.forbidden': 'Forbidden',
      'message.server_error': 'Server error',
    }
  },
  ar: {
    translation: {
      // Navigation
      'nav.home': 'الرئيسية',
      'nav.courses': 'الدورات',
      'nav.dashboard': 'لوحة التحكم',
      'nav.community': 'المجتمع',
      'nav.profile': 'الملف الشخصي',
      'nav.settings': 'الإعدادات',
      'nav.logout': 'تسجيل الخروج',
      'nav.login': 'تسجيل الدخول',
      'nav.signup': 'إنشاء حساب',
      
      // Auth
      'auth.email': 'البريد الإلكتروني',
      'auth.password': 'كلمة المرور',
      'auth.password_confirm': 'تأكيد كلمة المرور',
      'auth.name': 'الاسم الكامل',
      'auth.login': 'دخول',
      'auth.signup': 'إنشاء حساب',
      'auth.forgot_password': 'هل نسيت كلمة المرور؟',
      'auth.remember_me': 'تذكرني',
      'auth.terms': 'أوافق على شروط الخدمة',
      'auth.already_have_account': 'هل لديك حساب بالفعل؟',
      'auth.no_account': 'ليس لديك حساب؟',
      'auth.signup_with_google': 'التسجيل مع جوجل',
      'auth.signup_with_github': 'التسجيل مع جيت هاب',
      
      // Dashboard
      'dashboard.welcome': 'أهلاً بعودتك',
      'dashboard.progress': 'تقدمك',
      'dashboard.courses_enrolled': 'الدورات المسجلة',
      'dashboard.hours_learned': 'ساعات التعلم',
      'dashboard.certificates': 'الشهادات المكتسبة',
      'dashboard.continue_learning': 'استمر في التعلم',
      'dashboard.my_courses': 'دوراتي',
      'dashboard.recent_activity': 'النشاط الأخير',
      'dashboard.stats': 'الإحصائيات',
      
      // Courses
      'courses.all_courses': 'جميع الدورات',
      'courses.featured': 'مميزة',
      'courses.difficulty': 'مستوى الصعوبة',
      'courses.duration': 'المدة',
      'courses.students': 'الطلاب',
      'courses.rating': 'التقييم',
      'courses.enroll': 'سجل الآن',
      'courses.enrolled': 'مسجل',
      'courses.chapters': 'الفصول',
      'courses.lessons': 'الدروس',
      
      // Lessons
      'lesson.theory': 'النظرية',
      'lesson.practice': 'التطبيق',
      'lesson.exercise': 'التمرين',
      'lesson.resources': 'المصادر',
      'lesson.quiz': 'اختبر نفسك',
      'lesson.complete': 'وضع علامة كمكتملة',
      'lesson.completed': 'مكتملة',
      'lesson.notes': 'ملاحظاتي',
      'lesson.discussion': 'النقاش',
      
      // Subscription
      'subscription.plan': 'الخطة',
      'subscription.starter': 'مبتدئ',
      'subscription.pro': 'احترافي',
      'subscription.unlimited': 'غير محدود',
      'subscription.per_month': 'في الشهر',
      'subscription.per_year': 'في السنة',
      'subscription.upgrade': 'ترقية الخطة',
      'subscription.downgrade': 'خفض المستوى',
      'subscription.cancel': 'إلغاء الاشتراك',
      'subscription.current_plan': 'الخطة الحالية',
      'subscription.features': 'المميزات',
      
      // Pricing
      'pricing.title': 'أسعار بسيطة وشفافة',
      'pricing.monthly': 'شهري',
      'pricing.yearly': 'سنوي (وفر 20%)',
      'pricing.choose_plan': 'اختر خطتك',
      'pricing.get_started': 'ابدأ الآن',
      
      // Community
      'community.forum': 'المنتدى',
      'community.discussions': 'النقاشات',
      'community.ask_question': 'اسأل سؤالاً',
      'community.my_posts': 'منشوراتي',
      'community.trending': 'الأكثر شيوعاً',
      'community.recent': 'الأخيرة',
      'community.popular': 'الشهيرة',
      'community.unanswered': 'بدون إجابة',
      'community.create_post': 'إنشاء منشور',
      'community.reply': 'رد',
      'community.like': 'أعجبني',
      'community.solved': 'تم حلها',
      
      // Certificates
      'certificate.earned': 'شهادة مكتسبة!',
      'certificate.download': 'تحميل الشهادة',
      'certificate.share': 'مشاركة الشهادة',
      'certificate.verify': 'التحقق من الشهادة',
      'certificate.verified': 'شهادة موثقة',
      'certificate.hours': 'الساعات المكتملة',
      
      // Messages
      'message.success': 'نجح!',
      'message.error': 'خطأ',
      'message.loading': 'جاري التحميل...',
      'message.confirm': 'هل أنت متأكد؟',
      'message.delete': 'حذف',
      'message.cancel': 'إلغاء',
      'message.save': 'حفظ',
      'message.update': 'تحديث',
      'message.apply': 'تطبيق',
      'message.submit': 'إرسال',
      'message.close': 'إغلاق',
      'message.next': 'التالي',
      'message.previous': 'السابق',
      'message.back': 'رجوع',
      'message.not_found': 'غير موجود',
      'message.unauthorized': 'غير مصرح',
      'message.forbidden': 'ممنوع',
      'message.server_error': 'خطأ في الخادم',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
