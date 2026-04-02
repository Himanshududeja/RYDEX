'use client'
import React, { use, useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '@/redux/userSlice'

function useGetMe(enabled:boolean) {
    const dispatch=useDispatch()        // Get user data and set it in the redux store dispatch(setUserData(data))
    useEffect(()=>{
        if(!enabled) return
    const getMe=async()=>{
        try{
            const {data}=await axios.get("/api/user/me")
            dispatch(setUserData(data))
        }catch(err){
            console.log(err)
        }
    }
    getMe()
  },[enabled])
}

export default useGetMe
