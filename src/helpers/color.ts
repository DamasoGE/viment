export const generateColorFromString = (str: string): string => {
  let hash = 400;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  hash = Math.abs(hash);
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
};