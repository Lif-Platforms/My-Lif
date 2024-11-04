'use client'

import Loader from "@/components/global/loader/loader";
import styles from './profile_upload_status.module.css';

export default function UploadStatus({uploadStatus}) {
    if (uploadStatus === "upload_avatar") {
        return(
            <div className={styles.upload_status}>
                <Loader />
                <p>Uploading Avatar...</p>
            </div>
        )
    } else if (uploadStatus === "upload_avatar_complete") {
        return(
            <div className={styles.upload_status}>
                <p style={{color: "green"}}>✔ Avatar Upload Complete!</p>
            </div>
        )
    } else if (uploadStatus === "upload_banner") {
        return(
            <div className={styles.upload_status}>
                <Loader />
                <p>Uploading Banner...</p>
            </div>
        )
    } else if (uploadStatus === "upload_banner_complete") {
        return(
            <div className={styles.upload_status}>
                <p style={{color: "green"}}>✔ Banner Upload Complete!</p>
            </div> 
        )   
    } else if (uploadStatus === "error") {
        return(
            <div className={styles.upload_status}>
                <p style={{color: "red"}}>❌ Something Went Wrong!</p>
            </div>
        )
    }
}