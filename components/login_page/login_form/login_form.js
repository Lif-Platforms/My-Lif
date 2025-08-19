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

    const [formState, setFormState] = useState("LOGIN");

    const twoFaCodeRef = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const router = useRouter(false);

    // Change opacity of login content based on is loading
    useEffect(() => {
        if (isLoading) {
            loginContent.current.style.opacity = "0.5";
        } else {
            loginContent.current.style.opacity = "1";
        }
    }, [isLoading]);

    function handle_login({ username, password, twoFaCode }) {
        setIsLoading(true);
        setLoginStatus("");

        const data = new FormData();
        data.append("username", username);
        data.append("password", password);
        if (twoFaCode) {
            data.append("two_fa_code", twoFaCode);
        }

        // Make auth request
        fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/v2/login`, {
            method: "POST",
            body: data
        })
        .then(async (response) => {
            const resData = await response.json();
            const username = data.get('username');

            if (response.ok) {
                const cookieOptions = process.env.NODE_ENV === "development"
                    ? {}
                    : { domain: ".lifplatforms.com" };

                Cookies.set("LIF_USERNAME", username, cookieOptions);
                Cookies.set("LIF_TOKEN", resData.token, cookieOptions);

                redirect_url ? window.location.href = redirect_url : router.push("/");
            } else {
                setIsLoading(false);
                if (response.status === 401) {
                    if (resData.errorCode === "2FA_REQUIRED") {
                        setFormState("2-FACTOR-AUTH");
                    } else if (resData.errorCode === "INVALID_2FA_CODE") {
                        setLoginStatus("Invalid code");
                    } else {
                        setLoginStatus("Incorrect username or password.");
                    }
                } else if (response.status === 403) {
                    setLoginStatus("Account suspended. Contact Lif Support.");
                } else {
                    setLoginStatus("Something Went Wrong");
                }
            }
        })
        .catch((err) => {
            setIsLoading(false);
            setLoginStatus("Something Went Wrong");
        });
    }

    function handle_credentials_submit(event) {
        event.preventDefault();
        handle_login({ username, password });
    }

    function handle_two_factor_code_submit(event) {
        event.preventDefault();
        if (twoFaCodeRef.current) {
            handle_login({
                username,
                password,
                twoFaCode: twoFaCodeRef.current.value
            });
        }
    }

    return (
        <div className={styles.login_form}>
            <div className={isLoading ? styles.loader_loading : styles.loader} />
            <div ref={loginContent}>
                <img className={styles.logo} src='/logo.png' alt='Lif Logo' />
                {formState === "LOGIN" ? (
                    <>
                        <h1 className={styles.title}>Login With Lif</h1>
                        <form onSubmit={(event) => handle_credentials_submit(event)} ref={loginFormRef} className={styles.form}>
                            <input
                                name='username'
                                required
                                placeholder='Username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <input
                                name='password'
                                type='password'
                                required
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type='submit'>Login</button>
                        </form>
                        <p className={styles.login_status}>{loginStatus}</p>
                        <Link className={styles.link} href='/account_recovery'>Forgot Password</Link>
                    </>
                ) : (
                    <>
                        <h1 className={styles.title}>2-Factor Authentication</h1>
                        <p className={styles.subTitle}>Open your authenticator app and enter the one-time code below.</p>
                        <form className={styles.form} onSubmit={(event) => handle_two_factor_code_submit(event)}>
                            <input 
                                ref={twoFaCodeRef} 
                                placeholder='Code...' 
                                maxLength={6} 
                                type='text'
                                inputMode='numeric'
                                pattern='[0-9]*'
                            />
                            <button type='submit'>Login</button>
                        </form>
                        <p className={styles.login_status}>{loginStatus}</p>
                    </>
                )}
            </div>
        </div>
    )
}