import { create } from "zustand";
import { GameMetadata } from "@/generated/models.gen";

type State = {
  gameFilters: string[];
  setGameFilters: (value: string[]) => void;
  gameData: GameMetadata[];
  setGameData: (value: GameMetadata[]) => void;
};

const useUIStore = create<State>((set) => ({
  gameFilters: [],
  setGameFilters: (value: string[]) => set({ gameFilters: value }),
  gameData: [],
  setGameData: (value: GameMetadata[]) => set({ gameData: value }),
}));

export default useUIStore;
