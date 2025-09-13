
import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useTranslations();

  const languages = [
    { code: 'en', name: t('language_switcher_en') },
    { code: 'hi', name: t('language_switcher_hi') },
    { code: 'ta', name: t('language_switcher_ta') },
    { code: 'te', name: t('language_switcher_te') },
    { code: 'bn', name: t('language_switcher_bn') },
    { code: 'mr', name: t('language_switcher_mr') },
  ];

  return (
    <div className="flex justify-center items-center bg-gray-100 rounded-lg p-1 flex-wrap">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`flex-1 px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
            language === lang.code
              ? 'bg-primary text-white shadow'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;