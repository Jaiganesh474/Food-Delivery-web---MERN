import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CartItemCard from '../components/CartItemCard'

function CartPage() {
    const navigate = useNavigate()
    const { cartItems, totalAmount } = useSelector(state => state.user)

    return (
        <div className='min-h-screen bg-[#fff9f6] flex justify-center p-6'>
            <div className='w-full max-w-[800px]'>
                <div className='flex items-center gap-[20px] mb-6 relative'>
                    <div className='z-[10px]'>
                        <IoIosArrowRoundBack size={40} className='text-[#ff4d2d] cursor-pointer hover:scale-110 
                        transition-transform' onClick={() => navigate('/')} />
                    </div>

                    <h1 className='text-2xl font-bold text-start'>Your Cart</h1>
                </div>

                {cartItems?.length == 0 ? (
                    <p className='text-gray-900 mt-48 text-3xl text-center'>Your Cart is Empty!</p>
                ) : (
                    <>
                        <div className='space-y-4'>
                            {cartItems?.map((item, index) => (
                                <CartItemCard data={item} key={index} />
                            ))}
                        </div>

                        <div className='mt-6 bg-white p-4 rounded-xl shadow flex justify-between items-center border'>
                            <h1 className='text-lg flex font-semibold'>Sub Total :</h1>
                            <span className='text-xl font-bold text-[#ff4d2d]'>₹ {totalAmount}</span>
                        </div>

                        <div className='mt-6 bg-white p-4 rounded-xl shadow flex justify-between items-center border'>                            
                                <h1 className='text-lg font-semibold'>Restaurant Charges:</h1>
                                <span className='text-xl font-bold text-[#ff4d2d]'>₹20</span> 
                        </div>

                        <div className='mt-6 bg-white p-4 rounded-xl shadow flex justify-between items-center border'>
                            <h1 className='text-xl flex font-semibold'>Total Amount : <p className='text-xs'>(incl.taxes)</p></h1>
                            <span className='text-xl font-bold text-[#ff4d2d]'>₹ {totalAmount+20}</span>
                        </div>

                        <div className='mt-20 flex justify-end'>
                            <button className='bg-[#ff4d2d] cursor-pointer text-white px-6 py-3 rounded-lg text-lg 
                            font-medium hover:bg-[#e64526] transition' onClick={()=>navigate('/checkout')}>
                                PROCEED TO PAY
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CartPage
