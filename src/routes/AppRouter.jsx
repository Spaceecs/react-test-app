import {Navigate, Route, Routes} from "react-router-dom";
import User from "../pages/user/User"
import EditUser from "../pages/editUser/EditUser";

export default function AppRouter(){
    return(
        <Routes>
            <Route path="/" element={<Navigate to={"/user"} replace />}/>
            <Route path="/user" element={<User/>}/>
            <Route path="/edit_user" element={<EditUser/>}/>
            <Route path="*" element={<div> 404: Page not found </div>}/>
        </Routes>
    )
}