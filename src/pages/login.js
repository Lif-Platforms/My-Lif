import { useEffect, useRef, useState } from "react";
import Logo from "../assets/Lif_Logo.png"
import '../css/login.css';
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import stop from "../assets/login/stop.png";

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
    const [loginState, setLoginState] = useState("Login");

    // Get redirect url parameter
    const [searchParams] = useSearchParams();
    const redirect_value = searchParams.get('redirect');

    useEffect(() => {
        if (redirect_value) {
            const parsedUrl = new URL(redirect_value);
                const tld = parsedUrl.hostname.split('.').slice(-2).join('.'); 
                
                if (tld !== "lifplatforms.com") {
                    setLoginState("Dangerous_Redirect");
                }
        }        
    }, [redirect_value]);
    


    useEffect(() => {
        if (loginState === "Login") {
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
        }
    }, [isLoading, loginState])

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

            // Check for service redirect
            if (redirect_value) {
                window.location.href = redirect_value;
            } else {
                navigate('/');
            }   
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
    if (loginState === "Login") {
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
        );
    } else if (loginState === "Dangerous_Redirect") {
        return(
            <div className="LoginPage">
                <div className="login-container">
                    <img src={stop} />
                    <h1>Untrusted Link</h1>
                    <p>The link you provided does not redirect to lifplatforms.com or any Lif Platforms sub-domains. Please ensure your link is from a trusted source.</p>
                </div>
            </div>
        )
    }
    
}

export default Login;