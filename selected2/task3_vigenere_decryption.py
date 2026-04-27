import collections
import string

# Standard English letter frequency
ENGLISH_FREQ = {
    'A': 0.0817, 'B': 0.0150, 'C': 0.0278, 'D': 0.0425, 'E': 0.1270,
    'F': 0.0223, 'G': 0.0202, 'H': 0.0609, 'I': 0.0697, 'J': 0.0015,
    'K': 0.0077, 'L': 0.0403, 'M': 0.0241, 'N': 0.0675, 'O': 0.0751,
    'P': 0.0193, 'Q': 0.0010, 'R': 0.0599, 'S': 0.0633, 'T': 0.0906,
    'U': 0.0276, 'V': 0.0098, 'W': 0.0236, 'X': 0.0015, 'Y': 0.0197,
    'Z': 0.0007
}

def index_of_coincidence(text):
    """Calculates the Index of Coincidence for the given text."""
    n = len(text)
    if n <= 1:
        return 0
    counts = collections.Counter(text)
    numerator = sum(count * (count - 1) for count in counts.values())
    denominator = n * (n - 1)
    return numerator / denominator

def find_key_length(ciphertext, max_len=20):
    """Finds the most likely key length for a Vigenere cipher using IC."""
    filtered_text = "".join(filter(str.isalpha, ciphertext.upper()))
    results = []
    for length in range(1, max_len + 1):
        ics = []
        for i in range(length):
            coset = filtered_text[i::length]
            ics.append(index_of_coincidence(coset))
        
        avg_ic = sum(ics) / len(ics)
        results.append((length, avg_ic))
    
    # Sort by IC descending
    results.sort(key=lambda x: x[1], reverse=True)
    best_ic = results[0][1]
    
    # Threshold for a "good" IC (English is ~0.066)
    # We want the smallest length that is close to the best IC
    for length, ic in sorted(results, key=lambda x: x[0]):
        if ic > 0.9 * best_ic and ic > 0.05:
            return length
            
    return results[0][0]

def solve_caesar(text):
    """Finds the most likely Caesar shift for a single coset."""
    best_shift = 0
    min_chi_sq = float('inf')
    
    n = len(text)
    if n == 0: return 0
    
    counts = collections.Counter(text)
    
    for shift in range(26):
        chi_sq = 0
        for i in range(26):
            char = chr(ord('A') + (i + shift) % 26)
            observed = counts[char]
            expected = n * ENGLISH_FREQ[chr(ord('A') + i)]
            if expected > 0:
                chi_sq += ((observed - expected) ** 2) / expected
        
        if chi_sq < min_chi_sq:
            min_chi_sq = chi_sq
            best_shift = shift
            
    return best_shift

def decrypt_vigenere(ciphertext, key):
    """Decrypts Vigenere cipher with a given key string."""
    result = ""
    key = key.upper()
    key_idx = 0
    for char in ciphertext:
        if char.isalpha():
            start = ord('A') if char.isupper() else ord('a')
            shift = ord(key[key_idx % len(key)]) - ord('A')
            result += chr((ord(char) - start - shift) % 26 + start)
            key_idx += 1
        else:
            result += char
    return result

def break_vigenere(ciphertext):
    """Breaks Vigenere cipher without a key."""
    key_len = find_key_length(ciphertext)
    filtered_text = "".join(filter(str.isalpha, ciphertext.upper()))
    
    key = ""
    for i in range(key_len):
        coset = filtered_text[i::key_len]
        shift = solve_caesar(coset)
        key += chr(ord('A') + shift)
        
    return key, decrypt_vigenere(ciphertext, key)

def main():
    print("=== Vigenere Cipher Breaker (No Key) ===")
    ciphertext = input("Enter the ciphertext: ").strip()
    if not ciphertext:
        print("Empty input. Exiting.")
        return

    key, decrypted = break_vigenere(ciphertext)
    print(f"\nEstimated key length: {len(key)}")
    print(f"Likely key: {key}")
    print(f"\nDecrypted text:\n{decrypted}")

if __name__ == "__main__":
    main()
