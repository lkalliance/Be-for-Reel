import "./SearchForm.css";
import { Dispatch, SetStateAction } from "react";
import { InputText } from "../../components";

interface searchFormProps {
  show: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  handleSearch: () => void;
}

export function SearchForm({
  show,
  search,
  setSearch,
  handleSearch,
}: searchFormProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { value } = e.target;
    setSearch(value);
  };

  const handleSearchSubmit = async () => {
    if (search.length < 3) return;
    handleSearch();
  };

  const handleReturn = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handler to assign a keyboard enter to the title search button
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <div id="search-panel" className={show ? "show" : ""}>
      <InputText
        type="text"
        id="searchBox"
        val={search}
        setValue={handleSearchChange}
        keyUp={handleReturn}
        focused={show}
      />
      <button
        onClick={handleSearchSubmit}
        className="btn btn-primary"
        disabled={search.length < 3}
      >
        Search
      </button>
    </div>
  );
}
