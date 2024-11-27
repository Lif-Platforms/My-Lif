'use client'
import { useState, useEffect } from 'react';
import styles from './topnav.module.css';
import Link from 'next/link';

function Account_Panel({ username, showPanel }) {

    function handle_logout() {
        window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout?redirect=https://my.lifplatforms.com/login`;
    }

    if (showPanel) {
        return (
            <div className={styles.account_panel}>
                <div className={styles.header}>
                    <img src={`${process.env.NEXT_PUBLIC_AUTH_URL}/profile/get_avatar/${username}.png`} />
                    <h1>{username}</h1>
                </div>
                <button onClick={handle_logout}>Log Out</button>
            </div>
        )
    }
}

function Logo({ logoState, setShowSideNav, showSideNav }) {
    if (logoState === 'logo') {
        return (
            <div className={styles.logo}>
                <img className={styles.logo} src='/logo.png' />
                <h1>My Lif</h1>
            </div>
        );
    } else if (logoState === 'menu') {
        return (
            <div className={styles.logo}>
                <img className={styles.menu} onClick={() => setShowSideNav(!showSideNav)} src='/settings/hamburger.svg' />
                <h1>My Lif</h1>
            </div>
        );
    }
}

export default function TopNav({ username, showSideNav, setShowSideNav }) {
    const [showPanel, setShowPanel] = useState(false);
    const [logoState, setLogoState] = useState(null);

    useEffect(() => {
        function handleResize() {
          if (window.innerWidth <= 900 && window.location.pathname.startsWith('/settings')) {
            setLogoState('menu');
          } else {
            setLogoState('logo');
          }
        }

        // Run resize function once upon page load
        handleResize();
    
        window.addEventListener('resize', handleResize);
    
        // Cleanup the event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
      }, []);

    return (
        <div className={styles.topnav}>
            <Logo 
                logoState={logoState}
                setShowSideNav={setShowSideNav}
                showSideNav={showSideNav}
            />
            <div className={styles.avatar}>
                <img onClick={() => setShowPanel(!showPanel)} src={`${process.env.NEXT_PUBLIC_AUTH_URL}/profile/get_avatar/${username}.png`} />
                <Account_Panel username={username} showPanel={showPanel} />
            </div>
        </div>
    );
}