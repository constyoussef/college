import { useState, type FC } from "react";
// Ciphers Start
import * as caesar from "@/ciphers/caesar";
import * as monoalphabetic from "@/ciphers/monoalphabetic";
import * as playfair from "@/ciphers/playfair";
import * as vigenere from "@/ciphers/vigenere";
import * as otp from "@/ciphers/otp";
import * as hill from "@/ciphers/hill";
import * as rowTransposition from "@/ciphers/rowTransposition";
import * as permutation from "@/ciphers/permutation";
import * as railFence from "@/ciphers/railFence";
import * as des from "@/ciphers/des";
import * as aes from "@/ciphers/aes";
// Ciphers End
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CipherInterfaceProps {
  cipher: string;
}

const CipherInterface: FC<CipherInterfaceProps> = ({
  cipher,
}: CipherInterfaceProps) => {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [bruteforceResults, setBruteforceResults] = useState<string[]>([]);
  const [error, setError] = useState("");

  const getCipherModule = () => {
    switch (cipher) {
      case "caesar":
        return caesar;
      case "monoalphabetic":
        return monoalphabetic;
      case "playfair":
        return playfair;
      case "vigenere":
        return vigenere;
      case "otp":
        return otp;
      case "hill":
        return hill;
      case "rowTransposition":
        return rowTransposition;
      case "permutation":
        return permutation;
      case "railFence":
        return railFence;
      case "des":
        return des;
      case "aes":
        return aes;
      default:
        return caesar;
    }
  };

  const handleEncrypt = async () => {
    try {
      setError("");
      setBruteforceResults([]);
      const module = getCipherModule();
      const encrypted = await module.encrypt(text, key);
      setResult(encrypted);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message);
      setResult("");
    }
  };

  const handleDecrypt = async () => {
    try {
      setError("");
      setBruteforceResults([]);
      const module = getCipherModule();
      const decrypted = await module.decrypt(text, key);
      setResult(decrypted);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
      setResult("");
    }
  };

  const handleBruteforce = () => {
    try {
      setError("");
      setResult("");
      if (cipher === "caesar") {
        const results = caesar.bruteforce(text);
        setBruteforceResults(results);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getKeyPlaceholder = () => {
    switch (cipher) {
      case "caesar":
        return "Shift (0-25)";
      case "monoalphabetic":
        return "26-letter substitution key";
      case "playfair":
        return "Keyword";
      case "vigenere":
        return "Keyword";
      case "otp":
        return "Key (same length as text)";
      case "hill":
        return 'Matrix (e.g., "3 3 2 5" for 2x2)';
      case "rowTransposition":
        return "Keyword";
      case "permutation":
        return 'Permutation order (e.g., "3 1 4 2")';
      case "railFence":
        return "Number of rails";
      case "des":
        return "8-character key";
      case "aes":
        return "Password/key";
      default:
        return "Key";
    }
  };

  return (
    <Card className="w-full p-5 rounded-[5px]">
      <h2>{cipher.charAt(0).toUpperCase() + cipher.slice(1)} Cipher</h2>

      <div className="mb-4 flex flex-col gap-1">
        <Label className="block mb-1 font-bold">Text:</Label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full p-2 text-sm"
          placeholder="Enter text to encrypt/decrypt"
        />
      </div>

      <div className="mb-4 flex flex-col gap-1">
        <Label className="block mb-1 font-bold">Key:</Label>
        <Input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full p-2 text-sm"
          placeholder={getKeyPlaceholder()}
        />
      </div>

      <div className="mb-4">
        <Button variant="default" onClick={handleEncrypt} className="mr-3 p-2">
          Encrypt
        </Button>
        <Button
          variant="secondary"
          onClick={handleDecrypt}
          className="mr-3 p-2"
        >
          Decrypt
        </Button>
        {cipher === "caesar" && (
          <Button
            variant="outline"
            onClick={handleBruteforce}
            className="py-2 px-4"
          >
            Bruteforce
          </Button>
        )}
      </div>

      {error && (
        <AlertDialog>
          <strong>Error:</strong> {error}
        </AlertDialog>
      )}

      {result && (
        <div className="mb-4">
          <Label htmlFor="" className="block mb-1 font-bold">
            Result:
          </Label>
          <Textarea
            value={result}
            readOnly
            rows={4}
            className="w-full p-2 text-sm bg-[#f0f0f0]"
          />
        </div>
      )}

      {bruteforceResults.length > 0 && (
        <Card className="mb-4 ">
          <CardContent className="p-2 flex flex-col gap-3 rounded-lg">
            <Label className="block mb-1 font-bold">
              Bruteforce Results (All 26 shifts):
            </Label>
            <ScrollArea className="h-60">
              {bruteforceResults.map((res, idx) => (
                <div key={idx} className="mb-1 p-1 bg-[#f9f9f9]">
                  <strong>Shift {idx}:</strong> {res}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </Card>
  );
};

export default CipherInterface;
