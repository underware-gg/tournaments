import { create } from "zustand";

type State = {
  gameFilters: string[];
  setGameFilters: (value: string[]) => void;
};

const useUIStore = create<State>((set) => ({
  gameFilters: [],
  setGameFilters: (value: string[]) => set({ gameFilters: value }),
}));

export default useUIStore;
