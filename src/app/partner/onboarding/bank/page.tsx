'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BadgeCheck, CheckCircle, CircleDashed, CreditCard, Landmark, Phone} from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

function page() {
  const router=useRouter()
  const [accountHolder,setAccountHolder] = useState("")
  const [accountNumber,setAccountNumber] = useState("")
  const [ifsc,setIfsc] = useState("")
  const [upi,setupi] = useState("")
  const [mobileNumber,setMobileNumber] = useState("")
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")

  const handleBank=async ()=>{
    setLoading(true)
    setError("")
    try{
      const {data} = await axios.post("/api/partner/onboarding/bank",{
        accountHolder, accountNumber, ifsc, mobileNumber, upi
      })
      console.log(data)
      setLoading(false)
    }catch(error:any){
      setError(error?.response?.data?.message || "something went wrong")
      console.log(error)
      setLoading(false)
    }
  }
  return (
    <div className='min-h-screen bg-white flex items-center justify-center px-4'>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        className='w-full max-w-xl bg-white rounded-3xl border border-gray-300 shadow-[0_25px_70px_rgba(0,0,0,0.15)] p-6 sm:p-8'
      >
        <div className='relative text-center'>
          <button className='absolute left-0 top-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition' onClick={() => router.back()}><ArrowLeft size={18} /></button>
          <p className='text-xs text-gray-500 font-medium'>step 3 of 3</p>
          <h1 className='text-2xl font-bold mt-1'>Bank & Payout Setup</h1>
          <p className='text-sm text-gray-500 mt-2'>Used for partner payouts</p>
        </div>

        <div className='mt-8 space-y-6'>
          <div>
            <label htmlFor='ahn' className='text-xs font-semibold text-gray-500'>Account Holder Name</label>
            <div className='flex items-center gap-2 mt-2'>
              <div className='text-gray-400'><BadgeCheck/></div>
              <input type="text" id="ahn" placeholder="As per bank records" className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black'
                value={accountHolder} onChange={(e)=>setAccountHolder(e.target.value)}/>
            </div>
          </div>

          <div>
            <label htmlFor='ban' className='text-xs font-semibold text-gray-500'>Bank Account Number</label>
            <div className='flex items-center gap-2 mt-2'>
              <div className='text-gray-400'><CreditCard/></div>
              <input type="text" id="ban" placeholder="Enter Accounf Number" className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black'
                value={accountNumber} onChange={(e)=>setAccountNumber(e.target.value)}/>
            </div>
          </div>

          <div>
            <label htmlFor='ic' className='text-xs font-semibold text-gray-500'>IFSC Code</label>
            <div className='flex items-center gap-2 mt-2'>
              <div className='text-gray-400'><Landmark/></div>
              <input type="text" id="ic" placeholder="HDFC000123" className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black'
                value={ifsc} onChange={(e)=>setIfsc(e.target.value)}/>
            </div>
          </div>

          <div>
            <label htmlFor='mn' className='text-xs font-semibold text-gray-500'>Mobile Number</label>
            <div className='flex items-center gap-2 mt-2'>
              <div className='text-gray-400'><Phone/></div>
              <input type="text" id="mn" placeholder="10 digit mobile number" className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black'
                value={mobileNumber} onChange={(e)=>setMobileNumber(e.target.value)}/>
            </div>
          </div>

          <div>
            <label htmlFor='upi' className='text-xs font-semibold text-gray-500'>UPI ID (optional)</label>
            <div className='flex items-center gap-2 mt-2'>
              <input type="text" id="upi" placeholder="name@upi" className='flex-1 border-b pb-2 text-sm focus:outline-none border-gray-300 focus:border-black'
                value={upi} onChange={(e)=>setupi(e.target.value)}/>
            </div>
          </div>
        </div>

        {error && <p className='text-red-500 mt-4'>*{error}</p>}
        <div className='mt-6 flex items-start gap-3 text-xs text-gray-500'>
          <CheckCircle size={16} className='mt-0.5'/>
          <p>Bank details are verified before first payout.
                  This usually taked 24-48 hours.
          </p>
        </div>

        <motion.button
          whileHover={{scale:1.02}}
          whileTap={{scale:0.97}}
          onClick={handleBank}
          disabled={loading}
          className='mt-8 w-full h-14 rounded-2xl bg-black text-white font-semibold diasabled:opacity-40 transition'
        >
          {loading ? <CircleDashed className='text-white animate-spin' /> : "Continue"}
        </motion.button>
      </motion.div>
    </div>
  )
}

export default page
