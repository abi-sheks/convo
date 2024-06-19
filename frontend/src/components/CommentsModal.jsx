import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Button, Input, Text, Box, IconButton, Heading } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ArrowRightIcon } from '@chakra-ui/icons'
import { useSelector } from 'react-redux'
import { useAddNewCommentMutation } from '../features/apiSlice'
import {useToast} from '@chakra-ui/react'

const CommentsModal = ({ onClose, isOpen, postID, comments }) => {
    const currentUser = useSelector(state => state.user)
    const [content, setContent] = useState("")
    const toast = useToast()
    const [addNewComment, { isSuccess, isError }] = useAddNewCommentMutation()
    const handleComment = async () => {
        try {
            if (content === "") {
                throw new Error("No empty comments")
            }
            const response = await addNewComment({ comment: { commenter: currentUser.username, rel_post: postID, content: content }, token: currentUser.token }).unwrap()
            console.log(response)
            setContent("")
        } catch (error) {
            toast({
                title: 'Error',
                description: error.err,
                status: 'error',
                duration: 4000,
                isClosable: true,
              }) 
            console.log(error)
        }
    }
    const commentList = comments && comments.map(comment => {
        return (
            <Box margin="1rem" key={comment.id} display="flex" flexDirection="column">
                <Text fontWeight="bold">{comment.commenter}</Text>
                <Text>{comment.content}</Text>
            </Box>
        )
    })
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Leave a comment
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody maxHeight="800px">
                    {commentList}
                </ModalBody>
                <ModalFooter display="flex" alignItems="center">
                    <Input variant="outline" placeholder='Comment...' value={content} onChange={(e) => setContent(e.target.value)} />
                    <IconButton colorScheme='primary' icon={<ArrowRightIcon />} marginLeft="0.5rem" onClick={handleComment} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default CommentsModal
