import React from 'react';
import { MessageCircle } from 'lucide-react';
import { db } from '../db/schema';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  courseTitle?: string;
  orderNumber?: string;
  label?: string;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message,
  courseTitle,
  orderNumber,
  label,
  className = ''
}) => {
  const settings = db.getSettings();
  const targetPhone = phoneNumber || settings.whatsappNumber || '5571992747496';

  let defaultMsg = 'Olá! Gostaria de falar com o atendimento da Oliveira Concursos.';
  if (courseTitle) {
    defaultMsg = `Olá! Tenho interesse no curso ${courseTitle} da Oliveira Concursos. Gostaria de receber mais informações.`;
  } else if (orderNumber) {
    defaultMsg = `Olá! Gostaria de confirmar o pagamento do pedido ${orderNumber} na Oliveira Concursos.`;
  } else if (message) {
    defaultMsg = message;
  }

  const encodedMsg = encodeURIComponent(defaultMsg);
  const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedMsg}`;

  if (label) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-md transition-colors duration-200 ${className}`}
      >
        <MessageCircle className="w-5 h-5" />
        <span>{label}</span>
      </a>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end group">
      <div className="mb-2 hidden group-hover:flex items-center bg-[#071A33] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg border border-[#D4AF37]/40 whitespace-nowrap">
        <span>Fale conosco no WhatsApp</span>
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Atendimento WhatsApp Oliveira Concursos"
        className="bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 border-2 border-[#D4AF37]"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
};
