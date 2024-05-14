import { Box, useToast, Button, Grid, Flex, Text, HStack, Avatar, Heading, NumberInput, NumberInputField, NumberInputStepper,NumberIncrementStepper, NumberDecrementStepper, Table, RadioGroup, Radio, Select, CheckboxGroup ,Checkbox, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, Tooltip, IconButton, InputGroup, InputRightElement } from '@chakra-ui/react'
import { RiDeleteBin7Fill } from 'react-icons/ri';
import { MdEdit } from "react-icons/md";
import { useState , useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronRightIcon, ChevronLeftIcon, SearchIcon } from '@chakra-ui/icons';
import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";
import { btnLoading, btnLoadingFalse } from '../redux/Slice/authSlice';
import axios from 'axios'



const UserDashboard = () => {

    const [users, setUsers] = useState([])
    const [editId, setEditId] = useState('')

    const { isOpen, onOpen, onClose} = useDisclosure();
    const toast = useToast();   
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.currentUser) 
    const loading = useSelector((state) => state.auth.loading)

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [gender, setGender] = useState('male')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('')
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('')
    const [zipCode, setZipCode] = useState('');
    const [checkedItems, setCheckedItems] = useState([]);
    const [image, setImage] = useState('');
    const [imagePrev, setImagePrev] = useState('');
    const [searchUser, setSearchUser] = useState('')

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

    const fetchUser = async () => {
        try{
            const {data} = await axios.get('http://localhost:5000/users')
            // console.log(data, 'Data Fetching')
            setUsers(data)
        } catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        console.log('Working only once')
        fetchUser();
    }, [])

    const deleteButtonHandler = async (id) => {
        let data = await fetch(`http://localhost:5000/delete/${id}`, {
            method: 'DELETE'
        })

        
        data = await data.json()
        if(data){
            toast({
                title: data.message,
                status: 'success',
                duration: 2000,
                isClosable: true,
              })
              fetchUser()
        }
    }

    const updateHandler = async (id) => {
        setEditId(id)
        let data = await fetch(`http://localhost:5000/user/${id}`)
        data = await data.json();
        data = data.data
        let newCheckedItems = data.checkedItems[0].split(',');
        // console.log(newCheckedItems, data.checkedItems, 'data called')
        setFirstName(data.firstName)
        setLastName(data.lastName)
        setGender(data.gender)
        setSelectedCountry(data.selectedCountry)
        setSelectedState(data.selectedState)
        setSelectedCity(data.selectedCity)
        setZipCode(data.zipCode)
        setCheckedItems(newCheckedItems)
        setImage(data.image)
        setImagePrev(data.image)
        onOpen()
    }

    const updateDetailHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('firstName', firstName)
        formData.append('lastName', lastName)
        formData.append('gender', gender)
        formData.append('password', password)
        formData.append('selectedCountry', selectedCountry)
        formData.append('selectedState', selectedState)
        formData.append('selectedCity', selectedCity)
        formData.append('zipCode', zipCode)
        formData.append('checkedItems', checkedItems)
        formData.append('image', image)

        
        let result = await fetch(`http://localhost:5000/user/update/${editId}`, {
            method: 'PUT',
            body: formData
        })
        
        result = await result.json()
        toast({
            title: result.message,
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
        dispatch(btnLoadingFalse())
        fetchUser();
        setTimeout(() => {onClose()}, 1000)
    }


    const checkedHandler = (value) => {
        // console.log(value, 'checed')
        setCheckedItems(value);
    }

    const changeImageHandler = (e) => {
        const file =  e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImagePrev(reader.result)
            setImage(file)
        }
    }

    const searchHandler = (e) => {
        setGlobalFilter(searchUser)
    }

    const columnsName = [
        {
            Header: "Profile",
            accessor: "image",
            disableSortBy : true,
            Cell: ({row}) => <Avatar size={'md'} src={row.values.image} />,
        },
        {
            Header: "First Name",
            accessor: "firstName",
        },
        ,{
            Header: "Last Name",
            accessor: "lastName"
        },
        {
            Header: "Gender",
            accessor: "gender"
        },
        {
            Header: "Email",
            accessor: "email"
        },
        {
            Header: "Country",
            accessor: "selectedCountry"
        },
        {
            Header: "State",
            accessor: "selectedState"
        },
        {
            Header: "City",
            accessor: "selectedCity"
        },
        {
            Header: "Zip Code",
            accessor: "zipCode"
        },
        {
            Header: "Area of Interest",
            accessor: "checkedItems",
            disableSortBy : true,
        },
        {
            Header: "Action",
            accessor: "action",
            disableSortBy : true,
            Cell: ({row}) => (
                currentUser == row.original.email ? (
                    <HStack justifyContent={'flex-end'}>
                        <Button size={'sm'} border="1px" px={'1'} _hover={{ bg: "transparent", color: "#000" }} onClick={()=>updateHandler(row.original._id)}  bg={'green'} color={'white'} >
                            <MdEdit />
                        </Button>
                        <Button size={'sm'} border="1px" px={'1'} _hover={{ bg: "transparent", color: "#000" }} onClick={()=>deleteButtonHandler(row.original._id)} bg={'red'} color={'white'} >
                        <RiDeleteBin7Fill />
                        </Button>
                    </HStack>
                ) : (
                    <HStack className="action-none" justifyContent={'flex-end'}>
                        <Button size={'sm'} border="1px" px={'1'} _hover={{ bg: "transparent", color: "#000" }} onClick={()=>updateHandler(row.original._id)}  bg={'green'} color={'white'} >
                            <MdEdit />
                        </Button>
                        <Button size={'sm'} border="1px" px={'1'} _hover={{ bg: "transparent", color: "#000" }} onClick={()=>deleteButtonHandler(row.original._id)} bg={'red'} color={'white'} >
                        <RiDeleteBin7Fill />
                        </Button>
                    </HStack>   
                )
            )
        }
    ]
     
    const columns = useMemo(() => columnsName, [])
    const userData = useMemo(() => users, [users])
      console.log(users, 'users')

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        setPageSize,
        setGlobalFilter,    
        state: { pageIndex, pageSize }
      } = useTable(
        {
          columns: columns,
          data: userData,
          initialState: {
            pageIndex: 0,
            pageSize: 5,
          }
        },
        useGlobalFilter,
        useSortBy,
        usePagination
      );

    
    return(
        <>
            <Grid minH={'100vh'} templateColumns={['1fr']} className='flex-1' >
                <Box p={['0', '8']} overflowX={'auto'}>
                    <Flex justifyContent={'space-between'} alignItems={'center'}  mb={'6'}>
                        <Heading fontSize={'2xl'}  textTransform={'uppercase'} children='All Users' textAlign={['center', 'left']} /> 
                        <Flex alignItems="center">
                            <Select
                                w={32}
                                value={pageSize}
                                onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                }}
                            >
                                {[5, 10, 15, 20, 25].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                                ))}
                            </Select>
                        </Flex>
                    </Flex>
                    <Box mb={'6'} maxWidth={'container.sm'} mx={'auto'}>
                    <InputGroup size='md'>
                        <Input
                            pr='4.5rem'
                            type='text'
                            value={searchUser}
                            placeholder='Search User'
                            onChange={(e) => setSearchUser(e.target.value)}
                            focusBorderColor='yellow.500'
                        />
                        <InputRightElement mr={'1'}>
                            <Button colorScheme='yellow' color="white" h='1.75rem' size='sm' onClick={searchHandler}>
                                <SearchIcon />
                            </Button>
                        </InputRightElement>
                        </InputGroup>
                    </Box>
                    <TableContainer w={['100vw', 'full']} sx={{
                        '&::-webkit-scrollbar': {
                        width: '6px',
                        height: '5px',
                        borderRadius: '12px',
                        backgroundColor: `rgba(0, 0, 0, 0.09)`,
                        color: 'white'
                        },
                        '&::-webkit-scrollbar-thumb': {
                        borderRadius: '12px',
                        backgroundColor: `#999999`,
                        },
                    }}>
                        <Table {...getTableProps()} size={'sm'} boxShadow='base' border='2px' borderColor='gray.200' borderRadius={'8px'}>
                        {   users && users.length > 0 
                            ? <TableCaption mb={'3'} >All Available Users in the Database</TableCaption> 
                            : <TableCaption mb={'3'} >No user Available in Database</TableCaption>}
                        <Thead>
                        {
                            headerGroups.map((headerGroup, i) => {
                                return <Tr key={i} {...headerGroup.getHeaderGroupProps()}>
                                    {
                                        headerGroup.headers.map((column) => {
                                            // console.log(column)
                                            return <Th py={'3'} {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render("Header")}</Th>
                                        })
                                    }
                                </Tr>
                            })
                        }
                            {/* <Tr>
                                <Th py={'3'}>Profile</Th> 
                                <Th>First Name</Th>
                                <Th>Last Name</Th>
                                <Th>Gender</Th>
                                <Th>Email</Th>
                                <Th>Country</Th>
                                <Th>State</Th>
                                <Th>City</Th>
                                <Th>Zip Code</Th>
                                <Th>Area of Interest</Th>
                                <Th>Action</Th>
                            </Tr> */}
                        </Thead>
                        <Tbody {...getTableBodyProps()}>
                            {
                            page && page.map((item, i) => {
                                prepareRow(item)
                                // console.log(item, 'items')
                                return <RowData 
                                        currentUser={currentUser} 
                                        updateHandler={updateHandler} 
                                        deleteButtonHandler={deleteButtonHandler} 
                                        key={item.original._id} 
                                        item={item}
                                    />}
                                )
                                
                            }
                        </Tbody>
                        {/* <Tbody>
                            {
                            users && users.map((item) => {
                                return <RowData 
                                        currentUser={currentUser} 
                                        updateHandler={updateHandler} 
                                        deleteButtonHandler={deleteButtonHandler} 
                                        key={item._id} 
                                        item={item} 
                                    />}
                                )
                                
                            }
                        </Tbody> */}
                        </Table>
                        <Flex justifyContent="center" m={4} alignItems="center" gap={'10'}>
                            <Flex>
                                <Tooltip label="Previous Page">
                                    <IconButton
                                    onClick={previousPage}
                                    isDisabled={!canPreviousPage}
                                    icon={<ChevronLeftIcon h={6} w={6} />}
                                    />
                                </Tooltip>
                            </Flex>

                            <Flex alignItems="center">
                                <Text flexShrink="0">
                                    Page{" "}
                                    <Text fontWeight="bold" as="span">
                                    {pageIndex + 1}
                                    </Text>{" "}
                                    of{" "}
                                    <Text fontWeight="bold" as="span">
                                    {pageOptions.length}
                                    </Text>
                                </Text>
                            </Flex>
                            <Flex>
                                <Tooltip label="Next Page">
                                    <IconButton
                                    onClick={nextPage}
                                    isDisabled={!canNextPage}
                                    icon={<ChevronRightIcon h={6} w={6} />}
                                    />
                                </Tooltip>
                            </Flex>
                        </Flex>
                    </TableContainer>
                </Box>
                <Modal isOpen={isOpen} size={'3xl'} onClose={onClose} maxW="75%">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Update Details</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={'7'}>
                            <form onSubmit={updateDetailHandler}>
                                <HStack>
                                    <FormControl mb={'7'}>
                                        <FormLabel>First Name</FormLabel>
                                        <Input 
                                            type="text" 
                                            name="firstname" 
                                            placeholder="Enter First Name" 
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl mb={'7'}>
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
                                <FormControl mb={'7'}>
                                    <FormLabel>Gender</FormLabel>
                                    <RadioGroup value={gender} onChange={setGender}>
                                        <HStack spacing={'5'}>
                                            <Radio value='male'>Male</Radio>
                                            <Radio value='female'>Female</Radio>
                                        </HStack>
                                    </RadioGroup>
                                </FormControl>
                                <HStack alignItems={'flex-start'}>
                                    <FormControl mb={'7'}>
                                        <FormLabel>Password</FormLabel>
                                        <Input 
                                            type="password" 
                                            name="password" 
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)} />
                                    </FormControl>
                                    <FormControl mb={'7'} isInvalid={isNotMatched}>
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
                                    <FormControl mb={'7'}>
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
                                    <FormControl mb={'7'}>
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
                                    <FormControl mb={'7'}>
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
                                    <FormControl mb={'7'}>
                                        <FormLabel>Zip Code</FormLabel>
                                        <Input 
                                            type="text" 
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
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Grid>
        </>
    )
}

export default UserDashboard;

function RowData({item}){
    return(
      <Tr {...item.getRowProps()}>
        {
            item.cells.map((cell, i) => (
                <Td key={i} {...cell.getCellProps()}>{cell.render("Cell")}</Td>
            ))
        }
        {/* <Td>{item.firstName}</Td>
        t<Td py={'2'}><Avatar size={'md'} src={item.value} /></Td>
        <Td>{item.lastName}</Td>
        <Td>{item.gender}</Td>
        <Td>{item.email}</Td>
        <Td>{item.selectedCountry}</Td>
        <Td>{item.selectedState}</Td>
        <Td>{item.selectedCity}</Td>
        <Td>{item.zipCode}</Td>
        <Td>{item.checkedItems}</Td> */}
        {/* {
            currentUser == item.email ? (
            <Td>
            <HStack justifyContent={'flex-end'}>
                <Button size={'sm'} border="1px" px={'1'} _hover={{ bg: "transparent", color: "#000" }} onClick={()=>updateHandler(item._id)}  bg={'green'} color={'white'} >
                    <MdEdit />
                </Button>
                <Button size={'sm'} border="1px" px={'1'} _hover={{ bg: "transparent", color: "#000" }} onClick={()=>deleteButtonHandler(item._id)} bg={'red'} color={'white'} >
                <RiDeleteBin7Fill />
                </Button>
            </HStack>
            </Td>
            ) : (
                <Td disabled>
                <HStack justifyContent={'flex-end'}>
                    <Button size={'sm'} border="1px" px={'1'} _hover={{ bg: "transparent", color: "#000" }} onClick={()=>updateHandler(item._id)}  bg={'green'} color={'white'} >
                        <MdEdit />
                    </Button>
                    <Button size={'sm'} border="1px" px={'1'} _hover={{ bg: "transparent", color: "#000" }} onClick={()=>deleteButtonHandler(item._id)} bg={'red'} color={'white'} >
                    <RiDeleteBin7Fill />
                    </Button>
                </HStack>
                </Td>
            )
        }        */}
      </Tr>
    )
  }