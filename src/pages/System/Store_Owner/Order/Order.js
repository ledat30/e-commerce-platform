import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import { toast } from "react-toastify";
import Select from "react-select";
import {
    getAllOrderByStore, ConfirmAllOrders, ConfirmOrdersByTransfer, DeleteOrdersTransfer
} from "../../../../services/productService";
import { getAllShippingUnits } from "../../../../services/shippingUnitService";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";

function Order() {
    const { user } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(3);
    const [totalPages, setTotalPages] = useState(0);
    const [listOrders, setListOrders] = useState([]);
    console.log(listOrders);
    const [searchInput, setSearchInput] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [validInputNameUserShippingUnit, setValidInputNameUserShippingUnit] = useState(true);
    const [listShippingUnit, setListShippingUnit] = useState([]);

    useEffect(() => {
        fetchAllShippingUnit();
    }, [])

    const fetchAllShippingUnit = async () => {
        let response = await getAllShippingUnits();

        if (response && response.EC === 0) {
            setListShippingUnit(response.DT)
        }
    }

    //search
    const filteredData = listOrders.filter((item) =>
        item.User.username.toLowerCase().includes(searchInput.toLowerCase())
    );

    useEffect(() => {
        fetchAllOrders();
    }, [currentPage]);

    const fetchAllOrders = async () => {
        let response = await getAllOrderByStore(currentPage, currentLimit, user.account.storeId);

        if (response && response.EC === 0) {
            setListOrders(response.DT.orders);
            setTotalPages(response.DT.totalPages);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const checkValidInput = () => {
        let isValid = true;
        if (!selectedOption) {
            setValidInputNameUserShippingUnit(false);
            toast.error("Please select shipping unit.");
            isValid = false;
        }
        return isValid;
    };

    const confirmAllOrders = async () => {
        if (checkValidInput()) {
            try {
                const response = await ConfirmAllOrders(user.account.storeId, { shippingUnitId: selectedOption.value });
                if (response && response.EC === 0) {
                    toast.success(response.EM);
                    await fetchAllOrders();
                    setValidInputNameUserShippingUnit(true);
                }
                else {
                    toast.error(response.EM)
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleRefresh = async () => {
        await fetchAllOrders();
        setListShippingUnit(listShippingUnit);
    };

    const options = Array.isArray(listShippingUnit) ? listShippingUnit.map(item => ({
        label: item.shipping_unit_name,
        value: item.id
    })) : [];

    const handleOnChangeInput = (value, key) => {
        const updatedShippingUnit = listShippingUnit.map(shippingUnit =>
            shippingUnit.id === value ? { ...shippingUnit, [key]: value } : shippingUnit
        );
        setListShippingUnit(updatedShippingUnit);
    };

    const handleConfirm = async (id) => {
        if (checkValidInput()) {
            try {
                let response = await ConfirmOrdersByTransfer(user.account.storeId, { id, shippingUnitId: selectedOption.value });

                if (response && response.EC === 0) {
                    toast.success(response.EM);
                    await fetchAllOrders();
                } else {
                    toast.error(response.EM);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleDeleteOrder = async (orderId) => {
        try {
            await DeleteOrdersTransfer(orderId);
            toast.success("Product removed successfully");
            fetchAllOrders();

        } catch (error) {
            console.error("Error deleting product from cart:", error);
            toast.error("Failed to remove product from cart");
        }
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
                                    <div className="col-3 from-group">
                                        <label>
                                            Choose shipping unit(<span style={{ color: "red" }}>*</span>)
                                        </label>
                                        <Select
                                            className={`mb-4 ${!validInputNameUserShippingUnit ? "is-invalid" : ""}`}
                                            value={options.find(option => option.value === selectedOption?.value) || null}
                                            onChange={(selected) => {
                                                setSelectedOption(selected);
                                                handleOnChangeInput(selected.value, "nameUserShippingUnit");
                                            }}
                                            options={options}
                                        />
                                    </div>
                                    <button
                                        title="Xác nhận"
                                        className="btn btn-success"
                                        onClick={confirmAllOrders}
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
                                    <th>CustomerName</th>
                                    <th>Total amount</th>
                                    <th>Payment method</th>
                                    <th>Order date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData && filteredData.length > 0 ? (
                                    <>
                                        {filteredData.map((item, index) => {
                                            const orderDate = new Date(item.order_date);
                                            const formattedDate = orderDate.toLocaleString('vi-VN', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            });
                                            const price = item.total_amount;
                                            const formattedPrice = (price * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                            return (
                                                <tr key={`row-${index}`}>
                                                    <td>
                                                        {(currentPage - 1) * currentLimit + index + 1}
                                                    </td>
                                                    <td style={{ width: '250px' }}>{item.OrderItems[0].ProductAttribute.Product.product_name} (slg: {item.OrderItems[0].quantily})
                                                    </td>
                                                    <td>{item.OrderItems[0].Order && item.OrderItems[0].Order.customerName ? item.OrderItems[0].Order.customerName : item.User.username}
                                                    </td>
                                                    <td>
                                                        {formattedPrice}
                                                    </td>
                                                    <td>
                                                        {item.PaymentMethod.method_name}
                                                    </td>
                                                    <td>
                                                        {formattedDate}
                                                    </td>
                                                    <td>
                                                        <td>
                                                            {item.PaymentMethod.method_name === "Chuyển khoản" && (
                                                                <>
                                                                    <button
                                                                        title="Edit"
                                                                        className="btn btn-warning mx-2"
                                                                        onClick={() => handleConfirm(item.id)}
                                                                    >
                                                                        <i className="fa fa-check-circle-o"></i>
                                                                    </button>
                                                                </>
                                                            )}
                                                            <div style={{ display: 'flex' }}>
                                                                <button
                                                                    title="Edit"
                                                                    className="btn btn-warning mx-2"
                                                                    onClick={() => handleConfirm(item.id)}
                                                                >
                                                                    <i className="fa fa-check-circle-o"></i>
                                                                </button>
                                                                <button
                                                                    title="Delete"
                                                                    className="btn btn-danger"
                                                                    onClick={() => handleDeleteOrder(item.id)}
                                                                >
                                                                    <i className="fa fa-trash-o"></i>
                                                                </button>
                                                            </div>
                                                        </td>
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

export default Order;
