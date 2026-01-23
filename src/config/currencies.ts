type CurrencyConfig = {
    [key: string]: {
        slug: string;
        symbol: string;
        name: string;
        fullName?: string;
    };
}

type CurrencyConfigItem = {
    slug: string,
    symbol: string,
    name: string,
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

export const getCurrencyByLocale = (locale : string) : CurrencyConfigItem | null => {
    return currenciesConfig[locale] || null;
}

export const getCurrencySlugByLocale = (locale : string) : string => {
    return (currenciesConfig[locale] || currenciesConfig['pl']).name.toUpperCase();
}