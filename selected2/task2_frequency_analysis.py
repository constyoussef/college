import collections
import string

# Standard English letter frequency (A-Z) ordered by frequency (highest to lowest)
ENGLISH_FREQ_ORDER = "ETAOINSHRDLCUMWFGYPBVKJXQZ"

def get_frequencies(text):
    """Returns a list of characters sorted by frequency in the given text."""
    text = text.upper()
    counts = collections.Counter(char for char in text if char in string.ascii_uppercase)
    # Sort by count (desc), then alphabetically (asc)
    sorted_counts = sorted(counts.items(), key=lambda x: (-x[1], x[0]))
    return [char for char, count in sorted_counts]

def decrypt_with_mapping(text, mapping):
    """Decrypts text using a character mapping dictionary."""
    result = ""
    for char in text:
        upper_char = char.upper()
        if upper_char in mapping:
            replacement = mapping[upper_char]
            result += replacement if char.isupper() else replacement.lower()
        else:
            result += char
    return result

def automated_analysis(ciphertext):
    """Performs an automated frequency analysis and returns the best guess."""
    cipher_freqs = get_frequencies(ciphertext)
    
    # Simple mapping: most frequent ciphertext char -> most frequent English char
    mapping = {}
    for i, char in enumerate(cipher_freqs):
        if i < len(ENGLISH_FREQ_ORDER):
            mapping[char] = ENGLISH_FREQ_ORDER[i]
            
    return mapping

def main():
    print("=== Enhanced Frequency Analysis (Monoalphabetic Substitution) ===")
    ciphertext = input("Enter the ciphertext: ").strip()
    if not ciphertext:
        print("Empty input. Exiting.")
        return

    mapping = automated_analysis(ciphertext)
    
    while True:
        decrypted = decrypt_with_mapping(ciphertext, mapping)
        print("\n--- Current Decryption Guess ---")
        print(decrypted)
        print("\n--- Current Mapping ---")
        # Print mapping in a readable way
        mapping_str = ", ".join([f"{c}->{p}" for c, p in sorted(mapping.items())])
        print(mapping_str)
        
        print("\nOptions:")
        print("1. Modify mapping (e.g., 'X Y' to map X to Y)")
        print("2. Reset to automated guess")
        print("3. Done/Exit")
        
        choice = input("\nSelect an option: ").strip()
        
        if choice == '1':
            change = input("Enter change (e.g., 'X Y'): ").upper().split()
            if len(change) == 2:
                c, p = change
                # Swap if the target is already mapped
                existing_c = next((k for k, v in mapping.items() if v == p), None)
                if existing_c:
                    mapping[existing_c] = mapping[c]
                mapping[c] = p
            else:
                print("Invalid input format.")
        elif choice == '2':
            mapping = automated_analysis(ciphertext)
        elif choice == '3' or not choice:
            break
        else:
            print("Invalid choice.")

if __name__ == "__main__":
    main()
