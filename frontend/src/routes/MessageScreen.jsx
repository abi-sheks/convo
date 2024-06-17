import { List, Box, Heading, Avatar, Button, Input, Text, ListItem } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useGetProfileQuery, useGetMessagesQuery } from '../features/apiSlice'
import useWebSocket from 'react-use-websocket'
import { BASE_WS_ENDPOINT } from '../constants'

//idea - initially hydrate with data from http request for all messages between the two guys
//all subsequent messages handled by socket
const MessageScreen = () => {
    const currentUser = useSelector(state => state.user)
    const [messagesState, setMessagesState] = useState([])
    const [message, setMessage] = useState("")
    const { username } = useParams()
    const { data: profile, isSuccess: profileSuccess, isError: profileErrored } = useGetProfileQuery({ profileName: username, token: currentUser.token })
    const { data: messages, isSuccess: messagesSuccess, isError: messagesErrored } = useGetMessagesQuery({ sender: currentUser.username, receiver: username, token: currentUser.token })
    const socketURL = `${BASE_WS_ENDPOINT}${currentUser.username}/${username}/`
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketURL)

    useEffect(() => {
        messagesSuccess && setMessagesState(messages)
    }, [messages])
    useEffect(() => {
        if (lastMessage !== null) {
            const newMessages = [...messagesState, JSON.parse(lastMessage.data)]
            setMessagesState(newMessages)
            setMessage("")
        }
    }, [lastMessage]);
    console.log(lastMessage)
    messagesSuccess && console.log(messagesState)

    const handleMessageSend = () => {
        if (message) {
            sendMessage(message)
        }
    }
    const messageList = messagesState && messagesState.map(message => {
        return (
            <Box alignSelf={message.sender === currentUser.username ? "flex-end" : "flex-start"} padding="0.5rem" marginTop="0.25rem" marginBottom="0.25rem" key={message.id} width="60%" border="1px solid black" borderRadius="0.5rem" backgroundColor={message.sender === currentUser.username ? "secondary" : "primary"}>
                <Text fontWeight="bold">{message.sender}</Text>
                <Text>{message.content}</Text>
            </Box>
        )
    })
    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="space-between" paddingTop="2rem" height="100%" width="100%">
            <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar size="xl" src={profile && profile.pfp} />
                <Heading>Your chat with {username}</Heading>
            </Box>
            <Box width="100%" padding="1rem" display="flex" maxHeight="90vh" overflowY="auto" flexDirection="column" alignItems="flex-end">
                {messageList}
            </Box>
            <Box display="flex" width="80%">
                <Input variant="outline" value={message} onChange={(e) => setMessage(e.target.value)} placehoder="Enter your message..." backgroundColor="white" />
                <Button onClick={handleMessageSend}>Send</Button>
            </Box>
        </Box>
    )
}

export default MessageScreen
