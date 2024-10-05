'use client'

import { useEffect, useRef, useState } from 'react';
import styles from './panel.module.css';
import Loader from '@/components/account_recovery/loader/loader';
import { useRouter } from 'next/navigation';

export default function Panel() {
    const [panelState, setPanelState] = useState('welcome');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [accountData, setAccountData] = useState({username: null, email: null, password: null});
    const usernameEntry = useRef();
    const emailEntry = useRef();
    const passwordEntry = useRef();
    const confirmPasswordEntry = useRef();

    function handle_username_check() {
        if (usernameEntry.current) {
            setIsLoading(true);
            setErrorMessage(null);

            fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/account/check_info_usage/username/${usernameEntry.current.value}`)
            .then((response) => {
                if (response.ok) {
                    // Update account data
                    let new_account_data = {...accountData};
                    new_account_data.username = usernameEntry.current.value;
                    setAccountData(new_account_data);

                    // Clear entry box for next entry
                    usernameEntry.current.value = "";

                    setIsLoading(false);
                    setPanelState('stage2');
                } else if (response.status === 409) {
                    throw new Error("The username you chose is already in use. Please choose a different username.");
                } else {
                    throw new Error("Something went wrong!");
                }
            })
            .catch((error) => {
                setIsLoading(false);
                setErrorMessage(error.message);
            })
        }
    }

    function handle_email_check() {
        if (emailEntry.current) {
            setIsLoading(true);
            setErrorMessage(null);

            const email_in_use = new Promise((resolve, reject) => {
                fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/account/check_info_usage/email/${emailEntry.current.value}`)
                .then((response) => {
                    if (response.ok) {
                        resolve("Email Not In Use");
                    } else if (response.status === 409) {
                        throw new Error("The email you provided is already in use. Please try a different email.");
                    } else {
                        throw new Error("Something went wrong!");
                    }
                })
                .catch((error) => {
                    reject(error.message);
                })
            })

            const email_valid = new Promise((resolve, reject) => {
                fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/account/check_info_usage/emailValid/${emailEntry.current.value}`)
                .then((response) => {
                    if (response.ok) {
                        resolve("Email Is Valid");
                    } else if (response.status === 400) {
                        throw new Error("The email you provided is not valid. Please try a different email.");
                    } else {
                        throw new Error("Something went wrong.");
                    }
                })
                .catch((error) => {
                    reject(error.message);
                })
            })

            Promise.all([email_in_use, email_valid])
            .then(() => {
                // Update account data
                let new_account_data = {...accountData};
                new_account_data.email = emailEntry.current.value;
                setAccountData(new_account_data);

                // Move to next stage
                setIsLoading(false);
                setPanelState('stage3');
            })
            .catch((error) => {
                setIsLoading(false);
                setErrorMessage(error);
            })
        }
    }

    function handle_password_check() {
        if (passwordEntry.current && confirmPasswordEntry.current) {
            setIsLoading(true);
            setErrorMessage(null);

            const password = passwordEntry.current.value;
            const confirm_password = confirmPasswordEntry.current.value;

            if (password === confirm_password) {
                // Update account data
                let new_account_data = {...accountData};
                new_account_data.password = passwordEntry.current.value;
                setAccountData(new_account_data);

                setIsLoading(false);
                setPanelState('ready');
            } else {
                setIsLoading(false);
                setErrorMessage("Passwords do not match. Please double-check your password.");
            }
        }
    }

    function handle_account_creation() {
        setIsLoading(true);
        
        fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/account/create_account`, {
            method: 'POST',
            body: JSON.stringify({
                username: accountData.username,
                email: accountData.email,
                password: accountData.password
            })
        })
        .then((response) => {
            if (response.ok) {
                setIsLoading(false);
                setPanelState('done');
            } else {
                throw new Error('Something Went Wrong!');
            }
        })
        .catch((error) => {
            setIsLoading(false);
            setErrorMessage(error.message);
        })
    }

    const router = useRouter();

    if (panelState === 'welcome') {
        return (
            <div className={styles.panel}>
                <div className={styles.header}>
                    <img className={styles.logo} src='/logo.png' alt='Lif Logo' />
                    <h1>Welcome To Lif</h1>
                    <p>You're social starts here.</p>
                </div>
                <button onClick={() => setPanelState('stage1')} className={styles.next_button}>Lets Go</button>
            </div>
        )
    } else if (panelState === 'stage1') {
        return (
            <div className={styles.panel}>
                <Loader isLoading={isLoading} />
                <div className={styles.header}>
                    <img className={styles.logo} src='/logo.png' alt='Lif Logo' />
                    <h1>Choose A Username</h1>
                    <p>Your username is one of the most important parts of your Lif Account. Its the name that others will see when they look at your profile. Choose wisely, they cannot be changed later.</p>
                </div>
                <div className={styles.body}>
                    <input disabled={isLoading} ref={usernameEntry} type='text' placeholder='Username' />
                    <p className={styles.error_message}>{errorMessage}</p>
                </div>
                <button disabled={isLoading} onClick={handle_username_check} className={styles.next_button}>Next</button>
            </div>
        )
    } else if (panelState === 'stage2') {
        return (
            <div className={styles.panel}>
                <Loader isLoading={isLoading} />
                <div className={styles.header}>
                    <img className={styles.logo} src='/logo.png' alt='Lif Logo' />
                    <h1>Add Your Email</h1>
                    <p>Your email is crucial to your Lif account. It allows us to send you import emails, such as account recovery emails.</p>
                </div>
                <div className={styles.body}>
                    <input disabled={isLoading} ref={emailEntry} type='email' placeholder='Email' />
                    <p className={styles.error_message}>{errorMessage}</p>
                </div>
                <button disabled={isLoading} onClick={handle_email_check} className={styles.next_button}>Next</button>
            </div>
        )
    } else if (panelState === 'stage3') {
        return (
            <div className={styles.panel}>
                <Loader isLoading={isLoading} />
                <div className={styles.header}>
                    <img className={styles.logo} src='/logo.png' alt='Lif Logo' />
                    <h1>Choose A Password</h1>
                    <p>Your password is how you will log into your Lif Account. Choose one you will remember.</p>
                </div>
                <div className={styles.body}>
                    <input disabled={isLoading} ref={passwordEntry} type='password' placeholder='Password' />
                    <input disabled={isLoading} ref={confirmPasswordEntry} type='password' placeholder='Confirm Password' />
                    <p className={styles.error_message}>{errorMessage}</p>
                </div>
                <button disabled={isLoading} onClick={handle_password_check} className={styles.next_button}>Next</button>
            </div>
        )
    } else if (panelState === 'ready') {
        return (
            <div className={styles.panel}>
                <Loader isLoading={isLoading} />
                <div className={styles.header}>
                    <img className={styles.logo} src='/logo.png' alt='Lif Logo' />
                    <h1>Your Account is Ready</h1>
                    <p>Click the "Create Account" button to jump into your social.</p>
                </div>
                <div className={styles.body}>
                    <p className={styles.disclaimer_text}>By clicking "Create Account" you agree to be bound by the <a target='blank_' href='https://lifplatforms.com/terms%20of%20service'>Terms of Service</a> and <a target='blank_' href='https://lifplatforms.com/privacy%20policy'>Privacy Policy</a>.</p>
                    <p className={styles.error_message}>{errorMessage}</p>
                </div>
                <button disabled={isLoading} onClick={handle_account_creation} className={styles.next_button}>Create Account</button>
            </div>
        )
    } else if (panelState === 'done') {
        return (
            <div className={styles.panel}>
                <Loader isLoading={isLoading} />
                <div className={styles.header}>
                    <img className={styles.logo} src='/logo.png' alt='Lif Logo' />
                    <h1>You're In</h1>
                    <p>You are ready to dive into your social.</p>
                </div>
                <button onClick={() => router.push('/')} className={styles.next_button}>Done</button>
            </div>
        )
    }
}