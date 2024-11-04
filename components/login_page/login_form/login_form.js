'use client'
import { useEffect, useRef, useState } from 'react';
import styles from './login_form.module.css';
import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';
import Cookies from 'js-cookie';


export default function LoginForm({ redirect_url }) {
    const loginFormRef = useRef();
    const loginContent = useRef();

    const [loginStatus, setLoginStatus] = useState("");
    const [isLoading, setIsLoading] = useState();

    const router = useRouter(false);

    // Change opacity of login content based on is loading
    useEffect(() => {
        if (isLoading) {
            loginContent.current.style.opacity = "0.5";
        } else {
            loginContent.current.style.opacity = "1";
        }
    }, [isLoading]);

    function handle_login(event) {
        // Prevent form from refreshing the page
        event.preventDefault();

        setIsLoading(true);

        // Get login form data
        const formData = new FormData(loginFormRef.current);

        // Make auth request
        fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/login`, {
            method: "POST",
            body: formData
        })
        .then(async (response) => {
            // Parse response
            const data = await response.json();

            // Get username from form data
            const username = formData.get('username');

            if (response.ok) {
                // Set auth cookies
                if (process.env.NODE_ENV === "development") {
                    Cookies.set("LIF_USERNAME", username);
                    Cookies.set("LIF_TOKEN", data.token);
                } else {
                    Cookies.set("LIF_USERNAME", username, {domain: ".lifplatforms.com"});
                    Cookies.set("LIF_TOKEN", data.token, {domain: ".lifplatforms.com"});
                }

                // Check if there is a redirect URL
                if (redirect_url) {
                    window.location.href = redirect_url;
                } else {
                    router.push("/");
                }
            } else if (response.status === 401) {
                setIsLoading(false);
                setLoginStatus("Incorrect username or password.");
            } else if (response.status === 403) {
                setIsLoading(false);
                setLoginStatus("Account suspended. If you believe this was a mistake, contact Lif Support.");
            } else {
                throw new Error("Something Went Wrong");
            }
        })
        .catch((err) => {
            console.error(err);
            setIsLoading(false);
            setLoginStatus("Something Went Wrong");
        })
    }

    return (
        <div className={styles.login_form}>
            <div className={isLoading ? styles.loader_loading : styles.loader} />
            <div ref={loginContent}>
                <img className={styles.logo} src='/logo.png' alt='Lif Logo' />
                <h1 className={styles.title}>Login With Lif</h1>
                <form onSubmit={(event) => handle_login(event)} ref={loginFormRef} className={styles.form}>
                    <input required={true} name='username' placeholder='Username' />
                    <input type='password' required={true} name='password' placeholder='Password' />
                    <button type='submit'>Login</button>
                </form>
                <p className={styles.login_status}>{loginStatus}</p>
                <Link className={styles.link} href='/account_recovery'>Forgot Password</Link>
            </div>
        </div>
    )
}