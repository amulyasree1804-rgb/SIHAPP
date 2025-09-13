
import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';

interface SMSModalProps {
  onClose: () => void;
}

const SMSModal: React.FC<SMSModalProps> = ({ onClose }) => {
  const { t } = useTranslations();
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    modalRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone.trim()) {
      setError(t('sms_modal_error_phone_required'));
      return;
    }
    if (!message.trim()) {
      setError(t('sms_modal_error_message_required'));
      return;
    }

    setIsSending(true);
    // Simulate API call to send SMS
    setTimeout(() => {
      console.log('Simulating SMS sent:', { phone, message });
      setIsSending(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sms-modal-title"
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative transform transition-all" 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <CloseIcon />
        </button>

        {isSent ? (
          <div className="text-center">
             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 id="sms-modal-title" className="text-2xl font-bold text-dark-text mt-4">{t('sms_modal_success_title')}</h2>
            <p className="text-light-text mt-2">{t('sms_modal_success_desc')}</p>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark"
            >
              {t('sms_modal_close_button')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 id="sms-modal-title" className="text-2xl font-bold text-dark-text">{t('sms_modal_title')}</h2>
            <p className="text-light-text mt-2">{t('sms_modal_desc')}</p>
            
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('sms_modal_phone_label')}</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder={t('sms_modal_phone_placeholder')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">{t('sms_modal_message_label')}</label>
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={t('sms_modal_message_placeholder')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark disabled:bg-gray-400 transition-colors flex items-center justify-center"
              >
                {isSending ? t('sms_modal_sending_button') : t('sms_modal_send_button')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SMSModal;