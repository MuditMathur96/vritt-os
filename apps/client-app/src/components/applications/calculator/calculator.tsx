import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Calculator = () => {
  const [display, setDisplay] = useState('0');

  const handleButtonClick = (value: string) => {
    setDisplay((prev) => (prev === '0' ? value : prev + value));
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleCalculate = () => {
    try {
      setDisplay(eval(display).toString());
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white p-4 shadow-lg">
      <div className="text-right text-2xl mb-2 bg-gray-800 p-2 rounded">{display}</div>
      <div className="grid grid-cols-4 gap-2 h-full ">
        {[...'789/456*123-0.=+'].map((char) => (
          <button
            key={char}
            onClick={() =>
              char === '=' ? handleCalculate() : char === '.' ? handleButtonClick('.') : handleButtonClick(char)
            }
            className="bg-gray-700 p-4 rounded text-xl hover:bg-gray-600"
          >
            {char}
          </button>
        ))}
        <Button onClick={handleClear} className="col-span-2 bg-red-500 p-4 rounded text-xl hover:bg-red-400">
          C
        </Button>
      </div>
    </div>
  );
};