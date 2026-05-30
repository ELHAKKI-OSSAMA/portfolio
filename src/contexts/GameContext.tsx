"use client";
import { createContext, useContext, useState, useCallback } from "react";

interface GameContextValue {
  activeGameId: string | null;
  isOverlayVisible: boolean;
  launchGame: (id: string) => void;
  showOverlay: () => void;
  hideOverlay: () => void;
}

const GameContext = createContext<GameContextValue>({
  activeGameId: null,
  isOverlayVisible: false,
  launchGame: () => {},
  showOverlay: () => {},
  hideOverlay: () => {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [activeGameId, setActiveGameId]       = useState<string | null>(null);
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const launchGame = useCallback((id: string) => {
    setActiveGameId(id);
    setOverlayVisible(true);
  }, []);

  const showOverlay = useCallback(() => setOverlayVisible(true),  []);
  const hideOverlay = useCallback(() => setOverlayVisible(false), []);

  return (
    <GameContext.Provider value={{ activeGameId, isOverlayVisible, launchGame, showOverlay, hideOverlay }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
