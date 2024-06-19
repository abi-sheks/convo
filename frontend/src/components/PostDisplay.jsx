import React from 'react'
import CommentsModal from './CommentsModal'
import { useDisclosure } from '@chakra-ui/react'
import { GridItem, Text, Avatar, Box, IconButton, Image } from '@chakra-ui/react'
import { ChatIcon, StarIcon } from '@chakra-ui/icons'
import { Link as RRLink } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'

const PostDisplay = ({ post, profileState, profile, cu, editPost, token, pfpSrc }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const handleLike = async (post) => {
    let newPost = { ...post }
    delete newPost.img
    console.log(newPost.img)
    try {
      if (post.likers.indexOf(profileState.profile_name) === -1) {
        //like the post
        newPost.likers = [...post.likers, profileState.profile_name]
      }
      else {
        newPost.likers = post.likers.filter(liker => liker != profileState.profile_name)
      }
      const response = await editPost({ post: newPost, token: token }).unwrap()
      console.log(response)
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
  return (
    <GridItem display="flex" flexDirection="column" margin="1rem">
      <Box display="flex" borderTopRightRadius="0.5rem" borderTopLeftRadius="0.5rem" border="0.25px solid black" padding="0.5rem" alignItems="center" backgroundColor="white">
        <Avatar src={pfpSrc} />
        <Text fontWeight={600} marginLeft="1rem" as={RRLink} to={`/profiles/${post.poster}`}>{post.poster}</Text>
      </Box>
      <Image borderLeft="0.25px solid black" borderRight="0.25px solid black" display={post.img === "" ? "none" : "block"} src={post.img} boxSize={400} />
      <Box borderLeft="0.25px solid black" borderRight="0.25px solid black" display="flex" flexDirection="column" backgroundColor="white">
        <Box display="flex" margin="0.5rem" >
          <IconButton marginRight="0.25rem" colorScheme='primary' onClick={async () => await handleLike(post)} icon={<StarIcon color={cu && post.likers.indexOf(cu.profile_name) === -1 ? "white" : "red"} />} />
          <IconButton colorScheme='primary' onClick={onOpen} icon={<ChatIcon />} />
        </Box>
        <Text marginBottom="0.25rem" marginLeft="0.5rem" paddingLeft="0.25rem" fontWeight="bold">{post.likers.length} stars</Text>
      </Box>
      <Text backgroundColor="white" border="0.25px solid black" paddingRight="0.75rem" paddingTop="1rem" paddingBottom="1rem" paddingLeft="0.75rem">{post.caption}</Text>
      <CommentsModal isOpen={isOpen} onClose={onClose} postID={post.id} comments={post.comment_set} />
    </GridItem>
  )
}

export default PostDisplay
