import React, { useState, useEffect } from 'react'
import {
    Box, Avatar, Button, Heading, Text, Modal, ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    Grid,
    GridItem,
    Image,
    IconButton
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { useGetProfileQuery, useEditProfileMutation, useGetPostsQuery, useEditPostMutation } from '../features/apiSlice'
import { PostDisplay } from '../components'
import { useNavigate, useParams } from 'react-router-dom'
import { useDisclosure } from '@chakra-ui/react'
import { Link as RRLink } from 'react-router-dom'
import { getBase64 } from '../utils/base64'
import { ChatIcon, StarIcon } from '@chakra-ui/icons'


const Profile = () => {
    const currentUser = useSelector(state => state.user)
    const navigate = useNavigate()
    const { username } = useParams()

    const [profileState, setProfileState] = useState()
    const [postsState, setPostsState] = useState([])
    const [pfpState, setPfpState] = useState()
    const [showUpload, setShowUpload] = useState(false)

    const { isOpen: followersIsOpen, onOpen: followersOnOpen, onClose: followersOnClose } = useDisclosure()
    const { isOpen: followingIsOpen, onOpen: followingOnOpen, onClose: followingOnClose } = useDisclosure()

    const { data: profile, isSuccess: profSuccess, isError: profErrored } = useGetProfileQuery({ profileName: username, token: currentUser.token })
    const { data: cu, isSuccess: cuSuccess, isError: cuErrored } = useGetProfileQuery({ profileName: currentUser.username, token: currentUser.token })
    const [updateProfile, { isLoading: profileUpdateLoading, isError: profileUpdateErrored }] = useEditProfileMutation()
    const { data: posts, isSuccess: postsSuccess, isError, postsErrored } = useGetPostsQuery({ token: currentUser.token })
    const [editPost, { isSuccess: postLiked, isError: postLikeErrored }] = useEditPostMutation()



    useEffect(() => {
        profSuccess && setProfileState(profile)
    }, [profile])

    useEffect(() => {
        postsSuccess && profileState && setPostsState(posts.filter(post => post.poster === profileState.profile_name))
    }, [posts, profileState])

    const postList = postsSuccess && postsState.map(post => {
        return (
            <PostDisplay key={post.id} post={post} profileState={profileState} profile={profile} cu={cu} editPost={editPost} token={currentUser.token} pfpSrc={profileState.pfp}/>
        )
    })

    const handleFollow = async () => {
        let newFollowing
        if (cu && cu.following.indexOf(profileState.profile_name) == -1) {
            newFollowing = [...cu.following, profileState.profile_name]
        }
        else if (cu) {
            newFollowing = cu.following.filter(item => item != profileState.profile_name)
        }
        try {
            //add the user to your following
            const response = await updateProfile({ profile: { id: cu.id, following: newFollowing, profile_name: cu.profile_name, followers: cu.followers }, token: currentUser.token }).unwrap()
            console.log(response)

        } catch (error) {
            console.log(error)
        }
    }

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
            const response = await editPost({ post: newPost, token: currentUser.token }).unwrap()
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    const handleImageChange = (e) => {
        setPfpState(e.target.files[0])
        setShowUpload(true)
    }
    const handleUpload = async (e) => {
        try {
            //add the user to your following
            const pfpstr = await getBase64(pfpState)
            const response = await updateProfile({ profile: { id: cu.id, following: cu.Following, profile_name: cu.profile_name, pfp: pfpstr }, token: currentUser.token }).unwrap()
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Box width="100%" height="100%" display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" flexDirection="column" alignItems="center" width="80%">
                <Avatar marginTop="2rem" size="2xl" display="block" src={profileState && profileState.pfp} />
                <Heading>{username}</Heading>
                <Box display="flex" width="100%" alignItems="center" justifyContent="center">
                    <Text padding="0.5rem" fontWeight={600} onClick={followersOnOpen} margin="0.25rem">Followers</Text>
                    <Text padding="0.5rem" fontWeight={600} onClick={followingOnOpen} margin="0.25rem">Following</Text>
                </Box>
                <Box display="flex" width="100%" alignItems="center" justifyContent="center">
                    <Button colorScheme="primary" margin="0.5rem" display={profileState && currentUser.username === profileState.profile_name ? "none" : "block"} onClick={handleFollow}>
                        {cu && profileState && cu.following.indexOf(profileState.profile_name) === -1 ? "Follow" : "Unfollow"}
                    </Button>
                    <Button paddingTop="0.55rem" colorScheme="primary" margin="0.5rem" display={profileState && currentUser.username === profileState.profile_name ? "none" : "block"} as={RRLink} to={`/dms/${profileState && profileState.profile_name}`}>Message</Button>
                    <Box margin="0.5rem" display={profileState && currentUser.username === profileState.profile_name ? "block" : "none"}>
                        <Heading size="sm" margin="0.75rem">Upload profile picture</Heading>
                        <Input type="file" onChange={handleImageChange}></Input>
                        <Button colorScheme='primary' marginTop="0.5rem" display={showUpload ? "block" : "none"} onClick={handleUpload}>Upload</Button>
                    </Box>
                </Box>
            </Box>
            <Grid width="100%" templateColumns='repeat(3, 1fr)'>
                {postList}
            </Grid>
            {/* modals for display of followers and following list */}
            <Modal isOpen={followersIsOpen} onClose={followersOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{profileState && profileState.profile_name}'s Followers</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {profileState && profileState.followers.map(follower => {
                            return (
                                <Box onClick={() => {
                                    followersOnClose()
                                    navigate(`/profiles/${follower}`)
                                }} padding="0.5rem" key={follower}>{follower}</Box>
                            )
                        })}
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Modal isOpen={followingIsOpen} onClose={followingOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{profileState && profileState.profile_name}'s Following</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {profileState && profileState.following.map(following => {
                            return (
                                <Box onClick={() => {
                                    followersOnClose()
                                    navigate(`/profiles/${following}`)
                                }} padding="0.5rem" key={following}>{following}</Box>
                            )
                        })}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default Profile
