import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import { adminDashboardOrder } from '../../../../../services/storeService';
import Select from "react-select";

function Order() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [listOrders, setListOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [selectedStoreId, setSelectedStoreId] = useState(null);

    useEffect(() => {
        const filteredData = allOrders.filter((item) => {
            const matchesSearch = item.User.username.toLowerCase().includes(searchInput.toLowerCase());
            const matchesStore = selectedStoreId ? item.Store?.id === selectedStoreId : true;
            return matchesSearch && matchesStore;
        });

        const totalPageCount = Math.ceil(filteredData.length / currentLimit);
        setTotalPages(totalPageCount);
        const offset = (currentPage - 1) * currentLimit;
        const paginatedOrders = filteredData.slice(offset, offset + currentLimit);
        setListOrders(paginatedOrders);
    }, [searchInput, selectedStoreId, currentPage, allOrders, currentLimit]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchInput, selectedStoreId]);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        let response = await adminDashboardOrder(1, 1000);

        if (response && response.EC === 0) {
            setAllOrders(response.DT.orders);
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const uniqueStores = Array.from(new Set(allOrders.map(item => item.Store?.id)))
        .map(id => {
            const store = allOrders.find(item => item.Store?.id === id).Store;
            return {
                label: store?.name,
                value: store?.id
            };
        });

    const handleRefresh = async () => {
        setSelectedStoreId(null);
        setSearchInput("");
        setCurrentPage(1);
        await fetchAllOrders();
    };

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
                        <th>User</th>
                        <th>Product</th>
                        <th>Size & Color</th>
                        <th>Quantity</th>
                        <th>Order date</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {listOrders && listOrders.length > 0 ? (
                        <>
                            {listOrders.map((item, index) => {
                                const orderDate = new Date(item.order_date);
                                const day = orderDate.getDate();
                                const month = orderDate.getMonth() + 1;
                                const year = orderDate.getFullYear();
                                const formattedDate = `${day}-${month}-${year}`;
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
                                        <td>{formattedDate}</td>
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
        </div>
    );
}

export default Order;