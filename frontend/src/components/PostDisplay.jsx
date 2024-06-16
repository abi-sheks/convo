import React from 'react'
import CommentsModal from './CommentsModal'
import { useDisclosure } from '@chakra-ui/react'
import { GridItem, Text, Avatar, Box, IconButton, Image } from '@chakra-ui/react'
import { ChatIcon, StarIcon } from '@chakra-ui/icons'
import { Link as RRLink } from 'react-router-dom'
const PostDisplay = ({ post, profileState, profile, cu, editPost, token, pfpSrc }) => {
  const {isOpen, onOpen, onClose} = useDisclosure()
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
      console.log(error)
    }
  }
  return (
    <GridItem display="flex" flexDirection="column" margin="1rem">
      <Box display="flex" borderTopRightRadius="0.5rem" borderTopLeftRadius="0.5rem" border="0.25px solid black" padding="0.5rem" alignItems="center">
        <Avatar src={pfpSrc} />
        <Text marginLeft="1rem" as={RRLink} to={`/profiles/${post.poster}`}>{post.poster}</Text>
      </Box>
      <Image borderLeft="0.25px solid black" borderRight="0.25px solid black" display={post.img === "" ? "none" : "block"} src={post.img} />
      <Box borderLeft="0.25px solid black" borderRight="0.25px solid black" display="flex" flexDirection="column">
        <Box display="flex" >
          <IconButton onClick={async () => await handleLike(post)} icon={<StarIcon color={cu && post.likers.indexOf(profileState.profile_name) === -1 ? "black" : "red"} />} />
          <IconButton onClick={onOpen} icon={<ChatIcon />} />
        </Box>
        <Text paddingLeft="0.25rem" fontWeight="bold">{post.likers.length} stars</Text>
      </Box>
      <Text border="0.25px solid black" padding="0.5rem" borderBottomLeftRadius="0.5rem" borderBottomRightRadius="0.5rem">{post.caption}</Text>
      <CommentsModal isOpen={isOpen} onClose={onClose} postID={post.id} comments={post.comment_set}/>
    </GridItem>
  )
}

export default PostDisplay
