import { Button, useToast, Checkbox, Box, Avatar, CheckboxGroup, Container, FormControl, FormErrorMessage, FormLabel, HStack, Heading, Input, Radio, RadioGroup, Select } from "@chakra-ui/react"
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { btnLoading, btnLoadingFalse } from "../redux/Slice/authSlice";


const SignUp = () => {

    const loading = useSelector((state) => state.auth.loading)

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [gender, setGender] = useState('male')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('')
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('')
    const [zipCode, setZipCode] = useState('');
    const [checkedItems, setCheckedItems] = useState([]);
    const [image, setImage] = useState('');
    const [imagePrev, setImagePrev] = useState('');

    const countries = [
        {
            name: 'India',
            states: [
                {
                    name: 'Madhya Pradesh',
                    cities: ['Indore', 'Ujjain', 'Bhopal']
                },
                {
                    name: 'Uttar Pradesh',
                    cities: ['Lucknow', 'Varanasi', 'Mirzapur']
                }
            ]
        },
        {
            name: 'USA',
            states: [
                {
                    name: 'Texas',
                    cities: ['Houston', 'Oregan']
                },
                {
                    name: 'California',
                    cities: ['Los Angelas', 'Los Santos', 'San Jose']
                }
            ]
        }
    ]
    let isNotMatched = (password && confirmPassword  && confirmPassword != password) ? true : false;

    const checkedHandler = (value) => {
        setCheckedItems(value);
    }

    const changeImageHandler = (e) => {
        const file =  e.target.files[0];
        const reader = new FileReader();
        // console.log(reader)
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            // console.log(file, 'file')
            setImagePrev(reader.result)
            setImage(file)
        }
    }

    const toast = useToast();     
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const signupHandler = async (e) => {
        e.preventDefault();
        dispatch(btnLoading())
        // console.log(('Signup Submit'))
        if(password == confirmPassword){
            const formData = new FormData();
            formData.append('firstName', firstName)
            formData.append('lastName', lastName)
            formData.append('gender', gender)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('selectedCountry', selectedCountry)
            formData.append('selectedState', selectedState)
            formData.append('selectedCity', selectedCity)
            formData.append('zipCode', zipCode)
            formData.append('checkedItems', checkedItems)
            formData.append('image', image)
            
            let result = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                body: formData
            })
            
            result = await result.json()
            console.log(result);
            dispatch(btnLoadingFalse())
            if (result.codeStatus == 404){
                toast({
                    title: result.message,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                })
            }else if(result.codeStatus = 200){
                toast({
                    title: result.message,
                    description: "We've created your account for you.",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
                setTimeout(() => {navigate('/login')}, 2000)
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
            <Container maxW={'3xl'} p={'5'} className="bg-white rounded my-5" boxShadow='lg'  border='1px' borderColor='gray.200' borderRadius={'10'}>
                <Heading fontSize={'2xl'} className="uppercase text-center mb-7">Signup</Heading>
                <form onSubmit={signupHandler}>
                    <HStack>
                        <FormControl isRequired mb={'7'}>
                            <FormLabel>First Name</FormLabel>
                            <Input 
                                type="text" 
                                name="firstname" 
                                placeholder="Enter First Name" 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl isRequired mb={'7'}>
                            <FormLabel>Last Name</FormLabel>
                            <Input 
                                type="text" 
                                name="lastname" 
                                placeholder="Enter Last Name" 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </FormControl>
                    </HStack>
                    <FormControl isRequired mb={'7'}>
                        <FormLabel>Gender</FormLabel>
                        <RadioGroup value={gender} onChange={setGender}>
                            <HStack spacing={'5'}>
                                <Radio value='male'>Male</Radio>
                                <Radio value='female'>Female</Radio>
                            </HStack>
                        </RadioGroup>
                    </FormControl>
                    <FormControl isRequired mb={'7'}>
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
                    <HStack alignItems={'flex-start'}>
                        <FormControl isRequired mb={'7'}>
                            <FormLabel>Password</FormLabel>
                            <Input 
                                type="password" 
                                name="password" 
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                        </FormControl>
                        <FormControl isRequired mb={'7'} isInvalid={isNotMatched}>
                        <FormLabel>Confirm Password</FormLabel>
                        <Input 
                            type="password" 
                            name="confirmpassword" 
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} />
                            <FormErrorMessage>Passowrd Not Matched</FormErrorMessage>
                        </FormControl>  
                    </HStack>
                    <HStack>
                        <FormControl isRequired mb={'7'}>
                            <FormLabel>Country</FormLabel>
                            <Select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} placeholder="Select a Country">
                                {
                                    countries.length > 0 && countries.map((country, index) => {
                                        return(
                                            <option key={index} value={country.name}>{country.name}</option>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl isRequired mb={'7'}>
                            <FormLabel>States</FormLabel>
                            <Select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} placeholder="Select a State">
                                {
                                    selectedCountry &&  countries.find((country) => country.name === selectedCountry)?.states.map((state, index) => {
                                        return(
                                            <option key={index} value={state.name}>{state.name}</option>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </HStack>
                    <HStack>
                        <FormControl isRequired mb={'7'}>
                            <FormLabel>City</FormLabel>
                            <Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} placeholder="Select a City">
                                {
                                    selectedState && countries.find((country) => country.name === selectedCountry)?.states.find((state) => state.name === selectedState)?.cities.map((city, index) => {
                                        return(
                                            <option key={index} value={city}>{city}</option>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl isRequired mb={'7'}>
                            <FormLabel>Zip Code</FormLabel>
                            <Input 
                                type="number" 
                                name="zipcode" 
                                placeholder="Enter Zip Code" 
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                            />
                        </FormControl>
                    </HStack>
                    <FormControl mb={'7'}>
                        <FormLabel>Area of Interest</FormLabel>
                        <CheckboxGroup value={checkedItems} onChange={checkedHandler}>
                            <HStack spacing={'5'}>
                                <Checkbox value="reading">Reading</Checkbox>
                                <Checkbox value="writing">Writing</Checkbox>
                                <Checkbox value="travelling">Travelling</Checkbox>
                                <Checkbox value="plalying">Playing</Checkbox>
                            </HStack>
                        </CheckboxGroup>
                    </FormControl>
                    <FormControl mb={'7'}>
                        <FormLabel>Profile Picture</FormLabel>
                        <Input
                            type="file"
                            name="file"
                            accept="image/*"
                            onChange={changeImageHandler}
                        />
                    </FormControl>
                    <Box my={'4'} display={'flex'} justifyContent={'center'}>
                        <Avatar src={imagePrev} size={'2xl'}/>
                    </Box>
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

export default SignUp;