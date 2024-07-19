import React, { useEffect, useState } from 'react';
import './DetailOrder.scss';
import ReactPaginate from "react-paginate";

const DetailOrder = ({ orders, onClose }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [orderDetail, setOrderDetail] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        if (orders) {
            setOrderDetail(orders.OrderItems);
            setTotalPages(Math.ceil(orders.length / currentLimit));
        }
    }, [orders, currentLimit]);

    const filteredData = orderDetail.filter((item) =>
        item.ProductAttribute.Product.product_name.toLowerCase().includes(searchInput.toLowerCase())
    );

    const renderViews = () => {
        const startIndex = (currentPage - 1) * currentLimit;
        const selectedOrderDetail = filteredData.slice(startIndex, startIndex + currentLimit);
        if (selectedOrderDetail.length === 0) {
            return (
                <tr style={{ textAlign: "center", fontWeight: 600 }}>
                    <td colSpan="5">Not Found...</td>
                </tr>
            );
        }
        return selectedOrderDetail.map((detail, index) => {
            const formattedPrice = (detail.price_per_item * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            return (
                <tr key={detail.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{detail.ProductAttribute.Product.product_name} ({detail.ProductAttribute.AttributeValue1.name} - {detail.ProductAttribute.AttributeValue2.name} - slg: {detail.quantily})</td>
                    <td>{detail.Order && detail.Order.customerName ? detail.Order.customerName : (detail.Order.User && detail.Order.User.username ? detail.Order.User.username : '')}</td>
                    <td>{detail.Order && detail.Order.phonenumber ? detail.Order.phonenumber : detail.Order.User.phonenumber}</td>
                    <td>{formattedPrice}</td>
                </tr>
            );
        });
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    return (
        <div className="table-category table">
            <div className="header-table-category header_table">
                <div className='table_manage'>Chi tiết đơn hàng</div>
                <button className="btn btn-secondary btn-1" onClick={onClose}>
                    Trở lại
                </button>
                <div className="box search">
                    <form className="sbox">
                        <input
                            className="stext"
                            type="text"
                            placeholder="Tìm kiếm ..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </form>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Product</th>
                        <th>Customer name</th>
                        <th>PhoneNumber</th>
                        <th>Price per item</th>
                    </tr>
                </thead>
                <tbody>
                    {renderViews()}
                </tbody>
            </table>
            {totalPages > 0 && (
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
};

export default DetailOrder;