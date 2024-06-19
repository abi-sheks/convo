import React, { useState } from 'react'
import { REGISTER_API_ENDPOINT } from '../constants'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardBody, Input, Heading, Text, CardFooter, Button, Box } from '@chakra-ui/react'

const RegisterScreen = () => {
    const [usernameState, setUsernameState] = useState("")
    const [emailState, setEmailState] = useState("")
    const [passwordState, setPasswordState] = useState("")
    const [confirmPasswordState, setConfirmPasswordState] = useState("")
    const navigate = useNavigate()
    const handleSubmit = async () => {
        try {
            if (!confirmPasswordState || !passwordState || !usernameState || !emailState) {
                throw new Error("Please enter all your details")
            }
            if (confirmPasswordState !== passwordState) {
                throw new Error("Password not matching")
            }
            const response = (await axios.post(REGISTER_API_ENDPOINT, JSON.stringify({ username: usernameState, password: passwordState, email: emailState }), { headers: { "Content-type": "application/json" } })).data
            navigate("/")
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <Card backgroundColor="secondary" height="100%" width="60%">
            <CardHeader>
                <Heading textAlign="center">Register</Heading>
            </CardHeader>
            <CardBody>
                <Box marginTop="1rem">
                    <Text fontSize="xl" mb={3}>Username</Text>
                    <Input value={usernameState} onChange={(e) => setUsernameState(e.target.value)} type='text' />
                </Box>
                <Box marginTop="1rem">

                    <Text fontSize="xl" mb={3}>Email</Text>
                    <Input value={emailState} onChange={(e) => setEmailState(e.target.value)} type='text' />
                </Box>
                <Box marginTop="1rem">

                    <Text fontSize="xl" mb={3}>Password</Text>
                    <Input value={passwordState} onChange={(e) => setPasswordState(e.target.value)} type='password' />
                </Box>
                <Box marginTop="1rem">

                    <Text fontSize="xl" mb={3}>Confirm Password</Text>
                    <Input value={confirmPasswordState} onChange={(e) => setConfirmPasswordState(e.target.value)} type='password' />
                </Box>
            </CardBody>
            <CardFooter display="flex" justifyContent="center">
                <Button colorScheme='primary' onClick={handleSubmit}>Register</Button>
            </CardFooter>
        </Card>
    )
}

export default RegisterScreen
