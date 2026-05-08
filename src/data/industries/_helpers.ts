export function genPriceData(base: number, volatility: number, months = 16) {
  const data = [];
  let price = base;
  const start = new Date('2024-01-01');
  for (let i = 0; i < months; i++) {
    const d = new Date(start);
    d.setMonth(d.getMonth() + i);
    price = Math.max(base * 0.5, price + (Math.random() - 0.48) * volatility);
    data.push({ date: d.toISOString().slice(0, 7), price: parseFloat(price.toFixed(2)) });
  }
  return data;
}
