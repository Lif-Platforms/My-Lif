"use client"

import { useState } from "react";
import Image from "next/image";
import styles from "./2fa_tile.module.css";
import Cookies from "js-cookie";
import TwoFaPopup from "../2fa_popup/2fa_popup";
import { usePopup } from "@/providers/settings_page/popup";

export default function TwoFaTile() {
    const [isLoading, setIsLoading] = useState(false);

    const { createPopup } = usePopup();

    function handle_enable() {
        setIsLoading(true);
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
            createPopup(<TwoFaPopup url={data} />);
        })
    }

    return (
        <div className={styles.tile}>
            <p>Enabling 2-Factor Authentication on your account adds and extra layer of security to prevent unauthorized access.</p>
            <button onClick={handle_enable} disabled={isLoading}>
                {isLoading ? (
                    <Image src="/loader2.svg" alt="loader" width={10} height={10} />
                ) : (
                    "Enable"
                )}
            </button>
        </div>
    )
}