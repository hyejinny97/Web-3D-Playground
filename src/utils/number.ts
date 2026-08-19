export const isNumeric = (str: string) => {
  if (str === "") return false;
  return Number.isFinite(Number(str));
};
