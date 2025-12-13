export const cleanText = (text: string): string => {
  return text.toUpperCase().replace(/[^A-Z]/g, "");
};

export const mod = (n: number, m: number): number => {
  return ((n % m) + m) % m;
};

export const gcd = (a: number, b: number): number => {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

export const modInverse = (a: number, m: number): number => {
  a = mod(a, m);
  for (let x = 1; x < m; x++) {
    if (mod(a * x, m) === 1) {
      return x;
    }
  }
  throw new Error("Modular inverse does not exist");
};

export const determinant2x2 = (matrix: number[][]): number => {
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
};

export const determinant3x3 = (matrix: number[][]): number => {
  return (
    matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
    matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
    matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
  );
};

export const matrixInverse = (
  matrix: number[][],
  modulus: number
): number[][] => {
  const size = matrix.length;

  if (size === 2) {
    const det = determinant2x2(matrix);
    const detInv = modInverse(mod(det, modulus), modulus);
    return [
      [
        mod(matrix[1][1] * detInv, modulus),
        mod(-matrix[0][1] * detInv, modulus),
      ],
      [
        mod(-matrix[1][0] * detInv, modulus),
        mod(matrix[0][0] * detInv, modulus),
      ],
    ];
  }
  throw new Error("Matrix inversion only implemented for 2x2");
};

export const matrixMultiply = (
  matrix: number[][],
  vector: number[],
  modulus: number
): number[] => {
  return matrix.map((row) =>
    mod(
      row.reduce((sum, val, idx) => sum + val * vector[idx], 0),
      modulus
    )
  );
};
