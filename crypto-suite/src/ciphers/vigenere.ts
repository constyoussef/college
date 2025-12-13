import { mod } from "@/utils/helpers";

export const encrypt = (text: string, key: string): string => {
  if (!key) throw new Error("Key is required");

  const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!keyUpper) throw new Error("Key must contain at least one letter");

  let result = "";
  let keyIndex = 0;

  for (const char of text.toUpperCase()) {
    if (char >= "A" && char <= "Z") {
      const shift = keyUpper.charCodeAt(keyIndex % keyUpper.length) - 65;
      result += String.fromCharCode(
        mod(char.charCodeAt(0) - 65 + shift, 26) + 65
      );
      keyIndex++;
    } else {
      result += char;
    }
  }

  return result;
};

export const decrypt = (text: string, key: string): string => {
  if (!key) throw new Error("Key is required");

  const keyUpper = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!keyUpper) throw new Error("Key must contain at least one letter");

  let result = "";
  let keyIndex = 0;

  for (const char of text.toUpperCase()) {
    if (char >= "A" && char <= "Z") {
      const shift = keyUpper.charCodeAt(keyIndex % keyUpper.length) - 65;
      result += String.fromCharCode(
        mod(char.charCodeAt(0) - 65 - shift, 26) + 65
      );
      keyIndex++;
    } else {
      result += char;
    }
  }

  return result;
};
