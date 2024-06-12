import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import { useContext } from "react";
import { UserContext } from "../../../../../context/userContext";
import { storeDashboardRevenue, storeDashboardRevenueByDate } from '../../../../../services/storeService';
import Model from './Model';

function Revenue() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [listOrdersByDate, setListOrdersByDate] = useState([]);
    const { user } = useContext(UserContext);
    const [searchInput, setSearchInput] = useState("");
    const [searchInputDetail, setSearchInputDetail] = useState("");
    const [listDetailOrder, setListDetailOrder] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchAllOrders();
    }, [currentPage]);

    const fetchAllOrders = async () => {
        let response = await storeDashboardRevenue(currentPage, currentLimit, user.account.storeId);

        if (response && response.EC === 0) {
            setListOrdersByDate(response.DT);
            setTotalPages(response.DT.totalPages);
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    const filteredData = listOrdersByDate?.dailyRevenue?.filter((item) =>
        formatDate(item.order_date).includes(searchInput)
    );

    const filteredData2 = listDetailOrder?.orders?.filter((item) =>
        item.User.username.toLowerCase().includes(searchInputDetail.toLowerCase())
    );

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleDetailClick = async (date) => {
        let response = await storeDashboardRevenueByDate(currentPage, currentLimit, user.account.storeId, date);

        if (response && response.EC === 0) {
            setListDetailOrder(response.DT);
            setTotalPages(response.DT.totalPages);
            setSearchInput("");
            setIsModalOpen(true);
        }
    }

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="table-category table">
            {isModalOpen ? (
                <Model isOpen={isModalOpen} onClose={closeModal}>
                    <div className="header-table-category header_table">
                        <div className='table_manage'>Bảng thống kê chi tiết</div>
                        <div className="box search1">
                            <form className="sbox">
                                <input
                                    className="stext"
                                    type=""
                                    placeholder="Tìm kiếm ..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInputDetail(e.target.value)}
                                />
                            </form>
                        </div>
                    </div>
                    <table className='table1'>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>User</th>
                                <th>Product</th>
                                <th>Size & color</th>
                                <th>Quantily</th>
                                <th>Total amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData2 && filteredData2.length > 0 ? (
                                <>
                                    {filteredData2.map((item, index) => {
                                        const price = item.total_amount;
                                        const formattedPrice = (price * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {(currentPage - 1) * currentLimit + index + 1}
                                                </td>
                                                <td>{item.User.username}</td>
                                                <td>{item.OrderItems[0]?.ProductAttribute.Product.product_name}</td>
                                                <td>{item.OrderItems[0]?.ProductAttribute.AttributeValue1.name} , {item.OrderItems[0]?.ProductAttribute.AttributeValue2.name}</td>
                                                <td>{item.OrderItems[0]?.quantily}</td>
                                                <td>{formattedPrice}</td>
                                            </tr>
                                        )
                                    })}

                                </>
                            ) : (
                                <>
                                    <tr style={{ textAlign: "center", fontWeight: 600 }}>
                                        <td colSpan={7}>Not found ...</td>
                                    </tr>
                                </>
                            )}
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
                </Model>
            ) : (
                <>
                    <div className="header-table-category header_table">
                        <div className='table_manage'>Bảng quản lý doanh thu</div>
                        <div className="box search">
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
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Date</th>
                                <th>Total order</th>
                                <th>Total amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData && filteredData.length > 0 ? (
                                <>
                                    {filteredData.map((item, index) => {
                                        const orderDate = new Date(item.order_date);
                                        const day = orderDate.getDate();
                                        const month = orderDate.getMonth() + 1;
                                        const year = orderDate.getFullYear();
                                        const formattedDate = `${day}-${month}-${year}`;
                                        const price = item.total_revenue;
                                        const formattedPrice = (price * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {(currentPage - 1) * currentLimit + index + 1}
                                                </td>
                                                <td>{formattedDate}</td>
                                                <td>{item.order_count}</td>
                                                <td>{formattedPrice}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-success "
                                                        onClick={() => handleDetailClick(item.order_date)}
                                                    >Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}

                                </>
                            ) : (
                                <>
                                    <tr style={{ textAlign: "center", fontWeight: 600 }}>
                                        <td colSpan={7}>Not found ...</td>
                                    </tr>
                                </>
                            )}
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
                </>
            )}
        </div>
    );
}

export default Revenue;