const IP = [
  58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38,
  30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9, 1,
  59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39,
  31, 23, 15, 7,
];

const FP = [
  40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14,
  54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60, 28,
  35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9,
  49, 17, 57, 25,
];

const permute = (input: number[], table: number[]): number[] => {
  return table.map((pos) => input[pos - 1]);
};

const xor = (a: number[], b: number[]): number[] => {
  return a.map((bit, i) => bit ^ b[i]);
};

const stringToBits = (str: string): number[] => {
  const bits: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const byte = str.charCodeAt(i);
    for (let j = 7; j >= 0; j--) {
      bits.push((byte >> j) & 1);
    }
  }
  return bits;
};

const bitsToString = (bits: number[]): string => {
  let result = "";
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; i < 8; j++) {
      byte = (byte << 1) | (bits[i + j] || 0);
    }
    result += String.fromCharCode(byte);
  }
  return result;
};

const feistel = (right: number[], subkey: number[]): number[] => {
  const expanded = right.concat(right.slice(0, 16));
  const xored = xor(expanded.slice(0, subkey.length), subkey);
  return xored.slice(0, 32);
};

const desRound = (
  left: number[],
  right: number[],
  subkey: number[]
): [number[], number[]] => {
  const fResult = feistel(right, subkey);
  const newRight = xor(left, fResult);
  return [right, newRight];
};

const generateSubkeys = (key: number[]): number[][] => {
  const subkeys: number[][] = [];
  for (let i = 0; i < 16; i++) {
    const subkey = key.slice(0, 48).map((bit) => bit ^ i % 2);
    subkeys.push(subkey);
  }
  return subkeys;
};

const desProcess = (
  input: number[],
  key: number[],
  decrypt: boolean
): number[] => {
  const permuted = permute(input, IP);
  let left = permuted.slice(0, 32);
  let right = permuted.slice(32, 64);

  const subkeys = generateSubkeys(key);
  const keys = decrypt ? subkeys.reverse() : subkeys;

  for (const subkey of keys) {
    [left, right] = desRound(left, right, subkey);
  }

  const combined = right.concat(left);
  return permute(combined, FP);
};

export const encrypt = (text: string, key: string): string => {
  if (key.length !== 8) {
    throw new Error("DES key must be exactly 8 characters");
  }

  const keyBits = stringToBits(key);
  const textBits = stringToBits(text);

  while (textBits.length % 64 !== 0) {
    textBits.push(0);
  }

  let result: number[] = [];
  for (let i = 0; i < textBits.length; i += 64) {
    const block = textBits.slice(i, i + 64);
    const encrypted = desProcess(block, keyBits, false);
    result = result.concat(encrypted);
  }

  return btoa(bitsToString(result));
};

export const decrypt = (text: string, key: string): string => {
  if (key.length !== 8) {
    throw new Error("DES key must be exactly 8 characters");
  }

  const keyBits = stringToBits(key);
  let cipherBits: number[];

  try {
    const decoded = atob(text);
    cipherBits = stringToBits(decoded);
  } catch {
    throw new Error("Invalid encrypted text format");
  }

  let result: number[] = [];
  for (let i = 0; i < cipherBits.length; i += 64) {
    const block = cipherBits.slice(i, i + 64);
    const decrypted = desProcess(block, keyBits, true);
    result = result.concat(decrypted);
  }

  return bitsToString(result).replace(/\0+$/, "");
};
