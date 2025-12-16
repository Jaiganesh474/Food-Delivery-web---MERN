import React from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function DeliveryBoyDashboard() {
  const { userData, socket } = useSelector(state => state.user)
  const [currentOrder, setCurrentOrder] = useState()
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [loading, setLoading] = useState(false)
  const [availableAssignments, setAvailableAssignments] = useState([])
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)

  const [otp, setOtp] = useState("")
  const [todayDeliveries, setTodayDeliveries] = useState([])
  const navigate = useNavigate()
  const [message, setMessage] = useState("")


  useEffect(() => {
    if (!socket || userData.role !== "Deliveryboy") return
    let watchId
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        setDeliveryBoyLocation({ lat: latitude, lon: longitude })

        socket.emit('updateLocation', {
          latitude,
          longitude,
          userId: userData._id
        })
      }),
        (error) => {
          console.log("Geolocation error:", error);

        },
      {
        enableHighAccuracy: true,


      }

    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
    }
  }, [socket, userData])


  const ratePerDelivery = 50
  const totalEarning = todayDeliveries.reduce((sum, d) => sum + d.count * ratePerDelivery, 0)


  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true })
      setAvailableAssignments(result.data)

    } catch (error) {
      console.log(error);

    }
  }

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-order`, { withCredentials: true })
      setCurrentOrder(result.data)

    } catch (error) {
      console.log(error);

    }
  }


  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, { withCredentials: true })
      await getCurrentOrder()

    } catch (error) {
      console.log(error);
      toast.error('Please deliver the existing order.')

    }
  }

  const sendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/order/send-delivery-otp`, {
        orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id
      }, { withCredentials: true })
      setLoading(false);
      setShowOtpBox(true)
      toast.success('OTP is sent to the Customer')

    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error('Error in sending OTP.')

    }
  }

  const verifyOtp = async () => {
    setMessage("")
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/order/verify-delivery-otp`, {
        orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id, otp
      }, { withCredentials: true })
      setLoading(false);
      setMessage(result.data.message)

      toast.success('OTP verified successfully')
      navigate('/')
      location.reload()

    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error('Invalid OTP!')

    }
  }

  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-today-deliveries`, { withCredentials: true })
      console.log(result.data);
      setTodayDeliveries(result.data)

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    socket?.on('newAssignment', (data) => {
      if (data.sentTo == userData._id) {
        setAvailableAssignments(prev => [...prev, data])
      }
    })

    return () => {
      socket?.off('newAssignment')
    }
  }, [socket])

  useEffect(() => {
    if (!socket || userData.role !== "Deliveryboy") return

    let watchId

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords
        setDeliveryBoyLocation({ lat: latitude, lon: longitude })

        socket.emit('updateLocation', {
          userId: userData._id,
          latitude,
          longitude
        })
      },
        (error) => {
          console.error("Geolocation error:", error);

        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000,

        }
      )
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
    }
  }, [socket, userData])


  useEffect(() => {
    getAssignments()
    getCurrentOrder()
    handleTodayDeliveries()
  }, [userData])

  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <Nav />

      <div className='w-full max-w-[800px] flex flex-col gap-5 items-center'>
        <div className='bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start gap-2 items-center text-center w-[90%] border border-orange-100'>
          <h1 className='text-xl font-bold text-[#ff4d2d] flex gap-1'>Welcome,<p className='text-gray-800'>{userData.fullName}</p></h1>
          <p className='text-[#ff4d2d] font-semibold'>Your Location- Latitude: <span className='font-light'>{deliveryBoyLocation?.lat}</span>,
            Longitude: <span className='font-light'>{deliveryBoyLocation?.lon}</span></p>
        </div>

        <div className='bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-100'>
          <h1 className='text-lg font-bold mb-3 text-[#ff4d2d]'>Today Deliveries</h1>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={todayDeliveries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
              <YAxis allowDecimals={false} />

              <Tooltip formatter={(value) => [value, "orders"]} labelFormatter={label => `${label}:00`} />
              <Bar dataKey="count" fill='#ff4d2d' />
            </BarChart>
          </ResponsiveContainer>

          <div className='max-w-sm mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg text-center'>
            <h1 className='text-xl font-semibold text-gray-800 mb-2'>Today Earnings</h1>
            <span className='text-3xl font-bold text-green-600'>₹ {totalEarning}</span>
          </div>

        </div>

        {!currentOrder &&
          <div className='bg-white rounded-2xl p-5 mb-6 shadow-md w-[90%] border border-orange-100'>
            <h1 className='text-lg font-bold mb-4 flex items-center gap-2'>Available Orders</h1>



            <div className='space-y-4'>
              {availableAssignments?.length > 0
                ?
                (availableAssignments.map((a, index) => (
                  <div className='border rounded-lg p-4 flex justify-center items-center' key={index}>
                    <div>

                      <p className='text-sm font-semibold gap-2'>Order No: #{a?.orderId.slice(-6)}</p>
                      <p className='text-sm font-semibold gap-2'>{a?.shopName}</p>
                      <p className='text-sm pt-1 text-gray-500'><span className='font-semibold text-black'>Delivery Address: </span>{a?.deliveryAddress.text}</p>
                      <p className='text-sm text-gray-500'>{a.items.length} items | Order Bill: ₹ {a.subTotal}</p>
                    </div>

                    <button className='bg-[#ff4d2d] text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 cursor-pointer 
                  hover:scale-102 transition-transform' onClick={() => acceptOrder(a.assignmentId)}>
                      Accept
                    </button>

                  </div>
                ))
                ) :
                <p className='text-gray-600 text-center pt-10 mb-10 text-lg'>No Available Orders right now!</p>}

            </div>
          </div>
        }

        {currentOrder &&
          <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
            <h2 className='text-lg mb-3 font-bold'>Current Orders</h2>

            <div className='border rounded-lg p-4 mb-3'>
              <p className='font-semibold text-sm'>{currentOrder?.shopOrder.shop.name}</p>
              <p>{currentOrder.deliveryAddress.text}</p>
              <p className='text-sm text-gray-500'>{currentOrder.shopOrder.shopOrderItems.length} items | ₹ {currentOrder.shopOrder.subTotal}</p>
            </div>

            <DeliveryBoyTracking data={{
              deliveryBoyLocation: deliveryBoyLocation ||
              {
                lat: userData.location.coordinates[1],
                lon: userData.location.coordinates[0]

              },
              customerLocation: {
                lat: currentOrder.deliveryAddress.latitude,
                lon: currentOrder.deliveryAddress.longitude
              }
            }} />

            {!showOtpBox ?
              <button className='mt-4 w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-700
            active:scale-102 cursor-pointer flex items-center justify-center transition-all duration-200' onClick={sendOtp} disabled={loading}>
                {loading ? <Loader2 className='w-5 h-5 animate-spin text-center' /> : "Marked as Delivered"}
              </button> :
              <div className='mt-4 p-4 border rounded-xl bg-gray-50'>
                <div className='flex items-center gap-6 mb-2 relative'>
                  <div className='flex items-center' onClick={() => setShowOtpBox(false)}>
                    <IoIosArrowRoundBack size={30} className='text-[#ff4d2d] cursor-pointer hover:scale-110 
                    transition-transform' />
                    <h2 className='text-lg cursor-pointer hover:scale-102 
                    transition-transform font-bold text-[#ff4d2d] text-start'>Back</h2>
                  </div>


                </div>
                <p className='font-semibold'>Enter OTP that is sent to <span className='text-orange-500'>{currentOrder.user.fullName}</span></p>

                <input type="text" placeholder='Enter OTP' className='w-full mt-2 border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2
                focus:ring-orange-400' onChange={(e) => setOtp(e.target.value)} value={otp} />

              {/* {message && <p className='text-center text-green-400 text'>{message}</p>} */}

                <button className='w-full bg-orange-600 cursor-pointer text-white py-2 rounded-lg font-semibold 
                hover:bg-orange-700 transition-all flex justify-center items-center' onClick={verifyOtp}>
                  {loading ? <Loader2 className='w-5 h-5 animate-spin text-center' /> : "Verify OTP"}
                </button>
              </div>

            }
          </div>
        }

      </div>
    </div>
  )
}

export default DeliveryBoyDashboard
