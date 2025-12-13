export const encrypt = (text: string, key: string): string => {
  const rails = parseInt(key);
  if (isNaN(rails) || rails < 2) {
    throw new Error("Number of rails must be at least 2");
  }

  const clean = text.toUpperCase().replace(/[^A-Z]/g, "");
  if (clean.length === 0) return "";

  const fence: string[][] = Array(rails)
    .fill(null)
    .map(() => []);
  let rail = 0;
  let direction = 1;

  for (const char of clean) {
    fence[rail].push(char);
    rail += direction;
    if (rail === 0 || rail === rails - 1) {
      direction *= -1;
    }
  }

  return fence.map((row) => row.join("")).join("");
};

export const decrypt = (text: string, key: string): string => {
  const rails = parseInt(key);
  if (isNaN(rails) || rails < 2) {
    throw new Error("Number of rails must be at least 2");
  }

  const clean = text.toUpperCase().replace(/[^A-Z]/g, "");
  if (clean.length === 0) return "";

  const fence: (string | null)[][] = Array(rails)
    .fill(null)
    .map(() => Array(clean.length).fill(null));
  let rail = 0;
  let direction = 1;

  for (let i = 0; i < clean.length; i++) {
    fence[rail][i] = "*";
    rail += direction;
    if (rail === 0 || rail === rails - 1) {
      direction *= -1;
    }
  }

  let idx = 0;
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < clean.length; c++) {
      if (fence[r][c] === "*") {
        fence[r][c] = clean[idx++];
      }
    }
  }

  let result = "";
  rail = 0;
  direction = 1;
  for (let i = 0; i < clean.length; i++) {
    result += fence[rail][i];
    rail += direction;
    if (rail === 0 || rail === rails - 1) {
      direction *= -1;
    }
  }

  return result;
};
