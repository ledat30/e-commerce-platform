import { useState, useEffect } from "react";
import './OrderNeedsDelivery.scss';
import { useContext } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../../../context/userContext";
import { readAllOrderByShipper } from '../../../../services/productService';
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";

function OrderNeedsDelivery() {
    const { user } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [listOrders, setListOrders] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [showOptions, setShowOptions] = useState({});

    const toggleOptions = (index) => {
        setShowOptions(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    useEffect(() => {
        fetchListOrder();
    }, [])

    const fetchListOrder = async () => {
        let response = await readAllOrderByShipper(currentPage, currentLimit, user.account.id);

        if (response && response.EC === 0) {
            setListOrders(response.DT.orders);
            setTotalPages(response.DT.totalPages);
        }
    }

    //search
    const filteredData = listOrders.filter((item) =>
        item.Shipping_Unit_Order.Order.User.username.toLowerCase().includes(searchInput.toLowerCase())
    );

    const handleRefresh = () => {
        fetchListOrder();
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    return (
        <>
            <div className="category-container">
                <div className="container">
                    <div className="title-category">
                        <h4>Order needs delivery</h4>
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
                                    <th>Product</th>
                                    <th>Color & Size</th>
                                    <th>User</th>
                                    <th>Address</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData && filteredData.length > 0 ? (
                                    <>
                                        {filteredData.map((item, index) => {
                                            const price = item.Shipping_Unit_Order.Order.total_amount;
                                            const formattedPrice = (price * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                            return (
                                                <tr key={`row-${index}`}>
                                                    <td>
                                                        {(currentPage - 1) * currentLimit + index + 1}
                                                    </td>
                                                    <td>{item.Shipping_Unit_Order.Order.OrderItems[0].Product_size_color.Product.product_name}
                                                    </td>
                                                    <td>{item.Shipping_Unit_Order.Order.OrderItems[0].Product_size_color.Color.name} & {item.Shipping_Unit_Order.Order.OrderItems[0].Product_size_color.Size.size_value}
                                                    </td>
                                                    <td>
                                                        {item.Shipping_Unit_Order.Order.User.username}
                                                    </td>
                                                    <td>
                                                        {item.Shipping_Unit_Order.Order.User.address}
                                                    </td>
                                                    <td>
                                                        {item.Shipping_Unit_Order.Order.OrderItems[0].quantily}
                                                    </td>
                                                    <td>
                                                        {formattedPrice}
                                                    </td>
                                                    <td>
                                                        {item.Shipping_Unit_Order.Order.PaymentMethod.method_name}
                                                    </td>
                                                    <td>
                                                        <div className="all-optin">
                                                            <i className="fa fa-list icon" aria-hidden="true" onClick={() => toggleOptions(index)}>
                                                            </i>
                                                            {showOptions[index] && (
                                                                <>
                                                                    <span><i className="fa fa-hand-o-up hand" aria-hidden="true"></i></span>
                                                                    <span className="option1">Đã giao</span>
                                                                    <span className="option2">Giao không thành công</span>
                                                                </>
                                                            )}
                                                        </div>
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

export default OrderNeedsDelivery;
