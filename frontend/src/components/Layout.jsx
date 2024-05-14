import { Button, Container, Box, Heading } from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';


const Layout = () => {

    const authStatus = useSelector((state) => state.auth.isLogin)
    
    return(
        <>
            <Container maxW={'xl'} p={'5'} className="bg-white rounded my-5 flex align-center justify-center">
                <Box className="text-center">
                    <Heading fontSize={'2xl'} className="uppercase text-center mb-7">Welcome to CRUD Demo Project</Heading>
                    { 
                    authStatus ? (
                        <Link to={'/dashboard'}>
                            <Button border="1px" _hover={{ bg: "transparent", color: "#000" }} bg={'black'} color={'white'}>
                                Proceed to Dashboard
                            </Button>
                        </Link>    
                    ) : (
                        <Link to={'/login'}>
                            <Button border="1px" _hover={{ bg: "transparent", color: "#000" }} bg={'black'} color={'white'}>
                                Proceed to Login
                            </Button>
                        </Link>
                    )
                }
                </Box>
            </Container>
        </>
    )
}

export default Layout;