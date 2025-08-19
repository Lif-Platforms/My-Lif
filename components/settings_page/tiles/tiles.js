import Tile from '../tile/tile';
import styles from './tiles.module.css';
import ProfileTile from '../profile_tile/profile_tile';
import BioInfoTile from '../bio_info_tile/bio_info_tile';
import PasswordTile from '../password_tile/password_tile';
import EmailTile from '../email_tile/email_tile';
import LogOutEverywhere from '../log_out_everywhere/log_out_everywhere';
import TwoFaTile from '../2fa_tile/2fa_tile';

export default function Tiles({ page }) {
    // Define tiles that will be rendered base on page
    const personalization_tiles = [
        {
            title: "Profile",
            description: "Change how people see you by choosing an avatar and banner.",
            component: <ProfileTile />,
            id: 1
        },
        {
            title: "Bio/Info",
            description: "Show who you are by choosing a bio and pronouns.",
            component: <BioInfoTile />,
            id: 2
        }
    ];
    const security_tiles = [
        {
            title: "Password",
            description: "Change the password you use to log into this account.",
            component: <PasswordTile />,
            id: 3
        },
        {
            title: "Email",
            description: "Change the email associated with this account.",
            component: <EmailTile />,
            id: 4
        },
        {
            title: "2-Factor Authentication",
            description: "Enable 2FA on your Lif Account.",
            component: <TwoFaTile />,
            id: 5
        },
        {
            title: "Log Out Everywhere",
            description: "Log out of your Lif Account on all your devices.",
            component: <LogOutEverywhere />,
            id: 6
        }
    ];

    return (
        <div className={styles.tiles}>
            {page === "personalization" ? (
                personalization_tiles.map((tile) => (
                    <Tile 
                        title={tile.title}
                        description={tile.description}
                        component={tile.component}
                        key={tile.id}
                    />
                ))
            ) : page === "security" ? (
                security_tiles.map((tile) => (
                    <Tile
                        title={tile.title}
                        description={tile.description}
                        component={tile.component}
                        key={tile.id}
                    />
                ))
            ) : null}
        </div>
    )
}