import React, { useState, useEffect } from 'react'
import { CreatePost } from '../components'
import { useGetPostsQuery, useGetProfileQuery } from '../features/apiSlice'
import { useSelector } from 'react-redux'
import { Grid, Avatar, Image, Text, GridItem, Box, Heading } from '@chakra-ui/react'
import { Link as RRLink } from 'react-router-dom'
import { PFP_API_ENDPOINT } from '../constants'
import axios from 'axios'

const Feed = () => {

    const [profileState, setProfileState] = useState()
    const [postsState, setPostsState] = useState([])
    const [pfpMap, setPfpMap] = useState(new Map())
    const currentUser = useSelector(state => state.user)
    const { data: posts, isSuccess: postsSuccess, isError, postsErrored } = useGetPostsQuery({ token: currentUser.token })
    const { data: cu, isSuccess: cuSuccess, isError: cuErrored } = useGetProfileQuery({ profileName: currentUser.username, token: currentUser.token })

    useEffect(() => {
        postsSuccess && profileState && setPostsState(posts.filter(post => profileState.following.indexOf(post.poster) != -1))
    }, [posts, profileState])
    useEffect(() => {
        cuSuccess && setProfileState(cu)
    }, [cu])

    useEffect(() => {
        cu && cu.following.forEach(async (person) => {
            try {

                const response = (await axios.get(`${PFP_API_ENDPOINT}${person}/`, { headers: { 'Authorization': `Token ${currentUser.token}` } })).data
                const replica = pfpMap
                replica.set(person, response.pfp)
                setPfpMap(replica)
            } catch (error) {
                console.log(error)
            }
        })
    }, [cu])

    cuSuccess && profileState && console.log(profileState.following)

    const postList = postsSuccess && postsState.map(post => {
        cuSuccess && console.log(pfpMap)
        return (
            <GridItem key={post.id} display="flex" flexDirection="column" margin="1rem">
                <Box display="flex" borderTopRightRadius="0.5rem" borderTopLeftRadius="0.5rem" border="0.25px solid black" padding="0.5rem" alignItems="center">
                    <Avatar src={cu && pfpMap.get(post.poster)} />
                    <Text marginLeft="1rem" as={RRLink} to={`/profiles/${post.poster}`}>{post.poster}</Text>
                </Box>
                <Image display={post.img === "" ? "none" : "block"} src={post.img} />
                <Text as={RRLink} to={`/posts/${post.id}`} border="0.25px solid black" padding="0.5rem" borderBottomLeftRadius="0.5rem" borderBottomRightRadius="0.5rem">{post.caption}</Text>
            </GridItem>
        )
    })

    return (
        <Box display="flex" flexDirection="column" alignItems="center" paddingTop="1rem">
            <CreatePost />
            <Heading> Your feed </Heading>
            <Grid width="80%" templateColumns="repeat(3, 1fr)">
                {postList}
            </Grid>
        </Box>
    )
}

export default Feed
