import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout as authLogout, currentSession } from "../redux/Slice/authSlice";
import { Box, useToast } from "@chakra-ui/react";

const Header = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.auth.isLogin);
    const toast = useToast();

    const logoutHandler = (e) => {
        e.preventDefault();
        localStorage.removeItem('isLogin')
        dispatch(authLogout())
        dispatch(currentSession(null))
        navigate('/login')
        toast({
            title: 'Logged Out Successfully',
            status: 'success',
            duration: 1000
        })
    }

    return(
        <>
            <Box className="bg-white grow basis-full self-baseline" boxShadow='base'>    
                <div className="container m-auto flex justify-between items-center py-5">
                    <h2 className="text-2xl font-bold text-center">
                        <Link to={'/'}>CRUD Demo Project</Link>    
                    </h2>
                    <div className="">
                        <nav className="flex gap-5">
                            {
                                !authStatus && <>
                                    <Link to={'/login'}>Login</Link>
                                    <Link to={'/signup'}>Sign Up</Link>    
                                </>
                            }
                            {
                                authStatus &&
                                <>
                                    <Link to={'/dashboard'}>Dashboard</Link>
                                    <Link onClick={logoutHandler}>Logout</Link>
                                </> 
                            }
                        </nav>
                    </div>
                </div>
            </Box>
        </>
    )
}

export default Header;