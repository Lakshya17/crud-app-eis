import { Button, Container, useToast, FormControl, FormErrorMessage, FormLabel, HStack, Heading, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login as authLogin, btnLoading, btnLoadingFalse, currentSession } from "../redux/Slice/authSlice";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resetEmail, setResetEmail] = useState('');

    const { isOpen, onOpen, onClose} = useDisclosure();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();
    const loading = useSelector((state) => state.auth.loading)
   
    const loginHandler = async (e) => {
        e.preventDefault();
        let result = await fetch('http://localhost:5000/login', {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        result = await result.json()
        if(result.status == 200){
            localStorage.setItem('isLogin', true)
            dispatch(authLogin())
            dispatch(currentSession(email))
            toast({
                title: result.message,
                status: 'success',
                duration: 2000,
                isClosable: true,
              })
            navigate('/dashboard')
        }else{
            toast({
                title: result.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
              })
        }
    }

    const forgetPasswordHandler = async (e) => {
        e.preventDefault();
        console.log('Forget password Submit')

        if(resetEmail){
            let result = await fetch(`http://localhost:5000/reset`, {
                method: 'POST',
                body: JSON.stringify({'email': resetEmail}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            result = await result.json()
            console.log(result)
            if(result.status == 200){
                dispatch(currentSession(resetEmail))
                navigate('/resetpassword')
            }else{
                toast({
                    title: result.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                })
            }
        }else{
            toast({
                title: "Please enter an Email",
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }

    const forgetPasswordEmailHandler = async (e) => {
        e.preventDefault();
        console.log('Email Reset Clicked')
        dispatch(btnLoading())
        if(resetEmail){
            let result = await fetch('http://localhost:5000/resetEmail', {
                method: 'POST',
                body: JSON.stringify({'email': resetEmail}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            result = await result.json()
            console.log(result)
            if(result.status == 200){
                dispatch(currentSession(resetEmail))
                dispatch(btnLoadingFalse())
                toast({
                    title: result.message,
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                })
                navigate('/')
            }else{
                dispatch(btnLoadingFalse())
                toast({
                    title: result.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                })
            }
        }else{
            dispatch(btnLoadingFalse())
            toast({
                title: "Please enter an Email",
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }

    return(
        <>
            <Container maxW={'md'} p={'5'} className="bg-white basis-full self-baseline rounded my-5" boxShadow='lg'  border='1px' borderColor='gray.200' borderRadius={'10'}>
                <Heading fontSize={'2xl'} className="uppercase text-center mb-5">Login</Heading>
                <form onSubmit={loginHandler}>
                    <FormControl isRequired mb={'5'}>
                        <FormLabel>Email</FormLabel>
                        <Input 
                            type="email" 
                            name="emal" 
                            placeholder="Enter you email..." 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {/* {isEmailError && <FormErrorMessage>Please enter a valid email.</FormErrorMessage> } */}
                    </FormControl>
                    <FormControl isRequired mb={'5'}>
                        <HStack alignItems={'center'} justifyContent={'space-between'}>
                            <FormLabel>Password</FormLabel>
                            <Link onClick={onOpen} textDecoration={'underline'} fontSize={'sm'} mb={'2'}>Forgot Password?</Link>
                        </HStack>
                        <Input 
                            type="password" 
                            name="password" 
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </FormControl>
                    <Button w={'full'} type="submit" bg={'black'} color={'white'} border="1px" _hover={{ bg: "transparent", color: "#000" }}>Submit</Button>
                </form>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Forgot Password</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <form onSubmit={forgetPasswordHandler} >
                            <FormControl isRequired mb={'5'}>
                                <FormLabel>Email</FormLabel>
                                <Input 
                                    required="required"  
                                    type="email" 
                                    name="resetEmail" 
                                    placeholder="Enter you email..." 
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    />
                            </FormControl>
                            <HStack>
                                <Button  w={'full'} type="submit" bg={'black'} color={'white'} mb={'4'} border="1px" _hover={{ bg: "transparent", color: "#000" }}>Reset Now</Button>
                                {
                                    loading ? (
                                        <Button isLoading onClick={forgetPasswordEmailHandler} w={'full'} type="submit" bg={'black'} color={'white'} mb={'4'} border="1px" _hover={{ bg: "transparent", color: "#000" }}>Send Email</Button>
                                    ) : (
                                        <Button  onClick={forgetPasswordEmailHandler} w={'full'} type="submit" bg={'black'} color={'white'} mb={'4'} border="1px" _hover={{ bg: "transparent", color: "#000" }}>Send Email</Button>
                                    )
                                }
                            </HStack>
                        </form> 
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Container>
        </>
    )
}

export default Login