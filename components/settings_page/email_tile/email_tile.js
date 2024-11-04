'use client'

import { useRef } from "react";
import styles from './email_tile.module.css';
import Cookies from "js-cookie";

export default function EmailTile() {
    const emailEntryRef = useRef();
    const passwordEntryRef = useRef();
    const emailUpdateButton = useRef();
    const emailUpdateStatus = useRef();

    async function handle_email_update() {
        // Get username, email and password
        const email = emailEntryRef.current.value;
        const password = passwordEntryRef.current.value;
        const username = Cookies.get("LIF_USERNAME");

        // Update button status
        emailUpdateButton.current.innerHTML = "Updating...";
        emailUpdateStatus.current.classList.remove(styles.show);

        // Create form data
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);

        // Update email with Auth Server
        fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/account/update_email`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Update button status
                emailUpdateButton.current.innerHTML = "Updated!";
                
                // Clear email and password entries
                emailEntryRef.current.value = "";
                passwordEntryRef.current.value = "";

                // Reset update button
                setTimeout(() => {
                    emailUpdateButton.current.innerHTML = "Update";
                }, 3000);

            } else if (response.status === 400) {
                throw new Error("Email is Invalid!");

            } else if (response.status === 409) {
                throw new Error("Email Already In Use!");

            } else if (response.status === 401) {
                throw new Error("Invalid Password!");

            } else {
                throw new Error("Something Went Wrong!");
            }
        })
        .catch(error => {
            console.error(error);
            emailUpdateButton.current.innerHTML = "Update";
            emailUpdateStatus.current.innerHTML = error.message;
            emailUpdateStatus.current.classList.add(styles.show);
        })
    }

    return (
        <div className={styles.tile}>
            <div id="email_entry_section">
                <h1>New Email</h1>
                <input placeholder="Email" type="email" ref={emailEntryRef} />
            </div>
            <div id="email_password_entry_section">
                <h1>Password</h1>
                <input placeholder="Password" type="password" ref={passwordEntryRef} />
            </div>
            <button onClick={() => handle_email_update()} ref={emailUpdateButton}>Update</button>
            <span ref={emailUpdateStatus} className={styles.email_status} />
        </div>
    )
}