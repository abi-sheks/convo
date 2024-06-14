import axios from 'axios';
import {readToken} from './readToken' 
import { AUTH_API_ENDPOINT } from '../constants';

export const authClient = axios.create({
    baseURL: AUTH_API_ENDPOINT
  });