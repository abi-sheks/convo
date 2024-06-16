import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Button, Input, Text, Box } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useAddNewCommentMutation } from '../features/apiSlice'

const CommentsModal = ({ onClose, isOpen, postID, comments }) => {
    const currentUser = useSelector(state => state.user)
    const [content, setContent] = useState("")
    const [addNewComment, { isSuccess, isError }] = useAddNewCommentMutation()
    const handleComment = async () => {
        try {
            if (content === "") {
                throw new Error("No empty comments")
            }
            const response = await addNewComment({ comment: { commenter: currentUser.username, rel_post: postID, content: content}, token: currentUser.token }).unwrap()
            console.log(response)
            setContent("")
        } catch (error) {
            console.log(error)
        }
    }
    const commentList = comments && comments.map(comment => {
        return (
            <Box key={comment.id} display="flex" flexDirection="column">
                <Text fontWeight="bold">{comment.commenter}</Text>
                <Text>{comment.content}</Text>
            </Box>
        )
    })
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Leave a comment</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {commentList}
                </ModalBody>
                <ModalFooter display="flex" alignItems="center">
                    <Input variant="outline" placeholder='Comment...' value={content} onChange={(e) => setContent(e.target.value)} />
                    <Button marginLeft="0.5rem" onClick={handleComment}>Go</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default CommentsModal
