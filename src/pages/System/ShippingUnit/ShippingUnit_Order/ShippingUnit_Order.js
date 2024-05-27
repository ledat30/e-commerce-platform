import { useState, useEffect } from "react";
import { useContext } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../../../context/userContext";
import {
    readAllOrderByShippingUnit, confirmOrders
} from "../../../../services/shippingUnitService";
import { getGroupShipper } from '../../../../services/userService';
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";

function ShippingUnitOrder() {
    const { user } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [listOrders, setListOrders] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [listShippers, setListShippers] = useState([]);

    useEffect(() => {
        fetchAllShipper();
    }, [])

    const fetchAllShipper = async () => {
        let response = await getGroupShipper();

        if (response && response.EC === 0) {
            setListShippers(response.DT)
        }
    }

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

    const handleConfirmOrders = () => {
        const groupedOrders = groupOrdersByCitySuffix(listOrders, listShippers);
        sendGroupedOrdersToBackend(groupedOrders);
    };

    const groupOrdersByCitySuffix = (orders, shippers) => {
        const groupedOrders = {};
        const shipperIndexes = {};

        orders.forEach(order => {
            const orderCitySuffix = order.Order.User.address.split(', ').map(s => s.trim()).pop().toLowerCase();

            const cityShippers = shippers.filter(shipper => {
                const shipperCitySuffix = shipper.address.split(', ').map(s => s.trim()).pop().toLowerCase();
                return orderCitySuffix === shipperCitySuffix;
            });

            if (cityShippers.length > 0) {
                if (!groupedOrders[orderCitySuffix]) {
                    groupedOrders[orderCitySuffix] = [];
                    shipperIndexes[orderCitySuffix] = 0;
                }

                const currentShipperIndex = shipperIndexes[orderCitySuffix];
                const currentShipper = cityShippers[currentShipperIndex];

                let shipperGroup = groupedOrders[orderCitySuffix].find(group => group.shipperId === currentShipper.id);
                if (!shipperGroup) {
                    shipperGroup = {
                        shipperId: currentShipper.id,
                        orders: []
                    };
                    groupedOrders[orderCitySuffix].push(shipperGroup);
                }

                shipperGroup.orders.push({
                    shipping_unit_orderId: order.id,
                    orderId: order.orderId
                });

                shipperIndexes[orderCitySuffix] = (currentShipperIndex + 1) % cityShippers.length;
            }
        });
        return groupedOrders;
    };

    const sendGroupedOrdersToBackend = async (groupedOrders) => {
        await confirmOrders(groupedOrders)
            .then(response => {
                if (response.EC === 0) {
                    toast.success('Orders confirmed successfully!');
                    fetchAllOrders();
                } else {
                    toast.error('Failed to confirm orders!');
                }
            })
            .catch(error => {
                console.error('Error confirming orders:', error);
                toast.error('Error while confirming orders.');
            });
    };

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
                                        onClick={handleConfirmOrders}
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
                                    <th>Product</th>
                                    <th>Color</th>
                                    <th>Size</th>
                                    <th>User</th>
                                    <th>Address</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Date</th>
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
