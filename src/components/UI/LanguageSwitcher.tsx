/**
 * LanguageSwitcher Component
 * Toggle between Polish and English languages
 */

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
  showFlags?: boolean;
  showLabels?: boolean;
  variant?: 'button' | 'dropdown' | 'toggle';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  showFlags = true,
  showLabels = true,
  variant = 'toggle',
}) => {
  const { language, switchLanguage, isPl, isEn } = useLanguage();

  // Flag SVGs
  const FlagPL = () => (
    <svg className="w-5 h-4" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <g fillRule="evenodd">
        <path fill="#fff" d="M640 480H0V0h640z"/>
        <path fill="#dc143c" d="M640 480H0V240h640z"/>
      </g>
    </svg>
  );

  const FlagEN = () => (
    <svg className="w-5 h-4" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      <path fill="#012169" d="M0 0h640v480H0z"/>
      <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/>
      <path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"/>
      <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/>
      <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"/>
    </svg>
  );

  if (variant === 'toggle') {
    return (
      <button
        onClick={switchLanguage}
        className={`flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 hover:border-gray-400 transition-colors ${className}`}
        aria-label={isPl ? 'Switch to English' : 'Przełącz na polski'}
        title={isPl ? 'Switch to English' : 'Przełącz na polski'}
      >
        {showFlags && (isPl ? <FlagPL /> : <FlagEN />)}
        {showLabels && (
          <span className="text-sm font-medium uppercase">
            {language}
          </span>
        )}
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <div className={`flex gap-1 ${className}`}>
        <button
          onClick={() => !isPl && switchLanguage()}
          className={`px-3 py-1 text-sm rounded ${
            isPl 
              ? 'bg-dark-pastel-red text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors`}
          aria-label="Polski"
        >
          {showFlags && <FlagPL />}
          {showLabels && <span className={showFlags ? 'ml-1' : ''}>PL</span>}
        </button>
        <button
          onClick={() => !isEn && switchLanguage()}
          className={`px-3 py-1 text-sm rounded ${
            isEn 
              ? 'bg-dark-pastel-red text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors`}
          aria-label="English"
        >
          {showFlags && <FlagEN />}
          {showLabels && <span className={showFlags ? 'ml-1' : ''}>EN</span>}
        </button>
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`}>
      <select
        value={language}
        onChange={(e) => {
          if (e.target.value !== language) {
            switchLanguage();
          }
        }}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-dark-pastel-red"
        aria-label="Select language"
      >
        <option value="pl">🇵🇱 Polski</option>
        <option value="en">🇬🇧 English</option>
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
