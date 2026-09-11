export const formatCompact = (value: number): string => {
  if (value >= 1_000_000) {
    const scaled = value / 1_000_000;
    return `${scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const scaled = value / 1_000;
    return `${scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1)}K`;
  }
  return String(Math.round(value));
};

export const formatCompactPrice = (value: number): string =>
  `Rp\u00A0${formatCompact(value)}`;