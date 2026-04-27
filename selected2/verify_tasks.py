import sys
import os
import numpy as np

# Add current directory to path to import tasks
sys.path.append(os.getcwd())

import task1_caesar_decryption as t1
import task3_vigenere_decryption as t3
import task4_hill_cipher as t4

def test_task1():
    print("Testing Task 1 (Caesar Breaker)...")
    original = "HELLO WORLD THIS IS A TEST OF THE CAESAR CIPHER BREAKER"
    shift = 7
    # Manually encrypt
    encrypted = ""
    for c in original:
        if c.isalpha():
            encrypted += chr((ord(c) - ord('A') + shift) % 26 + ord('A'))
        else:
            encrypted += c
    
    decrypted, found_shift = t1.break_caesar(encrypted)
    assert found_shift == shift
    assert decrypted == original
    print("Task 1 passed!")

def test_task3():
    print("\nTesting Task 3 (Vigenere Breaker)...")
    original = """
The Vigenere cipher is a method of encrypting alphabetic text by using a series of interwoven Caesar ciphers, based on the letters of a keyword. It is a form of polyalphabetic substitution. First described by Giovan Battista Bellaso in 1553, the cipher is easy to understand and implement, but it resisted all attempts to break it until 1863, three centuries later. This led to the description le chiffre indechiffrable (French for 'the indecipherable cipher'). Many people have tried to implement encryption schemes that are essentially Vigenere ciphers. Friedrich Kasiski was the first to publish a general method of deciphering Vigenere ciphers in 1863.
""".upper()
    original = "".join(filter(str.isalpha, original))
    key = "CRYPTO"
    
    # Manually encrypt
    encrypted = ""
    for i, c in enumerate(original.replace(" ", "")):
        shift = ord(key[i % len(key)]) - ord('A')
        encrypted += chr((ord(c) - ord('A') + shift) % 26 + ord('A'))
    
    found_key, decrypted = t3.break_vigenere(encrypted)
    assert found_key == key
    print(f"Task 3 passed! Found key: {found_key}")

def test_task4():
    print("\nTesting Task 4 (Hill Cipher)...")
    original = "HELP"
    key_matrix = np.array([[3, 3], [2, 5]]) # Determinant 15-6=9, GCD(9, 26)=1. Inv exists.
    
    #HELP = [7, 4], [11, 15]
    #[3 3] [7] = [21+12] = [33] = 7 (H)
    #[2 5] [4] = [14+20] = [34] = 8 (I)
    #[3 3] [11] = [33+45] = [78] = 0 (A)
    #[2 5] [15] = [22+75] = [97] = 19 (T)
    # Ciphertext should be HIAT
    encrypted = "HIAT"
    
    decrypted = t4.decrypt_hill(encrypted, key_matrix)
    assert decrypted[:4] == original
    print("Task 4 passed!")

if __name__ == "__main__":
    try:
        test_task1()
        test_task3()
        test_task4()
        print("\nAll automated tests passed!")
    except AssertionError as e:
        print(f"\nTest failed: {e}")
    except Exception as e:
        print(f"\nAn error occurred during testing: {e}")
