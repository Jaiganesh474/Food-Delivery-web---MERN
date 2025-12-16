import React, { useState } from 'react'
import { MdPhone } from "react-icons/md";
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice';

function OwnerOrderCard({ data }) {
    const [availableBoys, setAvailableBoys] = useState([])
    const dispatch = useDispatch()
    const handleUpdateStatus = async (orderId, shopId, status) => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, { status }, { withCredentials: true })
            dispatch(updateOrderStatus({ orderId, shopId, status }))
            setAvailableBoys(result.data.availableBoys)
            console.log(result.data);


        } catch (error) {
            console.log(error);

        }
    }

    return (

        <div className='w-full bg-[#fff9f6] flex justify-center p-6'>
            <div className='w-full max-w-[800px]'>
                {data?.length == 0 ? (
                    <p className='text-gray-900 text-3xl text-center'>You have no orders from customers now!</p>
                ) : (<>
                    <div className='bg-white rounded-lg shadow p-4 space-y-4'>
                        <div>
                            <p className='font-semibold text-lg'>
                                Order No: #{data._id.slice(-6)}
                            </p>
                            <h2 className='text-xl font-semibold text-gray-800 mt-2'>{data.user.fullName}</h2>
                            <p className='text-lg text-gray-500'>{data.user.email}</p>
                            <p className='flex items-center gap-2 text-gray-800 mt-1 text-lg'><MdPhone />{data.user.mobile}</p>
                            {data.paymentMethod == "cod" ? <p className='text-lg text-gray-800'>Pay by {data.paymentMethod?.toUpperCase()}</p> :
                                <p className='text-lg text-gray-800'>Paid through Online Payment:  <span className='font-bold'>
                                    {data.payment ? <span className='text-green-600'> Success</span> : <span className='text-red-600'>  Failed</span>}</span></p>}
                        </div>

                        <div className='flex items-start flex-col text-gray-600 text-sm'>
                            <p className='text-lg'>Address: {data?.deliveryAddress?.text}</p>
                            <p className='text-xs text-gray-500'>Location: Lat:{data?.deliveryAddress.latitude}, Lon:{data?.deliveryAddress.longitude}</p>

                        </div>

                        <div className='flex space-x-4 overflow-x-auto pb-2'>
                            {data.shopOrders.shopOrderItems.map((item, index) => (
                                <div key={index} className='flex-shrink-0 w-40 border rounded-lg p-2 bg-white'>
                                    <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded' />
                                    <p className='text-l font-semibold mt-1'>{item.name}</p>
                                    <p className='text-sm text-gray-700'>Qty: {item.quantity} x ₹ {item.price}</p>

                                </div>
                            ))}
                        </div>
                        {/* <p className='text-green-600 font-semibold text-lg'>Delivered</p> */}

                        <div className='flex justify-between items-center mt-auto pt-3 gap-2 border-t border-gray-100'>
                            <span className='font-semibold text-lg'>Status:{" "}
                                {data.shopOrders.status == "delivered" ?
                                    (
                                        <span className='text-green-600 font-semibold text-lg'>Delivered</span>
                                    ) :
                                    <span className='font-semibold text-[#ff4d2d]'>
                                        {data.shopOrders.status?.charAt(0).toUpperCase() + data.shopOrders.status?.slice(1)}
                                    </span>
                                }

                            </span>

                            <select className='rounded-md border px-3 py-1 text-l focus:outline-none focus:ring-2 border-[#ff4d2d] text-[#ff4d2d]'
                                onChange={(e) => handleUpdateStatus(data._id, data.shopOrders.shop._id, e.target.value)}>
                                <option value="">Change</option>
                                <option value="pending">Pending</option>
                                <option value="preparing">Preparing</option>
                                <option value="out of delivery">Out for Delivery</option>
                            </select>
                        </div>

                        {data.shopOrders.status == "out of delivery" &&
                            <div className='mt-3 p-2 border rounded-lg bg-orange-50 gap-4'>
                                {data.shopOrders.assignedDeliveryBoy ? <p className='font-medium text-lg'>Assigned Delivery Boy:</p>
                                    : <p className='font-medium text-lg'>Available Delivery Boys:</p>}

                                {availableBoys?.length > 0 ? (
                                    availableBoys.map((b, index) => (
                                        <div className='text-gray-700'>
                                            {index + 1}. {b.fullName} - {b.mobile}
                                        </div>
                                    ))
                                ) :
                                    data.shopOrders.assignedDeliveryBoy ? <div className='text-l'>Delivery by: {data.shopOrders.assignedDeliveryBoy.fullName} -
                                        {data.shopOrders.assignedDeliveryBoy.mobile}</div> :
                                        <div>Waiting for delivery boys to accept order</div>
                                }
                            </div>
                        }

                        <div className='text-right font-semibold text-gray-800 text-lg'>
                            Sub Total: ₹ {data.shopOrders.subTotal}
                        </div>

                        {data.shopOrders.subTotal > 500 ?

                            (<>
                                <div className='text-right border-t border-gray-800 pt-2 font-semibold text-[#ff4d2d] text-lg'>
                                    Restaurant Charges: ₹ 20
                                </div>
                                <div className='text-right font-semibold text-[#ff4d2d] text-lg'>
                                    Delivery Fee: <span className='text-green-500'>Free</span>
                                </div>
                            </>
                            ) :
                            (
                                <>
                                    <div className='text-right border-t border-gray-800 pt-2 font-semibold text-[#ff4d2d] text-lg'>
                                        Restaurant Charges: ₹ 20
                                    </div>
                                    <div className='text-right font-semibold text-[#ff4d2d] text-lg'>
                                        Delivery Charges: ₹ 40
                                    </div>
                                </>

                            )
                        }

                        {data.shopOrders.subTotal > 500 ?

                            (<div className='text-right border-t pt-2 font-semibold text-gray-800 text-lg'>
                                Total Paid: ₹ {data.shopOrders.subTotal + 20}
                            </div>) :
                            (
                                <div className='text-right border-t pt-2 font-semibold text-gray-800 text-lg'>
                                    Total Paid: ₹ {data.shopOrders.subTotal + 60}
                                </div>
                            )
                        }

                    </div>
                </>
                )}
            </div>
        </div>

    )
}

export default OwnerOrderCard
