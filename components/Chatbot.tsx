
import React, { useState, useRef, useEffect } from 'react';
import { generateChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { MicIcon, SendIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';

// Add SpeechRecognition to window object
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const Chatbot: React.FC = () => {
  const { t, language } = useTranslations();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your AgriNova assistant. How can I help you with your farming needs today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const recognition = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = language; // Use current language for speech recognition

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (messageText: string = input) => {
    if (!messageText.trim() || isLoading) return;
    const userMessage: ChatMessage = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.slice(1); // Exclude the initial greeting
    const modelResponse = await generateChatResponse(history, messageText, language);
    const modelMessage: ChatMessage = { role: 'model', text: modelResponse };

    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  const handleMicClick = () => {
    if (isListening) {
      recognition.current?.stop();
      setIsListening(false);
    } else if (recognition.current) {
      recognition.current.start();
      setIsListening(true);
    } else {
        alert("Sorry, your browser doesn't support speech recognition.");
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-dark-text">{t('chatbot_title')}</h2>
        <p className="text-sm text-light-text">{t('chatbot_subtitle')}</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <div className="w-8 h-8 bg-primary rounded-full flex-shrink-0"></div>}
              <div className={`px-4 py-3 rounded-xl max-w-lg ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-dark-text'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex-shrink-0"></div>
              <div className="px-4 py-3 rounded-xl bg-gray-100 text-dark-text">
                <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      <div className="p-4 border-t bg-gray-50 rounded-b-xl">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder={t('chatbot_placeholder')}
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-light"
            disabled={isLoading}
          />
          <button onClick={handleMicClick} className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 hover:bg-gray-300'}`}>
            <MicIcon />
          </button>
          <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark disabled:bg-gray-300 transition-colors">
            <SendIcon />
          </button>
        </div>
        <p className="text-xs text-center text-gray-400 mt-2">{t('chatbot_disclaimer')}</p>
      </div>
    </div>
  );
};

export default Chatbot;