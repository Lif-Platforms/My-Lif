"use client"

import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import Qrcode from 'qrcode';
import styles from './2fa_popup.module.css';

export default function TwoFaPopup({ url }) {
    const contentRef = useRef();

    useEffect(() => {
        Qrcode.toCanvas(contentRef.current, url);
        return;
        const username = Cookies.get("LIF_USERNAME");
        const token = Cookies.get("LIF_TOKEN");

        fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/account/v1/2fa-setup`, {
            method: "GET",
            headers: {
                username: username,
                token: token
            },
        })
        .then((response) => {
            if (response.ok) {
                return response.text();
            }
        })
        .then((data) => {
            setIsLoading(false);
            console.log(data)
            setTimeout(() => {
                Qrcode.toCanvas(contentRef.current, data);
            }, 1);
        })
    }, []);

    return (
        <div className={styles.popup}>
            <h1>2FA Setup</h1>
            <p>Scan this QR code using your authenticator app of choice.</p>
            <canvas ref={contentRef} />
        </div>
    )
}