import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/create account.css";
import LifLogo from "../assets/Lif_Logo.png";

function CreateAccount() {
    const [accountState, setAccountState] = useState('welcome');
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const unsavedChangesRef = useRef(unsavedChanges);
    const [accountData, setAccountData] = useState({username: null, email: null, password: null});

    useEffect(() => {
        // Update the ref whenever unsavedChanges changes
        unsavedChangesRef.current = unsavedChanges;
      }, [unsavedChanges]);

    useEffect(() => {
        console.log("Adding beforeunload event listener");
        window.addEventListener('beforeunload', confirmExit);
      
        return () => {
          console.log("Removing beforeunload event listener");
          window.removeEventListener('beforeunload', confirmExit);
        };
      }, []);

    // Function to display the confirmation message
    const confirmExit = (e) => {
        console.log(unsavedChangesRef.current);
        if (unsavedChangesRef.current) {
            e.preventDefault();
            e.returnValue = 'Your Changes Will Not Be Saved!'; // Required for some browsers
        }
    };

    useEffect(() => {
        console.log(accountData);
    }, [accountData]);

    function handle_navigate(info_type, element_id, nav_page) {
        // Get username
        const info = document.getElementById(element_id).value; 

        // Update button
        document.getElementById("submit-button").innerHTML = "Loading...";

        // Check if username is already in use
        fetch(`${process.env.REACT_APP_AUTH_URL}/check_account_info_usage/${info_type}/${info}`)
            .then(response => {
                if (response.ok) {
                return response.json(); // Convert response to JSON
                } else {
                    return response.json().then(json => { throw json; });
                }
            })
            .then(data => {
                // Work with the data
                console.log(data);

                console.log(info_type);
                
                // Navigate to next page if status was ok
                if (data.Status === "Ok") {
                    document.getElementById("submit-button").innerHTML = "Next";
                    document.getElementById(element_id).value = ""; // Reset the value of the user input
                    document.getElementById('account-status').innerHTML = "";

                    // Create a clone of the 'accountData' useState and update its info
                    const updatedAccountData = { ...accountData };
                    updatedAccountData[info_type] = info;

                    console.log(updatedAccountData);

                    // Save account info for later
                    setAccountData(updatedAccountData);

                    setAccountState(nav_page);
                }
            })
            .catch(error => {
                // Handle any errors
                console.error(error);

                // Update account status for user
                document.getElementById('account-status').innerHTML = error.detail;
                document.getElementById("submit-button").innerHTML = "Next";
        });
    }

    function handle_welcome_navigate() {
        setUnsavedChanges(true);
        setAccountState("select_username");
    }

    function handle_password_add() {
        // Get both passwords from user input
        const password_1 = document.getElementById("password").value; 
        const password_2 = document.getElementById("confirm-password").value; 

        // Update submit button
        document.getElementById("submit-button").innerHTML = "Loading...";

        // Check if the passwords match
        if (password_1 === password_2) {
            // Create a clone of the 'accountData' useState and update its info
            const updatedAccountData = { ...accountData };
            updatedAccountData["password"] = password_1;

            // Save account info for later
            setAccountData(updatedAccountData);

            // Update submit button
            document.getElementById("submit-button").innerHTML = "Create Account";

            // Update account status
            document.getElementById('account-status').innerHTML = "";

            setAccountState('create_account');

        } else {
            // Update account status
            document.getElementById('account-status').innerHTML = "Passwords Don't Match!";

            // Update submit button
            document.getElementById("submit-button").innerHTML = "Next";
        }
    }

    function create_account() {
        // Update submit button
        document.getElementById("submit-button").innerHTML = "Creating...";

        fetch(`${process.env.REACT_APP_AUTH_URL}/create_lif_account`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(accountData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (data.Status === "Ok") {
                // Update submit button
                document.getElementById("submit-button").innerHTML = "Done";

                // Update account status
                document.getElementById('account-status').innerHTML = "";
                
                setUnsavedChanges(false);
                setAccountState('account_created');
            }
        })
        .catch(error => {
            console.error('Error:', error);

            // Update submit button
            document.getElementById("submit-button").innerHTML = "Create Account";

            // Update account status
            document.getElementById('account-status').innerHTML = error.detail;
        });
    }

    // Create navigation instance
    const navigate = useNavigate()

    if (accountState === "welcome") {
        return ( 
            <div className="create-account-page">
                <div className="content-container">
                    <div className="welcome-section">
                        <img className="lif-logo" src={LifLogo} alt="Lif Logo" />
                        <h1>Welcome To Lif!</h1>
                        <p>Your Social Starts Here</p>
                        <button onClick={() => handle_welcome_navigate()}>Lets Go!</button>
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
                        <button id="submit-button" onClick={() => handle_navigate("username", "username", "add_email")}>Next</button>
                        <span id="account-status" className="account-status" />
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
                        <button id="submit-button" onClick={() => handle_navigate("email", "email", "add_password")}>Next</button>
                        <span id="account-status" className="account-status" />
                    </div>
                </div>
            </div>
        );
    } else if (accountState === "add_password") {
        return(
            <div className="create-account-page">
                <div className="content-container">
                    <div className="enter-password">
                        <h1>Choose a Password</h1>
                        <p>Your password is how you will log into your Lif Account. Choose one you will remember.</p>
                        <input type="password" placeholder="Password" id="password" />
                        <input type="password" placeholder="Confirm Password" id="confirm-password" />
                        <button id="submit-button" onClick={() => handle_password_add()}>Next</button>
                        <span id="account-status" className="account-status" />
                    </div>
                </div>
            </div>
        );
    } else if (accountState === "create_account") {
        return(
            <div className="create-account-page">
                <div className="content-container">
                    <div className="new-account">
                        <h1>Your Account is Ready!</h1>
                        <p>Press the "Create Account" button to jump into your social.</p>
                        <button id="submit-button" onClick={() => create_account()}>Create Account</button>
                        <span id="account-status" className="account-status" />
                    </div>
                    <span className="disclaimer">By clicking "Create Account" you agree to be bound by the <a href="https://lifplatforms.com/terms%20of%20service.html" target="_blank">Terms of Service</a> and <a href="https://lifplatforms.com/privacy%20policy.html" target="_blank">Privacy Policy</a>.</span>
                </div>
            </div>
        );
    } else if (accountState === "account_created") {
        return(
            <div className="create-account-page">
                <div className="content-container">
                    <div className="new-account">
                        <h1>Your In!</h1>
                        <p>You are now ready to dive into the social world with your Lif Account.</p>
                        <button id="submit-button" onClick={() => navigate("/")}>Done</button>
                        <span id="account-status" className="account-status" />
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateAccount;