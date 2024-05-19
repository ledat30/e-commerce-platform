import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import { useContext } from "react";
import { UserContext } from "../../../../../context/userContext";
import { shipperDashboardOrder } from '../../../../../services/productService';

function Order() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [listOrders, setListOrders] = useState([]);
    const { user } = useContext(UserContext);
    const [searchInput, setSearchInput] = useState("");

    const filteredData = listOrders?.orders?.filter((item) =>
        item.Shipping_Unit_Order.Order.User.username.toLowerCase().includes(searchInput.toLowerCase())
    );

    useEffect(() => {
        fetchAllOrders();
    }, [currentPage]);

    const fetchAllOrders = async () => {
        let response = await shipperDashboardOrder(currentPage, currentLimit, user.account.id);

        if (response && response.EC === 0) {
            setListOrders(response.DT);
            setTotalPages(response.DT.totalPages);
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    return (
        <div className="table-category table">
            <div className="header-table-category header_table">
                <div className='table_manage'>Bảng quản lý đơn hàng</div>
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
                        <th>Payment method</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData && filteredData.length > 0 ? (
                        <>
                            {filteredData.map((item, index) => {
                                const orderDate = new Date(item.Shipping_Unit_Order.Order.order_date);
                                const day = orderDate.getDate();
                                const month = orderDate.getMonth() + 1;
                                const year = orderDate.getFullYear();
                                const formattedDate = `${day}-${month}-${year}`;
                                const price = item.Shipping_Unit_Order.Order.total_amount;
                                const formattedPrice = (price * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                return (
                                    <tr key={index}>
                                        <td>
                                            {(currentPage - 1) * currentLimit + index + 1}
                                        </td>
                                        <td>{item.Shipping_Unit_Order.Order.User.username}</td>
                                        <td>{item.Shipping_Unit_Order.Order.OrderItems[0]?.Product_size_color.Product.product_name}</td>
                                        <td>{item.Shipping_Unit_Order.Order.OrderItems[0]?.Product_size_color.Color.name} , {item.Shipping_Unit_Order.Order.OrderItems[0]?.Product_size_color.Size.size_value}</td>
                                        <td>{item.Shipping_Unit_Order.Order.OrderItems[0]?.quantily}</td>
                                        <td>{formattedDate}</td>
                                        <td>{formattedPrice}</td>
                                        <td>{item.Shipping_Unit_Order.Order.PaymentMethod.method_name}</td>
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