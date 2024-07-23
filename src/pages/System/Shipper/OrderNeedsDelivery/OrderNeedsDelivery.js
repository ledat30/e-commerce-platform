import { useState, useEffect } from "react";
import './OrderNeedsDelivery.scss';
import { useContext } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../../../context/userContext";
import { readAllOrderByShipper, shipperConfirmOrder, orderConfirmationFailed } from '../../../../services/productService';
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

function OrderNeedsDelivery() {
    const { user } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [listOrders, setListOrders] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [showOptions, setShowOptions] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [reason, setReason] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleClose = () => setShowModal(false);
    const handleShow = (orderId) => {
        setSelectedOrder(orderId);
        setShowModal(true);
    };

    const shipperConfirmOrderFailed = async (shipping_unit_orderId, reason) => {
        try {
            const response = await orderConfirmationFailed(user.account.id, { shipping_unit_orderId, reason });
            if (response && response.EC === 0) {
                toast.success(response.EM);
                await fetchListOrder();
            }
            else {
                toast.error(response.EM)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const confirmOrder = async (shipping_unit_orderId) => {
        try {
            const response = await shipperConfirmOrder(user.account.id, { shipping_unit_orderId });
            if (response && response.EC === 0) {
                toast.success(response.EM);
                await fetchListOrder();
            }
            else {
                toast.error(response.EM)
            }
        } catch (error) {
            console.log(error);
        }
    }

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

    const handleConfirmFailure = () => {
        if (selectedOrder) {
            shipperConfirmOrderFailed(selectedOrder, reason);
            handleClose();
        }
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
                                    <th>User</th>
                                    <th>PhoneNumber</th>
                                    <th>Product</th>
                                    <th>Address</th>
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
                                                    <td>
                                                        {item.Shipping_Unit_Order.Order && item.Shipping_Unit_Order.Order.customerName ? item.Shipping_Unit_Order.Order.customerName : item.Shipping_Unit_Order.Order.User.username}
                                                    </td>
                                                    <td>
                                                        {item.Shipping_Unit_Order.Order && item.Shipping_Unit_Order.Order.phonenumber ? item.Shipping_Unit_Order.Order.phonenumber : item.Shipping_Unit_Order.Order.User.phonenumber}
                                                    </td>
                                                    <td>{item.Shipping_Unit_Order.Order.OrderItems[0].ProductAttribute.Product.product_name} ({item.Shipping_Unit_Order.Order.OrderItems[0].ProductAttribute.AttributeValue1.name} & {item.Shipping_Unit_Order.Order.OrderItems[0].ProductAttribute.AttributeValue2.name} , slg:  {item.Shipping_Unit_Order.Order.OrderItems[0].quantily})
                                                    </td>
                                                    <td>
                                                        {item.Shipping_Unit_Order.Order.address_detail} , {item.Shipping_Unit_Order.Order.Ward.ward_name} , {item.Shipping_Unit_Order.Order.District.district_name} , {item.Shipping_Unit_Order.Order.Province.province_name} ,
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
                                                                    <span className="option1" onClick={() => confirmOrder(item.Shipping_Unit_Order.id)}>
                                                                        Đã giao
                                                                    </span>
                                                                    <span className="option2" onClick={() => handleShow(item.Shipping_Unit_Order.id)}>
                                                                        Giao không thành công
                                                                    </span>
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
                )}
            </div >
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Lý do giao không thành công</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Lý do</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleConfirmFailure}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default OrderNeedsDelivery;
