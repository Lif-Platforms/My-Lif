'use client'
import { useState } from 'react';
import styles from './log_out_everywhere.module.css';
import Cookies from 'js-cookie';

export default function LogOutEverywhere() {
    const [innerButton, setInnerButton] = useState("Log Out");
    const [disabled, setDisabled] = useState(false);
    const [errorText, setErrorText] = useState("");

    function handle_log_out() {
        setInnerButton(<img src="/loader2.svg" />);
        setDisabled(true);

        // Get auth info
        const username = Cookies.get('LIF_USERNAME');
        const token = Cookies.get('LIF_TOKEN');

        // Reset token on auth server
        fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/account/reset_token`, {
            headers: {
                username: username,
                token: token
            }
        })
        .then((response) => {
            if (response.ok) {
                window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout?redirect=https://my.lifplatforms.com/login`;
            } else {
               throw new Error("Request failed with status code: " + response.status);
            }
        })
        .catch((err) => {
            setDisabled(false);
            setInnerButton("Log Out");
            setErrorText("Something Went Wrong");
            console.error(err);
        })
    }

    return (
        <div className={styles.tile}>
            <p>By logging out everywhere you will be logged out of all devices that are currently logged into your Lif Account. Note that this also logs you out of this device as well.</p>
            <div className={styles.footer}>
                <p className={styles.error}>{errorText}</p>
                <button disabled={disabled} onClick={handle_log_out}>{innerButton}</button>
            </div>
        </div>
    )
}