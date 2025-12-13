import { useState } from "react";
import CipherInterface from "./components/CipherInterface";
import CipherSelector from "./components/CipherSelector";

function App() {
  const [selectedCipher, setSelectedCipher] = useState<string>("caesar");

  return (
    <main className="p-5 flex flex-col max-w-[800px] justify-center items-center h-screen mx-auto">
      <h1 className="text-4xl font-bold my-3 text-indigo-600">Crypto Suite</h1>
      <CipherSelector
        selectedCipher={selectedCipher}
        onSelect={setSelectedCipher}
      />
      <CipherInterface cipher={selectedCipher} />
    </main>
  );
}

export default App;
