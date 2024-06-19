import React, { useState } from 'react'
import { Modal, ModalOverlay, ModalCloseButton, ModalHeader, ModalContent, ModalBody, ModalFooter, Button, useDisclosure, Input, Box, Textarea, Text, Image } from '@chakra-ui/react'
import { getBase64 } from '../utils/base64'
import { useAddNewPostMutation } from '../features/apiSlice'
import { useSelector } from 'react-redux'


const CreatePost = () => {
    const currentUser = useSelector(state => state.user)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [imageContent, setImageContent] = useState(undefined)
    const [textContent, setTextContent] = useState("")
    const [addNewPost, { isSuccess, isError }] = useAddNewPostMutation()

    const handleImageChange = async (e) => {
        try {
            const file64 = await getBase64(e.target.files[0])
            setImageContent(file64)
        } catch (error) {
            console.log(error)
        }
    }
    const handlePost = async () => {
        console.log('hit')
        try {
            if (!textContent && !imageContent) {
                throw new Error("Post must contain some content")
            }
            const newPost = {
                img : imageContent ? imageContent : "",
                poster : currentUser.username,
                likers : [],
                caption : textContent
            }

            const response = await addNewPost({ post: newPost, token: currentUser.token }).unwrap()
            console.log(response)
            onClose()
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <Button mt={4} colorScheme='primary' onClick={onOpen}>Create a post</Button>
            <Modal onClose={() => {
                setImageContent(undefined)
                onClose()
            }} isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent minWidth="650px" display="flex" flexDirection="column" alignItems="center">
                    <ModalHeader size="xl" display="flex" justifyContent="center">Create a new post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <Input type='file' onChange={handleImageChange} />
                            <Image display={imageContent ? "block" : "none"} marginTop="1rem" boxSize="400px" objectFit="contain" marginBottom="1rem" border="1px solid black" src={imageContent} />
                        </Box>
                        <Box margin="1rem">
                            <Text marginBottom="0.5rem">Caption your post : </Text>
                            <Textarea value={textContent} onChange={(e) => setTextContent(e.target.value)}></Textarea>
                        </Box>
                    </ModalBody>
                    <ModalFooter display="flex" justifyContent="center">
                        <Button size='lg' colorScheme='primary' onClick={handlePost}>Post</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default CreatePost
