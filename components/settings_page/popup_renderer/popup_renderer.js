"use client"

import styles from './popupRenderer.module.css';
import Image from 'next/image';
import { motion, AnimatePresence, scale } from "motion/react";

export default function PopupRenderer({ component, showPopup, setShowPopup }) {
    return (
        <AnimatePresence>
            {showPopup ? (
                <motion.div
                    className={styles.background}
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                    <motion.div
                        className={styles.container}
                        exit={{ scale: 0.5 }}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            bounce: 0.4,
                            duration: 0.6
                        }}
                    >
                        <div
                            className={styles.header}>
                            <Image
                                src="/settings/x.svg"
                                alt='close icon'
                                width={20}
                                height={20}
                                onClick={() => setShowPopup(false)}
                            />
                        </div>
                        {component}
                    </motion.div>
                </motion.div>
            ): null}
        </AnimatePresence>
    )
}