import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";

import { InputField } from "@components";

export const Searchbar = () => {
  return (
    <form className="flex bg-accent-100 rounded-lg w-full max-w-175">
      <InputField
        className="h-11 w-full"
        classNameContainer="w-full"
        id="search"
        type="text"
        placeholder="Search for restaurant's name"
      />
      <button
        className="size-11 flex justify-center items-center"
        type="submit"
        aria-label="Search"
      >
        <MagnifyingGlassIcon size={20} className="text-base-100" />
      </button>
    </form>
  );
};
