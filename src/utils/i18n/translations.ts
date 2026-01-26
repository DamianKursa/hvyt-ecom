/**
 * Translations for Footer and other components
 * Centralized translation management
 */

import { Language } from './config';

export interface Translations {
  slugs: {
    category: string,
    product: string,
  },
  product: {  
  notAvailableInLanguage: string;  
  notAvailableDescription: string;  
  backToHome: string;  
  loading: string;  
},
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
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    remove: string;
    close: string;
    back: string;
    next: string;
    yes: string;
    no: string;
    required: string;
    optional: string;
    free: string;
    total: string;
    quantity: string;
    price: string;
    subtotal: string;
    vatIncluded: string;
    processing: string;
    tryAgainLater: string;
    noData: string;
    poland: string;
    countryRegion: string;
    backToHome: string;
  };
  cart: {
    pageTitle: string;
    emptyCart: {
      title: string;
      description: string;
      handlesButton: string;
      homeButton: string;
    };
    progress: {
      cart: string;
      deliveryAndPayment: string;
      summary: string;
      backToProducts: string;
    };
    item: {
      edit: string;
      editModalTitle: string;
      editModalDescription: string;
    };
    summary: {
      title: string;
      productsTotal: string;
      productsValue: string;
      discountValue: string;
      shipping: string;
      shippingFree: string;
      total: string;
      vatInfo: string;
      proceedToCheckout: string;
      placeOrder: string;
    };
    discountCode: {
      title: string;
      placeholder: string;
      apply: string;
      loading: string;
      emptyError: string;
      invalidError: string;
      saleItemsError: string;
      noMatchingProductsError: string;
      removed: string;
      added: string;
      addedFreeShipping: string;
      addedLimited: string;
      removedNoProducts: string;
      removedSaleItems: string;
    };
    errors: {
      outOfStock: string;
      variantUnavailable: string;
      maxQuantity: string;
      loadingError: string;
    };
    messages: {
      variationChanged: string;
    };
    recommendations: {
      title: string;
      description: string;
    };
  };
  checkout: {
    pageTitle: string;
    personalData: {
      title: string;
      loginPrompt: string;
      customerTypeIndividual: string;
      customerTypeCompany: string;
      firstName: string;
      lastName: string;
      companyName: string;
      vatNumber: string;
      phone: string;
      email: string;
      newsletterSubscribe: string;
      createAccount: string;
    };
    address: {
      title: string;
      streetName: string;
      buildingNumber: string;
      apartmentNumber: string;
      city: string;
      postalCode: string;
      country: string;
      differentShippingAddress: string;
      enterDifferentAddress: string;
      saveToAccount: string;
      additionalInfo: string;
      additionalInfoPlaceholder: string;
      loadingAddresses: string;
      loadingBillingData: string;
    };
    shipping: {
      title: string;
      selectMethod: string;
      loading: string;
      error: string;
      errorRetry: string;
      noMethodsAvailable: string;
      selectInpostLocker: string;
      selectGlsPoint: string;
      changeGlsPoint: string;
      selectedPoint: string;
      freeShipping: string;
      free: string;
      selectLocker: string;
      errorLoading: string;
      retryMessage: string;      
    };
    payment: {
      title: string;
      selectMethod: string;
      loading: string;
      error: string;
      errorRetry: string;
      noMethodsAvailable: string;
      noMethods: string;
      errorLoading: string;
      retryMessage: string;      
    };
    order: {
      title: string;
      emptyCart: string;
      quantity: string;
    };
    terms: {
      confirmTerms: string;
      termsLink: string;
      privacyLink: string;
      termsAcceptance: string;
      confirm: string;
      regulamin: string;
      and: string;
      privacyPolicy: string;
      accept: string;      
    };
    validation: {
      selectLocker: string;
      selectGlsPoint: string;
      emptyCart: string;
      selectShipping: string;
      selectPayment: string;
      acceptTerms: string;
      fillRequired: string;
      orderError: string;
      orderCreatedNoId: string;
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      street: string;
      buildingNumber: string;
      city: string;
      postalCode: string;      
    };
    deliveryAndPayment: string;
    hasAccount: string;
    createAccount: string;
    shippingAddress: {
      loadingAddresses: string;
      streetName: string;
      buildingNumber: string;
      apartmentNumber: string;
      city: string;
      postalCode: string;
      country: string;
      differentAddress: string;
      enterDifferentAddress: string;
      saveAddress: string;
      additionalInfo: string;
      additionalInfoPlaceholder: string;
    };
    billingAddress: {
      loadingData: string;
      individualCustomer: string;
      company: string;
      firstName: string;
      lastName: string;
      companyName: string;
      vatNumber: string;
      phone: string;
      email: string;
      subscribeNewsletter: string;
    };
    orderSummary: {
      title: string;
      emptyCart: string;
      quantity: string;
    };
    errors: {
      orderCreationFailed: string;
      shippingLoadFailed: string;
      orderCreatedNoId: string;
    };
    placeOrder: string;    
  };
  thankYou: {
    pageTitle: string;
    hero: {
      title: string;
      description: string;
      orderNumber: string;
    };
    order: {
      title: string;
      product: string;
      price: string;
      quantity: string;
      total: string;
      paymentMethod: string;
      noPaymentData: string;
      shippingAddress: string;
      noShippingData: string;
      billingAddress: string;
      noBillingData: string;
      noAddress: string;
    };
    backToHome: string;
    error: {
      orderNotFound: string;
      loadingError: string;
    };
  };
}

const translations: Record<Language, Translations> = {
  pl: {
    slugs: {
      category: 'kategoria',
      product: 'produkt',
    },
    product: {  
      notAvailableInLanguage: 'Produkt niedostępny w tym języku',  
      notAvailableDescription: 'Niestety ten produkt nie jest dostępny w wybranej wersji językowej...',  
      backToHome: 'Wróć do strony głównej',  
      loading: 'Ładowanie produktu...',  
    },
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
    common: {
      loading: 'Ładowanie...',
      error: 'Błąd',
      save: 'Zapisz',
      cancel: 'Anuluj',
      edit: 'edytuj',
      delete: 'Usuń',
      remove: 'Usuń',
      close: 'Zamknij',
      back: 'Wstecz',
      next: 'Dalej',
      yes: 'Tak',
      no: 'Nie',
      required: 'wymagane',
      optional: 'opcjonalnie',
      free: 'Darmowa',
      total: 'Razem',
      quantity: 'Ilość',
      price: 'Cena',
      subtotal: 'Suma częściowa',
      vatIncluded: 'kwota zawiera 23% VAT',
      processing: 'Przetwarzanie...',
      tryAgainLater: 'Spróbuj ponownie później.',
      noData: 'Brak danych',
      poland: 'Polska',
      countryRegion: 'Kraj / Region',
      backToHome: 'Wróć do strony głównej',
    },
    cart: {
      pageTitle: 'Hvyt | Koszyk',
      emptyCart: {
        title: 'Twój koszyk jest pusty',
        description: 'Znajdź produkt w naszym sklepie, który wyróżni Twoje wnętrze!',
        handlesButton: 'Uchwyty',
        homeButton: 'Strona Główna',
      },
      progress: {
        cart: 'Koszyk',
        deliveryAndPayment: 'Dostawa i płatność',
        summary: 'Podsumowanie',
        backToProducts: 'Wróć do produktów',
      },
      item: {
        edit: 'edytuj',
        editModalTitle: 'Edytuj rozstaw produktu',
        editModalDescription: 'Produkty zostaną dodane do koszyka z uwzględnieniem ich aktualnych cen. Czy chcesz kontynuować?',
      },
      summary: {
        title: 'Podsumowanie',
        productsTotal: 'Razem produkty',
        productsValue: 'Wartość produktów',
        discountValue: 'Wartość rabatu',
        shipping: 'Wysyłka',
        shippingFree: 'Darmowa',
        total: 'Suma',
        vatInfo: 'kwota zawiera 23% VAT',
        proceedToCheckout: 'Przejdź do kasy',
        placeOrder: 'Zamawiam i Płacę',
      },
      discountCode: {
        title: 'Posiadasz kod rabatowy?',
        placeholder: 'Wpisz kod',
        apply: 'Zapisz',
        loading: 'Ładowanie...',
        emptyError: 'Uzupełnij kod rabatowy',
        invalidError: 'Niepoprawny kod rabatowy',
        saleItemsError: 'Kod nie działa na produkty z promocji.',
        noMatchingProductsError: 'Brak produktów spełniających warunki kodu.',
        removed: 'Kod rabatowy został usunięty',
        added: 'Kod rabatowy został dodany',
        addedFreeShipping: 'Kod rabatowy został dodany – darmowa wysyłka.',
        addedLimited: 'Kod rabatowy został dodany - rabat naliczono dla:',
        removedNoProducts: 'Kod rabatowy usunięty – brak produktów spełniających warunki',
        removedSaleItems: 'Kod nie działa na produkty z promocji — usunięto.',
      },
      errors: {
        outOfStock: 'Produkt jest niedostępny.',
        variantUnavailable: 'Wariant wybrany dla tego produktu jest niedostępny. Zmień wariant, aby kontynuować.',
        maxQuantity: 'Nie można dodać więcej niż {count} szt.',
        loadingError: 'Wystąpił błąd. Spróbuj ponownie później.',
      },
      messages: {
        variationChanged: 'Rozstaw produktu {name} został zmieniony',
      },
      recommendations: {
        title: 'Produkty, które mogą Ci się spodobać',
        description: 'Sprawdź produkty, które idealnie pasują z wybranym produktem.',
      },
    },
    checkout: {
      pageTitle: 'Hvyt | Checkout',
      personalData: {
        title: 'Dane osobowe',
        loginPrompt: 'Masz już konto? Zaloguj się',
        customerTypeIndividual: 'Klient indywidualny',
        customerTypeCompany: 'Firma',
        firstName: 'Imię',
        lastName: 'Nazwisko',
        companyName: 'Nazwa firmy',
        vatNumber: 'NIP',
        phone: 'Numer telefonu',
        email: 'Adres e-mail',
        newsletterSubscribe: 'Zapisz się do newslettera',
        createAccount: 'Stwórz konto',
      },
      address: {
        title: 'Adres',
        streetName: 'Nazwa ulicy',
        buildingNumber: 'Nr budynku',
        apartmentNumber: 'Nr lokalu',
        city: 'Miasto',
        postalCode: 'Kod pocztowy',
        country: 'Kraj / Region',
        differentShippingAddress: 'Dostawa pod inny adres',
        enterDifferentAddress: 'Wpisz inny adres',
        saveToAccount: 'Zapisz ten adres w moim koncie',
        additionalInfo: 'Dodatkowe informacje do zamówienia (opcjonalnie)',
        additionalInfoPlaceholder: 'Opis...',
        loadingAddresses: 'Ładowanie adresów...',
        loadingBillingData: 'Ładowanie danych do faktury...',
      },
      shipping: {
        title: 'Dostawa i płatność',
        selectMethod: 'Wybierz sposób dostawy',
        loading: 'Ładowanie metod dostawy...',
        error: 'Nie udało się pobrać metod dostawy',
        errorRetry: 'Wystąpił błąd podczas ładowania metod dostawy. Ponowna próba za 5 sekund.',
        noMethodsAvailable: 'Brak dostępnych metod dostawy.',
        selectInpostLocker: 'Wybierz Paczkomat',
        selectGlsPoint: 'Wybierz punkt GLS',
        changeGlsPoint: 'Zmień punkt GLS',
        selectedPoint: 'Wybrany punkt:',
        freeShipping: 'Darmowa',
        free: 'Darmowa',
        selectLocker: 'Wybierz Paczkomat',
        errorLoading: 'Nie udało się pobrać metod dostawy',
        retryMessage: 'Wystąpił błąd podczas ładowania metod dostawy. Ponowna próba za 5 sekund.',        
      },
      payment: {
        title: 'Wybierz sposób płatności',
        selectMethod: 'Wybierz sposób płatności',
        loading: 'Ładowanie metod płatności...',
        error: 'Nie udało się pobrać metod płatności',
        errorRetry: 'Wystąpił błąd podczas pobierania metod płatności. Ponowna próba za 5 sekund.',
        noMethodsAvailable: 'Brak dostępnych metod płatności dla wybranej metody dostawy.',
        noMethods: 'Brak dostępnych metod płatności dla wybranej metody dostawy.',
        errorLoading: 'Nie udało się pobrać metod płatności',
        retryMessage: 'Wystąpił błąd podczas pobierania metod płatności. Ponowna próba za 5 sekund.',        
      },
      order: {
        title: 'Twoje zamówienie',
        emptyCart: 'Twój koszyk jest pusty.',
        quantity: 'Ilość:',
      },
      terms: {
        confirmTerms: 'Potwierdzam, że zapoznałam/em się z treścią',
        termsLink: 'Regulaminu',
        privacyLink: 'Polityki Prywatności',
        termsAcceptance: 'oraz akceptuję ich postanowienia.',
        confirm: '*Potwierdzam, że zapoznałam/em się z treścią',
        regulamin: 'Regulaminu',
        and: 'i',
        privacyPolicy: 'Polityki Prywatności',
        accept: 'oraz akceptuję ich postanowienia.',        
      },
      validation: {
        selectLocker: 'Wybierz paczkomat przed złożeniem zamówienia.',
        selectGlsPoint: 'Wybierz punkt GLS przed złożeniem zamówienia.',
        emptyCart: 'Koszyk jest pusty!',
        selectShipping: 'Wybierz metodę dostawy.',
        selectPayment: 'Wybierz metodę płatności.',
        acceptTerms: '*Potwierdzam, że zapoznałam/em się z treścią Regulaminu i Polityki Prywatności oraz akceptuję ich postanowienia.',
        fillRequired: 'Proszę uzupełnić wymagane pola:',
        orderError: 'Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.',
        orderCreatedNoId: 'Zamówienie utworzone, ale brakuje identyfikatora zamówienia.',
        firstName: 'Imię',
        lastName: 'Nazwisko',
        phone: 'Numer telefonu',
        email: 'Adres e-mail',
        street: 'Nazwa ulicy',
        buildingNumber: 'Numer budynku',
        city: 'Miasto',
        postalCode: 'Kod pocztowy',        
      },
      deliveryAndPayment: 'Dostawa i płatność',
      hasAccount: 'Masz już konto? Zaloguj się',
      createAccount: 'Stwórz konto',
      shippingAddress: {
        loadingAddresses: 'Ładowanie adresów...',
        streetName: 'Nazwa ulicy',
        buildingNumber: 'Nr budynku',
        apartmentNumber: 'Nr lokalu',
        city: 'Miasto',
        postalCode: 'Kod pocztowy',
        country: 'Kraj / Region',
        differentAddress: 'Dostawa pod inny adres',
        enterDifferentAddress: 'Wpisz inny adres',
        saveAddress: 'Zapisz ten adres w moim koncie',
        additionalInfo: 'Dodatkowe informacje do zamówienia (opcjonalnie)',
        additionalInfoPlaceholder: 'Opis...',
      },
      billingAddress: {
        loadingData: 'Ładowanie danych do faktury...',
        individualCustomer: 'Klient indywidualny',
        company: 'Firma',
        firstName: 'Imię',
        lastName: 'Nazwisko',
        companyName: 'Nazwa firmy',
        vatNumber: 'NIP',
        phone: 'Numer telefonu',
        email: 'Adres e-mail',
        subscribeNewsletter: 'Zapisz się do newslettera',
      },
      orderSummary: {
        title: 'Twoje zamówienie',
        emptyCart: 'Twój koszyk jest pusty.',
        quantity: 'Ilość:',
      },
      errors: {
        orderCreationFailed: 'Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.',
        shippingLoadFailed: 'Nie udało się załadować metod dostawy.',
        orderCreatedNoId: 'Zamówienie utworzone, ale brakuje identyfikatora zamówienia.',
      },
      placeOrder: 'Złóż zamówienie',      
    },
    thankYou: {
      pageTitle: 'Dziękujemy za zakupy!',
      hero: {
        title: 'Dziękujemy za zakupy w naszym sklepie!',
        description: 'Na podany adres e-mail wysłaliśmy potwierdzenie zakupu zamówienia',
        orderNumber: '#',
      },
      order: {
        title: 'Moje zamówienie',
        product: 'Produkt',
        price: 'Cena',
        quantity: 'Ilość',
        total: 'Suma',
        paymentMethod: 'Metoda płatności:',
        noPaymentData: 'Brak danych',
        shippingAddress: 'Dane do wysyłki:',
        noShippingData: 'Brak danych o wysyłce.',
        billingAddress: 'Dane do faktury:',
        noBillingData: 'Brak danych do faktury.',
        noAddress: 'Brak adresu',
      },
      backToHome: 'Wróć na stronę główną',
      error: {
        orderNotFound: 'Nie znaleziono zamówienia.',
        loadingError: 'Nie udało się załadować zamówienia.',
      },
    },
  },
  en: {
    slugs: {
      category: 'category',
      product: 'product',
    },
    product: {  
      notAvailableInLanguage: 'Product not available in this language',  
      notAvailableDescription: 'Unfortunately, this product is not available in the selected language version...',  
      backToHome: 'Back to homepage',  
      loading: 'Loading product...',  
    },
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
    common: {
      loading: 'Loading...',
      error: 'Error',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'edit',
      delete: 'Delete',
      remove: 'Remove',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      yes: 'Yes',
      no: 'No',
      required: 'required',
      optional: 'optional',
      free: 'Free',
      total: 'Total',
      quantity: 'Quantity',
      price: 'Price',
      subtotal: 'Subtotal',
      vatIncluded: 'price includes 23% VAT',
      processing: 'Processing...',
      tryAgainLater: 'Please try again later.',
      noData: 'No data',
      poland: 'Poland',
      countryRegion: 'Country / Region',
      backToHome: 'Back to homepage',
    },
    cart: {
      pageTitle: 'Hvyt | Cart',
      emptyCart: {
        title: 'Your cart is empty',
        description: 'Find a product in our store that will make your interior stand out!',
        handlesButton: 'Handles',
        homeButton: 'Home Page',
      },
      progress: {
        cart: 'Cart',
        deliveryAndPayment: 'Delivery & Payment',
        summary: 'Summary',
        backToProducts: 'Back to products',
      },
      item: {
        edit: 'edit',
        editModalTitle: 'Edit product spacing',
        editModalDescription: 'Products will be added to the cart with their current prices. Do you want to continue?',
      },
      summary: {
        title: 'Summary',
        productsTotal: 'Products total',
        productsValue: 'Products value',
        discountValue: 'Discount value',
        shipping: 'Shipping',
        shippingFree: 'Free',
        total: 'Total',
        vatInfo: 'price includes 23% VAT',
        proceedToCheckout: 'Proceed to checkout',
        placeOrder: 'Place order & Pay',
      },
      discountCode: {
        title: 'Have a discount code?',
        placeholder: 'Enter code',
        apply: 'Apply',
        loading: 'Loading...',
        emptyError: 'Please enter a discount code',
        invalidError: 'Invalid discount code',
        saleItemsError: 'Code does not apply to sale items.',
        noMatchingProductsError: 'No products match the coupon conditions.',
        removed: 'Discount code removed',
        added: 'Discount code applied',
        addedFreeShipping: 'Discount code applied – free shipping.',
        addedLimited: 'Discount code applied - discount calculated for:',
        removedNoProducts: 'Discount code removed – no matching products',
        removedSaleItems: 'Code does not apply to sale items — removed.',
      },
      errors: {
        outOfStock: 'Product is out of stock.',
        variantUnavailable: 'Selected variant is unavailable. Change the variant to continue.',
        maxQuantity: 'Cannot add more than {count} pcs.',
        loadingError: 'An error occurred. Please try again later.',
      },
      messages: {
        variationChanged: 'Product spacing for {name} has been changed',
      },
      recommendations: {
        title: 'Products you may like',
        description: 'Check out products that perfectly match your selection.',
      },
    },
    checkout: {
      pageTitle: 'Hvyt | Checkout',
      personalData: {
        title: 'Personal details',
        loginPrompt: 'Already have an account? Log in',
        customerTypeIndividual: 'Individual customer',
        customerTypeCompany: 'Company',
        firstName: 'First name',
        lastName: 'Last name',
        companyName: 'Company name',
        vatNumber: 'VAT number',
        phone: 'Phone number',
        email: 'Email address',
        newsletterSubscribe: 'Subscribe to newsletter',
        createAccount: 'Create account',
      },
      address: {
        title: 'Address',
        streetName: 'Street name',
        buildingNumber: 'Building number',
        apartmentNumber: 'Apartment number',
        city: 'City',
        postalCode: 'Postal code',
        country: 'Country / Region',
        differentShippingAddress: 'Ship to a different address',
        enterDifferentAddress: 'Enter a different address',
        saveToAccount: 'Save this address to my account',
        additionalInfo: 'Additional order information (optional)',
        additionalInfoPlaceholder: 'Description...',
        loadingAddresses: 'Loading addresses...',
        loadingBillingData: 'Loading billing data...',
      },
      shipping: {
        title: 'Delivery & Payment',
        selectMethod: 'Select delivery method',
        loading: 'Loading delivery methods...',
        error: 'Failed to load delivery methods',
        errorRetry: 'Error loading delivery methods. Retrying in 5 seconds.',
        noMethodsAvailable: 'No delivery methods available.',
        selectInpostLocker: 'Select InPost Locker',
        selectGlsPoint: 'Select GLS Point',
        changeGlsPoint: 'Change GLS Point',
        selectedPoint: 'Selected point:',
        freeShipping: 'Free',
        free: 'Free',
        selectLocker: 'Select Parcel Locker',
        errorLoading: 'Failed to load shipping methods',
        retryMessage: 'Error loading shipping methods. Retrying in 5 seconds.',        
      },
      payment: {
        title: 'Select payment method',
        selectMethod: 'Select payment method',
        loading: 'Loading payment methods...',
        error: 'Failed to load payment methods',
        errorRetry: 'Error loading payment methods. Retrying in 5 seconds.',
        noMethodsAvailable: 'No payment methods available for selected delivery method.',
        noMethods: 'No payment methods available for selected shipping method.',
        errorLoading: 'Failed to load payment methods',
        retryMessage: 'Error loading payment methods. Retrying in 5 seconds.',        
      },
      order: {
        title: 'Your order',
        emptyCart: 'Your cart is empty.',
        quantity: 'Quantity:',
      },
      terms: {
        confirmTerms: 'I confirm that I have read',
        termsLink: 'Terms and Conditions',
        privacyLink: 'Privacy Policy',
        termsAcceptance: 'and I accept their provisions.',
        confirm: '*I confirm that I have read the',
        regulamin: 'Terms and Conditions',
        and: 'and',
        privacyPolicy: 'Privacy Policy',
        accept: 'and I accept their provisions.',        
      },
      validation: {
        selectLocker: 'Please select a locker before placing your order.',
        selectGlsPoint: 'Please select a GLS point before placing your order.',
        emptyCart: 'Your cart is empty!',
        selectShipping: 'Please select a delivery method.',
        selectPayment: 'Please select a payment method.',
        acceptTerms: '*I confirm that I have read the Terms and Conditions and Privacy Policy and I accept their provisions.',
        fillRequired: 'Please fill in the required fields:',
        orderError: 'An error occurred while placing the order. Please try again.',
        orderCreatedNoId: 'Order created, but order ID is missing.',
        firstName: 'First name',
        lastName: 'Last name',
        phone: 'Phone number',
        email: 'Email address',
        street: 'Street name',
        buildingNumber: 'Building number',
        city: 'City',
        postalCode: 'Postal code',        
      },
      deliveryAndPayment: 'Delivery & Payment',
      hasAccount: 'Already have an account? Sign in',
      createAccount: 'Create account',
      shippingAddress: {
        loadingAddresses: 'Loading addresses...',
        streetName: 'Street name',
        buildingNumber: 'Building no.',
        apartmentNumber: 'Apt. no.',
        city: 'City',
        postalCode: 'Postal code',
        country: 'Country / Region',
        differentAddress: 'Ship to a different address',
        enterDifferentAddress: 'Enter different address',
        saveAddress: 'Save this address to my account',
        additionalInfo: 'Additional order information (optional)',
        additionalInfoPlaceholder: 'Description...',
      },
      billingAddress: {
        loadingData: 'Loading billing data...',
        individualCustomer: 'Individual customer',
        company: 'Company',
        firstName: 'First name',
        lastName: 'Last name',
        companyName: 'Company name',
        vatNumber: 'VAT number',
        phone: 'Phone number',
        email: 'Email address',
        subscribeNewsletter: 'Subscribe to newsletter',
      },
      orderSummary: {
        title: 'Your order',
        emptyCart: 'Your cart is empty.',
        quantity: 'Qty:',
      },
      errors: {
        orderCreationFailed: 'An error occurred while placing your order. Please try again.',
        shippingLoadFailed: 'Failed to load shipping methods.',
        orderCreatedNoId: 'Order created, but order ID is missing.',
      },
      placeOrder: 'Place order',      
    },
    thankYou: {
      pageTitle: 'Thank you for your purchase!',
      hero: {
        title: 'Thank you for shopping at our store!',
        description: 'We have sent a purchase confirmation to your email address for order',
        orderNumber: '#',
      },
      order: {
        title: 'My order',
        product: 'Product',
        price: 'Price',
        quantity: 'Quantity',
        total: 'Total',
        paymentMethod: 'Payment method:',
        noPaymentData: 'No data',
        shippingAddress: 'Shipping address:',
        noShippingData: 'No shipping data.',
        billingAddress: 'Billing address:',
        noBillingData: 'No billing data.',
        noAddress: 'No address',
      },
      backToHome: 'Back to home page',
      error: {
        orderNotFound: 'Order not found.',
        loadingError: 'Failed to load order.',
      },
    },
  },
};

export const getTranslations = (lang: Language): Translations => {
  return translations[lang] || translations.pl;
};
