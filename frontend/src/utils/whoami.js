import { WHOAMI_API_ENDPOINT } from "../constants";
import axios from "axios";

const checkLogin = async (dispatch, userAction, token) => {
    //throws an error if unauthorized 
    const authClient = axios.create({
        baseURL: WHOAMI_API_ENDPOINT
    });
    authClient.defaults.headers['Authorization'] = `Token ${token}`
    const data = (await authClient.get()).data
    console.log(data)
    dispatch(
        userAction({
            username: data.username,
            email: data.email,
            token: token
        })
    )
}

export default checkLogin;