"use client"
import { useEffect } from "react";

/** Redirects users who are using legacy routes
 * EXAMPLE: from: my_lif.com/#/page to: my_lif.com/page
**/
export default function LegacyRedirect() {
    useEffect(() => {
        const hash = window.location.hash;
        if (hash.startsWith('#/')) {
            const newPath = hash.replace('#/', '');
            window.location.href = `${window.location.origin}/${newPath}`;
        }
    }, []);
}