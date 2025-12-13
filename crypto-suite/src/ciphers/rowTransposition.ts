export const encrypt = (text: string, key: string): string => {
  if (!key) throw new Error("Key is required");

  const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, "");
  const keyLen = keyUpper.length;

  const order = keyUpper
    .split("")
    .map((c, i) => ({ char: c, index: i }))
    .sort((a, b) => a.char.localeCompare(b.char))
    .map((item) => item.index);

  const clean = text.toUpperCase().replace(/[^A-Z]/g, "");
  const rows = Math.ceil(clean.length / keyLen);
  const grid: string[][] = [];

  for (let i = 0; i < rows; i++) {
    grid.push(
      clean
        .slice(i * keyLen, (i + 1) * keyLen)
        .padEnd(keyLen, "X")
        .split("")
    );
  }

  let result = "";
  for (const col of order) {
    for (let row = 0; row < rows; row++) {
      result += grid[row][col];
    }
  }

  return result;
};

export const decrypt = (text: string, key: string): string => {
  if (!key) throw new Error("Key is required");

  const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, "");
  const keyLen = keyUpper.length;

  const order = keyUpper
    .split("")
    .map((c, i) => ({ char: c, index: i }))
    .sort((a, b) => a.char.localeCompare(b.char))
    .map((item) => item.index);

  const clean = text.toUpperCase().replace(/[^A-Z]/g, "");
  const rows = Math.ceil(clean.length / keyLen);
  const grid: string[][] = Array(rows)
    .fill(null)
    .map(() => Array(keyLen).fill(""));

  let idx = 0;
  for (const col of order) {
    for (let row = 0; row < rows; row++) {
      if (idx < clean.length) {
        grid[row][col] = clean[idx++];
      }
    }
  }

  let result = "";
  for (let row = 0; row < rows; row++) {
    result += grid[row].join("");
  }

  return result;
};
