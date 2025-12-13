import { mod } from "@/utils/helpers";

export const encrypt = (text: string, key: string): string => {
  const shift = parseInt(key);
  if (isNaN(shift) || shift < 0 || shift > 25) {
    throw new Error("Key must be a number between 0 and 25");
  }

  return text
    .toUpperCase()
    .split("")
    .map((char) => {
      if (char >= "A" && char <= "Z") {
        return String.fromCharCode(
          mod(char.charCodeAt(0) - 65 + shift, 26) + 65
        );
      }
      return char;
    })
    .join("");
};

export const decrypt = (text: string, key: string): string => {
  const shift = parseInt(key);
  if (isNaN(shift) || shift < 0 || shift > 25) {
    throw new Error("Key must be a number between 0 and 25");
  }

  return encrypt(text, (26 - shift).toString());
};

export const bruteforce = (text: string): string[] => {
  const results: string[] = [];
  for (let shift = 0; shift < 26; shift++) {
    results.push(encrypt(text, shift.toString()));
  }
  return results;
};
