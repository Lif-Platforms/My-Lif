'use client'
import Link from 'next/link';
import styles from './sidebar.module.css';
import { useEffect, useRef } from 'react';

export default function SideBar({ page }) {
    const personalizationLink = useRef(null);
    const securityLink = useRef(null);

    useEffect(() => {
        if (securityLink.current && personalizationLink.current) {
            if (page === "personalization") {
                securityLink.current.classList.remove(styles.active);
                personalizationLink.current.classList.add(styles.active);
            } else if (page === "security") {
                securityLink.current.classList.add(styles.active);
                personalizationLink.current.classList.remove(styles.active);
            }
        }
    }, [page]);

    return (
        <div className={styles.side_bar}>
            <Link ref={personalizationLink} href="/settings/personalization">Personalization</Link>
            <Link ref={securityLink} href="/settings/security">Security</Link>
        </div>
    )
}