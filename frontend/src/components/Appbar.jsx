import React, {useState} from 'react'
import { Search2Icon } from "@chakra-ui/icons"
import {
    Avatar,
    Box, Heading, Input, InputGroup, InputRightAddon, InputLeftElement, Button,
    Menu, MenuItem, MenuButton, MenuList
} from '@chakra-ui/react'

import { userAdded } from '../features/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { LOGOUT_API_ENDPOINT } from '../constants'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Link as RRLink } from 'react-router-dom'


const Appbar = () => {
    const currentUser = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchState, setSearchState] = useState("")
    const handleSearch = () => {
        if(searchState !== "")
        {
            navigate(`/profiles?query=${searchState}`)
        }
    } 
    const handleLogout = async () => {
        try {
            console.log(currentUser)
            await axios.post(LOGOUT_API_ENDPOINT, JSON.stringify({}), {headers : {"Authorization" : `Token ${currentUser.token}`}})
            dispatch(userAdded({
                username : "",
                email : "",
                token : ""
            }))
            navigate("/login")
        } catch(error)
        {
            console.log(error)
        }
    }
    return (
        <Box height="12%" width="100%" backgroundColor="white"
            display="flex" alignItems="center" justifyContent="space-between" paddingLeft="1rem" paddingRight="1rem">
            <Heading as={RRLink} to="/home" size="md">social media app</Heading>
            <Box width="70%" display="flex">
                <InputGroup borderRadius={5} size="sm">
                    <InputLeftElement
                        pointerEvents="none"
                        children={<Search2Icon color="gray.600" />}
                    />
                    <Input value={searchState} onChange={(e) => setSearchState(e.target.value)} type="text" placeholder="Search for people..." border="1px solid #949494" />
                    <InputRightAddon
                        p={0}
                        border="none"
                    >
                        <Button size="sm" borderLeftRadius={0} borderRightRadius={3.3} border="1px solid #949494" onClick={handleSearch}>
                            Search
                        </Button>
                    </InputRightAddon>
                </InputGroup>
            </Box>
            <Menu>
                <MenuButton as={Avatar} >
                </MenuButton>
                <MenuList>
                    <MenuItem as={RRLink} to= {`profiles/${currentUser.username}/`}>Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </Box>
    )
}

export default Appbar
