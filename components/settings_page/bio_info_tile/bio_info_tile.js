'use client'

import { useEffect, useRef, useState } from 'react';
import styles from './bio_info_tile.module.css';
import Cookies from 'js-cookie';

export default function BioInfoTile() {
    const [isDisabled, setIsDisabled] = useState(true);
    const bioEntry = useRef();
    const pronounsEntry = useRef();
    const save_button = useRef();

    // Get username from cookies
    const username = Cookies.get('LIF_USERNAME');

    // Fetch bio and pronouns info
    useEffect(() => {
        const fetchBio = fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/profile/get_bio/${username}`)
            .then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error("Request failed with status code: " + response.status);
                }
            })
            .then((text) => {
                // Remove quotes from text
                const unquotedText = text.replace(/['"]/g, '');
                // Ensure newline characters are preserved
                const formattedText = unquotedText.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
                bioEntry.current.value = formattedText;
            });
    
        const fetchPronouns = fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/profile/get_pronouns/${username}`)
            .then((response) => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error("Request failed with status code: " + response.status);
                }
            })
            .then((text) => {
                const unquotedText = text.replace(/['"]/g, '');
                pronounsEntry.current.value = unquotedText;
            });
    
        Promise.all([fetchBio, fetchPronouns])
            .then(() => {
                setIsDisabled(false);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    async function handle_personalization_update() {
        // Update save button
        save_button.current.innerHTML = "Saving...";

        // Get client auth info
        const username = Cookies.get("LIF_USERNAME");
        const token = Cookies.get("LIF_TOKEN");

        // Get info to update
        const bio =  bioEntry.current.value; 
        const pronouns =  pronounsEntry.current.value; 

        // Format data for request
        const formData = new FormData();
        formData.append('username', username);
        formData.append('token', token);
        formData.append('bio', bio);
        formData.append('pronouns', pronouns);

        // Make request to auth server
        fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/account/update_info/personalization`, {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log("Data Updated!");
                save_button.current.innerHTML = "Saved!";
            } else {
                console.log(response);
            }
        })
    }

    return (
        <div className={styles.tile}>
            <form>
                <h1>Bio</h1>
                <textarea ref={bioEntry} disabled={isDisabled} maxLength={300} placeholder="Tell us about yourself..."></textarea>
            </form>
            <hr />
            <form>
                <h1>Pronouns</h1>
                <select ref={pronounsEntry} disabled={isDisabled}>
                    <option value="Prefer not to say">Prefer not to say</option>
                    <option value="he/him">he/him</option>
                    <option value="she/her">she/her</option>
                    <option value="they/them">they/them</option>
                </select>
            </form>
            <button ref={save_button} disabled={isDisabled} className="small-button" onClick={() => handle_personalization_update()}>Save</button>
        </div>
    )
}