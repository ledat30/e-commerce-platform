import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import { useContext } from "react";
import { UserContext } from "../../../../../context/userContext";
import { shipperDashboardRevenue, shipperDashboardDetailRevenue } from '../../../../../services/productService';
import Model from './Model';

function Revenue() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [listOrdersByDate, setListOrdersByDate] = useState([]);
    const { user } = useContext(UserContext);
    const [searchInput, setSearchInput] = useState("");
    const [listDetailOrder, setListDetailOrder] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchAllOrders();
    }, [currentPage]);

    const fetchAllOrders = async () => {
        let response = await shipperDashboardRevenue(currentPage, currentLimit, user.account.id);

        if (response && response.EC === 0) {
            setListOrdersByDate(response.DT);
            setTotalPages(response.DT.totalPages);
        }
    }
    const filteredData = listOrdersByDate?.dailyRevenue?.filter((item) =>
        item.order_date.toLowerCase().includes(searchInput.toLowerCase())
    );

    const filteredData2 = listDetailOrder?.orders?.filter((item) =>
        item.Shipping_Unit_Order.Order.User.username.toLowerCase().includes(searchInput.toLowerCase())
    );

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleDetailClick = async (date) => {
        let response = await shipperDashboardDetailRevenue(currentPage, currentLimit, user.account.id, date);

        if (response && response.EC === 0) {
            setListDetailOrder(response.DT);
            setTotalPages(response.DT.totalPages);
            setIsModalOpen(true);
        }
    }

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="table-category table">
            {isModalOpen ? (
                <Model isOpen={isModalOpen} onClose={closeModal}>
                    <div className="header-table-category header_table">
                        <div className='table_manage'>Bảng thống kê chi tiết <span style={{ color: "red", fontSize: '14px' }}>(* mỗi đơn hàng sẽ được trả là 10.000vnđ)</span>
                        </div>
                        <div className="box search1">
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
                    <table className='table1'>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>User</th>
                                <th>Product</th>
                                <th>Size & color</th>
                                <th>Quantily</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData2 && filteredData2.length > 0 ? (
                                <>
                                    {filteredData2.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {(currentPage - 1) * currentLimit + index + 1}
                                                </td>
                                                <td>{item.Shipping_Unit_Order.Order.User.username}</td>
                                                <td>{item.Shipping_Unit_Order.Order.OrderItems[0]?.Product_size_color.Product.product_name}</td>
                                                <td>{item.Shipping_Unit_Order.Order.OrderItems[0]?.Product_size_color.Color.name} , {item.Shipping_Unit_Order.Order.OrderItems[0]?.Product_size_color.Size.size_value}</td>
                                                <td>{item.Shipping_Unit_Order.Order.OrderItems[0]?.quantily}</td>
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
                                        const formattedPrice = (price * 1).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
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