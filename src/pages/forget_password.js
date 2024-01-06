import '../css/account_recovery.css';
import Lif_Logo from '../assets/Lif_Logo.png';
import { useEffect, useRef, useState } from 'react';
import '../css/checkmark.css';
import '../css/spinners.css';
import { useNavigate } from 'react-router-dom';
import { connect } from './account_recovery';

function UserForm() {
    // Determines the page of the user form to render
    const [page, setPage] = useState('loading');

    // Store if the UI is loading
    const [isLoading, setIsLoading] = useState(false);

    // Hold component refs
    const statusText = useRef();
    const recoveryCode = useRef();
    const form = useRef(null);
    const loader = useRef(null);
    const nextButton = useRef();
    const passwordEntry1 = useRef();
    const passwordEntry2 = useRef();

    // Update UI based on loading status
    useEffect(() => {
        // Check if form and loader UI elements exist
        if (form.current !== null && loader.current !== null) {
            if (isLoading) {
                loader.current.className = "loader-active";
                form.current.style.opacity = 0.5;
    
            } else {
                loader.current.className = "loader";
                form.current.style.opacity = 1;
            }
        } 
    }, [isLoading]);

    // Create navigation instance
    const navigate = useNavigate();

    // Connect to recovery service
    // Listen for socket events
    useEffect(() => {
        // Listen for connection success event
        window.addEventListener('connectionEstablished', () => {
            console.log(`WebSocket connection established`);

            setPage('home');
        });

        // Listen for connection errors
        window.addEventListener('connectionFailed', () => {
            console.log(`WebSocket connection failed`);

            setPage('error');
        });

        // Close connection when component unmounts
        return () => {
            const closeEvent = new CustomEvent('closeConnection');
            window.dispatchEvent(closeEvent);
        }
    }, []);

    async function handle_email_send() {
        setIsLoading(true);
        console.log('Sending email...');
        
        // Get email
        const email = document.getElementById('email-entry').value; 

        // Send email to auth server
        const status = await connect.send_email(email);
        console.log('Email sending result:', status);

        // Check email send status
        if (status === "OK") {
            // Clear status text
            statusText.current.innerHTML = "";

            setIsLoading(false);

            // Navigate to stage 2
            setPage("stage_2");

        } else if (status === "BAD_EMAIL") {
            setIsLoading(false);
            statusText.current.innerHTML = "Sorry, the email you provided does not match a Lif Account.";

        } else {
            setIsLoading(false);
            statusText.current.innerHTML = "Something went wrong! Please try again.";
        }
    }

    async function handle_code_send() {
        setIsLoading(true);
        console.log('Sending code...');

        // Get code
        const code = recoveryCode.current.value;

        // Send code to auth server
        const status = await connect.send_code(code);
        console.log('Code sending result:', status);

        // Check code send status
        if (status === "OK") {
            // Clear status text
            statusText.current.innerHTML = "";

            setIsLoading(false);

            // Navigate to stage 3
            setPage("stage_3");

        } else if (status === "BAD_CODE") {
            setIsLoading(false);
            statusText.current.innerHTML = "Sorry, the code you provided is not valid. Please try again.";

        } else {
            setIsLoading(false);
            statusText.current.innerHTML = "Something went wrong! Please try again.";
        }
    }

    async function handle_password_update() {
        setIsLoading(true);
        console.log('Sending password...');

        // Get both passwords
        const password1 = passwordEntry1.current.value;
        const password2 = passwordEntry2.current.value;

        // Check if both passwords match
        if (password1 !== password2) {
            setIsLoading(false);
            statusText.current.innerHTML = "Passwords you provided do not match. Please ensure both passwords match.";

            return;
        }

        // Send password to auth server
        const status = await connect.send_password(password1);
        console.log('Password sending result:', status);

        // Check password send status
        if (status === "OK") {
            // Clear status text
            statusText.current.innerHTML = "";

            setIsLoading(false);

            // Navigate to complete page
            setPage("complete");

        } else {
            setIsLoading(false);
            statusText.current.innerHTML = "Something went wrong! Please try again.";
        }
    }

    if (page === 'loading') {
        return(
            <div className='account-recovery-container'>
                <img src={Lif_Logo} alt='Lif Logo' className='lif-logo' />
                <h1>One Moment Please</h1>
                <div className="lds-dual-ring"></div>
            </div>
        );
    } else if (page === 'error') {
        return(
            <div className='account-recovery-container'>
                <img src={Lif_Logo} alt='Lif Logo' className='lif-logo' />
                <h1>Something Went Wrong</h1>
                <p>Please try again later.</p>
            </div>
        );
    } else if (page === 'home') {
        return(
            <div className='account-recovery-container'>
                <img src={Lif_Logo} alt='Lif Logo' className='lif-logo' />
                <h1>Lost Your Password? <br />Lets Fix That</h1>
                <button type='button' onClick={() => setPage('stage_1')}>Next</button>
            </div>
        );
    } else if (page === 'stage_1') {
        return(
            <div className='account-recovery-container'>
                <span ref={loader} className='loader' />
                <div ref={form}>
                    <img src={Lif_Logo} alt='Lif Logo' className='lif-logo' />
                    <h1>Enter Your Email</h1>
                    <p>Enter the email associated with your Lif Account. We need this to send you an account recovery email.</p>
                    <input type='email' placeholder='Email' id='email-entry' className='email-entry' />
                    <button type='button' ref={nextButton} onClick={() => handle_email_send()}>Next</button>
                    <span className='status-text' ref={statusText} />
                </div>
            </div>
        );
    } else if (page === 'stage_2') {
        return(
            <div className='account-recovery-container'>
                <span ref={loader} className='loader' />
                <div ref={form}>
                    <img src={Lif_Logo} alt='Lif Logo' className='lif-logo' />
                    <h1>Check Your Inbox</h1>
                    <p>We sent a 5 digit code to your email. Please enter it below.</p>
                    <form id="code-entry-form" className='code-entry-form'>
                        <input type="code" pattern="[0-9]+" maxLength="5" size="1" placeholder='12345' ref={recoveryCode} required />
                    </form>
                    <button type='button' onClick={() => handle_code_send()}>Next</button>
                    <span className='status-text' ref={statusText} />
                </div>
            </div>
        );
    } else if (page === 'stage_3') {
        return(
            <div className='account-recovery-container'>
                <span ref={loader} className='loader' />
                <div ref={form}>
                    <img src={Lif_Logo} alt='Lif Logo' className='lif-logo' />
                    <h1>Choose Your New Password</h1>
                    <p>Choose the new password you will use to log into your Lif Account.</p>
                    <input type='password' placeholder='Password' ref={passwordEntry1} className='password-entry' />
                    <input type='password' placeholder=' Confirm Password' ref={passwordEntry2} className='password-entry' />
                    <button type='button' onClick={() => handle_password_update()}>Next</button>
                    <span className='status-text' ref={statusText} />
                </div>
            </div>
        );
    } else if (page === 'complete') {
        return(
            <div className='account-recovery-container'>
                <div ref={form}>
                    <img src={Lif_Logo} alt='Lif Logo' className='lif-logo' />
                    <h1>All Set!</h1>
                    <p>Use your new password to log into your Lif Account. Try to remember it this time!</p>
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                    <button type='button' onClick={() => navigate('/')}>Done</button>
                </div>
            </div>
        );
    }
}

function ForgetPassword() {
    return(
        <div className="forget-password-page">
            <UserForm />
        </div>
    );
}

export default ForgetPassword;