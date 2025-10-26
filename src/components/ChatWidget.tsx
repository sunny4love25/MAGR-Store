import { useState } from 'react';
import { MessageCircle, X, Send, Phone, Lock, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { Dialog, DialogContent, DialogDescription } from './ui/dialog';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

export function ChatWidget() {
  const { user, setAuthDialogOpen } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [activeChat, setActiveChat] = useState<'none' | 'live' | 'whatsapp'>('none');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can we help you today?',
      sender: 'support',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const whatsappNumber = '2348089299224'; // +234 (Nigeria) + 8089299224

  const handleWhatsApp = () => {
    const defaultMessage = 'Hello, I need assistance with my order.';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappUrl, '_blank');
    setShowOptions(false);
  };

  const handleLiveChat = () => {
    if (!user) {
      setShowLoginPrompt(true);
      setShowOptions(false);
      return;
    }
    setActiveChat('live');
    setShowOptions(false);
    setIsOpen(true);
  };

  const handleLoginClick = () => {
    setShowLoginPrompt(false);
    setAuthDialogOpen(true);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate support response
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. Our support team will respond shortly.',
        sender: 'support',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, supportMessage]);
    }, 1000);
  };

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setActiveChat('none');
    } else {
      setShowOptions(true);
    }
  };

  if (showOptions && !isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
        {/* WhatsApp Option - Icon hidden, text visible */}
        <div
          onClick={handleWhatsApp}
          className="flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg cursor-pointer hover:bg-green-600 transition-all hover:scale-105 animate-in slide-in-from-right"
        >
          <span className="font-medium">Chat on WhatsApp</span>
        </div>

        {/* Live Chat Option - Icon hidden, text visible */}
        <div
          onClick={handleLiveChat}
          className="flex items-center gap-3 bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg cursor-pointer hover:bg-orange-600 transition-all hover:scale-105 animate-in slide-in-from-right"
        >
          <span className="font-medium">Live Chat Support</span>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setShowOptions(false)}
          className="w-14 h-14 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition-all hover:scale-110"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    );
  }

  if (activeChat === 'live' && isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] animate-in slide-in-from-bottom">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden border">
          {/* Header */}
          <div className="bg-orange-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold">Live Chat Support</h3>
                <p className="text-xs text-orange-100">We typically reply in minutes</p>
              </div>
            </div>
            <button
              onClick={handleToggle}
              className="hover:bg-orange-600 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="h-96 p-4 bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-orange-100' : 'text-gray-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-orange-500 hover:bg-orange-600"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Logged in as {user?.name}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Chat Button
  return (
    <>
      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="sm:max-w-xl bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 border-0">
          <DialogDescription className="sr-only">
            Login to access chat support
          </DialogDescription>
          <div className="text-center py-8 px-4">
            {/* Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 via-orange-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl animate-pulse">
              <Lock className="w-12 h-12 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Login Required
            </h2>

            {/* Message */}
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Please <span className="font-bold text-orange-600">login to your account</span> to use our live chat support feature
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleLoginClick}
                className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all text-lg py-6"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Login Now
              </Button>
              <Button
                onClick={() => setShowLoginPrompt(false)}
                variant="outline"
                className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-600"
              >
                Maybe Later
              </Button>
            </div>

            {/* Extra Info */}
            <div className="mt-6 p-4 bg-white/50 rounded-lg border border-orange-200">
              <p className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> Create an account to access live chat, track orders, and get exclusive deals!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleToggle}
          className="w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-all hover:scale-110 animate-bounce"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        {/* Notification Badge */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
          1
        </div>
      </div>
    </>
  );
}
