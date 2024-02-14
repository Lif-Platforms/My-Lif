import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { get_username, get_token } from "../scripts/get_cookie";
import "../css/settings.css";
import Loader from "./global components/loader";
import Cookies from "js-cookie";

function SideBar({ setState, page }) {
    const [username, setUsername] = useState(null);
    const pageNavigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await get_username();
                setUsername(result);

            } catch (error) {
                console.error("Error fetching username:", error);
            }
        }

        fetchData();
    }, []);

    if (username === null) {
        // You can render a loading indicator here if needed
        return <div>Loading...</div>;
    }

    function navigate(to_page) {
        // Get a reference to the parent <div>
        const parentDiv = document.getElementById('sidebar-buttons'); // Replace 'parentDiv' with the actual ID of your parent <div>
    
        // Iterate through child <div> elements
        const childDivs = parentDiv.querySelectorAll('div'); // You can adjust the selector as needed
        childDivs.forEach((div) => {
            // Check if the div has the class 'active' (replace with your desired class)
            if (div.classList.contains('active')) {
                // Remove the class
                div.classList.remove('active');
            }
        });
    
        // Add active class to selected option
        document.getElementById(to_page).classList.add("active");
    
        setState(to_page);

        pageNavigate(`/settings/${to_page}`);
    }

    function get_avatar_url() {
        // Generate a random number for dummy parameter to prevent caching
        const number = Math.floor(Math.random() * 9000000000) + 1000000000;

        return `${process.env.REACT_APP_AUTH_URL}/get_pfp/${username}.png?dummy=${number}`;
    }

    return (
    <div className="sidebar">
        <div className="sidebar-header">
            <img src={get_avatar_url()} alt={`Profile picture of ${username}`} className="user-avatar" />
            <h1>{username}</h1>
        </div>
        <div className="sidebar-buttons" id="sidebar-buttons">
            <button id="personalization" className={page === 'personalization' ? 'active' : ''} onClick={() => navigate('personalization')}>Personalization</button>
            <button id="security" className={page === 'security' ? 'active' : ''} onClick={() => navigate('security')}>Security</button>
        </div>
    </div>
    );
}

// Component for showing upload status of avatar and banner
function UploadStatus({uploadStatus}) {
    if (uploadStatus === "upload_avatar") {
        return(
            <div className="upload-status">
                <Loader />
                <p>Uploading Avatar...</p>
            </div>
        )
    } else if (uploadStatus === "upload_avatar_complete") {
        return(
            <div className="upload-status">
                <p style={{color: "green"}}>✔ Avatar Upload Complete!</p>
            </div>
        )
    } else if (uploadStatus === "upload_banner") {
        return(
            <div className="upload-status">
                <Loader />
                <p>Uploading Banner...</p>
            </div>
        )
    } else if (uploadStatus === "upload_banner_complete") {
        return(
            <div className="upload-status">
                <p style={{color: "green"}}>✔ Banner Upload Complete!</p>
            </div> 
        )   
    } else if (uploadStatus === "error") {
        return(
            <div className="upload-status">
                <p style={{color: "red"}}>❌ Something Went Wrong!</p>
            </div>
        )
    }
}

function SettingsPage({ state }) {
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    const [uploadStatus, setUploadStatus] = useState();

    async function handleAvatarUpload() {
        // Grab user avatar
        const file = avatarInputRef.current.files[0];

        // Grab client auth info
        const username = await get_username();
        const token = await get_token();

        // Set upload status
        setUploadStatus("upload_avatar");
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', username);
        formData.append('token', token);

        fetch(`${process.env.REACT_APP_AUTH_URL}/update_pfp`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log('File uploaded successfully.');
                setUploadStatus("upload_avatar_complete");
            } else {
                console.error('An error occurred!');
            }
        })
        .catch(error => {
            console.error('An error occurred!', error);
            setUploadStatus("error");
        });

        // Reset upload status after 5 seconds
        setTimeout(() => {
            setUploadStatus(null);
        }, 5000);
    }

    async function handleBannerUpload() {
        // Grab user banner
        const file = bannerInputRef.current.files[0];

        // Grab client auth info
        const username = await get_username();
        const token = await get_token();

        // Set upload status
        setUploadStatus("upload_banner");
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', username);
        formData.append('token', token);

        fetch(`${process.env.REACT_APP_AUTH_URL}/update_profile_banner`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log('File uploaded successfully.');
                setUploadStatus("upload_banner_complete");
            } else {
                console.error('An error occurred!');
            }
        })
        .catch(error => {
            console.error('An error occurred!', error);
            setUploadStatus("error");
        });

        // Reset upload status after 5 seconds
        setTimeout(() => {
            setUploadStatus(null);
        }, 5000);
    }

    async function handle_personalization_update() {
        // Update save button
        const save_button = document.getElementById('Personalization-update');
        save_button.innerHTML = "Saving...";

        // Get client auth info
        const username = await get_username();
        const token = await get_token();

        // Get info to update
        const bio =  document.getElementById('user_bio').value; 
        const pronouns =  document.getElementById('user_pronouns').value; 

        // Format data for request
        const formData = new FormData();
        formData.append('username', username);
        formData.append('token', token);
        formData.append('bio', bio);
        formData.append('pronouns', pronouns);

        // Make request to auth server
        fetch(`${process.env.REACT_APP_AUTH_URL}/update_account_info/personalization`, {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log("Data Updated!");
                save_button.innerHTML = "Saved!";
            } else {
                console.log(response);
            }
        })
    }

    // Update user bio upon page load
    useEffect(() => {
        async function get_bio() {
            const user_bio = document.getElementById('user_bio');
            const username = await get_username();

            fetch(`${process.env.REACT_APP_AUTH_URL}/get_user_bio/${username}`)
            .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.text(); // Read the response body as text
            })
            .then(data => {
                // Use the replace method to remove the quotes
                const insert_data = data.replace(/^"(.*)"$/, '$1');

                // Update user bio input
                user_bio.value = insert_data;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }

        if (state === "personalization") {
            get_bio();
        }
    }, [state])

    // Update user pronouns upon page load
    useEffect(() => {
        async function get_pronouns() {
            const user_pronouns = document.getElementById('user_pronouns');
            const username = await get_username();

            fetch(`${process.env.REACT_APP_AUTH_URL}/get_user_pronouns/${username}`)
            .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.text(); // Read the response body as text
            })
            .then(data => {
                // Use the replace method to remove the quotes
                const insert_data = data.replace(/^"(.*)"$/, '$1');

                // Update user bio input
                user_pronouns.value = insert_data;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }

        if (state === "personalization") {
            get_pronouns();
        }
    }, [state])

    async function handle_password_update() {
        // Get client auth info
        const username = await get_username();

        // Update status button
        const status_button = document.getElementById('password-update');
        status_button.innerHTML = "Updating...";

        // Get password data
        const old_password = document.getElementById('old-password-input').value;
        const new_password = document.getElementById('new-password-input').value;

        // Prepare data for server request
        const formData = new FormData();
        formData.append('username', username);
        formData.append('current_password', old_password);
        formData.append('new_password', new_password);

        // Make server request
        fetch(`${process.env.REACT_APP_AUTH_URL}/lif_password_update`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                status_button.innerHTML = "Updated!";
            } else {
                throw new Error(response.text());
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    if (state === "personalization") {
        return(
            <div className="settings">
                <h1 className="page-title">Personalization</h1>
                <div className="options">
                    <div className="options-header">
                        <h1>Avatar</h1>
                    </div>
                    <div>
                        <h1>Profile Photo</h1>
                        <input id="avatarInput" type="file" style={{ display: 'none' }} ref={avatarInputRef} onChange={() => handleAvatarUpload()} />
                        <button onClick={() => avatarInputRef.current.click()}>Choose</button>
                    </div>
                    <hr />
                    <div>
                        <h1>Profile Banner</h1>
                        <input id="bannerInput" type="file" style={{ display: 'none' }} ref={bannerInputRef} onChange={() => handleBannerUpload()} />
                        <button onClick={() => bannerInputRef.current.click()}>Choose</button>
                    </div>
                    <UploadStatus uploadStatus={uploadStatus} />
                </div>
                <div className="options">
                    <div className="options-header">
                        <h1>Bio/Info</h1>
                    </div>
                    <div>
                        <h1>Bio</h1>
                        <textarea placeholder="Tell us about yourself..." id="user_bio" />
                    </div>
                    <hr />
                    <div>
                        <h1>Pronouns</h1>
                        <select id="user_pronouns">
                            <option value="none">Other</option>
                            <option value="he/him">he/him</option>
                            <option value="she/her">she/her</option>
                            <option value="they/them">they/them</option>
                        </select>
                    </div>
                    <button className="small-button" onClick={() => handle_personalization_update()} id="Personalization-update">Save</button>
                </div>
            </div>
        )
    } else if (state === "security") {
        return(
            <div className="settings">
                <h1 className="page-title">Security</h1>
                <div className="options">
                    <div className="options-header">
                        <h1>Password</h1>
                    </div>
                    <div>
                        <h1>Current Password</h1>
                        <input placeholder="Password" type="password" id="old-password-input" />
                    </div>
                    <div>
                        <h1>New Password</h1>
                        <input placeholder="Password" type="password" id="new-password-input" />
                    </div>
                    <button className="small-button" onClick={() => handle_password_update()} id="password-update">Update</button>
                </div>
            </div>
        )
    }
}

function Settings() {
    const [pageState, setPageState] = useState('personalization');

    // Grab the section from the url
    const { section } = useParams();

    // Set the section based on the "section" variable in page url
    useEffect(() => {
        setPageState(section);
    }, [section]);

    const navigate = useNavigate();

    // Check if user is logged in before proceeding
    useEffect(() => {
        const username = Cookies.get("LIF_USERNAME");
        const token = Cookies.get("LIF_TOKEN");

        if (!username || !token) {
            navigate("/login");
        }
    }, [])

    return(
        <div className="settings-page">
            <SideBar setState={setPageState} page={pageState} />
            <SettingsPage state={pageState} /> 
        </div>
    )
}

export default Settings;