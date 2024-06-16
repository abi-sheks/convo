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
    Image
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { useGetProfileQuery, useEditProfileMutation, useGetPostsQuery } from '../features/apiSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { useDisclosure } from '@chakra-ui/react'
import { Link as RRLink } from 'react-router-dom'
import { getBase64 } from '../utils/base64'


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


    useEffect(() => {
        profSuccess && setProfileState(profile)
    }, [profile])

    useEffect(() => {
        postsSuccess && profileState && setPostsState(posts.filter(post => post.poster === profileState.profile_name))
    }, [posts, profileState])

    const postList = postsSuccess && postsState.map(post => {
        return (
            <GridItem key={post.id} display="flex" flexDirection="column" margin="1rem">
                <Box display="flex" borderTopRightRadius="0.5rem" borderTopLeftRadius="0.5rem" border="0.25px solid black" padding="0.5rem" alignItems="center">
                    <Avatar src={profile && profileState.pfp} />
                    <Text marginLeft="1rem" as={RRLink} to={`/profiles/${post.poster}`}>{post.poster}</Text>
                </Box>
                <Image display={post.img === "" ? "none" : "block"} src={post.img} />
                <Text as={RRLink} to={`/posts/${post.id}`} border="0.25px solid black" padding="0.5rem" borderBottomLeftRadius="0.5rem" borderBottomRightRadius="0.5rem">{post.caption}</Text>
            </GridItem>
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
                    <Text onClick={followersOnOpen} margin="0.75rem">Followers</Text>
                    <Text onClick={followingOnOpen} margin="0.75rem">Following</Text>
                </Box>
                <Box display="flex" width="100%" alignItems="center" justifyContent="center">
                    <Button margin="0.5rem" display={profileState && currentUser.username === profileState.profile_name ? "none" : "block"} onClick={handleFollow}>
                        {cu && profileState && cu.following.indexOf(profileState.profile_name) === -1 ? "Follow" : "Unfollow"}
                    </Button>
                    <Button margin="0.5rem" display={profileState && currentUser.username === profileState.profile_name ? "none" : "block"}>Message</Button>
                    <Box margin="0.5rem" display={profileState && currentUser.username === profileState.profile_name ? "block" : "none"}>
                        <Text margin="0.75rem">Upload profile picture</Text>
                        <Input type="file" onChange={handleImageChange}></Input>
                        <Button display={showUpload ? "block" : "none"} onClick={handleUpload}>Upload</Button>
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
