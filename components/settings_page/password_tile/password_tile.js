'use client'

import { useRef } from 'react';
import styles from './password_tile.module.css';
import Cookies from 'js-cookie';

export default function PasswordTile() {
    const update_button = useRef();
    const current_password_input = useRef();
    const new_password_input = useRef();
    
    async function handle_password_update() {
        // Get client auth info
        const username = Cookies.get("LIF_USERNAME");

        // Update "update" button
        update_button.current.innerHTML = "Updating...";

        // Get password data
        const old_password = current_password_input.current.value;
        const new_password = new_password_input.current.value;

        // Prepare data for server request
        const formData = new FormData();
        formData.append('username', username);
        formData.append('current_password', old_password);
        formData.append('new_password', new_password);

        // Make server request
        fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/account/update_password`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                update_button.current.innerHTML = "Updated!";
            } else {
                throw new Error(response.text());
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <div className={styles.tile}>
             <div>
                <h1>Current Password</h1>
                <input ref={current_password_input} placeholder="Password" type="password" />
            </div>
            <div>
                <h1>New Password</h1>
                <input ref={new_password_input} placeholder="Password" type="password" />
            </div>
            <button type='button' ref={update_button} onClick={handle_password_update}>Update</button>
        </div>
    )
}