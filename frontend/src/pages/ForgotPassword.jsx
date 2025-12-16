import axios from 'axios'
import React, { useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { Loader2 } from 'lucide-react'

function ForgotPassword() {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false);


    const handleSendOtp = async () => {
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true })
            console.log(result);
            setStep(2)
            setErr("")
            setLoading(false);
        } catch (error) {
            setErr(error?.response?.data?.message)
            setLoading(false);

        }
    }
    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp }, { withCredentials: true })
            console.log(result);
            setStep(3)
            setLoading(false);
            setErr("")
        } catch (error) {
            setErr(error?.response?.data?.message)
            setLoading(false);
        }
    }
    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            return null
        }
        setLoading(true);

        try {
            const result = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true })
            console.log(result);
            navigate("/signin")
            setErr("")
            setLoading(false);

        } catch (error) {
            setErr(error?.response?.data?.message)
            setLoading(false);
        }
    }

    return (
        <div className='flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]'>
            <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>
                <div className='flex items-center gap-4 mb-4'>
                    <IoIosArrowRoundBack className='text-[#ff4d2d] hover:scale-105 cursor-pointer transition-transform' size={30} onClick={() => navigate("/signin")} />
                    <h1 className='text-2xl font-bold text-center text-[#ff4d2d]'>Forgot Password</h1>
                </div>
                {step == 1 &&
                    <div>
                        <div className='mb-6'>
                            <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
                            <input type="email" className='w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline' placeholder='Enter your Email'
                                onChange={(e) => setEmail(e.target.value)} value={email} required />
                        </div>
                        <button className={`w-full flex items-center cursor-pointer justify-center gap-2 border rounded-lg 
                px-4 py-2 duration-200 bg-[#ff4d2d] hover:scale-102 font-semibold transition-transform text-white hover:bg-[#e64323]`}
                            onClick={handleSendOtp}>
                            {loading ? <Loader2 className='w-5 h-5 animate-spin'/>:"Send OTP"}
                        </button>
                        {err &&
                            <p className='text-red-500 transition-transform text-center mt-2'>{err}</p>
                        }
                    </div>
                }
                {step == 2 &&
                    <div>
                        <div className='mb-6'>
                            <label htmlFor="password" className='block text-gray-700 font-medium mb-1'>OTP</label>
                            <input type="password" className='w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline' placeholder='Enter OTP'
                                onChange={(e) => setOtp(e.target.value)} value={otp} required />
                        </div>
                        <button className={`w-full flex items-center cursor-pointer justify-center gap-2 border rounded-lg 
                px-4 py-2 duration-200 bg-[#ff4d2d] hover:scale-102 font-semibold transition-transform text-white hover:bg-[#e64323]`}
                            onClick={handleVerifyOtp}>
                            {loading ? <Loader2 className='w-5 h-5 animate-spin'/>:"Verify OTP"}
                        </button>
                        {err &&
                            <p className='text-red-500 transition-transform text-center mt-2'>{err}</p>
                        }
                    </div>
                }
                {step == 3 &&
                    <div>
                        <div className='mb-6'>
                            <label htmlFor="newPassword" className='block text-gray-700 font-medium mb-1'>New Password</label>
                            <input type="password" className='w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline' placeholder='Enter New Password'
                                onChange={(e) => setNewPassword(e.target.value)} value={newPassword} required />
                        </div>
                        <div className='mb-6'>
                            <label htmlFor="ConfirmPassword" className='block text-gray-700 font-medium mb-1'>Confirm Password</label>
                            <input type="password" className='w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline' placeholder='Enter Confirm Password'
                                onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} required />
                        </div>
                        <button className={`w-full flex items-center cursor-pointer font-semibold justify-center gap-2 border rounded-lg 
                px-4 py-2 duration-200 bg-[#ff4d2d] hover:scale-102 transition-transform text-white hover:bg-[#e64323]`}
                            onClick={handleResetPassword}>
                            {loading ? <Loader2 className='w-5 h-5 animate-spin'/>:"Reset Password"}
                        </button>
                        {err &&
                            <p className='text-red-500 transition-transform text-center mt-2'>{err}</p>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default ForgotPassword
