import React, { useState, useEffect } from 'react'
import { CreatePost, PostDisplay } from '../components'
import { useGetPostsQuery, useGetProfileQuery, useEditPostMutation } from '../features/apiSlice'
import { useSelector } from 'react-redux'
import { Grid, Avatar, Image, Text, GridItem, Box, Heading, IconButton } from '@chakra-ui/react'
import { Link as RRLink } from 'react-router-dom'
import { PFP_API_ENDPOINT } from '../constants'
import axios from 'axios'
import { ChatIcon, StarIcon } from '@chakra-ui/icons'

const Feed = () => {

    const [profileState, setProfileState] = useState()
    const [postsState, setPostsState] = useState([])
    const [pfpMap, setPfpMap] = useState(new Map())
    const currentUser = useSelector(state => state.user)
    const { data: posts, isSuccess: postsSuccess, isError, postsErrored } = useGetPostsQuery({ token: currentUser.token })
    const { data: cu, isSuccess: cuSuccess, isError: cuErrored } = useGetProfileQuery({ profileName: currentUser.username, token: currentUser.token })
    const [editPost, { isSuccess: postLiked, isError: postLikeErrored }] = useEditPostMutation()

    useEffect(() => {
        postsSuccess && profileState && setPostsState(posts.filter(post => profileState.following.indexOf(post.poster) != -1 || post.poster === profileState.profile_name))
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
        const replica = pfpMap
        profileState && replica.set(profileState.profile_name, profileState.pfp)
    }, [cu, profileState])

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
    const postList = postsSuccess && postsState.map(post => {
        return (
            <PostDisplay key={post.id} post={post} profileState={profileState} profile={cu} cu={cu} editPost={editPost} token={currentUser.token} pfpSrc={pfpMap.get(post.poster)}/>
        )
    })

    return (
        <Box display="flex" flexDirection="column" alignItems="center" paddingTop="1rem">
            <Heading size="2xl" margin="1rem"> Your feed </Heading>
            <CreatePost />
            <Grid width="80%" templateColumns="repeat(3, 1fr)">
                {postList}
            </Grid>
        </Box>
    )
}

export default Feed
