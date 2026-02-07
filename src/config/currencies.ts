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
  fallback: {
    slug: '',
    symbol: '',
    name: '',
  },
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

export const getCurrencyByLocale = (locale : string ) : CurrencyConfigItem => {
    return currenciesConfig[locale] || currenciesConfig['fallback'];
}

export const getCurrencyBySlug = (slug : string ) : CurrencyConfigItem => {
    for (let locale of Object.keys(currenciesConfig)) {
        if(currenciesConfig[locale].slug === slug.toLocaleLowerCase()) {
            return currenciesConfig[locale]
        }
    }
    
    return currenciesConfig['fallback'];
}

export const getCurrencySlugByLocale = (locale : string) : string => {
    return (currenciesConfig[locale] || currenciesConfig['pl']).name.toUpperCase();
}