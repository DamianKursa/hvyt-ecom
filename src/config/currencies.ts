type CurrencyConfig = {
    [key: string]: {
        slug: string;
        symbol: string;
        name: string;
        fullName?: string;
    };
}

export const currenciesConfig: CurrencyConfig = {
  pl: {
    slug: 'pln',
    symbol: 'zł',
    name: 'PLN',
  },
  en: {
    slug: 'eur',
    symbol: '€',
    name: 'EUR',
  },
}

export const getCurrencyByLocale = (locale : string) => {
    return currenciesConfig[locale] || currenciesConfig['pl'];
}