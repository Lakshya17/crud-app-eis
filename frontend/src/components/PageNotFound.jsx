import { Link } from 'react-router-dom';
import { Button, Container, Box, Heading } from "@chakra-ui/react"


const PageNotFound = () => {
    return(
        <>
        <Container maxW={'xl'} p={'5'} className="bg-white rounded my-5 flex align-center justify-center">
            <Box className="text-center">
                <Heading fontSize={'2xl'} className="uppercase text-center mb-7">404 Page Not Found</Heading>
                <Button border="1px" _hover={{ bg: "transparent", color: "#000" }} bg={'black'} color={'white'}>
                    <Link to={'/'}>Return to Homepage</Link>    
                </Button>
            </Box>
        </Container>
        </>
    )
}

export default PageNotFound;