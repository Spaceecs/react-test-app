import {NavLink} from "react-router-dom";
import "./NavBar.styles.css"

export default function NavBar(){
    return(
        <nav className={'nav'}>
            <NavLink to={"/user"} className={({isActive}) => isActive ? 'active-link' : 'link'}>Users</NavLink>
            <NavLink to={"/edit_user"} className={({isActive}) => isActive ? 'active-link' : 'link'}>Edit User</NavLink>
        </nav>
    )
}