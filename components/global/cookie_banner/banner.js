'use client'

import { useEffect, useState } from "react";
import styles from "./banner.module.css";
import Cookies from "js-cookie";
import Clarity from "@microsoft/clarity";

export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const [cookieConsent, setCookieConsent] = useState(false);

    function handleClick() {
        // Allow cookies and close the banner
        setCookieConsent(true);
        setShowBanner(false);

        // Set cookie to remember user preference
        Cookies.set('cookie_consent', 'true', { expires: 365 });
    }

    // Init MS Clarity
    Clarity.init("pbheesnn9h");

    // Update clarity cookie consent
    useEffect(() => {
        Clarity.consent(cookieConsent);
    }, [cookieConsent]);

    // Check user preference for cookies
    // and show the banner if not set
    useEffect(() => {
        const cookieConsent = Cookies.get('cookie_consent');
        if (!cookieConsent) {
            setShowBanner(true);
        } else {
            setCookieConsent(true);
        }
    }, []);

    if (!showBanner) {
        return null;
    }

    return (
        <div className={styles.cookie_banner}>
            <div className={styles.cookie_icon}>
                <img src='/cookie_icon.svg' />
            </div>
            <div className={styles.cookie_text}>
                <h1>We Use Cookies</h1>
                <p>Lif Platforms uses cookies for various functions and are required for our site to function.</p>
            </div>
            <div className={styles.ok_button}>
                <button onClick={handleClick}>Okay</button>
            </div>
        </div>
    )
}