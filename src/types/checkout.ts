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
  methods: CountryShippingMethod[]
}

export interface ShippingCountryItem {
  code: string        // "PL"
  name: string        // "Poland"
  zoneId: number
}