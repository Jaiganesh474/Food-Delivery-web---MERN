import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import UserOrderCard from '../components/userOrderCard'
import OwnerOrderCard from '../components/OwnerOrderCard'
import { useEffect } from 'react'
import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice'

function MyOrders() {
    const { userData, myOrders, socket } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        socket?.on('newOrder', (data) => {
            if (data.shopOrders?.owner._id == userData._id) {
                dispatch(setMyOrders([data, ...myOrders]))
            }
        })

        socket?.on('update-status', ({ orderId, shopId, status, userId }) => {
            if (userId == userData._id) {
                dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }))
            }
        })

        return () => {
            socket?.off('newOrder'),
                socket?.off('update-status')
        }
    }, [socket])

    return (
        <div className='w-full min-h-screen bg-[#fff9f6] justify-center flex px-4'>
            <div className='flex items-start p-8 gap-6 mb-6 fixed'>
                <div className='z-[10px]'>
                    <IoIosArrowRoundBack size={40} className='text-[#ff4d2d] cursor-pointer hover:scale-110 
                            transition-transform' onClick={() => navigate('/')} />
                </div>

                <h1 className='text-3xl font-bold'>My Orders</h1>
            </div>
            <div className='w-full max-w-[800px] p-8'>
                <div className='space-y-6 mt-14'>
                    {myOrders?.map((order, index) => (
                        userData.role == "User" ? (
                            <UserOrderCard data={order} key={index} />
                        ) :
                            userData.role == "Owner" ? (
                                <OwnerOrderCard data={order} key={index} />
                            ) : null

                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyOrders
