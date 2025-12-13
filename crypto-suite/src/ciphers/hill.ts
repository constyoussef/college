import { cleanText, matrixInverse, matrixMultiply } from "@/utils/helpers";

const parseMatrix = (keyStr: string): number[][] => {
  const nums = keyStr
    .trim()
    .split(/\s+/)
    .map((n) => parseInt(n));
  if (nums.some(isNaN)) throw new Error("Invalid matrix format");

  const size = Math.sqrt(nums.length);
  if (!Number.isInteger(size)) throw new Error("Matrix must be square");

  const matrix: number[][] = [];
  for (let i = 0; i < size; i++) {
    matrix.push(nums.slice(i * size, (i + 1) * size));
  }

  return matrix;
};

export const encrypt = (text: string, key: string): string => {
  const matrix = parseMatrix(key);
  const size = matrix.length;
  const clean = cleanText(text);

  while (clean.length % size !== 0) {
    text += "X";
  }
  const cleanPadded = cleanText(text);

  let result = "";
  for (let i = 0; i < cleanPadded.length; i += size) {
    const block = cleanPadded
      .slice(i, i + size)
      .split("")
      .map((c) => c.charCodeAt(0) - 65);
    const encrypted = matrixMultiply(matrix, block, 26);
    result += encrypted.map((n) => String.fromCharCode(n + 65)).join("");
  }

  return result;
};

export const decrypt = (text: string, key: string): string => {
  const matrix = parseMatrix(key);
  const size = matrix.length;
  const clean = cleanText(text);

  let invMatrix: number[][];
  try {
    invMatrix = matrixInverse(matrix, 26);
  } catch {
    throw new Error(
      "Matrix is not invertible (determinant has no inverse mod 26)"
    );
  }

  let result = "";
  for (let i = 0; i < clean.length; i += size) {
    const block = clean
      .slice(i, i + size)
      .split("")
      .map((c) => c.charCodeAt(0) - 65);
    const decrypted = matrixMultiply(invMatrix, block, 26);
    result += decrypted.map((n) => String.fromCharCode(n + 65)).join("");
  }

  return result;
};
