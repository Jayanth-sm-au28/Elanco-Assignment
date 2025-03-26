export interface Country {
  name: string;
  code: string;
  flag: string;
  population: number;
  region: string;
  capital: string;
  timezone: string[];
  currencies?: {
    code: string;
    name: string;
    symbol: string;
  }[];
  languages?: {
    name: string;
    nativeName: string;
  }[];
  borders?: string[];
}
