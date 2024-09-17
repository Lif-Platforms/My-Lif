'use client'
import { useRef, useState } from 'react';
import styles from './login_form.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function LoginForm() {
    const loginFormRef = useRef();

    const [loginStatus, setLoginStatus] = useState("");

    const router = useRouter();

    function handle_login(event) {
        // Prevent form from refreshing the page
        event.preventDefault();

        // Get login form data
        const formData = new FormData(loginFormRef.current);

        // Make auth request
        fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/login`, {
            method: "POST",
            headers: {
                "set-auth-cookies": true
            },
            body: formData
        })
        .then((response) => {
            if (response.ok) {
                router.push("/");
            } else if (response.status === 401) {
                setLoginStatus("Incorrect username or password.");
            } else if (response.status === 403) {
                setLoginStatus("Account suspended. If you believe this was a mistake, contact Lif Support.");
            } else {
                throw new Error("Something Went Wrong");
            }
        })
        .catch((err) => {
            console.error(err);
            setLoginStatus("Something Went Wrong");
        })
    }

    return (
        <div className={styles.login_form}>
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
    )
}