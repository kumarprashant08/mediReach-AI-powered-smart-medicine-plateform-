import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, ShieldAlert, Pill, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export const MediReachAIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am **MediReach AI**, your healthcare accessibility assistant. How can I help you find medicines or understand your prescription today?',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      let aiResponseText = '';
      const query = messageText.toLowerCase();

      if (query.includes('paracetamol') || query.includes('dolo') || query.includes('crocin')) {
        aiResponseText =
          '**Paracetamol (500mg/650mg)** is an analgesic and antipyretic medication used to treat fever and mild-to-moderate pain. Standard dosage is 1 tablet as advised by a doctor. *Disclaimer: MediReach does not provide diagnostic prescriptions.*';
      } else if (query.includes('reservation') || query.includes('reserve')) {
        aiResponseText =
          'To reserve medicine on MediReach:\n1. Search for your medicine.\n2. Choose the pharmacy with the highest **Smart Access Score**.\n3. Click **Reserve Pickup** and pick a time slot.\n4. Show your generated **QR code** at pickup!';
      } else if (query.includes('access score') || query.includes('ranking')) {
        aiResponseText =
          '**Smart Access Score** ranks pharmacies using 5 weighted factors:\n- **Availability (40%)**\n- **Distance (20%)**\n- **Price (15%)**\n- **Stock Freshness (15%)**\n- **Pickup Speed (10%)**';
      } else if (query.includes('prescription') || query.includes('ocr')) {
        aiResponseText =
          'You can upload a photo of your handwritten or printed prescription on our **Prescription OCR** page. Our AI extracts medicine names, strength, and dosage for instant pharmacy availability verification!';
      } else {
        aiResponseText =
          `MediReach AI is designed to help you locate verified medicines, understand dosage instructions, and find nearby pharmacies. For specific medical treatments or diagnoses, please consult a qualified medical professional.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiResponseText,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const sampleQuestions = [
    'What is Paracetamol used for?',
    'How does medicine reservation work?',
    'How is Smart Access Score calculated?',
    'How to upload prescription OCR?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold px-4 py-3.5 rounded-full shadow-2xl shadow-brand-500/40 hover:scale-105 transition-all group"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-sm font-sans tracking-wide">MediReach AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="w-[92vw] sm:w-[380px] h-[520px] glass-card bg-white/95 rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-brand-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-brand-500/30 border border-brand-400/40 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm flex items-center gap-1.5">
                    MediReach AI Assistant <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </h4>
                  <span className="text-[10px] text-cyan-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Online • Medical Info Assistant
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Disclaimer Banner */}
            <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-2 text-[10px] text-amber-900 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>Informational only. Not a substitute for professional medical advice.</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-500 text-white rounded-br-none shadow-md'
                        : 'bg-white text-navy-900 rounded-bl-none border border-slate-200 shadow-sm'
                    }`}
                  >
                    {msg.text.split('\n').map((line, idx) => (
                      <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="whitespace-nowrap text-[10px] font-medium bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" /> {q}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about medicines, reservations, or OCR..."
                className="flex-1 text-xs bg-slate-100 border border-slate-200 rounded-full px-4 py-2.5 focus:outline-none focus:border-brand-500 text-navy-900"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
