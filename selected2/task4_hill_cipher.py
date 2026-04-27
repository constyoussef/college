import numpy as np

def modInverse(a, m):
    """Calculates the modular multiplicative inverse of a modulo m."""
    a = a % m
    for x in range(1, m):
        if (a * x) % m == 1:
            return x
    return None

def matrix_mod_inverse(matrix, m):
    """Calculates the inverse of a matrix modulo m."""
    n = len(matrix)
    det = int(np.round(np.linalg.det(matrix)))
    det_inv = modInverse(det, m)
    
    if det_inv is None:
        raise ValueError("Matrix is not invertible modulo 26 (determinant has no inverse).")
    
    # Calculate adjugate matrix
    if n == 2:
        adjugate = np.array([
            [matrix[1][1], -matrix[0][1]],
            [-matrix[1][0], matrix[0][0]]
        ])
    elif n == 3:
        adjugate = np.zeros((3, 3))
        for i in range(3):
            for j in range(3):
                # Minor matrix
                minor = np.delete(np.delete(matrix, i, axis=0), j, axis=1)
                adjugate[j][i] = ((-1)**(i+j)) * int(np.round(np.linalg.det(minor)))
    else:
        raise NotImplementedError("Only 2x2 and 3x3 matrices are supported.")
        
    return (det_inv * adjugate).astype(int) % m

def decrypt_hill(ciphertext, key_matrix):
    """Decrypts ciphertext using the Hill cipher and a key matrix."""
    n = len(key_matrix)
    ciphertext = "".join(filter(str.isalpha, ciphertext.upper()))
    
    # Pad ciphertext if necessary
    while len(ciphertext) % n != 0:
        ciphertext += 'X'
        
    # Convert ciphertext to numbers
    cipher_nums = [ord(c) - ord('A') for c in ciphertext]
    
    # Get inverse key matrix
    inv_matrix = matrix_mod_inverse(key_matrix, 26)
    
    result = ""
    # Decrypt in blocks
    for i in range(0, len(cipher_nums), n):
        block = np.array(cipher_nums[i:i+n])
        decrypted_block = np.dot(inv_matrix, block) % 26
        result += "".join(chr(int(num) + ord('A')) for num in decrypted_block)
        
    return result

def main():
    print("=== Hill Cipher Decryptor ===")
    ciphertext = input("Enter the ciphertext: ").strip()
    if not ciphertext:
        print("Empty input. Exiting.")
        return
        
    try:
        n = int(input("Enter matrix size (2 or 3): "))
        print(f"Enter the {n}x{n} key matrix row by row (space-separated numbers):")
        matrix = []
        for i in range(n):
            row = list(map(int, input(f"Row {i+1}: ").split()))
            if len(row) != n:
                raise ValueError(f"Each row must have {n} elements.")
            matrix.append(row)
        
        key_matrix = np.array(matrix)
        decrypted = decrypt_hill(ciphertext, key_matrix)
        print(f"\nDecrypted text:\n{decrypted}")
        
    except ValueError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    main()
