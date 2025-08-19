"use client"

import PopupRenderer from "@/components/settings_page/popup_renderer/popup_renderer";
import { useContext, createContext, useState } from "react";

const PopupContext = createContext();

export function PopupProvider({ children }) {
    const [showPopup, setShowPopup] = useState(false);
    const [component, setComponent] = useState();

    function createPopup(component) {
        setComponent(component);
        setShowPopup(true);
    }

    return (
        <PopupContext.Provider value={
            createPopup
        }>
            { children }
            <PopupRenderer
                component={component}
                showPopup={showPopup}
                setShowPopup={setShowPopup}
            />
        </PopupContext.Provider>
    )
}

export function usePopup() {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return { createPopup: context };
}