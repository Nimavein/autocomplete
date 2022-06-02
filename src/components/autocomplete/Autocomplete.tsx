import { ReactNode, useEffect, useRef, useState } from "react";
import "./Autocomplete.scss";

type TSuggestion = {
  name: string;
};

type AutocompleteProps = {
  suggestions: TSuggestion[];
  selectedTags?: string[];
  suggestionsNotFoundContent?: ReactNode;
  placeholder?: string;
  style?: React.CSSProperties;
  dropdownStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  tagStyle?: React.CSSProperties;
};

export const KEY_CODE_UP = 38;
export const KEY_CODE_DOWN = 40;

export const Autocomplete = ({
  suggestions,
  selectedTags,
  suggestionsNotFoundContent,
  placeholder,
  style,
  dropdownStyle,
  inputStyle,
  tagStyle,
}: AutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const [sortedSuggestions, setSortedSuggestions] =
    useState<TSuggestion[]>(suggestions);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>(selectedTags || []);

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 40 && selectedIndex < sortedSuggestions.length - 1) {
      setSelectedIndex((prev) => (prev += 1));
      setIsDropdownVisible(true);
    } else if (e.keyCode === 38 && selectedIndex > 0) {
      setIsDropdownVisible(true);
      setSelectedIndex((prev) => (prev -= 1));
    } else if (e.keyCode === 13 && selectedIndex >= 0) {
      e.preventDefault();
      addTagFromSuggestions(sortedSuggestions[selectedIndex]?.name);
      setSelectedIndex(-1);
    } else if (
      e.keyCode === 13 &&
      selectedIndex < 0 &&
      inputValue !== "" &&
      !tags.includes(inputValue)
    ) {
      setTags([...tags, inputValue]);
      setInputValue("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (
        inputRef.current &&
        isDropdownVisible &&
        !inputRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef, isDropdownVisible]);

  useEffect(() => {
    const matchingSuggestions = suggestions.filter(
      (suggestion) =>
        suggestion.name
          .toLowerCase()
          .includes(inputValue.toLocaleLowerCase()) || inputValue === ""
    );

    const uniqueSortedSuggestions = matchingSuggestions.filter(
      (suggestion) => !tags.includes(suggestion.name)
    );
    setSortedSuggestions(uniqueSortedSuggestions);
    setSelectedIndex(-1);
  }, [inputValue, tags, suggestions]);

  const removeTags = (tagName: string) => {
    setTags([...tags.filter((tag: string) => tag !== tagName)]);
  };

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (sortedSuggestions?.length > 0) setIsDropdownVisible(true);
    setInputValue(e.currentTarget.value);
  };

  const addTagFromSuggestions = (name: string) => {
    setTags([...tags, name]);
    setIsDropdownVisible(false);
    setInputValue("");
  };

  return (
    <div className="autocomplete-wrapper" style={style}>
      <div className="tags-input">
        <ul className="tags">
          {tags.map((tag: string) => (
            <li key={tag} className="tag" style={tagStyle}>
              <span className="tag-title">{tag}</span>
              <span className="tag-close-icon" onClick={() => removeTags(tag)}>
                x
              </span>
            </li>
          ))}
        </ul>
        <input
          style={inputStyle}
          type="text"
          onKeyDown={(e) => handleKeyDown(e)}
          placeholder={placeholder || "Type and press enter to add"}
          onClick={() => setIsDropdownVisible(true)}
          onChange={handleInputChange}
          value={inputValue}
          ref={inputRef}
        />
      </div>
      {isDropdownVisible && (
        <>
          {sortedSuggestions?.length > 0 ? (
            <ul className="dropdown" ref={dropdownRef}>
              {sortedSuggestions.map((suggestion: TSuggestion, index) => (
                <li
                  className={`dropdown-item ${
                    selectedIndex === index ? "active" : ""
                  }`}
                  key={suggestion.name}
                  onClick={() => addTagFromSuggestions(suggestion.name)}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="dropdown" style={dropdownStyle}>
              {suggestionsNotFoundContent || "Suggestions not found"}
            </div>
          )}
        </>
      )}
    </div>
  );
};
