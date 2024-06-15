import { Box } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Appbar } from '../components'
import checkLogin from '../utils/whoami'
import { useDispatch } from 'react-redux'
import { userAdded } from '../features/userSlice'
import { useSelector } from 'react-redux'
import { useNavigate, Outlet } from 'react-router-dom'

const Home = ({children}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const currentUser = useSelector(state => state.user)
  useEffect(() => {
    (async () => {
      try {
        await checkLogin(dispatch, userAdded, currentUser.token)
      } catch (error) {
        navigate('/login')
      }
    })()
  }, [])
  return (
    <Box height="100%" width="100%">
      <Appbar />
      <Outlet />
    </Box>
  )
}

export default Home
