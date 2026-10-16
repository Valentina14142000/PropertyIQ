import type { Property } from '@/lib/mock-data';

// Transparent, documented assumptions used everywhere in the app.
export const ASSUMPTIONS = {
  downPaymentPct: 20,
  interestRate: 6.5,
  termYears: 30,
  vacancyPct: 5,
  propertyTaxPct: 1.2,
  insurancePct: 0.5,
  maintenancePct: 1,
} as const;

export function mortgagePayment(loan: number, ratePct: number, years: number): number {
  const n = years * 12;
  if (loan <= 0 || n <= 0) return 0;
  const r = ratePct / 100 / 12;
  if (r === 0) return loan / n;
  return (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function metricsFor(p: Pick<Property, 'price' | 'estimatedRent'>) {
  const a = ASSUMPTIONS;
  const annualRent = p.estimatedRent * 12;
  const grossYield = p.price > 0 ? (annualRent / p.price) * 100 : 0;
  const operating = p.price * ((a.propertyTaxPct + a.insurancePct + a.maintenancePct) / 100);
  const noi = annualRent * (1 - a.vacancyPct / 100) - operating;
  const capRate = p.price > 0 ? (noi / p.price) * 100 : 0;
  const down = p.price * (a.downPaymentPct / 100);
  const payment = mortgagePayment(p.price - down, a.interestRate, a.termYears);
  const monthlyCashflow = noi / 12 - payment;
  const cashOnCash = down > 0 ? ((monthlyCashflow * 12) / down) * 100 : 0;
  return { grossYield, capRate, noi, down, payment, monthlyCashflow, cashOnCash };
}

export function projectValue(price: number, growthPct: number, years: number): number {
  return price * Math.pow(1 + growthPct / 100, years);
}

export const usd = (n: number, digits = 0) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits }).format(Number.isFinite(n) ? n : 0);

export const compactUsd = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 }).format(Number.isFinite(n) ? n : 0);
