import { authClient } from "./client";

const checkLogin = async (dispatch, userAction, token) => {
    try{
        authClient.defaults.headers['Authorization'] = `Token ${token}`
        const data = (await authClient.get('whoami/')).data
        console.log(data)
        dispatch(
            userAction({
                username: data.username,
                email: data.email,
                token : token
            })
        )
    }
    catch(error)
    {
        console.log(error)
    }
}

export default checkLogin;