'use client'
import { useState } from 'react';
import styles from './topnav.module.css';

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

export default function TopNav({ username }) {
    const [showPanel, setShowPanel] = useState(false);

    return (
        <div className={styles.topnav}>
            <div className={styles.logo}>
                <img src='/logo.png' />
                <h1>My Lif</h1>
            </div>
            <div className={styles.avatar}>
                <img onClick={() => setShowPanel(!showPanel)} src={`${process.env.NEXT_PUBLIC_AUTH_URL}/profile/get_avatar/${username}.png`} />
                <Account_Panel username={username} showPanel={showPanel} />
            </div>
        </div>
    );
}