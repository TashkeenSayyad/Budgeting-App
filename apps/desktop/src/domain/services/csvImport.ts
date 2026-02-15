export function parseAmount(value: string, invertSign = false) {
  const normalized = Number(value.replace(/[$,\s]/g, ''));
  const minor = Math.round(normalized * 100);
  return invertSign ? -minor : minor;
}

export function parseDate(raw: string, format: 'YYYY-MM-DD' | 'MM/DD/YYYY') {
  if (format === 'YYYY-MM-DD') return raw;
  const [month, day, year] = raw.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
