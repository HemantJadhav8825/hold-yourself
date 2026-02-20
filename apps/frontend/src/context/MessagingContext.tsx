"use client";

import React, { createContext, useContext, useState } from 'react';

interface MessagingContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggle: () => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <MessagingContext.Provider value={{
            isOpen,
            setIsOpen,
            toggle: () => setIsOpen(prev => !prev)
        }}>
            {children}
        </MessagingContext.Provider>
    );
};

export const useMessagingContext = () => {
    const context = useContext(MessagingContext);
    if (context === undefined) {
        throw new Error('useMessagingContext must be used within a MessagingProvider');
    }
    return context;
};
