import { useEffect, useRef, useState } from "react";
import Logo from "../assets/Lif_Logo.png"
import '../css/login.css';
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate(); 

    const loader = useRef();
    const loginForm = useRef();
    const usernameInput = useRef();
    const passwordInput = useRef();
    const loginButton = useRef();
    const loginStatus = useRef();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isLoading) {
            loader.current.className = "loader-active";
            loginForm.current.style.opacity = 0.5;
            usernameInput.current.disabled = true;
            passwordInput.current.disabled = true;
            loginButton.current.disabled = true;

        } else {
            loader.current.className = "loader";
            loginForm.current.style.opacity = 1;
            usernameInput.current.disabled = false;
            passwordInput.current.disabled = false;
            loginButton.current.disabled = false;
        }   
    }, [isLoading])

    // Function for handling the login process
    async function handle_login() {
        setIsLoading(true);

        // Get username and password values
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;

        // Logs in the user with the lif auth server
        fetch(`${process.env.REACT_APP_AUTH_URL}/login/${username}/${password}`)
        .then(response => {
            if (response.ok) {
            return response.json(); // Convert response to JSON
            } else {
            throw new Error('Request failed with status code: ' + response.status);
            }
        })
        .then(data => {
            // Work with the data
            console.log(data);
            
            if (data.Status === "Successful") {
                document.cookie = "LIF_TOKEN=" + data.Token;
                document.cookie = "LIF_USERNAME=" + username;

                navigate('/');
            } else {
                loginStatus.current.innerHTML = "Incorrect Username or Password";
                setIsLoading(false);
            }
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
            setIsLoading(false);
            loginStatus.current.innerHTML = "Something Went Wrong!";
        });
    }   

    return(
        <div className="LoginPage">
            <div className="login-container">
                <span ref={loader} className="loader" />
                <div ref={loginForm}>
                    <img src={Logo} alt="Lif-Logo" />
                    <h1>Login With Lif</h1>
                    <form>
                        <input type="Username" ref={usernameInput} placeholder="Username" />
                        <br />
                        <input type="Password" ref={passwordInput} placeholder="Password"/>
                        <br />
                        <button type="button" ref={loginButton} onClick={handle_login}>Login</button>
                    </form>
                    <br />
                    <span ref={loginStatus} className="login-status"></span>
                    <Link to="/account_recovery">Forgot Password</Link>  
                </div>
                
            </div>
            <div className="create-account">
                <p>Don't have an account? <Link to="/create_account">Create One!</Link></p>
            </div>
        </div>
    )
}

export default Login;