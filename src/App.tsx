import { useState } from "react";
import { Autocomplete } from "./components/autocomplete/Autocomplete";

type TSuggestion = {
  name: string;
};

export const App = () => {
  const [suggestions] = useState<TSuggestion[]>([
    { name: "Red" },
    { name: "Blue" },
    { name: "White" },
    { name: "Black" },
    { name: "Magenta" },
    { name: "Yellow" },
    { name: "Green" },
  ]);
  const selectedTags = ["Violet", "Orange"];
  return (
    <div className="App">
      <Autocomplete
        suggestionsNotFoundContent={<>No matching suggestions found.</>}
        selectedTags={selectedTags}
        suggestions={suggestions}
      />
      XXXXXXXXXXX
    </div>
  );
};

