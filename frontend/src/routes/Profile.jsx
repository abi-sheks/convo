import React, { useState, useEffect } from 'react'
import {
    Box, Avatar, Button, Heading, Text, Modal, ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { useGetProfileQuery, useEditProfileMutation } from '../features/apiSlice'
import { useParams } from 'react-router-dom'
import { useDisclosure } from '@chakra-ui/react'

const Profile = () => {
    const currentUser = useSelector(state => state.user)
    const [profileState, setProfileState] = useState()
    const { isOpen: followersIsOpen, onOpen: followersOnOpen, onClose: followersOnClose } = useDisclosure()
    const { isOpen: followingIsOpen, onOpen: followingOnOpen, onClose: followingOnClose } = useDisclosure()
    const { username } = useParams()
    const { data: profile, isSuccess: profSuccess, isError: profErrored } = useGetProfileQuery({ profileName: username, token: currentUser.token })
    const { data: cu, isSuccess: cuSuccess, isError: cuErrored } = useGetProfileQuery({ profileName: currentUser.username, token: currentUser.token })
    cu && console.log(cu)
    const [updateProfile, { isLoading: profileUpdateLoading, isError: profileUpdateErrored }] = useEditProfileMutation()
    useEffect(() => {
        profSuccess && setProfileState(profile)
    }, [profile])
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
            const response = await updateProfile({ profile: { id: cu.id, following: newFollowing, profile_name: cu.profile_name }, token: currentUser.token }).unwrap()
            console.log(response)

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Box width="100%" height="100%" display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" flexDirection="column" alignItems="center" width="80%">
                <Avatar marginTop="2rem" size="2xl" display="block" />
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
                </Box>
            </Box>
            <Modal isOpen={followersIsOpen} onClose={followersOnClose}>
                <ModalOverlay /> 
                <ModalContent>
                    <ModalHeader>{profileState && profileState.profile_name}'s Followers</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {profileState && profileState.followers.map(follower => {
                            return (
                                <Box key={follower}>{follower}</Box>
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
                                <Box key={following}>{following}</Box>
                            )
                        })}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default Profile
