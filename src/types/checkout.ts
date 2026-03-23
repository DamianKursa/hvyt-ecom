export interface CountryShippingMethod {
  id: number
  title: string
  cost: string
  currency: string
}

export interface ShippingCountry {
  code: string        // "PL"
  name: string        // "Poland"
  zoneId: number
  zoneName: string
  methods: ShippingMethodWithoutClasses[]
}

export interface ShippingCountryItem {
  code: string        // "PL"
  name: string        // "Poland"
  zoneId: number
}

export interface ShippingMethod {
  id: string;
  method_id?: string;
  title: string;
  cost: string | number | null; // Handle different types of cost
  enabled: boolean;
  shipping_classes?: ShippingClass[]
}

export interface ShippingMethodWithoutClasses {
  id: number
  cost: number | string
  cost_original: number | string
  currency: string
  title: string
}

export interface ShippingZoneWithMethods {
  zoneId: number        // "PL"
  methods: ShippingMethodWithoutClasses[]
}

export interface ShippingClass {
  class_id: number
  class_name: string
  slass_slug: string
  cost: number | null
  cost_original: number | null
  price_source: string
}