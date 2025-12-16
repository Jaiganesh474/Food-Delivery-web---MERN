import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { IoLocationSharp } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { BiCurrentLocation } from "react-icons/bi";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { useDispatch, useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css'
import { setAddress, setLocation } from '../redux/mapSlice';
import axios from 'axios';
import { MdDeliveryDining } from "react-icons/md";
import { MdOutlinePayments } from "react-icons/md";
import { TiCreditCard } from "react-icons/ti";
import { FaMobileScreenButton } from "react-icons/fa6";
import { MdFastfood } from "react-icons/md";
import { serverUrl } from '../App'
import { addMyOrder } from '../redux/userSlice';

function RecenterMap({ location }) {
    if (location.lat && location.lon) {
        const map = useMap()
        map.setView([location.lat, location.lon], 16, { animate: true })
    }
    return null
}

function CheckOut() {
    const navigate = useNavigate()
    const { location, address } = useSelector(state => state.map)
    const { cartItems, totalAmount, userData } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const apiKey = import.meta.env.VITE_GEOAPIKEY

    const [addressInput, setAddressInput] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("cod")

    const deliveryFee = totalAmount > 500 ? 0 : 40
    const AmountWithDeliveryFee = totalAmount + deliveryFee + 20

    const onDragEnd = (e) => {
        const { lat, lng } = e.target._latlng
        dispatch(setLocation({ lat, lon: lng }))
        getAddressByLatLng(lat, lng)
    }

    const getCurrentLocation = () => {

        const latitude = userData.location.coordinates[1]
        const longitude = userData.location.coordinates[0]
        dispatch(setLocation({ lat: latitude, lon: longitude }))
        getAddressByLatLng(latitude, longitude)

    }

    const getAddressByLatLng = async (lat, lng) => {
        try {

            const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&
                format=json&apiKey=${apiKey}`)

            dispatch(setAddress(result?.data?.features[0]?.properties?.address_line2))

        } catch (error) {
            console.log(error);

        }
    }

    const getLatLngByAddress = async () => {
        try {
            const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`)

            const { lat, lon } = result.data.features[0].properties
            dispatch(setLocation({ lat, lon }))

        } catch (error) {
            console.log(error);

        }
    }

    const handlePlaceOrder = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/place-order`, {
                paymentMethod,
                deliveryAddress: {
                    text: addressInput,
                    latitude: location.lat,
                    longitude: location.lon
                },
                totalAmount: AmountWithDeliveryFee,
                cartItems
            }, { withCredentials: true })

            if (paymentMethod == "cod") {
                dispatch(addMyOrder(result.data))
                navigate('/order-placed')
            } else {
                const orderId = result.data.orderId
                const razorOrder = result.data.razorOrder
                openRazorpayWindow(orderId, razorOrder)
            }

        } catch (error) {
            console.log(error);
        }
    }

    const openRazorpayWindow = (orderId, razorOrder) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: razorOrder.amount,
            currency: 'INR',
            name: "EatSure",
            description: "Food Delivery Website",
            order_id: razorOrder.id,
            handler: async function (response) {
                try {
                    const result = await axios.post(`${serverUrl}/api/order/verify-payment`, {
                        razorpay_payment_id: response.razorpay_payment_id,
                        orderId
                    }, { withCredentials: true })
                    dispatch(addMyOrder(result.data))
                    navigate("/order-placed")

                } catch (error) {
                    console.log(error);

                }
            }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
    }


    useEffect(() => {
        setAddressInput(address)
    }, [address])


    return (
        <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>
            <div className='absolute top-[20px] left-[20px] z-[10px]'>
                <IoIosArrowRoundBack size={40} className='text-[#ff4d2d] cursor-pointer hover:scale-110 
                transition-transform' onClick={() => navigate('/cart')} />
            </div>

            <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6'>
                <h1 className='text-3xl font-bold text-gray-800'>Order Checkout</h1>
                <section>
                    <h2 className='text-2xl font-semibold mb-2 flex items-center gap-2'><IoLocationSharp size={22} className='text-[#ff4d2d]' />Delivery Location</h2>
                    <div className='flex gap-2 mb-3'>
                        <input type="text" className='flex-1 border border-gray-300 rounded-lg p-2 text-l
                        focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' placeholder='Enter your delivery Address'
                            value={addressInput} onChange={(e) => setAddressInput(e.target.value)} />

                        <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex
                        items-center justify-center' onClick={getLatLngByAddress}><IoSearchOutline size={20} className='cursor-pointer' /></button>

                        <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex
                        items-center justify-center' onClick={getCurrentLocation}><BiCurrentLocation size={20} className='cursor-pointer' /></button>
                    </div>

                    <div className='rounded-xl border mt-4 overflow-hidden'>
                        <div className='h-64 w-full flex items-center justify-center'>
                            <MapContainer
                                className={'w-full h-full'}
                                center={[location?.lat, location?.lon]}
                                zoom={16}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <RecenterMap location={location} />

                                <Marker position={[location?.lat, location?.lon]} draggable eventHandlers=
                                    {{ dragend: onDragEnd }} />


                            </MapContainer>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-semibold mb-3 text-gray-800 flex items-center gap-2'><MdOutlinePayments size={22} className='text-[#ff4d2d]' />Payment Method</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                        <div className={`flex items-center gap-3 rounded-xl cursor-pointer border p-4 text-left transition ${paymentMethod === "cod" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-400"
                            }`} onClick={() => setPaymentMethod("cod")}>

                            <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d2d]'>
                                <MdDeliveryDining className='text-white text-xl' size={22} />
                            </span>
                            <div>
                                <p className='font-medium text-lg text-gray-800'>Cash on Delivery</p>
                                <p className='text-s text-gray-500'>Pay when your food arrives</p>
                            </div>

                        </div>
                        <div className={`flex items-center gap-3 rounded-xl border cursor-pointer p-4 text-left transition ${paymentMethod === "online" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-400"
                            }`} onClick={() => setPaymentMethod("online")}>

                            <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d2d]'>
                                <TiCreditCard className='text-white text-xl' size={22} />
                            </span>
                            <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d2d]'>
                                <FaMobileScreenButton className='text-white text-xl' size={22} />
                            </span>

                            <div>
                                <p className='font-medium text-lg text-gray-800'>UPI / Credit / Debit Card</p>
                                <p className='text-s text-gray-500'>Pay securely Online</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2'><MdFastfood size={22} className='text-[#ff4d2d]'
                    />Order Summary</h2>
                    <div className='rounded-xl border bg-gray-50 p-4 space-y-2'>
                        {cartItems.map((item, index) => (
                            <div key={index} className='flex font-medium justify-between text-l text-gray-800'>
                                <span>{item.name} x {item.quantity} Nos.</span>
                                <span className='font-bold text-[#ff4d2d]'>₹ {item.price * item.quantity}</span>
                            </div>
                        ))}
                        <hr className='border-gray-300 mt-2 my-2' />

                        <div className='flex justify-between font-semibold text-lg text-[#ff4d2d]'>
                            <span className='text-gray-800'>Subtotal</span>
                            <span>₹ {totalAmount}</span>
                        </div>

                        <div className='flex justify-between text-gray-800'>
                            <span>Restaurant Charges</span>
                            <span className='font-semibold'>₹ 20</span>
                        </div>

                        <div className='flex justify-between text-gray-800'>
                            <span>Delivery Fee</span>
                            <span className='font-semibold'>₹ {deliveryFee == 0 ? "Free" : deliveryFee}</span>
                        </div>
                        <hr className='border-gray-300 my-2' />

                        <div className='flex justify-between text-xl font-bold text-[#ff4d2d] pt-1'>
                            <span>Order Total</span>
                            <span>₹ {AmountWithDeliveryFee}</span>
                        </div>
                    </div>
                </section>

                <button className='w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 text-xl 
                cursor-pointer rounded-xl font-semibold' onClick={handlePlaceOrder}>
                    {paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}
                </button>
            </div>
        </div>
    )
}

export default CheckOut
