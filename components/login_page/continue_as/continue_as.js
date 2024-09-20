'use client'
import styles from './continue_as.module.css';
import { useRouter } from 'next/navigation';

export default function ContinueAs({ username, redirect_url }) {

    // Create router instance
    const router = useRouter();

    function handle_log_out() {
        window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout?redirect=https://my.lifplatforms.com/login`;
    }

    function handle_login() {
        if (redirect_url) {
            window.location.href = redirect_url;
        } else {
            router.push('/');
        }
    }

    return (
        <div className={styles.continue_panel}>
            <img src={`${process.env.NEXT_PUBLIC_AUTH_URL}/profile/get_avatar/${username}.png`} />
            <h1>Continue As <br/> {username}</h1>
            <button onClick={handle_login} className={styles.continue_button}>Continue</button>
            <button onClick={handle_log_out} className={styles.log_out_button}>Use Other Account</button>
        </div>
    );
}