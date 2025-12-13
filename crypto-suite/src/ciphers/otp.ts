import { cleanText, mod } from "@/utils/helpers";

export const encrypt = (text: string, key: string): string => {
  const cleanTextStr = cleanText(text);
  const cleanKey = cleanText(key);

  if (cleanKey.length < cleanTextStr.length) {
    throw new Error("Key must be at least as long as the text");
  }

  let result = "";
  for (let i = 0; i < cleanTextStr.length; i++) {
    const textChar = cleanTextStr.charCodeAt(i) - 65;
    const keyChar = cleanKey.charCodeAt(i) - 65;
    result += String.fromCharCode(mod(textChar + keyChar, 26) + 65);
  }

  return result;
};

export const decrypt = (text: string, key: string): string => {
  const cleanTextStr = cleanText(text);
  const cleanKey = cleanText(key);

  if (cleanKey.length < cleanTextStr.length) {
    throw new Error("Key must be at least as long as the text");
  }

  let result = "";
  for (let i = 0; i < cleanTextStr.length; i++) {
    const textChar = cleanTextStr.charCodeAt(i) - 65;
    const keyChar = cleanKey.charCodeAt(i) - 65;
    result += String.fromCharCode(mod(textChar - keyChar, 26) + 65);
  }

  return result;
};
