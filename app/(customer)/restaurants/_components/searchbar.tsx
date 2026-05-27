import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";

import { InputField } from "@components";

export const Searchbar = () => {
  return (
    <form className="flex bg-accent-100 rounded-lg">
      <InputField
        className="h-11 w-135.75"
        id="search"
        type="text"
        placeholder="Search for restaurant's name"
      />
      <button
        className="size-11 flex justify-center items-center"
        type="submit"
      >
        <MagnifyingGlassIcon size={20} className="text-base-100" />
      </button>
    </form>
  );
};
