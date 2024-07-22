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
    const [currentLimit] = useState(5);
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
        const { groupedOrders, unmatchedOrders } = groupOrdersByLocation(listOrders, listShippers);

        unmatchedOrders.forEach(order => {
            toast.error(`No shippers found for order ${order.orderId} in ${order.ward}, ${order.district}, ${order.province}`);
        });

        // Kiểm tra xem có đơn hàng nào phù hợp với shipper không
        const hasMatchedOrders = Object.keys(groupedOrders).some(key => groupedOrders[key].length > 0);

        if (hasMatchedOrders) {
            sendGroupedOrdersToBackend(groupedOrders);
        }
    };

    const groupOrdersByLocation = (orders, shippers) => {
        const groupedOrders = {};
        const shipperIndexes = {};
        const unmatchedOrders = [];

        orders.forEach(order => {
            const orderProvince = order.Order.Province.province_name.toLowerCase();
            const orderDistrict = order.Order.District.district_name.toLowerCase();
            const orderWard = order.Order.Ward.ward_name.toLowerCase();

            const cityShippers = shippers.filter(shipper => {
                const shipperProvince = shipper.Province.province_name.toLowerCase();
                const shipperDistrict = shipper.District.district_name.toLowerCase();
                const shipperWard = shipper.Ward.ward_name.toLowerCase();

                return orderProvince === shipperProvince &&
                    orderDistrict === shipperDistrict &&
                    orderWard === shipperWard;
            });

            if (cityShippers.length > 0) {
                const locationKey = `${orderProvince}-${orderDistrict}-${orderWard}`;
                if (!groupedOrders[locationKey]) {
                    groupedOrders[locationKey] = [];
                    shipperIndexes[locationKey] = 0;
                }

                const currentShipperIndex = shipperIndexes[locationKey];
                const currentShipper = cityShippers[currentShipperIndex];

                let shipperGroup = groupedOrders[locationKey].find(group => group.shipperId === currentShipper.id);
                if (!shipperGroup) {
                    shipperGroup = {
                        shipperId: currentShipper.id,
                        orders: []
                    };
                    groupedOrders[locationKey].push(shipperGroup);
                }

                shipperGroup.orders.push({
                    shipping_unit_orderId: order.id,
                    orderId: order.orderId
                });

                shipperIndexes[locationKey] = (currentShipperIndex + 1) % cityShippers.length;
            } else {
                unmatchedOrders.push({
                    orderId: order.orderId,
                    province: orderProvince,
                    district: orderDistrict,
                    ward: orderWard
                });
            }
        });

        return { groupedOrders, unmatchedOrders };
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
                                    <th>User</th>
                                    <th>Product</th>
                                    <th style={{ width: '280px' }}>Address</th>
                                    <th>PhoneNumber</th>
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
                                                    <td>{item.Order && item.Order.customerName ? item.Order.customerName : item.Order.User.username}</td>
                                                    <td>{item.Order.OrderItems[0].ProductAttribute.Product.product_name} ({item.Order.OrderItems[0].ProductAttribute.AttributeValue1.name} , {item.Order.OrderItems[0].ProductAttribute.AttributeValue2.name} , slg: {item.Order.OrderItems[0].quantily})
                                                    </td>
                                                    <td>
                                                        {item.Order.Ward.ward_name} , {item.Order.District.district_name} , {item.Order.Province.province_name}
                                                    </td>
                                                    <td>{item.Order && item.Order.phonenumber ? item.Order.phonenumber : item.Order.User.phonenumber}</td>
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
