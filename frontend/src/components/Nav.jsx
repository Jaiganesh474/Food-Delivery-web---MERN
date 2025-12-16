import React, { useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import { IoIosSearch } from 'react-icons/io'
import { FiShoppingCart } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { Box, LogOut, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { RxCross2 } from 'react-icons/rx'
import axios from 'axios'
import { serverUrl } from '../App'
import { setSearchItems, setUserData } from '../redux/userSlice'
import { FaPlus } from "react-icons/fa";
import { TbReceiptRupee } from "react-icons/tb";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { useEffect } from 'react'

function Nav() {
    const { userData, currentCity, cartItems } = useSelector(state => state.user)
    const { myShopData } = useSelector(state => state.owner)
    const [showInfo, setShowInfo] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [query, setQuery] = useState("")

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error);
        }
    }

    const handleSearchItems = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`, { withCredentials: true })
            dispatch(setSearchItems(result.data))

        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        if(query){
            handleSearchItems()
        }else{
            dispatch(setSearchItems(null))
        }
    }, [query])

    return (
        <div className='w-full h-[80px] flex items-center justify-between md:justify-center gap-[50px] px-[10px] fixed top-0 z-[9999]
    bg-[#fff9f6] overflow-visible'>
            {showSearch && userData.role == "User" &&
                <div className='md:w-[90%] md:hidden mt-2 lg:w-[40%] hover:scale-105 hover:text-orange-600 transition-transform h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] flex fixed top-[80px] left-[5%]'>
                    <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
                        <FaLocationDot size={25} className='text-[#ff4d2d]' />
                        <div className='w-[80%] truncate text-gray-600'>{currentCity}</div>
                    </div>

                    <div className='w-[80%] flex items-center gap-[10px]'>
                        <IoIosSearch size={25} className='text-[#ff4d2d]' />
                        <input type="text" placeholder='Search your favourite dish...' className='px-[10px] text-gray-700 outline-0 w-full'
                            onChange={(e) => setQuery(e.target.value)} value={query} />
                    </div>
                </div>
            }

            {userData.role == "User" &&
                <h1 className='text-2xl font-extrabold hover:scale-105 hover:text-orange-600 
            transition-transform cursor-pointer text-[#ff4d2d]' onClick={() => navigate('/')}>EatSure</h1>
            }

            {userData.role == "Owner" &&
                <h1 className='text-2xl font-extrabold hover:scale-105 hover:text-orange-600 
            transition-transform cursor-pointer text-[#ff4d2d]' onClick={() => navigate('/')}>EatSure Owner Platform</h1>
            }

            {userData.role == "Deliveryboy" &&
                <h1 className='text-2xl font-extrabold hover:scale-105 hover:text-orange-600 
            transition-transform cursor-pointer text-[#ff4d2d]' onClick={() => navigate('/')}>EatSure Delivery</h1>
            }
            {userData.role == "User" &&
                <div className='md:w-[60%] lg:w-[40%] hover:scale-102 transition-transform h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] hidden md:flex'>
                    <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
                        <FaLocationDot size={25} className='text-[#ff4d2d] cursor-pointer' />
                        <div className='w-[80%] cursor-pointer truncate text-gray-600'>{currentCity}</div>
                    </div>

                    <div className='w-[80%] flex items-center gap-[10px]'>
                        <IoIosSearch size={25} className='text-[#ff4d2d]' />
                        <input type="text" placeholder='Search your favourite dish...' className='px-[10px] text-gray-700 outline-0 w-full'
                            onChange={(e) => setQuery(e.target.value)} value={query} />
                    </div>
                </div>
            }

            <div className='flex items-center gap-4'>
                {userData.role == "User" && (
                    showSearch ? <RxCross2 size={25} className='text-[#ff4d2d] md:hidden' onClick={() => setShowSearch(false)} />
                        : <IoIosSearch size={25} className='text-[#ff4d2d] md:hidden' onClick={() => setShowSearch(true)} />)
                }

                {userData.role == "Owner" ?
                    <>
                        {myShopData && <>
                            <button className='hidden md:flex items-center font-bold gap-2 p-2 cursor-pointer rounded-full
                             bg-[#ff4d2d]/10 text-[#ff4d2d] hover:scale-105 hover:text-orange-600 transition-transform'
                                onClick={() => navigate("/add-item")} >
                                <FaPlus size={20} className='' />
                                <span>Add Food Item</span>
                            </button>
                            <button className='md:hidden flex items-center font-bold p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10
                             text-[#ff4d2d] hover:scale-105 hover:text-orange-600 transition-transform'
                                onClick={() => navigate("/add-item")}>
                                <FaPlus size={20} className='' />
                            </button>
                        </>}


                        <div className='hidden md:flex items-center gap-2 font-bold cursor-pointer pr-2 rounded-full relative p-2 bg-[#ff4d2d]/10 text-[#ff4d2d] hover:scale-105 hover:text-orange-600 transition-transform'
                            onClick={() => navigate('/my-orders')}>
                            <TbReceiptRupee size={20} />
                            <span>My Orders</span>
                            
                        </div>
                       
                    </> :
                    (
                        <>
                            {userData.role == "User" &&
                                <div className='relative cursor-pointer hover:scale-105 hover:text-orange-600 transition-transform' onClick={() => navigate('/cart')}>
                                    <FiShoppingCart size={25} className='text-[#ff4d2d]' />
                                    <span className='absolute right-[-9px] w-[18px] flex items-center justify-center bg-[#ff4d2d] 
                                text-white h-[18px] rounded-full top-[-12px]'>
                                        {cartItems.length}</span>
                                </div>
                            }

                            <button className='hidden md:flex items-center gap-1 font-bold p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10
                 text-[#ff4d2d] hover:scale-105 hover:text-orange-600 transition-transform' onClick={() => navigate('/my-orders')}>
                                <Box size={18} />My Orders
                            </button>

                        </>
                    )
                }


                <div className='w-[38px] h-[38px] hover:scale-110 transition-transform rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer'
                    onClick={() => setShowInfo(prev => !prev)}>
                    {userData?.fullName.slice(0, 1)}
                </div>
                {
                    userData.role == "Owner" &&
                    showInfo &&
                    <div className='fixed mt-2 transition-transform  top-[80px] right-[10px] md:right-[20%] lg:right-[35%] w-[180px] bg-white shadow-2xl rounded-xl
                p-[20px] flex flex-col gap-[10px] z-[9999]'>
                        <div className='text-[17px] gap-2 font-medium inline-flex'>
                            <User size={20} />{userData.fullName}
                        </div>
                        {userData.role == 'Owner' &&
                            <div className='md:hidden text-[#ff4d2d] text-[17px] font-medium gap-2 cursor-pointer inline-flex' onClick={() => navigate('/my-orders')}><Box size={20} />{" "}My Orders</div>

                        }
                        <div className='text-[#ff4d2d] font-medium hover:scale-102 transition-transform text-[17px] gap-2 cursor-pointer inline-flex' onClick={handleLogOut}><LogOut size={20} />Log out</div>
                    </div>
                }

                {userData.role == "User" && showInfo &&
                    <div className='fixed mt-2 transition-transform top-[80px] right-[10px] md:right-[20%] lg:right-[20%] w-[180px] bg-white shadow-2xl rounded-xl
                p-[20px] flex flex-col gap-[10px] z-[9999]'>
                        <div className='text-[17px] gap-2 font-medium inline-flex'>
                            <User size={20} />{userData.fullName}
                        </div>
                        {userData.role == 'User' &&
                            <div className='md:hidden text-[#ff4d2d] text-[17px] font-medium gap-2 cursor-pointer inline-flex' onClick={() => navigate('/my-orders')}><Box size={20} />{" "}My Orders</div>

                        }
                        <div className='text-[#ff4d2d] font-medium hover:scale-102 transition-transform text-[17px] gap-2 cursor-pointer inline-flex' onClick={handleLogOut}><LogOut size={20} />Log out</div>
                    </div>
                }

                {
                    userData.role == "Deliveryboy" &&
                    showInfo &&
                    <div className='fixed mt-2 transition-transform  top-[80px] right-[10px] md:right-[25%] lg:right-[40%] w-[180px] bg-white shadow-2xl rounded-xl
                p-[20px] flex flex-col gap-[10px] z-[9999]'>
                        <div className='text-[17px] gap-2 font-medium inline-flex'>
                            <MdOutlineDeliveryDining size={20} />{userData.fullName}
                        </div>
                        {userData.role == 'Deliveryboy' &&
                            <div className='md:hidden text-[#ff4d2d] text-[17px] font-medium gap-2 cursor-pointer inline-flex' onClick={() => navigate('/my-orders')}><Box size={20} />{" "}My Orders</div>

                        }
                        <div className='text-[#ff4d2d] font-medium hover:scale-102 transition-transform text-[17px] gap-2 cursor-pointer inline-flex' onClick={handleLogOut}><LogOut size={20} />Log out</div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Nav
