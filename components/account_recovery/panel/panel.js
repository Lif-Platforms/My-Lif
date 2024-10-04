'use client'

import { useEffect, useRef, useState } from "react";
import styles from './panel.module.css';
import { openConnection, closeConnection, sendMessage, receiveMessage } from '@/scripts/account_recovery/websocket_conn';
import Loader from "../loader/loader";
import { useRouter } from "next/navigation";

export default function Panel() {
    const [panelState, setPanelState] = useState('loading');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const emailEntry = useRef();
    const codeEntry = useRef();
    const panelStateRef = useRef();
    const newPasswordEntry = useRef();
    const confirmPasswordEntry = useRef();

    // Ensure the panel state can be accessed inside the websocket useEffect
    useEffect(() => {
        panelStateRef.current = panelState;
    }, [panelState]);

    useEffect(() => {
        const connectWebSocket = async () => {
            await openConnection(`${process.env.NEXT_PUBLIC_AUTH_WS}/account/account_recovery`);
            setPanelState('start');
        };
    
        connectWebSocket();

        receiveMessage((message) => {
            console.log('Received:', message);

            // Parse response from server
            const parsed_response = JSON.parse(message);

            if (parsed_response.responseType === "emailSent") {
                // Reset entry box for next entry
                emailEntry.current.value = "";

                setIsLoading(false);
                setPanelState('stage2');

            } else if (parsed_response.responseType === "codeCorrect") {
                // Reset entry box for next entry
                codeEntry.current.value = "";

                setIsLoading(false);
                setPanelState('stage3');

            } else if (parsed_response.responseType === "error" && panelStateRef.current === "stage2") {
                setIsLoading(false);
                setErrorMessage("The code you entered is invalid. Please double-check your email.");

            } else if (parsed_response.responseType === "error" && panelStateRef.current === "stage1") {
                setIsLoading(false);
                setErrorMessage("The email you entered does not match a Lif Account. Please try a different email.");

            } else if (parsed_response.responseType === "passwordUpdated") {
                setIsLoading(false);
                setPanelState('done');
            }
        });
    
        return () => {
            closeConnection();
        };
    }, []);

    function handle_email_send() {
        if (emailEntry.current) {
            setIsLoading(true);
            setErrorMessage(null);
            sendMessage(JSON.stringify({email: emailEntry.current.value}));
        }
    }

    function handle_code_send() {
        if (codeEntry.current) {
            setIsLoading(true);
            setErrorMessage(null);
            sendMessage(JSON.stringify({code: codeEntry.current.value}));
        }
    }

    function handle_password_send() {
        if (newPasswordEntry.current && confirmPasswordEntry.current) {
            setIsLoading(true);
            setErrorMessage(null);

            const new_password = newPasswordEntry.current.value;
            const confirm_password = confirmPasswordEntry.current.value;

            // Check if passwords match
            if (new_password === confirm_password) {
                sendMessage(JSON.stringify({password: new_password}));
            } else {
                setIsLoading(false);
                setErrorMessage("Passwords do not match.");
            }
        }
    }

    const router = useRouter();

    if (panelState === 'loading') {
        return (
            <div className={styles.panel}>
                <div className={styles.header}>
                    <img className={styles.logo} src="/logo.png" alt="Lif Logo" />
                    <h1>One Moment...</h1>
                </div>
                <img className={styles.loader} src="/loader.svg" />
            </div>
        );
    } else if (panelState === 'start') {
        return (
            <div className={styles.panel}>
                <div className={styles.header}>
                    <img className={styles.logo} src="/logo.png" alt="Lif Logo" />
                    <h1>Lost Your Password? <br />Lets Fix That.</h1>
                </div>
                <button onClick={() => setPanelState('stage1')} className={styles.next_button}>Next</button>
            </div>
        )
    } else if (panelState === 'stage1') {
        return (
            <div className={styles.panel}>
                <Loader isLoading={isLoading} />
                <div className={styles.header}>
                    <img className={styles.logo} src="/logo.png" alt="Lif Logo" />
                    <h1>Enter Your Email</h1>
                    <p>Enter the email associated with your Lif Account. We need this to send you an account recovery email.</p>
                </div>
                <div className={styles.body}>
                    <input disabled={isLoading} ref={emailEntry} type="email" placeholder="Email" />
                    <p className={styles.error_message}>{errorMessage}</p>
                </div>
                <button disabled={isLoading} onClick={handle_email_send} className={styles.next_button}>Next</button>
            </div>
        )
    } else if (panelState === 'stage2') {
        return (
            <div className={styles.panel}>
                <Loader isLoading={isLoading} />
                <div className={styles.header}>
                    <img className={styles.logo} src="/logo.png" alt="Lif Logo" />
                    <h1>Check Your Email</h1>
                    <p>We sent a 5 digit code to your inbox. Please enter it below.</p>
                </div>
                <div className={styles.body}>
                    <input ref={codeEntry} disabled={isLoading} type="text" placeholder="Code" />
                    <p className={styles.error_message}>{errorMessage}</p>
                </div>
                <button disabled={isLoading} onClick={handle_code_send} className={styles.next_button}>Next</button>
            </div>
        )
    } else if (panelState === 'stage3') {
        return (
            <div className={styles.panel}>
                <Loader isLoading={isLoading} />
                <div className={styles.header}>
                    <img className={styles.logo} src="/logo.png" alt="Lif Logo" />
                    <h1>Enter Your New Password</h1>
                    <p>Enter the new password you will use to log into your account.</p>
                </div>
                <div className={styles.body}>
                    <input ref={newPasswordEntry} disabled={isLoading} type="password" placeholder="New Password" />
                    <input ref={confirmPasswordEntry} disabled={isLoading} type="password" placeholder="Confirm Password" />
                    <p className={styles.error_message}>{errorMessage}</p>
                </div>
                <button disabled={isLoading} onClick={handle_password_send} className={styles.next_button}>Next</button>
            </div>
        )
    } else if (panelState == 'done') {
        return (
            <div className={styles.panel}>
                <div className={styles.header}>
                    <img className={styles.logo} src="/logo.png" alt="Lif Logo" />
                    <h1>You're All Set</h1>
                    <p>Try to remember your password this time.</p>
                </div>
                <button onClick={() => router.push('/')} className={styles.next_button}>Done</button>
            </div>
        )
    }
}