import { useEffect, useState, useContext } from 'react';
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
    const [filterStatus, setFilterStatus] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("");

    const filteredData = listOrders?.orders?.filter((item) => {
        const usernameMatch = item.User.username.toLowerCase().includes(searchInput.toLowerCase());
        const statusMatch = filterStatus ? item.Shipping_Unit_Orders[0]?.Shipping_Unit_Order_users[0]?.status === filterStatus : true;
        const excludeBeingTransported = item.Shipping_Unit_Orders[0]?.Shipping_Unit_Order_users[0]?.status !== 'Being transported';
        return usernameMatch && statusMatch && (!selectedFilter || excludeBeingTransported);
    });

    useEffect(() => {
        fetchAllOrders();
    }, [currentPage]);

    const fetchAllOrders = async () => {
        let response = await storeDashboardOrder(currentPage, currentLimit, user.account.storeId);

        if (response && response.EC === 0) {
            setListOrders(response.DT);
            setTotalPages(response.DT.totalPages);
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleFailClick = () => {
        if (selectedFilter === "danger") {
            setFilterStatus("");
            setSelectedFilter("");
        } else {
            setFilterStatus("Order delivery failed");
            setSelectedFilter("danger");
        }
        setCurrentPage(1);
    };

    const handleSuccessClick = () => {
        if (selectedFilter === "success") {
            setFilterStatus("");
            setSelectedFilter("");
        } else {
            setFilterStatus("Delivered");
            setSelectedFilter("success");
        }
        setCurrentPage(1);
    };

    return (
        <div className="table-category table">
            <div className="header-table-category header_table">
                <div className='table_manage'>Bảng quản lý đơn hàng</div>
                <div className='buttton'>
                    <button
                        className={`btn btn-danger ${selectedFilter === "danger" ? "active" : ""}`}
                        onClick={handleFailClick}
                    > Fail
                    </button>
                    <button
                        className={`btn btn-success ${selectedFilter === "success" ? "active" : ""}`}
                        onClick={handleSuccessClick}
                    > Success
                    </button>
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
                        <th>Status</th>
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
                                const price = item.total_amount;
                                const formattedPrice = (price * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                return (
                                    <tr key={index}>
                                        <td>
                                            {(currentPage - 1) * currentLimit + index + 1}
                                        </td>
                                        <td>{item.User.username}</td>
                                        <td>{item.OrderItems[0]?.Product_size_color.Product.product_name}</td>
                                        <td>{item.OrderItems[0]?.Product_size_color.Color.name} , {item.OrderItems[0]?.Product_size_color.Size.size_value}</td>
                                        <td>{item.OrderItems[0]?.quantily}</td>
                                        <td>{formattedDate}</td>
                                        <td>{formattedPrice}</td>
                                        <td>{item.Shipping_Unit_Orders[0]?.Shipping_Unit_Order_users[0]?.status || 'Being transported'}
                                        </td>
                                    </tr>
                                )
                            })}
                        </>
                    ) : (
                        <>
                            <tr style={{ textAlign: "center", fontWeight: 600 }}>
                                <td colSpan={8}>Not found ...</td>
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