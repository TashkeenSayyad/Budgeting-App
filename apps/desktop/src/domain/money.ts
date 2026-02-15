export const money = {
  add: (aMinor: number, bMinor: number) => aMinor + bMinor,
  subtract: (aMinor: number, bMinor: number) => aMinor - bMinor,
  fromMajor: (major: number) => Math.round(major * 100),
  toMajor: (minor: number) => minor / 100,
  format: (minor: number, currency: string, locale = 'en-US') =>
    new Intl.NumberFormat(locale, { style: 'currency', currency }).format(minor / 100)
};
