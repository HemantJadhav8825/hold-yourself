"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type PaperMode = "day" | "night" | "auto";

interface PaperModeContextType {
    mode: PaperMode;
    setMode: (mode: PaperMode) => void;
    isNightActive: boolean; // True if night mode is actively displaying
}

const PaperModeContext = createContext<PaperModeContextType | undefined>(undefined);

export function PaperModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<PaperMode>("auto");
    const [isNightActive, setIsNightActive] = useState(false);

    useEffect(() => {
        // Initialize from localStorage on mount
        try {
            const stored = localStorage.getItem("paper-mode") as PaperMode;
            if (stored && ["day", "night", "auto"].includes(stored)) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setModeState(stored);
            }
        } catch (e) {
            // Ignore localStorage errors
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute("data-paper-mode", mode);

        const updateActiveState = () => {
            if (mode === "night") {
                setIsNightActive(true);
            } else if (mode === "day") {
                setIsNightActive(false);
            } else {
                // Auto mode
                setIsNightActive(window.matchMedia("(prefers-color-scheme: dark)").matches);
            }
        };

        updateActiveState();

        if (mode === "auto") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handler = () => updateActiveState();
            mediaQuery.addEventListener("change", handler);
            return () => mediaQuery.removeEventListener("change", handler);
        }
    }, [mode]);

    const setMode = (newMode: PaperMode) => {
        setModeState(newMode);
        try {
            localStorage.setItem("paper-mode", newMode);
        } catch (e) {
            // Ignore
        }
    };

    return (
        <PaperModeContext.Provider value={{ mode, setMode, isNightActive }}>
            {children}
        </PaperModeContext.Provider>
    );
}

export function usePaperMode() {
    const context = useContext(PaperModeContext);
    if (context === undefined) {
        throw new Error("usePaperMode must be used within a PaperModeProvider");
    }
    return context;
}
