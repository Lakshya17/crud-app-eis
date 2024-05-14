import { Button, Container, useToast, FormControl, FormErrorMessage, FormLabel, HStack, Heading, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { btnLoading, btnLoadingFalse } from "../redux/Slice/authSlice";

const ForgotPassword = () => {

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const { currentUser, loading } = useSelector((state) => state.auth)

    const toast = useToast();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    let isNotMatched = (newPassword && confirmNewPassword  && confirmNewPassword != newPassword) ? true : false;

    const [queryParameters] = useSearchParams()
    let newUser = queryParameters.get("user");
    const passwordResetHandler = async (e) => {
        e.preventDefault();
        dispatch(btnLoading())
        if(newPassword == confirmNewPassword){
            let result = await fetch(`http://localhost:5000/updatepassword/${newUser}`, {
                method: 'PUT',
                body: JSON.stringify({newPassword, currentUser}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            
            result = await result.json()
            dispatch(btnLoadingFalse())
            if(result.status == 200){
                toast({
                    title: result.message,
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
                navigate('/login')
            }else{
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
                title: `Password Not Matched`,
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }

    return(
        <>
            <Container maxW={'md'} p={'5'} className="bg-white basis-full self-baseline rounded my-5" boxShadow='lg'  border='1px' borderColor='gray.200' borderRadius={'10'}>
                <Heading fontSize={'2xl'} className="uppercase text-center mb-5">Create New Password</Heading>
                <form onSubmit={passwordResetHandler}>
                    <FormControl isRequired mb={'5'}>
                        <FormLabel>New Password</FormLabel>
                        <Input 
                            type="password" 
                            name="newpassword" 
                            placeholder="Enter new password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </FormControl>
                    <FormControl isRequired mb={'5'} isInvalid={isNotMatched}>
                        <FormLabel>Confirm Password</FormLabel>
                        <Input 
                            type="password" 
                            name="confirmpassword" 
                            placeholder="Confirm password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)} />
                            <FormErrorMessage>Passowrd Not Matched</FormErrorMessage>
                    </FormControl>
                    {
                        loading ? (
                            <Button isLoading w={'full'} type="submit" bg={'black'} color={'white'} border="1px" _hover={{ bg: "transparent", color: "#000" }}>Submit</Button>
                        ) : (
                            <Button w={'full'} type="submit" bg={'black'} color={'white'} border="1px" _hover={{ bg: "transparent", color: "#000" }}>Submit</Button>
                        )   
                    }
                </form>
            </Container>
        </>
    )
}

export default ForgotPassword;