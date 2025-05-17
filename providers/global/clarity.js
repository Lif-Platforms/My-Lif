'use client'

import { createContext, useEffect, useState } from "react";
import Clarity from "@microsoft/clarity";

export const ClarityContext = createContext();

export function ClarityProvider({ children }) {
    // Define clarity cookie consent
    const [cookieConsent, setCookieConsent] = useState(false);

    // Init MS Clarity
    Clarity.init("pbheesnn9h");

    // Set cookie consent when updated
    useEffect(() => {
        if (cookieConsent) {
            Clarity.consent(cookieConsent);
        }
    }, [cookieConsent]);

    function setConsent(consent) {
        setCookieConsent(consent);
    }

    return (
        <ClarityContext.Provider value={{ setConsent }}>
            {children}
        </ClarityContext.Provider>
    );
}