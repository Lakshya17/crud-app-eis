import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";


const ProtectedRoute = ({ children }) => {
    const user = useSelector((state) => state.auth.isLogin)
    let location = useLocation();

    if(!user){
        return <Navigate to={'/login'} state={{from: location}} replace/>
    }
    return children
}

export default ProtectedRoute;