import './Profile.scss';
import React, { useState, useRef, useEffect } from 'react';
import ReactPaginate from "react-paginate";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import HeaderHome from "../../HeaderHome/HeaderHome";
import Footer from "../../Footer/Footer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { editProfile } from '../../../../services/userService';
import { getreadStatusOrderWithPagination, cancelOrder } from '../../../../services/productService';
const { Buffer } = require("buffer");

function Profile() {
    const { user, handleUpdateUserInfo } = useContext(UserContext);
    let navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });
    const [usernameInput, setUsernameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [addressInput, setAddressInput] = useState('');
    const [activeTab, setActiveTab] = useState('orders');
    const contentRef = useRef(null);
    const [listProducts, setListProducts] = useState([]);
    console.log(listProducts);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    const fetchProducts = async () => {
        let response = await getreadStatusOrderWithPagination(currentPage, currentLimit, user.account.id);

        if (response && response.EC === 0) {
            setListProducts(response.DT.products);
            setTotalPages(response.DT.totalPages);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

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

    const handleDeleteProduct = async (orderId) => {
        console.log(orderId);
        try {
            await cancelOrder(orderId);
            toast.success("Product removed successfully");
            fetchProducts();

        } catch (error) {
            console.error("Error deleting product from cart:", error);
            toast.error("Failed to remove product from cart");
        }
    }

    const handleHome = () => {
        navigate("/home");
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
                            {listProducts.map((order, index) => {
                                return (
                                    <div className='product' key={index}>
                                        {order.OrderItems.map((item, itemIndex) => {
                                            const formattedTotalAmount = (order.total_amount * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                            let imageBase64 = '';
                                            if (item.Product_size_color.Product.image) {
                                                imageBase64 = new Buffer.from(item.Product_size_color.Product.image, 'base64').toString('binary');
                                            }
                                            return (
                                                <div key={itemIndex} className='product_item'>
                                                    <div className='name-order'>
                                                        Tên đơn hàng
                                                        <div className='name-product'>
                                                            {item.Product_size_color.Product.product_name}
                                                        </div>
                                                        <span className='quantity'>Số lượng : x{item.quantily}</span> , <span className='total_price'>Tổng tiền : <span className='price'>{formattedTotalAmount}</span></span>
                                                        <div style={{ backgroundImage: `url(${imageBase64})` }} className='img_product'>
                                                        </div>
                                                    </div>
                                                    <div className='status-order'>
                                                        Trạng thái đơn hàng
                                                        <div className='status'>
                                                            {order.status === "Processing" && (
                                                                <>
                                                                    <div className='order_status'>Đơn hàng đã được đặt thành công</div>
                                                                    <span className='icon_status'>
                                                                        <i className="fa fa-long-arrow-down" aria-hidden="true"></i>
                                                                    </span>
                                                                </>
                                                            )}
                                                            {order.status === "confirmed" && (
                                                                <>
                                                                    <div className='order_status'>Đã xác nhận từ cửa hàng</div>
                                                                    <span className='icon_status'>
                                                                        <i className="fa fa-long-arrow-down" aria-hidden="true"></i>
                                                                    </span>
                                                                </>
                                                            )}

                                                            {order.Shipping_Unit_Orders.map((item, index) => {
                                                                return (
                                                                    <>
                                                                        <div className='order_status' key={index}>
                                                                            {item.status === 'Received from store' && (
                                                                                <>Đơn vị vận chuyển đã nhận đơn hàng</>
                                                                            )}
                                                                        </div>
                                                                        <span className='icon_status'>
                                                                            <i className="fa fa-long-arrow-down" aria-hidden="true"></i>
                                                                        </span>
                                                                    </>
                                                                )
                                                            })}
                                                            {/* <div className='order_status'>Đã giao hàng</div> */}
                                                        </div>
                                                    </div>
                                                    <div className='cancel'>
                                                        {order.status === "Processing" ? (
                                                            <div>
                                                                Bạn muốn huỷ đơn <button className="btn btn-success" onClick={() => handleDeleteProduct(order.id)}>
                                                                    <i className="fa fa-trash-o" aria-hidden="true"></i> Huỷ đơn
                                                                </button>
                                                            </div>

                                                        ) : (
                                                            <p>Đơn hàng đã xác nhận không thể huỷ</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}

                            {listProducts.length === 0 && (
                                <>
                                    <div className="no_product">
                                        <span className="title_no-product">Chưa có sản phẩm nào ?</span>
                                        <p className="click_buy" onClick={handleHome}>Mua ngay</p>
                                    </div>
                                </>
                            )}

                            {totalPages > 0 && listProducts.length > 0 && (
                                <div className="user-footer mt-3">
                                    <ReactPaginate
                                        nextLabel="sau >"
                                        onPageChange={handlePageClick}
                                        pageRangeDisplayed={3}
                                        marginPagesDisplayed={2}
                                        pageCount={totalPages}
                                        previousLabel="< Trước"
                                        pageClassName="page-item"
                                        pageLinkClassName="page-link"
                                        previousClassName="page-item"
                                        previousLinkClassName="page-link"
                                        nextClassName="page-item"
                                        nextLinkClassName="page-link"
                                        breakLabel="..."
                                        breakClassName="page-item"
                                        breakLinkClassName="page-link"
                                        containerClassName="pagination justify-content-center"
                                        activeclassname="active"
                                        renderOnZeroPageCount={null}
                                    />
                                </div>
                            )}
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
