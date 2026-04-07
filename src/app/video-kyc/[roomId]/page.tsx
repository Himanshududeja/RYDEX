'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react'
import { useParams } from 'next/navigation';


function page() {
    const { userData } = useSelector((state: RootState) => state.user)
    const containerRef = useRef<HTMLDivElement>(null)
    const [joined, setJoined] = useState(false)
    const previewRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [isCameraOn, setIsCameraOn] = useState(true)
    const [isMicOn, setIsMicON] = useState(true)
    const params = useParams()
    const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId

    useEffect(() => {
        if (joined) return
        let localstream: MediaStream
        const init = async () => {
            try {
                localstream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                })
                setStream(localstream)
                if (previewRef.current) {
                    previewRef.current.srcObject = localstream
                }
            }
            catch (error) {
                console.log(error)
            }
        }
        init()
    }, [])

    const toggleCamera = () => {
        if (!stream) return
        stream.getVideoTracks().forEach((track) => track.enabled = !isCameraOn);
        setIsCameraOn(!isCameraOn)
    }

    const toggleMic = () => {
        if (!stream) return
        stream.getAudioTracks().forEach((track) => track.enabled = !isMicOn);
        setIsMicON(!isMicOn)
    }
    const startCall = async () => {
        if (!containerRef.current) {
            return null
        }

        const displayName=userData?.role=="admin" ? "Admin" : `${userData?.name} (${userData?.email})`
        try {
            const { ZegoUIKitPrebuilt } = await import('@zegocloud/zego-uikit-prebuilt');
            const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
            const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET
            const userId = ((userData as any)?._id?.toString()) || "guest"
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appId,
                serverSecret!,
                roomId!,
                userId,
                displayName
            )

            const zp = ZegoUIKitPrebuilt.create(kitToken)
            zp.joinRoom({
                container: containerRef.current,
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
                },
                showPreJoinView: false
            });
            setJoined(true)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='min-h-screen bg-black text-white flex flex-col'>
            <div className='px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                <div>
                    <Image src={"/logo.png"} alt='logo' width={80} height={80} priority />
                    <p className='text-xs text-gray-400'>{userData?.role == "admin" ? "Admin Verification" : "Partner Video KYC"}</p>
                </div>
            </div>
            <div className='flex-1 relative'>
                <div ref={containerRef} className={`absolute inset-0 ${
                    joined ? "block" : "hidden"
                }`}/>
                {!joined && (
                    <div className='h-full flex items-center justify-center px-4 py-10'>
                        <div className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                            <div className='relative rounded-2xl overflow-hidden border border-white/10 bg-white/5'>
                                <video
                                    ref={previewRef}
                                    autoPlay
                                    playsInline
                                    className='w-full h-[300px] sm:h-[400px] object-cover'
                                />

                                {!isCameraOn && (
                                    <div className='absolute inset-0 bg-black flex items-center justify-center'><VideoOff size={40}/></div>
                                )}
                            </div>
                            <div className='space-y-8 text-center lg:text-left'>
                                <h1 className='text-3xl sm:text-4xl font-bold'>Secure Video KYC</h1>
                                <div className='flex justify-center lg:justify-start gap-6'>
                                    <button
                                        onClick={toggleCamera}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                                            isCameraOn
                                                ? "bg-white text-black"
                                                : "bg-white/10 border border-white/20"
                                            }`}
                                    >{isCameraOn ? <Video/> : <VideoOff/>}</button>
                                    <button
                                        onClick={toggleMic}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                                            isMicOn
                                                ? "bg-white text-black"
                                                : "bg-white/10 border border-white/20"
                                            }`}
                                    >{isMicOn ? <Mic/> : <MicOff/>}</button>
                                </div>

                                <button className='w-full bg-white text-black py-4 rounded-xl font-semibold'
                                    onClick={startCall}
                                >Join Secure Call</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default page
