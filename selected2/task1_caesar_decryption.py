import collections
import string

# Standard English letter frequency (A-Z)
ENGLISH_FREQ = {
    'A': 0.0817, 'B': 0.0150, 'C': 0.0278, 'D': 0.0425, 'E': 0.1270,
    'F': 0.0223, 'G': 0.0202, 'H': 0.0609, 'I': 0.0697, 'J': 0.0015,
    'K': 0.0077, 'L': 0.0403, 'M': 0.0241, 'N': 0.0675, 'O': 0.0751,
    'P': 0.0193, 'Q': 0.0010, 'R': 0.0599, 'S': 0.0633, 'T': 0.0906,
    'U': 0.0276, 'V': 0.0098, 'W': 0.0236, 'X': 0.0015, 'Y': 0.0197,
    'Z': 0.0007
}

def decrypt_caesar(ciphertext, shift):
    """Decrypts Caesar cipher with a given shift."""
    result = ""
    for char in ciphertext:
        if char.isalpha():
            start = ord('A') if char.isupper() else ord('a')
            result += chr((ord(char) - start - shift) % 26 + start)
        else:
            result += char
    return result

def score_text(text):
    """Scores a text based on how closely it matches English letter frequencies."""
    text = text.upper()
    total_chars = sum(1 for char in text if char in string.ascii_uppercase)
    if total_chars == 0:
        return float('inf')
    
    counts = collections.Counter(char for char in text if char in string.ascii_uppercase)
    score = 0
    for char in string.ascii_uppercase:
        observed = counts[char] / total_chars
        expected = ENGLISH_FREQ[char]
        # Chi-squared statistic for frequency matching
        score += ((observed - expected) ** 2) / expected
    return score

def break_caesar(ciphertext):
    """Tries all 26 shifts and returns the best decryption."""
    best_text = ""
    best_score = float('inf')
    best_shift = 0

    for shift in range(26):
        decrypted = decrypt_caesar(ciphertext, shift)
        score = score_text(decrypted)
        if score < best_score:
            best_score = score
            best_text = decrypted
            best_shift = shift
            
    return best_text, best_shift

def main():
    print("=== Caesar Cipher Breaker (No Key) ===")
    ciphertext = input("Enter the ciphertext: ").strip()
    if not ciphertext:
        print("Empty input. Exiting.")
        return

    decrypted_text, shift = break_caesar(ciphertext)
    print(f"\nPossible shift found: {shift}")
    print(f"Decrypted text:\n{decrypted_text}")

if __name__ == "__main__":
    main()
