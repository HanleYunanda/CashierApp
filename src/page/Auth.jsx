import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function Auth() {

    const token = useSelector(state => state.auth.token);

    if(!token) {
        return <Navigate to="/login" replace />
    }

    return <Outlet/>
}

export default Auth;