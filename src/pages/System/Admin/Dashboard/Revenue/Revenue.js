import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import { adminDashboardRevenueByStore, adminDashboardRevenueStoreByDate, adminDashboardRevenueStoreDetailByDate } from '../../../../../services/storeService';

function Revenue() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [listOrdersStore, setListOrdersStore] = useState([]);
    const [listOrderStoreByDate, setListOrderStoreByDate] = useState([]);
    const [searchInputMain, setSearchInputMain] = useState("");
    const [searchInputModal, setSearchInputModal] = useState("");
    const [searchInputDetail, setSearchInputDetail] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalPage, setModalPage] = useState(1);
    const [modalTotalPages, setModalTotalPages] = useState(0);
    const [currentStoreId, setCurrentStoreId] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [detailPage, setDetailPage] = useState(1);
    const [detailTotalPages, setDetailTotalPages] = useState(0);
    const [currentDate, setCurrentDate] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);

    useEffect(() => {
        fetchAllOrders();
    }, [currentPage]);

    useEffect(() => {
        if (isModalOpen) {
            fetchOrdersByDate(currentStoreId);
        }
    }, [modalPage, currentStoreId]);

    useEffect(() => {
        if (isDetailModalOpen) {
            fetchOrderDetails(currentStoreId, currentDate);
        }
    }, [detailPage, currentStoreId, currentDate]);

    const fetchAllOrders = async () => {
        let response = await adminDashboardRevenueByStore(currentPage, currentLimit);

        if (response && response.EC === 0) {
            setListOrdersStore(response.DT);
            setTotalPages(response.DT.totalPages);
        }
    }

    const fetchOrdersByDate = async (storeId) => {
        let response = await adminDashboardRevenueStoreByDate(modalPage, currentLimit, storeId);

        if (response && response.EC === 0) {
            setListOrderStoreByDate(response.DT.dailyRevenue);
            setModalTotalPages(response.DT.totalPages);
        }
    }

    const fetchOrderDetails = async (storeId, date) => {
        let response = await adminDashboardRevenueStoreDetailByDate(detailPage, currentLimit, storeId, date);

        if (response && response.EC === 0) {
            setOrderDetails(response.DT.orders);
            setDetailTotalPages(response.DT.totalPages);
        }
    }

    const handleDetailClick = async (storeId) => {
        setCurrentStoreId(storeId);
        setModalPage(1);
        setIsModalOpen(true);
        setSearchInputMain("");
        await fetchOrdersByDate(storeId);
    }

    const handleDateDetailClick = async (date) => {
        setCurrentDate(date);
        setDetailPage(1);
        setIsDetailModalOpen(true);
        setSearchInputModal("");
        await fetchOrderDetails(currentStoreId, date);
    }

    const filteredData = listOrdersStore?.orders?.filter((item) =>
        item.name.toLowerCase().includes(searchInputMain.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const filteredData2 = listOrderStoreByDate.filter((item) =>
        formatDate(item.order_date).includes(searchInputModal)
    );

    const filteredData3 = orderDetails.filter((item) =>
        item.User.username.toLowerCase().includes(searchInputDetail.toLowerCase())
    );

    const closeModal = () => setIsModalOpen(false);
    const closeDetailModal = () => setIsDetailModalOpen(false);

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    return (
        <div className="table-category table">
            {isDetailModalOpen ? (
                <div>
                    <div className="header-table-category header_table">
                        <div className='table_manage'>Bảng chi tiết doanh thu theo ngày</div>
                        <button
                            className="btn btn-secondary close"
                            onClick={closeDetailModal}
                        >Close
                        </button>
                        <div className="box search3">
                            <form className="sbox">
                                <input
                                    className="stext"
                                    type=""
                                    placeholder="Tìm kiếm ..."
                                    value={searchInputDetail}
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
                                <th>Quantity</th>
                                <th>Total amount</th>
                            </tr>
                        </thead>
                        <tbody style={{ borderBottom: 'none' }}>
                            {filteredData3 && filteredData3.length > 0 ? (
                                <>
                                    {filteredData3.map((item, index) => {
                                        const price = item.total_amount;
                                        const formattedPrice = (price * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                        return (
                                            <tr key={index}>
                                                <td>{(detailPage - 1) * currentLimit + index + 1}</td>
                                                <td>{item.User.username}</td>
                                                <td>{item.OrderItems[0]?.Product_size_color.Product.product_name}</td>
                                                <td>{item.OrderItems[0]?.Product_size_color.Color.name} , {item.OrderItems[0]?.Product_size_color.Size.size_value}
                                                </td>
                                                <td>{item.OrderItems[0]?.quantily}</td>
                                                <td>{formattedPrice}</td>
                                            </tr>
                                        )
                                    })}
                                </>
                            ) : (
                                <tr style={{ textAlign: "center", fontWeight: 600 }}>
                                    <td colSpan={6}>Not found ...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {detailTotalPages > 0 && (
                        <div className="user-footer mt-3">
                            <ReactPaginate
                                nextLabel="sau >"
                                onPageChange={(event) => setDetailPage(event.selected + 1)}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={detailTotalPages}
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
            ) : isModalOpen ? (
                <div>
                    <div className="header-table-category header_table">
                        <div className='table_manage'>Bảng thống kê tổng doanh thu theo ngày</div>
                        <button
                            className="btn btn-secondary close"
                            onClick={closeModal}
                        >Close
                        </button>
                        <div className="box search2">
                            <form className="sbox">
                                <input
                                    className="stext"
                                    type=""
                                    placeholder="Tìm kiếm ..."
                                    value={searchInputModal}
                                    onChange={(e) => setSearchInputModal(e.target.value)}
                                />
                            </form>
                        </div>
                    </div>
                    <table className='table1'>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Date</th>
                                <th>Order</th>
                                <th>Total amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody style={{ borderBottom: 'none' }}>
                            {filteredData2 && filteredData2.length > 0 ? (
                                <>
                                    {filteredData2.map((item, index) => {
                                        const orderDate = new Date(item.order_date);
                                        const day = orderDate.getDate();
                                        const month = orderDate.getMonth() + 1;
                                        const year = orderDate.getFullYear();
                                        const formattedDate = `${day}-${month}-${year}`;
                                        const price = item.total_revenue;
                                        const formattedPrice = (price * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                        return (
                                            <tr key={index}>
                                                <td>{(modalPage - 1) * currentLimit + index + 1}</td>
                                                <td>{formattedDate}</td>
                                                <td>{item.order_count}</td>
                                                <td>{formattedPrice}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={() => handleDateDetailClick(item.order_date)}
                                                    >Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </>
                            ) : (
                                <tr style={{ textAlign: "center", fontWeight: 600 }}>
                                    <td colSpan={5}>Not found ...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {modalTotalPages > 0 && (
                        <div className="user-footer mt-3">
                            <ReactPaginate
                                nextLabel="sau >"
                                onPageChange={(event) => setModalPage(event.selected + 1)}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={modalTotalPages}
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
                                    value={searchInputMain}
                                    onChange={(e) => setSearchInputMain(e.target.value)}
                                />
                            </form>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Store</th>
                                <th>Total order</th>
                                <th>Total amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData && filteredData.length > 0 ? (
                                <>
                                    {filteredData.map((item, index) => {
                                        const price = item.totalAmount;
                                        const formattedPrice = (price * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                        return (
                                            <tr key={index}>
                                                <td>{(currentPage - 1) * currentLimit + index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.confirmedOrdersCount}</td>
                                                <td>{formattedPrice || 0}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-success "
                                                        onClick={() => handleDetailClick(item.id)}
                                                    >Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </>
                            ) : (
                                <tr style={{ textAlign: "center", fontWeight: 600 }}>
                                    <td colSpan={5}>Not found ...</td>
                                </tr>
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