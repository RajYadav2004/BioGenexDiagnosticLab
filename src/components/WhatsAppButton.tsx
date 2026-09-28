import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  message?: string;
  phoneNumber?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

const WhatsAppButton = ({ 
  message = "Hi, I'd like to book a test", 
  phoneNumber = "919082945603",
  variant = "default",
  size = "default",
  className = "",
  children
}: WhatsAppButtonProps) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => window.open(whatsappUrl, '_blank')}
    >
      <MessageCircle className="mr-2 h-5 w-5" />
      {children || "Book via WhatsApp"}
    </Button>
  );
};

export default WhatsAppButton;
