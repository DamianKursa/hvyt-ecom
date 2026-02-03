import { dropdownOption } from "@/types/filters";

export const getSortingOptions = (t: any): dropdownOption[] => [
    {key: 'bestseller', label: t.filters.bestsellers},
    {key: 'newest', label: t.filters.newest},
    {key: 'pricehigh', label: t.filters.highestPrice},
    {key: 'pricelow', label: t.filters.lowestPrice},
  ];