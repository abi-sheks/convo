import React, { useState } from 'react'
import { Card, CardHeader, CardBody, Input, Heading, Text, CardFooter, Button, Link as ChakraLink } from '@chakra-ui/react'
import {Link as RRLink} from 'react-router-dom'
import axios from 'axios'
import { LOGIN_API_ENDPOINT } from '../constants'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userAdded } from '../features/userSlice'


const LoginScreen = () => {
  const [usernameState, setUsernameState] = useState("")
  const [emailState, setEmailState] = useState("")
  const [passwordState, setPasswordState] = useState("")
  const dispatch = useDispatch()
  const navigate =useNavigate()

  const handleSubmit = async () => {
      //logs in, gets token, and stores logged in users details to state.
      //stores token in localstorage 
      try{
        const response = (await axios.post(LOGIN_API_ENDPOINT, JSON.stringify({username : usernameState, password : passwordState, email : emailState}), {headers : {'Content-type' : "application/json"}})).data
        dispatch(userAdded({
          username : response.username,
          email : response.email,
          token : response.token
        }))
        //logged in
        console.log(response)
        navigate("/feed/")
      }
      catch(error)
      {
        console.log(error)
      }
  }
  return (
    <Card backgroundColor="secondary" height="80%" width="60%" border>
      <CardHeader>
        <Heading textAlign="center" mb={4}>Connect with your friends.</Heading>
        <Text textAlign="center" fontSize="3xl">Login</Text>
      </CardHeader>
      <CardBody display="flex" flexDirection="column" justifyContent="space-around">
        <div>
          <Text fontSize="xl" mb={3}>Username</Text>
          <Input value={usernameState} onChange={(e) => setUsernameState(e.target.value)} type='text' />
        </div>
        <div>
          <Text fontSize="xl" mb={3}>Email</Text>
          <Input value={emailState} onChange={(e) => setEmailState(e.target.value)} type='text' />
        </div>
        <div>
          <Text fontSize="xl" mb={3}>Password</Text>
          <Input value={passwordState} onChange={(e) => setPasswordState(e.target.value)} type='password' />
        </div>
      </CardBody>
      <CardFooter display="flex" justifyContent="center" alignItems='center'>
        <Button size="lg" colorScheme='primary' onClick={handleSubmit} marginRight='1rem'>Login</Button>
        <ChakraLink size="lg" as={RRLink} to='/register'>New? Register</ChakraLink>
      </CardFooter>
    </Card>
  )
}

export default LoginScreen
