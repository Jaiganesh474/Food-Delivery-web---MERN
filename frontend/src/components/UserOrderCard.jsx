import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'

function UserOrderCard({ data }) {
    const navigate = useNavigate()
    const [selectedRating, setSelectedRating] = useState({})

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    const handleRating=async(itemId,rating)=>{
        try {
            const result=await axios.post(`${serverUrl}/api/item/rating`,{itemId,rating},{withCredentials:true})

            setSelectedRating(prev=>({
                ...prev,[itemId]:rating
            }))

        } catch (error) {
            console.log(error);
            
        }

    }

    return (
        <div className='bg-white rounded-lg shadow p-4 space-y-4'>
            <div className='flex justify-between border-b pb-2'>
                <div>
                    <p className='font-semibold text-xl'>
                        Order No: #{data._id.slice(-6)}
                    </p>
                    <p className='text-lg text-gray-500 mt-0'>
                        Order Date: {formatDate(data.createdAt)}
                    </p>
                </div>

                <div className='text-right'>
                    {data.paymentMethod == "cod" ? <p className='text-lg text-gray-800'>Pay by {data.paymentMethod?.toUpperCase()}</p> :
                        <p className='text-lg text-gray-800'>Paid by Online Payment:  <span className='font-bold'>
                            {data.payment ? <span className='text-green-600'> Success</span> : <span className='text-red-600'> Failed</span>}</span></p>}


                </div>
            </div>

            {data.shopOrders.map((shopOrder, index) => (
                <div className='border rounded-lg p-3 bg-[#fffaf7] space-y-3' key={index}>
                    <p className='font-semibold text-lg'>{shopOrder.shop.name}</p>

                    <div className='flex space-x-4 overflow-x-auto pb-2'>
                        {shopOrder.shopOrderItems.map((item, index) => (
                            <div key={index} className='flex-shrink-0 w-40 border rounded-lg p-2 bg-white'>
                                <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded' />
                                <p className='text-l font-semibold mt-1'>{item.name}</p>
                                <p className='text-sm text-gray-700'>Qty: {item.quantity} x ₹ {item.price}</p>


                                {shopOrder.status=="delivered" && 
                                    <div className='flex space-x-1 mt-2'>
                                        {[1,2,3,4,5].map((star)=>(
                                            <button className={`text-lg ${selectedRating[item.item._id]>=star 
                                                ? 'text-yellow-400':'text-gray-400'
                                            }`} onClick={()=>handleRating(item.item._id,star)}>
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                }
                            </div>
                        ))}
                    </div>

                    <div className='flex justify-between items-center border-t pt-2'>
                        <p className='font-semibold text-lg'>Subtotal: ₹ {shopOrder.subTotal}</p>

                        <p className='font-semibold text-lg'>Status: {" "}
                            {data.shopOrders?.[0].status == "delivered" ?
                                (
                                    <span className='text-green-600 font-semibold text-lg'>Delivered</span>
                                ) :
                                <span className='font-semibold text-lg text-[#ff4d2d]'>
                                    {data.shopOrders?.[0].status?.charAt(0).toUpperCase() + data.shopOrders?.[0].status?.slice(1)}
                                </span>
                            }
                        </p>
                    </div>
                </div>

            ))}

            {data.shopOrders.subTotal > 500 ?

                (<>
                    <div className='text-right border-t border-gray-800 pt-2 font-semibold text-[#ff4d2d] text-lg'>
                        Restaurant Charges: ₹ 20
                    </div>
                    <div className='text-right border-t border-gray-800 pt-2 font-semibold text-[#ff4d2d] text-lg'>
                        Delivery Fee: <span className='text-green-500'>Free</span>
                    </div>
                </>

                ) :
                (
                    <>
                        <div className='flex  font-semibold text-[#ff4d2d] text-lg'>
                            Restaurant Charges: ₹ 20
                        </div>

                    </>

                )
            }


            <div className='flex justify-between items-center border-t pt-2'>
                <p className='font-semibold text-xl'>Order Total: ₹ {data.totalAmount}</p>

                <button className='bg-[#ff4d2d] hover:bg-[#e64526] cursor-pointer hover:scale-102 transition-transform 
                text-white px-4 py-2 rounded-lg' onClick={() => navigate(`/track-order/${data._id}`)}>
                    Track Order
                </button>
            </div>
        </div>
    )
}

export default UserOrderCard
