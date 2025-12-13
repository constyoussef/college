import type { FC } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CipherSelectorProps {
  selectedCipher: string;
  onSelect: (cipher: string) => void;
}

const ciphers = [
  { value: "caesar", label: "Caesar Cipher" },
  { value: "monoalphabetic", label: "Monoalphabetic Cipher" },
  { value: "playfair", label: "Playfair Cipher" },
  { value: "vigenere", label: "Vigenère Cipher" },
  { value: "otp", label: "One-Time Pad" },
  { value: "hill", label: "Hill Cipher" },
  { value: "rowTransposition", label: "Row Transposition Cipher" },
  { value: "permutation", label: "Permutation Cipher" },
  { value: "railFence", label: "Rail Fence Cipher" },
  { value: "des", label: "DES (Simplified)" },
  { value: "aes", label: "AES" },
];

const CipherSelector: FC<CipherSelectorProps> = ({
  selectedCipher,
  onSelect,
}) => {
  return (
    <Card className="mb-5 w-full">
      <CardHeader>
        <Label htmlFor="cipher-select" className="mr-3 font-bold">
          Select Chiper:
        </Label>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedCipher}
          // onValueChange={(e) => onSelect(e.)}
          onValueChange={(e) => onSelect(e)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Chiper" />
            <SelectContent>
              {ciphers.map((cipher) => (
                <SelectItem key={cipher.value} value={cipher.value}>
                  {cipher.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectTrigger>
        </Select>
      </CardContent>
    </Card>
  );
};

export default CipherSelector;
