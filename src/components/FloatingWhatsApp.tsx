import { MessageCircle } from "lucide-react";
import { useState } from "react";

const FloatingWhatsApp = () => {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappUrl = "https://wa.me/919082945603?text=" + encodeURIComponent("Hi, I'd like to book a test at Biogenex Diagnostic");

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: isHovered ? "12px 20px 12px 16px" : "16px",
      }}
    >
      <MessageCircle className="h-6 w-6" />
      <span 
        className={`whitespace-nowrap font-medium transition-all duration-300 overflow-hidden ${
          isHovered ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
        }`}
      >
        Book via WhatsApp
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
