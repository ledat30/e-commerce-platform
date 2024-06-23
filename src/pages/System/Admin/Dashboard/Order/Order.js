import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import { adminDashboardOrder } from '../../../../../services/storeService';
import Select from "react-select";

function Order() {
    const [overallCurrentPage, setOverallCurrentPage] = useState(1);
    const [overallCurrentLimit] = useState(6);
    const [overallTotalPages, setOverallTotalPages] = useState(0);
    const [searchInputOverall, setSearchInputOverall] = useState("");

    const [detailCurrentPage, setDetailCurrentPage] = useState(1);
    const [detailCurrentLimit] = useState(6);
    const [detailTotalPages, setDetailTotalPages] = useState(0);
    const [searchInputDetail, setSearchInputDetail] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);

    const [listOrders, setListOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [selectedStoreId, setSelectedStoreId] = useState(null);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        let response = await adminDashboardOrder(1, 1000);

        if (response && response.EC === 0) {
            setAllOrders(response.DT.orders);
        }
    };


    const groupByDate = (orders) => {
        return orders.reduce((acc, order) => {
            const orderDate = new Date(order.order_date);
            const formattedDate = `${orderDate.getDate()}-${orderDate.getMonth() + 1}-${orderDate.getFullYear()}`;
            if (!acc[formattedDate]) {
                acc[formattedDate] = [];
            }
            acc[formattedDate].push(order);
            return acc;
        }, {});
    };

    const groupedOrders = groupByDate(allOrders);

    useEffect(() => {
        if (!selectedDate) return;

        const filteredData = allOrders.filter((item) => {
            const matchesSearch = item.User.username.toLowerCase().includes(searchInputDetail.toLowerCase());
            const matchesStore = selectedStoreId ? item.Store?.id === selectedStoreId : true;
            const orderDate = new Date(item.order_date);
            const formattedDate = `${orderDate.getDate()}-${orderDate.getMonth() + 1}-${orderDate.getFullYear()}`;
            const matchesDate = formattedDate === selectedDate;
            return matchesSearch && matchesStore && matchesDate;
        });

        const totalPageCount = Math.ceil(filteredData.length / detailCurrentLimit);
        setDetailTotalPages(totalPageCount);
        const offset = (detailCurrentPage - 1) * detailCurrentLimit;
        const paginatedOrders = filteredData.slice(offset, offset + detailCurrentLimit);
        setListOrders(paginatedOrders);
    }, [searchInputDetail, selectedStoreId, selectedDate, detailCurrentPage, allOrders, detailCurrentLimit]);

    useEffect(() => {
        setDetailCurrentPage(1);
    }, [searchInputDetail, selectedStoreId, selectedDate]);

    useEffect(() => {
        const dates = Object.keys(groupedOrders);
        const filteredDates = dates.filter(date => date.includes(searchInputOverall));

        const totalPageCount = Math.ceil(filteredDates.length / overallCurrentLimit);
        setOverallTotalPages(totalPageCount);
    }, [searchInputOverall, groupedOrders, overallCurrentLimit]);

    const handleRefresh = async () => {
        setSelectedStoreId(null);
        setSearchInputOverall("");
        setOverallCurrentPage(1);
        setSearchInputDetail("");
        setDetailCurrentPage(1);
        setSelectedDate(null);
        await fetchAllOrders();
    };

    const uniqueStores = Array.from(new Set(allOrders.map(item => item.Store?.id)))
        .map(id => {
            const store = allOrders.find(item => item.Store?.id === id).Store;
            return {
                label: store?.name,
                value: store?.id
            };
        });

    const handleOverallPageClick = (event) => {
        setOverallCurrentPage(event.selected + 1);
    };

    const handleDetailPageClick = (event) => {
        setDetailCurrentPage(event.selected + 1);
    };

    const filteredDates = Object.keys(groupedOrders).filter(date => date.includes(searchInputOverall));
    const paginatedDates = filteredDates.slice((overallCurrentPage - 1) * overallCurrentLimit, overallCurrentPage * overallCurrentLimit);

    return (
        <div className="table-category table">
            <div className="header-table-category header_table header_table_prd">
                <div className='table_manage'>Bảng quản lý đơn hàng</div>
                <button
                    title="refresh"
                    className="btn btn-success refresh"
                    onClick={() => handleRefresh()}
                >
                    <i className="fa fa-refresh"></i> Refesh
                </button>
                <div>
                    <Select
                        className='mb-4 select'
                        value={uniqueStores.find(option => option.value === selectedStoreId) || null}
                        onChange={(selected) => {
                            setSelectedStoreId(selected?.value || null);
                        }}
                        options={uniqueStores}
                    />
                </div>
                <div className="box search">
                    <form className="sbox">
                        <input
                            className="stext"
                            type=""
                            placeholder="Tìm kiếm ..."
                            value={selectedDate ? searchInputDetail : searchInputOverall}
                            onChange={(e) => selectedDate ? setSearchInputDetail(e.target.value) : setSearchInputOverall(e.target.value)}
                        />
                    </form>
                </div>
            </div>
            {selectedDate ? (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>User</th>
                                <th>Product</th>
                                <th>Size & Color</th>
                                <th>Quantity</th>
                                <th>Order date</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listOrders.length > 0 ? (
                                listOrders.map((item, index) => {
                                    const orderDate = new Date(item.order_date);
                                    const day = orderDate.getDate();
                                    const month = orderDate.getMonth() + 1;
                                    const year = orderDate.getFullYear();
                                    const formattedDate = `${day}-${month}-${year}`;
                                    const price = item.total_amount;
                                    const formattedPrice = (price * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                    return (
                                        <tr key={index}>
                                            <td>{(detailCurrentPage - 1) * detailCurrentLimit + index + 1}</td>
                                            <td>{item.User.username}</td>
                                            <td>{item.OrderItems[0]?.ProductAttribute.Product.product_name}</td>
                                            <td>{item.OrderItems[0]?.ProductAttribute.AttributeValue1.name} , {item.OrderItems[0]?.ProductAttribute.AttributeValue2.name}</td>
                                            <td>{item.OrderItems[0]?.quantily}</td>
                                            <td>{formattedDate}</td>
                                            <td>{formattedPrice}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr style={{ textAlign: "center", fontWeight: 600 }}>
                                    <td colSpan={7}>Not found ...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {detailTotalPages > 0 && (
                        <div className="user-footer mt-3">
                            <ReactPaginate
                                nextLabel="sau >"
                                onPageChange={handleDetailPageClick}
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
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '350px' }}>No</th>
                                <th style={{ width: '500px' }}>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedDates.length > 0 ? (
                                paginatedDates.map((date, index) => (
                                    <tr key={index}>
                                        <td>{(overallCurrentPage - 1) * overallCurrentLimit + index + 1}</td>
                                        <td>{date}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => setSelectedDate(date)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr style={{ textAlign: "center", fontWeight: 600 }}>
                                    <td colSpan={3}>Not found ...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {overallTotalPages > 0 && (
                        <div className="user-footer mt-3">
                            <ReactPaginate
                                nextLabel="sau >"
                                onPageChange={handleOverallPageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={overallTotalPages}
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
        </div >
    );
}

export default Order;