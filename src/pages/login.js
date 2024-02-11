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
    const loginData = useRef();

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

        // Logs in the user with the lif auth server
        fetch(`${process.env.REACT_APP_AUTH_URL}/lif_login`, {
            method: "POST",
            body: new FormData(loginData.current)
        })
        .then(response => {
            if (response.status === 200) {
                return response.json(); // Convert response to JSON
            } else {
                let exception = new Error('Request failed with status code: ' + response.status);
                exception.status = response.status;
                throw exception;


            }
        })
        .then(data => {
            // Work with the data
            console.log(data);
            
            document.cookie = "LIF_TOKEN=" + data.token;
            document.cookie = "LIF_USERNAME=" + usernameInput.current.value;

            navigate('/');
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
            setIsLoading(false);

            if (error.status === 401) {
                loginStatus.current.innerHTML = "Incorrect Username or Password";

            } else {
                loginStatus.current.innerHTML = "Something Went Wrong!"; 
            }    
        });
    }   

    return(
        <div className="LoginPage">
            <div className="login-container">
                <span ref={loader} className="loader" />
                <div ref={loginForm}>
                    <img src={Logo} alt="Lif-Logo" />
                    <h1>Login With Lif</h1>
                    <form ref={loginData}>
                        <input type="Username" name="username" ref={usernameInput} placeholder="Username" />
                        <br />
                        <input type="Password" name="password" ref={passwordInput} placeholder="Password"/>
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