import React, { useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { FaTrash } from "react-icons/fa";
import { removeCartItem, updateQuantity } from '../redux/userSlice';

function CartItemCard({ data }) {
    
    const { cartItems } = useSelector(state => state.user)
    const dispatch = useDispatch()

    const handleIncrease = (id, currentQty) => {
        dispatch(updateQuantity({ id, quantity: currentQty + 1 }))
    }
    const handleDecrease = (id, currentQty) => {
        if (currentQty>1) {
            dispatch(updateQuantity({ id, quantity: currentQty - 1 }))
        }
    }
    return (
        <div className='flex items-center justify-between mb-4 bg-white p-4 rounded-xl shadow border'>
            <div className='flex items-center gap-4'>
                <img src={data.image} alt="" className='w-20 h-20 object-cover rounded-lg border' />

                <div>
                    <h1 className='font-semibold text-xl text-gray-800'>{data.name}</h1>
                    <p>Items - <p className='font-medium inline-flex'>₹ {data.price} x {data.quantity} Nos.</p></p>
                    <p>Total - <p className='font-bold mt-2 inline-flex'>₹ {data.price * data.quantity}</p></p>
                </div>
            </div>

            <div className='flex items-center gap-3'>
                <button className='p-2 bg-gray-200 cursor-pointer rounded-full hover:bg-gray-300 duration-300'
                    onClick={() => handleDecrease(data.id, data.quantity)}>
                    <FaMinus size={14} />
                </button>

                <span className='font-semibold text-l'>{data.quantity}</span>

                <button className='p-2 bg-gray-200 cursor-pointer rounded-full hover:bg-gray-300 duration-200'
                    onClick={() => handleIncrease(data.id, data.quantity)} >
                    <FaPlus size={14} />
                </button>

                <button className='p-2 bg-red-100 text-red-500 ml-2 cursor-pointer rounded-full hover:bg-red-200'
                onClick={()=>dispatch(removeCartItem(data.id))}>
                    <FaTrash size={14} />
                </button>
            </div>
        </div>
    )
}

export default CartItemCard
