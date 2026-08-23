import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Salam Zewellery Concierge! I am browsing the boutique collection on zewellery.pk and would like some assistance."
    );
    window.open(`https://wa.me/923001234567?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40">
      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className="flex items-center bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-full shadow-2xl hover:shadow-green-500/40 transition-all duration-300 ease-out cursor-pointer border-2 border-white overflow-hidden"
        aria-label="Let's connect on WhatsApp"
        title="Let's connect on WhatsApp"
      >
        {/* WhatsApp Icon */}
        <MessageCircle size={24} fill="currentColor" className="shrink-0" />

        {/* Text appears ONLY when pointer is ON the button */}
        <span
          className={`overflow-hidden whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-all duration-300 ease-out ${
            isHovered
              ? 'max-w-[240px] ml-2.5 opacity-100 pr-1'
              : 'max-w-0 ml-0 opacity-0'
          }`}
        >
          LETS CONNECT ON WHATSAPP
        </span>
      </button>
    </div>
  );
}
