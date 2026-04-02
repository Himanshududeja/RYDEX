'use client'
import { useSession } from 'next-auth/react'
import React, { use } from 'react'
import useGetMe from './hooks/useGetMe'

function InitUser() {
  const {status}=useSession()
    useGetMe(status=="authenticated")
  return null
}

export default InitUser
