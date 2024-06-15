import React, { useState, useEffect } from 'react'
import { List, ListItem, Text, Box, Heading, Avatar } from '@chakra-ui/react'
import { useSearchParams } from 'react-router-dom'
import { useGetProfilesQuery } from '../features/apiSlice'
import { useSelector } from 'react-redux'
import { Link as RRLink } from 'react-router-dom'

const ProfileList = () => {
    const [searchParams] = useSearchParams()
    const currentUser = useSelector(state => state.user)
    const query = searchParams.get("query")
    const [profilesState, setProfilesState] = useState([])
    const { data: profiles, isSuccess, error, isLoading } = useGetProfilesQuery({ profileName: query, token : currentUser.token })
    useEffect(() => {
        isSuccess && setProfilesState(profiles)
    }, [profiles])
    const profileList = isSuccess && profilesState.map((profile) => {
        console.log(`running ${profile.user.username}`)
        return (
            <ListItem as={RRLink} to={`${profile.user.username}`} display="flex" alignItems="center" padding="1rem" key={profile.id} border="1px solid #949494" borderRadius="0.5rem" margin="0.25rem" backgroundColor="white">
                <Avatar />
                <Text paddingLeft="1rem">
                    {profile.user.username}
                </Text>
            </ListItem>
        )
    })
    isSuccess && console.log(profilesState)
    return (
        <Box height="100%" width="100%" paddingTop="2rem" display="flex" flexDirection="column" alignItems="center">
            <Heading as="h4" marginTop="1rem" marginBottom="2rem">Results</Heading>
            <List width="60%" backgroundColor="#EEEEEE">
                {profileList}
            </List>
        </Box>
    )
}

export default ProfileList
