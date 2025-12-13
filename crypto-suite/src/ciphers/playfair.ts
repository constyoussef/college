import { cleanText } from "@/utils/helpers";

const createPlayfairMatrix = (key: string): string[][] => {
  const keyClean = cleanText(key.replace(/J/g, "I"));
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const seen = new Set<string>();
  const matrix: string[][] = [];

  let chars = "";
  for (const char of keyClean) {
    if (!seen.has(char)) {
      seen.add(char);
      chars += char;
    }
  }

  for (const char of alphabet) {
    if (!seen.has(char)) {
      seen.add(char);
      chars += char;
    }
  }

  for (let i = 0; i < 5; i++) {
    matrix.push(chars.slice(i * 5, (i + 1) * 5).split(""));
  }

  return matrix;
};

const findPosition = (matrix: string[][], char: string): [number, number] => {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (matrix[i][j] === char) {
        return [i, j];
      }
    }
  }
  return [0, 0];
};

const processPair = (
  matrix: string[][],
  a: string,
  b: string,
  encrypt: boolean
): string => {
  const [r1, c1] = findPosition(matrix, a);
  const [r2, c2] = findPosition(matrix, b);

  if (r1 === r2) {
    // Note: (c1 + 1) % 5  if reach the end of the row, it will go back to the first element
    // Note: (c1 + 4) % 5 in encrypt mode, it will go to the last element
    const nc1 = encrypt ? (c1 + 1) % 5 : (c1 + 4) % 5;
    const nc2 = encrypt ? (c2 + 1) % 5 : (c2 + 4) % 5;
    return matrix[r1][nc1] + matrix[r2][nc2];
  } else if (c1 === c2) {
    const nr1 = encrypt ? (r1 + 1) % 5 : (r1 + 4) % 5;
    const nr2 = encrypt ? (r2 + 1) % 5 : (r2 + 4) % 5;
    return matrix[nr1][c1] + matrix[nr2][c2];
  } else {
    return matrix[r1][c2] + matrix[r2][c1];
  }
};

export const encrypt = (text: string, key: string): string => {
  if (!key) throw new Error("Key is required");

  const matrix = createPlayfairMatrix(key);
  const clean = cleanText(text).replace(/J/g, "I");

  let pairs = "";
  for (let i = 0; i < clean.length; i++) {
    if (i === clean.length - 1) {
      pairs += clean[i] + "X";
    } else if (clean[i] === clean[i + 1]) {
      pairs += clean[i] + "X";
    } else {
      pairs += clean[i] + clean[i + 1];
      i++;
    }
  }

  let result = "";
  for (let i = 0; i < pairs.length; i += 2) {
    result += processPair(matrix, pairs[i], pairs[i + 1], true);
  }

  return result;
};

export const decrypt = (text: string, key: string): string => {
  if (!key) throw new Error("Key is required");

  const matrix = createPlayfairMatrix(key);
  const clean = cleanText(text);

  let result = "";
  for (let i = 0; i < clean.length; i += 2) {
    if (i + 1 < clean.length) {
      result += processPair(matrix, clean[i], clean[i + 1], false);
    }
  }

  return result;
};
