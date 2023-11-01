import '../css/account_recovery.css';
import Lif_Logo from '../assets/Lif_Logo.png';
import { useState } from 'react';
import '../css/checkmark.css';
import '../css/spinners.css';
import { useNavigate } from 'react-router-dom';

function UserForm() {
    // Determines the page of the user form to render
    const [page, setPage] = useState('loading');

    // Create navigation instance
    const navigate = useNavigate();

    if (page === 'loading') {
        return(
            <div className='account-recovery-container'>
                <img src={Lif_Logo} alt='Lif Logo' className='lif-logo' />
                <h1>One Moment Please</h1>
                <div class="lds-dual-ring"></div>
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
                <img src={Lif_Logo} alt='Lif Logo' className='lif-logo' />
                <h1>Enter Your Email</h1>
                <p>Enter the email associated with your Lif Account. We need this to send you an account recovery email.</p>
                <input type='email' placeholder='Email' id='email-entry' className='email-entry' />
                <button type='button' onClick={() => setPage('stage_2')}>Next</button>
            </div>
        );
    } else if (page === 'stage_2') {
        return(
            <div className='account-recovery-container'>
                <img src={Lif_Logo} alt='Lif Logo' className='lif-logo' />
                <h1>Check Your Inbox</h1>
                <p>We sent a 5 digit code to your email. Please enter it below.</p>
                <form id="code-entry-form" className='code-entry-form'>
                    <input type="text" pattern="\d" maxlength="1" size="1" placeholder='1' required />
                    <input type="text" pattern="\d" maxlength="1" size="1" placeholder='2' required />
                    <input type="text" pattern="\d" maxlength="1" size="1" placeholder='3' required />
                    <input type="text" pattern="\d" maxlength="1" size="1" placeholder='4' required />
                    <input type="text" pattern="\d" maxlength="1" size="1" placeholder='5' required />
                </form>
                <button type='button' onClick={() => setPage('stage_3')}>Next</button>
            </div>
        );
    } else if (page === 'stage_3') {
        return(
            <div className='account-recovery-container'>
                <img src={Lif_Logo} alt='Lif Logo' className='lif-logo' />
                <h1>Choose Your New Password</h1>
                <p>Choose the new password you will use to log into your Lif Account.</p>
                <input type='password' placeholder='Password' id='password-entry-1' className='password-entry' />
                <input type='password' placeholder=' Confirm Password' id='password-entry-2' className='password-entry' />
                <button type='button' onClick={() => setPage('complete')}>Next</button>
            </div>
        );
    } else if (page === 'complete') {
        return(
            <div className='account-recovery-container'>
                <img src={Lif_Logo} alt='Lif Logo' className='lif-logo' />
                <h1>All Set!</h1>
                <p>Use your new password to log into your Lif Account. Try to remember it this time!</p>
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
                <button type='button' onClick={() => navigate('/')}>Done</button>
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