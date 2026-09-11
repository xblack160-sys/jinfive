import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-amber-400/40 animate-bounce">
      <span className="h-2 w-2 rounded-full bg-white animate-ping" />
      <WifiOff className="w-4 h-4" />
      <span>وضع عدم الاتصال — المحتوى المتاح محفوظ ومخزن مسبقاً.</span>
    </div>
  );
};
