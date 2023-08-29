import { useState } from "react";
import "../css/create account.css";
import LifLogo from "../assets/Lif_Logo.png";

function CreateAccount() {
    const [accountState, setAccountState] = useState('welcome');

    if (accountState === "welcome") {
        return ( 
            <div className="create-account-page">
                <div className="content-container">
                    <div className="welcome-section">
                        <img src={LifLogo} alt="Lif Logo" />
                        <h1>Welcome To Lif!</h1>
                        <p>Your Social Starts Here</p>
                        <button onClick={() => setAccountState('select_username')}>Lets Go!</button>
                    </div>
                </div>
            </div>
         );
    } else if (accountState === "select_username") {
        return(
            <div className="create-account-page">
                <div className="content-container">
                    <div className="username-select">
                        <h1>Choose A Username</h1>
                        <p>Your username is one of the most important parts of your Lif Account. Its the name that others will see when they look at your profile. Choose wisely, they cannot be changed later.</p>
                        <input id="username" placeholder="Username" />
                        <br />
                        <button onClick={() => setAccountState('add_email')}>Next</button>
                    </div>
                </div>
            </div>
        );
    } else if (accountState === "add_email") {
        return(
            <div className="create-account-page">
                <div className="content-container">
                    <div className="enter-email">
                        <h1>Add Your Email</h1>
                        <p>Your email is crucial to your Lif account. It allows us to send you import emails, such as account recovery emails.</p>
                        <input id="email" placeholder="Email" />
                        <br />
                        <button onClick={() => setAccountState('create_password')}>Next</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateAccount;