//shouldnt be an issue exposing these for now :>
export const BASE_API_ENDPOINT = "http://localhost:8000/api/"
export const AUTH_API_ENDPOINT = `${BASE_API_ENDPOINT}auth/`
export const LOGIN_API_ENDPOINT = `${AUTH_API_ENDPOINT}login/`
export const LOGOUT_API_ENDPOINT = `${AUTH_API_ENDPOINT}logout/`
export const REGISTER_API_ENDPOINT = `${AUTH_API_ENDPOINT}register/`
export const WHOAMI_API_ENDPOINT = `${AUTH_API_ENDPOINT}whoami/`
export const PFP_API_ENDPOINT = `${BASE_API_ENDPOINT}pfp/`
export const BASE_WS_ENDPOINT = "ws://localhost:8000/chat/"