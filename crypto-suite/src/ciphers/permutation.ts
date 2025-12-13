export const encrypt = (text: string, key: string): string => {
  const order = key
    .trim()
    .split(/\s+/)
    .map((n) => parseInt(n) - 1);
  if (order.some(isNaN) || order.some((n) => n < 0)) {
    throw new Error("Invalid permutation format (use 1-indexed positions)");
  }

  const blockSize = order.length;
  const clean = text.toUpperCase().replace(/[^A-Z]/g, "");

  let result = "";
  for (let i = 0; i < clean.length; i += blockSize) {
    const block = clean.slice(i, i + blockSize).padEnd(blockSize, "X");
    result += order.map((pos) => block[pos] || "X").join("");
  }

  return result;
};

export const decrypt = (text: string, key: string): string => {
  const order = key
    .trim()
    .split(/\s+/)
    .map((n) => parseInt(n) - 1);
  if (order.some(isNaN) || order.some((n) => n < 0)) {
    throw new Error("Invalid permutation format (use 1-indexed positions)");
  }

  const blockSize = order.length;
  const clean = text.toUpperCase().replace(/[^A-Z]/g, "");

  const inverseOrder = Array(blockSize).fill(0);
  order.forEach((val, idx) => {
    inverseOrder[val] = idx;
  });

  let result = "";
  for (let i = 0; i < clean.length; i += blockSize) {
    const block = clean.slice(i, i + blockSize);
    result += inverseOrder.map((pos) => block[pos] || "").join("");
  }

  return result;
};
