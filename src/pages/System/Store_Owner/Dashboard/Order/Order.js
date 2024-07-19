import './Order.scss';
import React, { useEffect, useState, useContext } from 'react';
import ReactPaginate from "react-paginate";
import { UserContext } from "../../../../../context/userContext";
import { storeDashboardOrder } from '../../../../../services/storeService';

function Order() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [listOrders, setListOrders] = useState([]);
    const { user } = useContext(UserContext);
    const [searchInput, setSearchInput] = useState("");
    const [expandedDate, setExpandedDate] = useState(null);
    const [detailedOrders, setDetailedOrders] = useState([]);
    const [detailedTotalPages, setDetailedTotalPages] = useState(0);
    const [detailedCurrentPage, setDetailedCurrentPage] = useState(1);
    const [searchDate, setSearchDate] = useState("");

    useEffect(() => {
        fetchAllOrders();
    }, [currentPage]);

    useEffect(() => {
        if (expandedDate) {
            fetchDetailedOrders();
        }
    }, [expandedDate, detailedCurrentPage]);

    const fetchAllOrders = async () => {
        let response = await storeDashboardOrder(currentPage, currentLimit, user.account.storeId);

        if (response && response.EC === 0) {
            setListOrders(response.DT);
            setTotalPages(response.DT.totalPages);
        }
    }

    const fetchDetailedOrders = async () => {
        let response = await storeDashboardOrder(detailedCurrentPage, currentLimit, user.account.storeId, expandedDate, searchInput);

        if (response && response.EC === 0) {
            setDetailedOrders(response.DT.orders);
            setDetailedTotalPages(response.DT.totalPages);
        }
    }

    const groupOrdersByDate = () => {
        if (!listOrders.orders || listOrders.orders.length === 0) {
            return {};
        }

        const filteredData = listOrders.orders.filter((item) => {
            const usernameMatch = item.User.username.toLowerCase().includes(searchInput.toLowerCase());
            const dateMatch = searchDate ? new Date(item.order_date).toLocaleDateString() === new Date(searchDate).toLocaleDateString() : true;
            return usernameMatch && dateMatch;
        });

        const grouped = filteredData.reduce((acc, order) => {
            const orderDate = new Date(order.order_date).toLocaleDateString();
            if (!acc[orderDate]) {
                acc[orderDate] = [];
            }
            acc[orderDate].push(order);
            return acc;
        }, {});
        return grouped;
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleDetailedPageClick = async (event) => {
        setDetailedCurrentPage(+event.selected + 1);
    };

    const handleToggleExpand = (date) => {
        setExpandedDate(expandedDate === date ? null : date);
        setDetailedCurrentPage(1);
    }

    const groupedOrders = groupOrdersByDate();
    return (
        <div className="table-category table">
            {expandedDate ? (
                <>
                    <div>
                        <div className="box search search_detail">
                            <form className="sbox">
                                <input
                                    className="stext"
                                    type=""
                                    placeholder="Tìm kiếm ..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </form>
                        </div>
                        <div className='button_'>
                            <div>
                                <button className="btn btn-primary" onClick={() => setExpandedDate(null)}>Back</button>
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>CustomerName</th>
                                    <th>Product</th>
                                    <th>PhoneNumber</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody style={{ borderBottom: 'none' }}>
                                {Object.keys(groupedOrders).length > 0 ? (
                                    Object.keys(groupedOrders).map((date, index) => (
                                        <React.Fragment key={index}>
                                            {expandedDate === date && groupedOrders[date].map((item, idx) => {
                                                const orderDate = new Date(item.order_date);
                                                const day = orderDate.getDate();
                                                const month = orderDate.getMonth() + 1;
                                                const year = orderDate.getFullYear();
                                                const formattedDate = `${day}-${month}-${year}`;
                                                const price = item.total_amount;
                                                const formattedPrice = (price * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                                return (
                                                    <tr key={idx} style={{ borderStyle: 'none' }}>
                                                        <td>{idx + 1}</td>
                                                        <td>{item.OrderItems[0].Order && item.OrderItems[0].Order.customerName ? item.OrderItems[0].Order.customerName : item.User.username}</td>
                                                        <td>{item.OrderItems[0]?.ProductAttribute.Product.product_name} ({item.OrderItems[0]?.ProductAttribute.AttributeValue1.name} , {item.OrderItems[0]?.ProductAttribute.AttributeValue2.name} , slg: {item.OrderItems[0]?.quantily})</td>
                                                        <td>{item.OrderItems[0].Order && item.OrderItems[0].Order.phonenumber ? item.OrderItems[0].Order.phonenumber : item.User.phonenumber}</td>
                                                        <td>{formattedDate}</td>
                                                        <td>{formattedPrice}</td>
                                                        <td>{item.Shipping_Unit_Orders[0]?.Shipping_Unit_Order_users[0]?.status || 'Being transported'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3}>No orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table >
                        {detailedTotalPages > 0 && (
                            <div className="user-footer mt-3">
                                <ReactPaginate
                                    nextLabel="sau >"
                                    onPageChange={handleDetailedPageClick}
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
                    </div >
                </>
            ) : (
                <>
                    <div className="header-table-category header_table">
                        <div className='table_manage'>Bảng quản lý đơn hàng</div>
                    </div>
                    <div className="box search search_date">
                        <form className="sbox">
                            <input
                                className="stext"
                                type="date"
                                placeholder="Chọn ngày"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                            />
                        </form>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '200px' }}>No</th>
                                <th style={{ width: '380px' }}>Date</th>
                                <th style={{ width: '300px' }}>Orders</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(groupedOrders).length > 0 ? (
                                Object.keys(groupedOrders).map((date, index) => (
                                    <tr key={index}>
                                        <td>{(detailedTotalPages - 1) * detailedCurrentPage + index + 1}</td>
                                        <td>{date}</td>
                                        <td>{groupedOrders[date].length}</td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => handleToggleExpand(date)}>View Details</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr style={{ textAlign: "center", fontWeight: 600 }}>
                                    <td colSpan={4}>Not found ...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>

            )}
            {totalPages > 0 && !expandedDate && (
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
    );
}

export default Order;