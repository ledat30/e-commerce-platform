import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import {
    readAllOrderByShippingUnit
} from "../../../../services/shippingUnitService";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";

function ShippingUnitOrder() {
    const { user } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [listOrders, setListOrders] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    //search
    const filteredData = listOrders.filter((item) =>
        item.Order.User.username.toLowerCase().includes(searchInput.toLowerCase())
    );

    useEffect(() => {
        fetchAllOrders();
    }, [currentPage]);

    const fetchAllOrders = async () => {
        let response = await readAllOrderByShippingUnit(currentPage, currentLimit, user.account.shipingUnitId);

        if (response && response.EC === 0) {
            setListOrders(response.DT.orders);
            setTotalPages(response.DT.totalPages);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };


    const handleRefresh = () => {
        fetchAllOrders();
    }

    return (
        <>
            <div className="category-container">
                <div className="container">
                    <div className="title-category">
                        <h4>Order management</h4>
                        <button
                            title="refresh"
                            className="btn btn-success"
                            onClick={() => handleRefresh()}
                        >
                            <i className="fa fa-refresh"></i> Refesh
                        </button>
                    </div>
                    <hr />
                    <div className="table-category">
                        <div className="header-table-category">
                            <h4>List current order</h4>
                            {listOrders.length > 0 && (
                                <>
                                    <button
                                        title="Xác nhận"
                                        className="btn btn-success"
                                    >
                                        Confirm all orders
                                    </button>
                                </>
                            )}
                            <div className="box">
                                <form className="sbox">
                                    <input
                                        className="stext"
                                        type=""
                                        placeholder="Tìm kiếm order..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                    />
                                    <NavLink className="sbutton" type="submit" to="">
                                        <i className="fa fa-search"></i>
                                    </NavLink>
                                </form>
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Product name</th>
                                    <th>Color</th>
                                    <th>Size</th>
                                    <th>User</th>
                                    <th>Address</th>
                                    <th>Quantity</th>
                                    <th>Total amount</th>
                                    <th>Order date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData && filteredData.length > 0 ? (
                                    <>
                                        {filteredData.map((item, index) => {
                                            const orderDate = new Date(item.Order.order_date);
                                            const day = orderDate.getDate();
                                            const month = orderDate.getMonth() + 1;
                                            const year = orderDate.getFullYear();
                                            const formattedDate = `${day}-${month}-${year}`;
                                            const price = item.Order.total_amount;
                                            const formattedPrice = (price * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                            return (
                                                <tr key={`row-${index}`}>
                                                    <td>
                                                        {(currentPage - 1) * currentLimit + index + 1}
                                                    </td>
                                                    <td>{item.Order.OrderItems[0].Product_size_color.Product.product_name}
                                                    </td>
                                                    <td>{item.Order.OrderItems[0].Product_size_color.Color.name}
                                                    </td>
                                                    <td>{item.Order.OrderItems[0].Product_size_color.Size.size_value}
                                                    </td>
                                                    <td>
                                                        {item.Order.User.username}
                                                    </td>
                                                    <td>
                                                        {item.Order.User.address}
                                                    </td>
                                                    <td>
                                                        {item.Order.OrderItems[0].quantily}
                                                    </td>
                                                    <td>
                                                        {formattedPrice}
                                                    </td>
                                                    <td>
                                                        {formattedDate}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <>
                                        <tr style={{ textAlign: "center", fontWeight: 600 }}>
                                            <td colSpan={10}>Not found order...</td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div >
                </div >
                {totalPages > 0 && (
                    <div className="user-footer mt-3">
                        <ReactPaginate
                            nextLabel="next >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            pageCount={totalPages}
                            previousLabel="< previous"
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
                )
                }
            </div >
        </>
    );
}

export default ShippingUnitOrder;
