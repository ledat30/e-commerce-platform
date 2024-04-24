import './Profile.scss';
import React, { useState, useRef, useEffect } from 'react';
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import HeaderHome from "../../HeaderHome/HeaderHome";
import Footer from "../../Footer/Footer";
import { toast } from "react-toastify";
import { editProfile } from '../../../../services/userService';

function Profile() {
    const { user, handleUpdateUserInfo } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });
    const [usernameInput, setUsernameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [addressInput, setAddressInput] = useState('');
    const [activeTab, setActiveTab] = useState('orders');
    const contentRef = useRef(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setUsernameInput(user.account.username);
        setEmailInput(user.account.email);
        setAddressInput(user.account.address);
    }, [user]);

    const handleClickOutside = (event) => {
        if (contentRef.current && !contentRef.current.contains(event.target)) {
            if (event.target.tagName !== "BUTTON" || !event.target.classList.contains("submit-button")) {
                setIsEditing(false);
                setEditedUser({ ...user });
            }
        }
    };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') setUsernameInput(value);
        if (name === 'email') setEmailInput(value);
        if (name === 'address') setAddressInput(value);
        e.stopPropagation();
    };

    const handleSubmit = async () => {
        const data = {
            id: user.account.id,
            username: usernameInput,
            email: emailInput,
            address: addressInput,
        };
        try {
            const response = await editProfile(data);
            if (response && response.EC === 0) {
                toast.success(response.EM);
                handleUpdateUserInfo(data);
                setIsEditing(false);
            } else {
                toast.error(response.EM);
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="container_profile">
            <HeaderHome />
            <div className="grid wide container">
                <div className='title_main'>
                    <div className={`title_order ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => handleTabClick('orders')}>
                        Đơn hàng
                    </div>
                    <div className='seperate'>|</div>
                    <div className={`title_profile ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => handleTabClick('profile')}>
                        Hồ sơ cá nhân
                    </div>
                </div>
                <div className='content'>
                    {activeTab === 'orders' && (
                        <div className='content_left'>
                            <div className='product'>
                                <div className='name-order'>
                                    Tên đơn hàng
                                    <div className='name-product'>
                                        Sữa rửa mặt carave dịu nhẹ với mọi loại da
                                    </div>
                                    <span className='quantity'>Số lượng : x3</span> , <span className='total_price'>Tổng tiền : <span className='price'>120.000.000đ</span></span>
                                    <div className='img_product'>
                                        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTggfOap8_Hn9mHErpcIh6h0nmlr1XLMtf7fQ&s' className='img'></img>
                                    </div>
                                </div>
                                <div className='status-order'>
                                    Trạng thái đơn hàng
                                    <div className='status'>
                                        Đang được giao
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'profile' && (
                        <div className='content_right' ref={contentRef}>
                            <div className='title'>
                                Hồ sơ người dùng
                            </div>
                            <div className='name_user'>
                                Họ và tên : {isEditing ? (
                                    <input
                                        type="text"
                                        name="username"
                                        value={usernameInput}
                                        onChange={handleInputChange}
                                        className='input'
                                    />
                                ) : (
                                    user.account.username
                                )}
                                <button
                                    title="Edit"
                                    className="btn btn-warning button"
                                    onClick={handleEditClick}
                                >
                                    <i className="fa fa-pencil"></i>
                                </button>
                            </div>
                            <div className='name_user'>
                                Email cá nhân : {isEditing ? (
                                    <input
                                        type="text"
                                        name="email"
                                        value={emailInput}
                                        onChange={handleInputChange}
                                        className='input'
                                    />
                                ) : (
                                    user.account.email
                                )}
                                <button
                                    title="Edit"
                                    className="btn btn-warning button"
                                    onClick={handleEditClick}
                                >
                                    <i className="fa fa-pencil"></i>
                                </button>
                            </div>
                            <div className='address'>
                                Địa chỉ : {isEditing ? (
                                    <input
                                        type="text"
                                        name="address"
                                        value={addressInput}
                                        onChange={handleInputChange}
                                        className='input'
                                    />
                                ) : (
                                    user.account.address
                                )}
                                <button
                                    title="Edit"
                                    className="btn btn-warning button"
                                    onClick={handleEditClick}
                                >
                                    <i className="fa fa-pencil"></i>
                                </button>
                            </div>
                            {isEditing && (
                                <button
                                    className="btn btn-success submit"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Profile;
