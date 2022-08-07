import { createContext } from 'react';

export const UserContext=createContext({
    isLogged: false,
    userId:null,
    userName:null,
    saved:null,
    token: null,
    setUser: ()=>{}
})