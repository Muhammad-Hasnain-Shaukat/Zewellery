import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-deep-charcoal text-warm-ivory text-xs sm:text-sm py-3 px-4 rounded shadow-2xl border border-champagne-gold/30 flex items-center gap-3 animate-slide-in-right cursor-pointer hover:bg-black transition-colors"
          onClick={() => onDismiss(toast.id)}
        >
          <CheckCircle2 size={16} className="text-champagne-gold shrink-0" />
          <span className="leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
