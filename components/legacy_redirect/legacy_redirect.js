'use client'
import { useEffect } from 'react';

export default function LegacyRedirect() {
    useEffect(() => {
        const hash = window.location.hash;
        if (hash.startsWith('#/')) {
            const newPath = hash.replace('#/', '');
            window.location.href = `${window.location.origin}/${newPath}`;
        }
    }, []);
}