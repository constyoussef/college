export const encrypt = (text: string, key: string): string => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const substitution = key.toUpperCase();

  if (substitution.length !== 26 || new Set(substitution).size !== 26) {
    throw new Error("Key must be a 26-letter permutation of the alphabet");
  }

  return text
    .toUpperCase()
    .split("")
    .map((char) => {
      const idx = alphabet.indexOf(char);
      return idx !== -1 ? substitution[idx] : char;
    })
    .join("");
};

export const decrypt = (text: string, key: string): string => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const substitution = key.toUpperCase();

  if (substitution.length !== 26 || new Set(substitution).size !== 26) {
    throw new Error("Key must be a 26-letter permutation of the alphabet");
  }

  return text
    .toUpperCase()
    .split("")
    .map((char) => {
      const idx = substitution.indexOf(char);
      return idx !== -1 ? alphabet[idx] : char;
    })
    .join("");
};
