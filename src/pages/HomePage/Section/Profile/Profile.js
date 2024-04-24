import './Profile.scss';
import React, { useState } from 'react';
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import HeaderHome from "../../HeaderHome/HeaderHome";
import Footer from "../../Footer/Footer";

function Profile() {
    const { user } = useContext(UserContext);
    console.log(user);
    const [activeTab, setActiveTab] = useState('orders');
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
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
                        <div className='content_right'>
                            <div className='title'>
                                Hồ sơ người dùng
                            </div>
                            <div className='name_user'>
                                Họ và tên : {user.account.username}
                                <button
                                    title="Edit"
                                    className="btn btn-warning button"
                                >
                                    <i className="fa fa-pencil"></i>
                                </button>
                            </div>
                            <div className='name_user'>
                                Email cá nhân : {user.account.email}
                                <button
                                    title="Edit"
                                    className="btn btn-warning button"
                                >
                                    <i className="fa fa-pencil"></i>
                                </button>
                            </div>
                            <div className='address'>
                                Địa chỉ : {user.account.address}
                                <button
                                    title="Edit"
                                    className="btn btn-warning button"
                                >
                                    <i className="fa fa-pencil"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Profile;