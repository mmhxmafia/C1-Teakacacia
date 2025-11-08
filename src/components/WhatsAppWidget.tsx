import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "918590774213"; // +91 8590774213 without + and spaces
  
  const handleWhatsAppClick = (message?: string) => {
    const defaultMessage = "Hello\! I'm interested in your furniture products. Could you please provide more information?";
    const encodedMessage = encodeURIComponent(message || defaultMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const quickMessages = [
    "I want to inquire about custom furniture",
    "I need wholesale pricing information", 
    "I want to visit your showroom",
    "I need furniture for my home/office"
  ];

  return (
    <>
      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Quick Messages Popup */}
          {isOpen && (
            <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5 mb-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">Edakkattu Furniture</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Typically replies instantly</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Hi\! 👋 How can we help you today?
                </p>
                
                {quickMessages.map((message, index) => (
                  <button
                    key={index}
                    onClick={() => handleWhatsAppClick(message)}
                    className="w-full text-left p-3 text-sm bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-gray-700 hover:border-green-500/30 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-200 hover:text-green-700 dark:hover:text-green-400 shadow-sm hover:shadow-md"
                  >
                    {message}
                  </button>
                ))}
                
                <button
                  onClick={() => handleWhatsAppClick()}
                  className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]"
                >
                  Start Chat on WhatsApp
                </button>
              </div>
            </div>
          )}
          
          {/* Main WhatsApp Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
            
            {/* Pulse animation */}
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
          </button>
          
          {/* Online indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full">
            <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsAppWidget;
