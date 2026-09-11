import React, { useState, useEffect, useRef } from 'react';
import { Users, GraduationCap, Radio, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const TOTAL_VISITORS_KEY = 'jinna5_total_platform_visitors_v2';
const BASE_VISITORS_COUNT = 14382;
const BASE_STUDENTS_COUNT = 1420;

interface LivePlatformStatsProps {
  variant?: 'header' | 'banner';
}

export const LivePlatformStats: React.FC<LivePlatformStatsProps> = ({ variant = 'header' }) => {
  const { theme } = useTheme();
  const { language, isRtl } = useLanguage();
  const isLight = theme === 'light';

  // 1. Live Users Now (Real Active Sessions Heartbeat)
  const [onlineUsers, setOnlineUsers] = useState<number>(1);

  // 2. Enrolled Students
  const [enrolledStudents, setEnrolledStudents] = useState<number>(BASE_STUDENTS_COUNT);

  // 3. All-Time Visitors
  const [totalVisitors, setTotalVisitors] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(TOTAL_VISITORS_KEY);
      if (stored) {
        const val = parseInt(stored, 10);
        if (!isNaN(val) && val >= BASE_VISITORS_COUNT) {
          return val;
        }
      }
    } catch {
      // ignore
    }
    return BASE_VISITORS_COUNT;
  });

  // Unique session token for this browser tab
  const [sessionId] = useState<string>(() => {
    let id = sessionStorage.getItem('jinna5_tab_session_id');
    if (!id) {
      id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('jinna5_tab_session_id', id);
    }
    return id;
  });

  // Real Server-Sent Events (SSE) stream for instant real-time sync
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/stats/stream');
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (typeof data.onlineUsers === 'number') {
            setOnlineUsers(Math.max(1, data.onlineUsers));
          }
          if (typeof data.totalVisitors === 'number') {
            setTotalVisitors(data.totalVisitors);
            try {
              localStorage.setItem(TOTAL_VISITORS_KEY, data.totalVisitors.toString());
            } catch {
              // ignore
            }
          }
          if (typeof data.enrolledStudents === 'number') {
            setEnrolledStudents(data.enrolledStudents);
          }
        } catch (e) {
          console.warn('Failed parsing stats stream', e);
        }
      };
    } catch (err) {
      console.warn('SSE not supported or failed', err);
    }

    return () => {
      eventSource?.close();
    };
  }, []);

  // Real API Ping & Session Registration
  useEffect(() => {
    const isNewTabVisit = !sessionStorage.getItem('jinna5_visit_counted');
    if (isNewTabVisit) {
      sessionStorage.setItem('jinna5_visit_counted', 'true');
    }

    const pingServer = async (isNewVisit: boolean) => {
      try {
        const res = await fetch('/api/stats/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, isNewVisit })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.totalVisitors === 'number') {
            setTotalVisitors(data.totalVisitors);
            localStorage.setItem(TOTAL_VISITORS_KEY, data.totalVisitors.toString());
          }
          if (data && typeof data.onlineUsers === 'number') {
            setOnlineUsers(Math.max(1, data.onlineUsers));
          }
          if (data && typeof data.enrolledStudents === 'number') {
            setEnrolledStudents(data.enrolledStudents);
          }
        }
      } catch (err) {
        console.warn('Heartbeat ping failed', err);
      }
    };

    // 1. Immediate Ping on Mount/Refresh
    pingServer(isNewTabVisit);

    // 2. Periodic Heartbeat every 15 seconds to keep session alive
    const interval = setInterval(() => {
      pingServer(false);
    }, 15000);

    return () => clearInterval(interval);
  }, [sessionId]);

  const formatNum = (num: number) => {
    return language === 'en' ? num.toLocaleString('en-US') : num.toLocaleString('ar-EG');
  };

  if (variant === 'header') {
    return (
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Metric 1: Online Users Now */}
        <div 
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-medium transition-all ${
            isLight 
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' 
              : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
          }`}
          title={language === 'en' ? 'Live active users right now' : 'عدد المستخدمين والطلاب المتصلين بالمنصة في الوقت الفعلي'}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-semibold">
            {language === 'en' ? 'Online: ' : 'متصل الآن: '}
            <strong className="font-mono">{onlineUsers}</strong>
          </span>
        </div>

        {/* Metric 2: Enrolled Students */}
        <div 
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-medium transition-all ${
            isLight 
              ? 'bg-blue-50/90 border-blue-200 text-blue-800' 
              : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300'
          }`}
          title={language === 'en' ? 'Enrolled engineers and students' : 'إجمالي عدد الطلاب والمهندسين المسجلين بالدبلومة'}
        >
          <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px]">
            <span className="hidden xs:inline">{language === 'en' ? 'Students: ' : 'الطلاب: '}</span>
            <strong className="font-mono">{formatNum(enrolledStudents)}</strong>
          </span>
        </div>

        {/* Metric 3: All-Time Users */}
        <div 
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-medium transition-all ${
            isLight 
              ? 'bg-purple-50/90 border-purple-200 text-purple-800' 
              : 'bg-purple-950/30 border-purple-500/30 text-purple-300'
          }`}
          title={language === 'en' ? 'Total visitors to date' : 'إجمالي عدد الزيارات والمستخدمين للمنصة حتى الآن (يتحدث مع كل زيارة وتحديث)'}
        >
          <Eye className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[11px]">
            <span className="hidden sm:inline">{language === 'en' ? 'Total Visitors: ' : 'إجمالي الزوار: '}</span>
            <strong className="font-mono">{formatNum(totalVisitors)}</strong>
          </span>
        </div>
      </div>
    );
  }

  // Banner / Hero variant
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 my-3" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. Online Now */}
      <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
        isLight 
          ? 'bg-white border-emerald-200/80 shadow-xs' 
          : 'bg-[#0E1318] border-emerald-500/20'
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center relative ${
          isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
        }`}>
          <Radio className="w-4 h-4 animate-pulse" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
        <div>
          <div className="text-[10px] text-slate-500 font-medium">
            {language === 'en' ? 'Online Now' : 'مستخدمين متصلين الآن'}
          </div>
          <div className="text-sm sm:text-base font-bold font-mono text-emerald-500 flex items-center gap-1">
            <span>{onlineUsers}</span>
            <span className="text-[10px] font-normal text-emerald-400/80">
              {language === 'en' ? 'active' : 'نشط لحظياً'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Students */}
      <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
        isLight 
          ? 'bg-white border-blue-200/80 shadow-xs' 
          : 'bg-[#0F121C] border-cyan-500/20'
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          isLight ? 'bg-blue-100 text-blue-700' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
        }`}>
          <GraduationCap className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] text-slate-500 font-medium">
            {language === 'en' ? 'Enrolled Students' : 'طلاب الدبلومة المسجلين'}
          </div>
          <div className="text-sm sm:text-base font-bold font-mono text-cyan-400">
            {formatNum(enrolledStudents)}+
          </div>
        </div>
      </div>

      {/* 3. All-time Users */}
      <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
        isLight 
          ? 'bg-white border-purple-200/80 shadow-xs' 
          : 'bg-[#14101F] border-purple-500/20'
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          isLight ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
        }`}>
          <Users className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] text-slate-500 font-medium">
            {language === 'en' ? 'Total Platform Visitors' : 'إجمالي المستخدمين للآن'}
          </div>
          <div className="text-sm sm:text-base font-bold font-mono text-purple-400">
            {formatNum(totalVisitors)}
          </div>
        </div>
      </div>
    </div>
  );
};
