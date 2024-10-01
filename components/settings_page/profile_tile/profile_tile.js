'use client'

import { useRef, useState } from "react";
import styles from './profile_tile.module.css';
import Cookies from "js-cookie";
import UploadStatus from "../profile_upload_status/profile_upload_status";

export default function ProfileTile() {
    const avatarInputRef = useRef();
    const bannerInputRef = useRef();
    const [uploadStatus, setUploadStatus] = useState();

    async function handleAvatarUpload() {
        // Grab user avatar
        const file = avatarInputRef.current.files[0];

        // Grab client auth info
        const username = Cookies.get('LIF_USERNAME');
        const token = Cookies.get("LIF_TOKEN");

        // Set upload status
        setUploadStatus("upload_avatar");
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', username);
        formData.append('token', token);

        fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/account/update_avatar`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log('File uploaded successfully.');
                setUploadStatus("upload_avatar_complete");
            } else {
                console.error('An error occurred!');
            }
        })
        .catch(error => {
            console.error('An error occurred!', error);
            setUploadStatus("error");
        });

        // Reset upload status after 5 seconds
        setTimeout(() => {
            setUploadStatus(null);
        }, 5000);
    }

    async function handleBannerUpload() {
        // Grab user banner
        const file = bannerInputRef.current.files[0];

        // Grab client auth info
        const username = Cookies.get("LIF_USERNAME");
        const token = Cookies.get("LIF_TOKEN");

        // Set upload status
        setUploadStatus("upload_banner");
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', username);
        formData.append('token', token);

        fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/account/update_profile_banner`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log('File uploaded successfully.');
                setUploadStatus("upload_banner_complete");
            } else {
                console.error('An error occurred!');
            }
        })
        .catch(error => {
            console.error('An error occurred!', error);
            setUploadStatus("error");
        });

        // Reset upload status after 5 seconds
        setTimeout(() => {
            setUploadStatus(null);
        }, 5000);
    }

    return (
        <div className={styles.tile}>
            <form>
                <h1>Profile Photo</h1>
                <input id="avatarInput" accept="image/*" type="file" style={{ display: 'none' }} ref={avatarInputRef} onChange={handleAvatarUpload} />
                <button type="button" onClick={() => avatarInputRef.current.click()}>Choose</button>
            </form>
            <hr />
            <form>
                <h1>Profile Banner</h1>
                <input id="bannerInput" accept="image/*" type="file" style={{ display: 'none' }} ref={bannerInputRef} onChange={handleBannerUpload} />
                <button type="button" onClick={() => bannerInputRef.current.click()}>Choose</button>
            </form>
            <UploadStatus uploadStatus={uploadStatus} />
        </div>
    )
}