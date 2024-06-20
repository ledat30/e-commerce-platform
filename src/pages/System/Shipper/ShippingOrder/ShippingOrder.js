import './ShippingOrder.scss';
import { useState, useEffect } from "react";
import { useContext } from "react";
import { orderSuccessByShipper } from '../../../../services/productService';
import { UserContext } from "../../../../context/userContext";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";

function ShippingOrder() {
    const { user } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [listOrders, setListOrders] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [viewStatus, setViewStatus] = useState(null);
    const [activeStatus, setActiveStatus] = useState('all');

    useEffect(() => {
        fetchListOrder();
    }, [currentPage, viewStatus])

    const fetchListOrder = async () => {
        let response = await orderSuccessByShipper(currentPage, currentLimit, user.account.id);

        if (response && response.EC === 0) {
            setListOrders(response.DT.orders);
            setTotalPages(response.DT.totalPages);
        }
    }

    const handleRefresh = () => {
        fetchListOrder();
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleFilterStatus = (status) => {
        setViewStatus(status);
        setActiveStatus(status);
    };

    const filteredData = listOrders.filter((item) => {
        const usernameMatches = item.Shipping_Unit_Order?.Order?.User?.username?.toLowerCase().includes(searchInput.toLowerCase());

        if (!viewStatus) {
            return usernameMatches;
        }
        if (viewStatus === 'success') {
            return usernameMatches && item.status === 'Delivered';
        }
        return usernameMatches && item.status === 'Order delivery failed';
    });

    return (
        <>
            <div className="category-container">
                <div className="container">
                    <div className="title-category">
                        <h4>Shipping Order</h4>
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
                            <h4>List order</h4>
                            <button className={`btn btn-secondary ${activeStatus === 'all' ? 'actived' : ''}`} onClick={() => handleFilterStatus(null)}>
                                Show all
                            </button>
                            <button className={`btn btn-success ${activeStatus === 'fail' ? 'actived' : ''}`} onClick={() => handleFilterStatus('fail')}>
                                Order failed
                            </button>
                            <button className={`btn btn-success ${activeStatus === 'success' ? 'actived' : ''}`} onClick={() => handleFilterStatus('success')}>
                                Order successful
                            </button>
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
                                                    <td>{item.Shipping_Unit_Order.Order.OrderItems[0].ProductAttribute.Product.product_name}
                                                    </td>
                                                    <td>{item.Shipping_Unit_Order.Order.OrderItems[0].ProductAttribute.AttributeValue1.name} & {item.Shipping_Unit_Order.Order.OrderItems[0].ProductAttribute.AttributeValue2.name}
                                                    </td>
                                                    <td>
                                                        {item.Shipping_Unit_Order.Order.User.username}
                                                    </td>
                                                    <td>
                                                        {item.Shipping_Unit_Order.Order.Ward.ward_name} ,   {item.Shipping_Unit_Order.Order.District.district_name} ,  {item.Shipping_Unit_Order.Order.Province.province_name} ,
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

export default ShippingOrder;
