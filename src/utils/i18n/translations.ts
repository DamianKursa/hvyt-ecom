/**
 * Translations for Footer and other components
 * Centralized translation management
 */

import { Language } from './config';

export interface FooterTranslations {
  serviceInfo: {
    freeShipping: { title: string; desc: string };
    shipping24h: { title: string; desc: string };
    return30: { title: string; desc: string };
    support: { title: string; desc: string };
  };
  company: {
    title: string;
    contact: string;
    email: string;
  };
  links: {
    categories: {
      handles: string;
      doorHandles: string;
      wallHooks: string;
      knobs: string;
      furniture: string;
      collections: string;
      blog: string;
    };
    pages: {
      about: string;
      contact: string;
      cooperation: string;
      delivery: string;
      returns: string;
    };
  };
  newsletter: {
    title: string;
    placeholder: string;
    button: string;
    consent: string;
  };
  partners: {
    title: string;
    paymentMethods: string;
  };
  legal: {
    copyright: string;
    terms: string;
    privacy: string;
  };
  aboutUs: {
    pageTitle: string;
    metaDescription: string;
    heroTitle: string;
    heroDescriptionMobile: string;
    heroDescriptionDesktop: string;
    contactButton: string;
  };
}

const translations: Record<Language, FooterTranslations> = {
  pl: {
    serviceInfo: {
      freeShipping: {
        title: 'Darmowa dostawa',
        desc: 'Dla zamówień powyżej 300 zł',
      },
      shipping24h: {
        title: 'Wysyłka w 24h',
        desc: 'W dni robocze',
      },
      return30: {
        title: '30 dni na zwrot',
        desc: 'Od dnia otrzymania przesyłki',
      },
      support: {
        title: 'Błyskawiczne wsparcie',
        desc: 'Przez formularz i social media',
      },
    },
    company: {
      title: 'Dane firmowe:',
      contact: 'Kontakt:',
      email: 'hello@hvyt.pl',
    },
    links: {
      categories: {
        handles: 'Uchwyty',
        doorHandles: 'Klamki',
        wallHooks: 'Wieszaki',
        knobs: 'Gałki',
        furniture: 'Meble',
        collections: 'Kolekcje',
        blog: 'Blog',
      },
      pages: {
        about: 'O nas',
        contact: 'Kontakt',
        cooperation: 'Współpraca',
        delivery: 'Dostawa',
        returns: 'Zwroty i reklamacje',
      },
    },
    newsletter: {
      title: 'Zapisz się do newslettera, aby być na bieżąco z nowościami i promocjami.',
      placeholder: 'Podaj swój adres e-mail',
      button: 'Zapisz się',
      consent: 'Subskrybując, wyrażasz zgodę na naszą Politykę prywatności i na otrzymywanie aktualizacji od naszej firmy.',
    },
    partners: {
      title: 'Nasi partnerzy:',
      paymentMethods: 'Metody płatności:',
    },
    legal: {
      copyright: '© HVYT. Wszystkie prawa zastrzeżone.',
      terms: 'Regulamin',
      privacy: 'Polityka prywatności',
    },
    aboutUs: {
      pageTitle: 'Hvyt | O nas',
      metaDescription: 'Poznaj HVYT - małą firmę z wielką ofertą. Stworzyliśmy markę z miłości do designu i dodatków, które nadają indywidualny charakter każdemu wnętrzu. Odkryj nasze kolekcje uchwytów, klamek i wieszaków.',
      heroTitle: 'Mała firma,<br /> wielka oferta',
      heroDescriptionMobile: 'HVYT powstał z miłości do designu i dodatków. Wierzymy, że to właśnie one są odpowiedzialne za indywidualny charakter każdego wnętrza. Sami jesteśmy całkiem zakręceni, dlatego nasza nazwa to alternatywny zapis słowa „chwyt". Staramy się aby nasza oferta była różnorodna i każdy mógł znaleźć coś dla siebie.',
      heroDescriptionDesktop: 'HVYT powstał z miłości do designu i dodatków.<br /> Wierzymy, że to właśnie one są odpowiedzialne<br /> za indywidualny charakter każdego wnętrza.<br /> Sami jesteśmy całkiem zakręceni, dlatego nasza<br /> nazwa to alternatywny zapis słowa „chwyt".<br /><br /> Staramy się aby nasza oferta była<br /> różnorodna i każdy mógł znaleźć coś dla siebie.',
      contactButton: 'Kontakt →',
    },
  },
  en: {
    serviceInfo: {
      freeShipping: {
        title: 'Free shipping',
        desc: 'For orders over €50',
      },
      shipping24h: {
        title: 'Shipping within 24h',
        desc: 'On business days',
      },
      return30: {
        title: '30 days return',
        desc: 'From the day of receipt',
      },
      support: {
        title: 'Lightning-fast support',
        desc: 'Via form and social media',
      },
    },
    company: {
      title: 'Company details:',
      contact: 'Contact:',
      email: 'hello@hvyt.pl',
    },
    links: {
      categories: {
        handles: 'Handles',
        doorHandles: 'Door handles',
        wallHooks: 'Wall hooks',
        knobs: 'Knobs',
        furniture: 'Furniture',
        collections: 'Collections',
        blog: 'Blog',
      },
      pages: {
        about: 'About us',
        contact: 'Contact',
        cooperation: 'Cooperation',
        delivery: 'Delivery',
        returns: 'Returns and complaints',
      },
    },
    newsletter: {
      title: 'Subscribe to our newsletter to stay up to date with news and promotions.',
      placeholder: 'Enter your email address',
      button: 'Subscribe',
      consent: 'By subscribing, you agree to our Privacy Policy and to receive updates from our company.',
    },
    partners: {
      title: 'Our partners:',
      paymentMethods: 'Payment methods:',
    },
    legal: {
      copyright: '© HVYT. All rights reserved.',
      terms: 'Terms and Conditions',
      privacy: 'Privacy Policy',
    },
    aboutUs: {
      pageTitle: 'Hvyt | About Us',
      metaDescription: 'Discover HVYT - a small company with a great offer. We created our brand from a love of design and accessories that give each interior its individual character. Explore our collections of handles, door handles and wall hooks.',
      heroTitle: 'Small company,<br /> great offer',
      heroDescriptionMobile: 'HVYT was born from a love of design and accessories. We believe that these are what give each interior its individual character. We are quite quirky ourselves, which is why our name is an alternative spelling of the word "grip". We strive to make our offer diverse so everyone can find something for themselves.',
      heroDescriptionDesktop: 'HVYT was born from a love of design and accessories.<br /> We believe that these are what give each interior<br /> its individual character. We are quite quirky ourselves,<br /> which is why our name is an alternative spelling<br /> of the word "grip".<br /><br /> We strive to make our offer diverse<br /> so everyone can find something for themselves.',
      contactButton: 'Contact →',
    },
  },
};

export const getTranslations = (lang: Language): FooterTranslations => {
  return translations[lang] || translations.pl;
};

