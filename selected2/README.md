# Cryptography Implementation Project

This repository contains Python implementations of four classic cryptography decryption tasks. These tools are designed to break or decrypt various ciphers, ranging from simple Caesar ciphers to matrix-based Hill ciphers.

## 📋 Requirements

- **Python 3.6+**
- **NumPy**: Required for Task 4 (Hill Cipher matrix operations).
  ```bash
  pip install numpy
  ```

---

## 🛠 Tasks Overview

### Task 1: Caesar Cipher Breaker
**File:** `task1_caesar_decryption.py`

This tool breaks a Caesar cipher without knowing the original shift. It tries all 26 possible shifts and uses **Chi-Squared Frequency Analysis** to determine which result most closely matches standard English letter distributions.

*   **How to Run:**
    ```bash
    python3 task1_caesar_decryption.py
    ```
*   **Test Case:**
    *   **Ciphertext:** `Olssv Dvysk! P't h Jhlzhy Jpwoly iylhrly.`
    *   **Expected Result:** Shift 7, "Hello World! I'm a Caesar Cipher breaker."

---

### Task 2: Enhanced Frequency Analysis
**File:** `task2_frequency_analysis.py`

A tool for breaking monoalphabetic substitution ciphers. It provides an automated initial guess based on letter frequency (ETAOIN...) and then enters an **interactive mode** where you can manually swap letter mappings to refine the decryption.

*   **How to Run:**
    ```bash
    python3 task2_frequency_analysis.py
    ```
*   **Test Case:**
    *   **Ciphertext:** `G朝日Y V朝日SD! (Use a substitution text)`
    *   **Interaction:** Once running, you can type `X Y` to swap the mapping of ciphertext character `X` to plaintext `Y`.

---

### Task 3: Vigenère Cipher Breaker (No Key)
**File:** `task3_vigenere_decryption.py`

This script breaks Vigenère ciphers without requiring the key. It uses:
1.  **Index of Coincidence (IC)** to estimate the most likely key length.
2.  **Frequency Analysis** on each "coset" to determine the specific shift for each key character.

*   **How to Run:**
    ```bash
    python3 task3_vigenere_decryption.py
    ```
*   **Test Case:**
    *   **Ciphertext:** `Zp rshmghu vpwoly pz h tlmave vm lujyfwapun hswihilspj mlea...` (Provide a longer text for better accuracy).
    *   **Expected Result:** It should identify the key (e.g., "CRYPTO") and decrypt the text.

---

### Task 4: Hill Cipher Decryptor
**File:** `task4_hill_cipher.py`

Decrypts text using a Hill Cipher with a provided 2x2 or 3x3 key matrix. It performs modular matrix inversion (mod 26) to find the decryption key.

*   **How to Run:**
    ```bash
    python3 task4_hill_cipher.py
    ```
*   **Test Case:**
    *   **Ciphertext:** `HIAT`
    *   **Matrix Size:** `2`
    *   **Key Matrix:**
        *   Row 1: `3 3`
        *   Row 2: `2 5`
    *   **Expected Result:** `HELP`

---

## ✅ Automated Verification

You can run the automated test suite to verify that the implementations of Task 1, 3, and 4 are working correctly:

```bash
python3 verify_tasks.py
```

This script will:
1.  Encrypt sample messages using known keys.
2.  Pass the ciphertext to the breakers.
3.  Assert that the original text is recovered.
