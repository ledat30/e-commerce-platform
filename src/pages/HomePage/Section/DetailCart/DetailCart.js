import "./DetailCart.scss";
import { useContext } from "react";
import React, { useState, useEffect } from "react";
import HeaderHome from "../../HeaderHome/HeaderHome";
import Footer from "../../Footer/Footer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../../../context/userContext";
import { deleteProductCart, buyProduct } from "../../../../services/productService";
import { getAllPaymentClient } from "../../../../services/paymentMethodService";
import { useCart } from '../../../../context/cartContext';
import axios from 'axios';
import { point, distance } from '@turf/turf';
const { Buffer } = require("buffer");

function DetailCart() {
    const { user } = useContext(UserContext);
    const { cartItems, fetchCartItems } = useCart();
    let navigate = useNavigate();
    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [listPayMents, setListPayMents] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        const calculateShippingFee = async () => {
            try {
                // tọa độ của địa chỉ nhận hàng 
                const address = user.account.address;
                if (!address) {
                    throw new Error('Địa chỉ người dùng không tồn tại.');
                }
                const destinationCoordinates = await geocodeAddress(address);

                // Tọa độ của cửa hàng 
                const storeCoordinates = { lat: 21.024813, lng: 105.988944 };

                //  khoảng cách giữa địa chỉ nhận hàng và cửa hàng
                const distanceInKm = calculateDistance(destinationCoordinates, storeCoordinates);
                const roundedDistance = distanceInKm.toFixed(1);

                //  công thức phí vận chuyển 
                const shippingRatePerKm = 2000;

                const shippingTotal = (roundedDistance / 1000) * shippingRatePerKm;
                const ship = shippingTotal;
                const formattedShip = (ship * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

                setShippingFee(formattedShip);

            } catch (error) {
                console.error('Lỗi khi tính phí vận chuyển:', error);
            }
        };

        //gọi lại khi thông tin user thay đổi
        calculateShippingFee();
    }, [user]);

    //chuyển đổi địa chỉ thành tọa độ
    const geocodeAddress = async (address) => {
        try {
            const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
                params: {
                    key: '06ba581ba3b34e7897f56d8f8683266c',
                    q: address,
                    limit: 1,
                },
            });
            if (response.data && response.data.results.length > 0) {
                const { lat, lng } = response.data.results[0].geometry;
                return { lat, lng };
            } else {
                throw new Error('Không tìm thấy tọa độ cho địa chỉ này.');
            }
        } catch (error) {
            console.error('Lỗi khi geocode địa chỉ:', error);
            throw error;
        }
    };

    // tính khoảng cách giữa hai điểm
    const calculateDistance = (source, destination) => {
        const sourcePoint = point([source.lng, source.lat]);
        const destinationPoint = point([destination.lng, destination.lat]);
        const options = { units: 'kilometers' };
        const distanceInKm = distance(sourcePoint, destinationPoint, options);
        return distanceInKm;
    };

    const handBuyProduct = async () => {
        const selectedOrderItemIds = [];
        cartItems.forEach(item => {
            item.OrderItems.forEach(orderItem => {
                if (selectAll || selectedItems[orderItem.id]) {
                    selectedOrderItemIds.push({
                        productColorSizeId: orderItem.Product_size_color.id,
                        orderId: item.id,
                        storeId: orderItem.Product_size_color.Product.Store.id,
                        quantily: quantities[orderItem.Product_size_color.Inventories[0].id],
                        price: orderItem.Product_size_color.Product.price
                    });
                }
            });
        });
        if (selectedOrderItemIds.length > 0) {
            if (activeIndex === null) {
                toast.info("Please select a payment method.");
                return;
            }
            const responses = await Promise.all(selectedOrderItemIds.map(orderItem =>
                buyProduct(orderItem.productColorSizeId, orderItem.orderId, orderItem.storeId, { quantily: orderItem.quantily, price_per_item: orderItem.price, payment_methodID: listPayMents[activeIndex].id, shippingFee: shippingFee })
            ));

            const allSuccess = responses.every(response => response.EC === 0);
            if (allSuccess) {
                toast.success("All selected items purchased successfully!")
                setSelectAll(false);
                setSelectedItems({});
                setListPayMents([]);
                fetchCartItems(user.account.id);
            } else {
                responses.forEach(response => {
                    if (response.EC !== 0) toast.error(response.EM);
                });
            }
        } else {
            toast.info("No items selected for purchase.");
        }
    }

    const handlePaymentClick = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    const isPaymentActive = (index) => {
        return index === activeIndex;
    };

    useEffect(() => {
        fetchAllPayMent();
    }, []);

    const fetchAllPayMent = async () => {
        let response = await getAllPaymentClient();
        if (response && response.EC === 0) {
            setListPayMents(response.DT)
        }
    }

    const [quantities, setQuantities] = useState(() => {
        const initialQuantities = {};
        cartItems.forEach(item => {
            item.OrderItems.forEach(orderItem => {
                const inventory = orderItem.Product_size_color?.Inventories?.[0];
                if (inventory && inventory.id) {
                    initialQuantities[inventory.id] = 1;
                }
            });
        });
        return initialQuantities;
    });
    useEffect(() => {
        fetchCartItems(user.account.id);
    }, [user.account.id]);

    const selectedItemCount = Object.values(selectedItems).filter(selected => selected).length;

    useEffect(() => {
        const totalAmount = cartItems.reduce((total, item) => {
            return total + item.OrderItems.reduce((itemTotal, orderItem) => {
                if (selectedItems[orderItem.id]) {
                    const price = orderItem.Product_size_color.Product.price;
                    const quantity = quantities[orderItem.Product_size_color.Inventories[0].id];
                    return itemTotal + price * quantity;
                }
                return itemTotal;
            }, 0);
        }, 0);

        const formattedTotalAmount = (totalAmount * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

        if (selectedItemCount > 0) {
            const total = totalAmount + parseFloat(shippingFee);
            const formatTotal = (total * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

            setTotalPayment(formatTotal);
        }
        else {
            const total = 0;
            const formatTotal = (total * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

            setTotalPayment(formatTotal);
        }
        setTotalAmount(formattedTotalAmount);
    }, [cartItems, quantities, selectedItems, selectedItemCount, shippingFee]);


    const handleSelectAllChange = (e) => {
        const newChecked = e.target.checked;
        setSelectAll(newChecked);
        const newSelectedItems = {};
        cartItems.forEach(item => {
            item.OrderItems.forEach(orderItem => {
                newSelectedItems[orderItem.id] = newChecked;
            });
        });
        setSelectedItems(newSelectedItems);
    };

    const handleCheckboxChange = (itemId) => {
        setSelectedItems(prevState => ({
            ...prevState,
            [itemId]: !prevState[itemId]
        }));
        if (selectAll) {
            setSelectAll(false);
        }
    };

    const renderCheckbox = (itemId) => (
        <input
            className="form-check-input center"
            type="checkbox"
            checked={selectedItems[itemId] || false}
            onChange={() => handleCheckboxChange(itemId)}
        />
    );

    const incrementQuantity = (inventoryId) => {
        setQuantities(prev => {
            const maxQuantity = cartItems.find(item =>
                item.OrderItems.some(orderItem =>
                    orderItem.Product_size_color?.Inventories?.[0]?.id === inventoryId
                )
            )?.OrderItems.find(orderItem =>
                orderItem.Product_size_color?.Inventories?.[0]?.id === inventoryId
            )?.Product_size_color?.Inventories?.[0]?.currentNumber;

            if (prev[inventoryId] < maxQuantity) {
                return { ...prev, [inventoryId]: prev[inventoryId] + 1 };
            }
            return prev;
        });
    };

    const decrementQuantity = (inventoryId) => {
        setQuantities(prev => {
            if (prev[inventoryId] > 1) {
                return { ...prev, [inventoryId]: prev[inventoryId] - 1 };
            }
            return prev;
        });
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteProductCart(productId);
            toast.success("Product removed from cart successfully");
            fetchCartItems(user.account.id);
        } catch (error) {
            console.error("Error deleting product from cart:", error);
            toast.error("Failed to remove product from cart");
        }
    }

    const handleHome = () => {
        navigate("/home");
    };

    return (<>
        <div className="container_detail_cart">
            <HeaderHome />
            <div className="grid wide container">
                <div className="right_cart">
                    <div className="detail">
                        <div className="form-check check">
                            <input className="form-check-input" type="checkbox" id="flexCheckIndeterminate" checked={selectAll}
                                onChange={handleSelectAllChange} />
                            <label className="form-check-label" htmlFor="flexCheckIndeterminate">
                                Chọn tất cả <span className="number-item">({cartItems.map(product => product.OrderItems.length).reduce((total, count) => total + count, 0)} sản phẩm)</span>
                            </label>
                        </div>
                    </div>
                    {cartItems && cartItems.length > 0 && cartItems[0].OrderItems.length > 0 ? (
                        <div className="product_cart">
                            {cartItems && cartItems.map((item, index) => {
                                return (
                                    <div className="product_cart_item" key={index}>
                                        {item.OrderItems.map((orderItem, orderIndex) => {
                                            let imageBase64 = '';
                                            if (orderItem.Product_size_color.Product.image) {
                                                imageBase64 = new Buffer.from(orderItem.Product_size_color.Product.image, 'base64').toString('binary');
                                            }
                                            const inventory = orderItem.Product_size_color?.Inventories?.[0];
                                            if (!inventory) return null;
                                            return (
                                                <div className="item_product" key={orderIndex}>
                                                    {renderCheckbox(orderItem.id)}
                                                    <div
                                                        style={{ backgroundImage: `url(${imageBase64})` }}
                                                        className="img_product-cart"
                                                    />
                                                    <div className="name_prod">
                                                        <div className="name">
                                                            {orderItem.Product_size_color.Product.product_name}
                                                        </div>
                                                        <div className="size_color">
                                                            {orderItem.Product_size_color.Color.name} , {orderItem.Product_size_color.Size.size_value}
                                                        </div>
                                                    </div>
                                                    <div className="colum-3">
                                                        <div className="price_prod">
                                                            <span className="underline">đ</span> {orderItem.Product_size_color.Product.price}
                                                        </div>
                                                        <div className="delete_prod" onClick={() => handleDeleteProduct(orderItem.id)}>
                                                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                                                        </div>
                                                    </div>
                                                    <div className="quantily">
                                                        <div className="cong-tru">
                                                            <button
                                                                className={"button-quantily ml"}
                                                                onClick={() => decrementQuantity(inventory.id)}
                                                                disabled={quantities[inventory.id] === 1}
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                className="input-quantily"
                                                                id="quantityInput"
                                                                type="number"
                                                                value={quantities[inventory.id]}
                                                                readOnly={true}
                                                            />
                                                            <button
                                                                className="button-quantily"
                                                                onClick={() => incrementQuantity(inventory.id)}
                                                                disabled={quantities[inventory.id] >= inventory.currentNumber}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="no_product">
                            <span className="title_no-product">Chưa có sản phẩm nào ?</span>
                            <p className="click_buy" onClick={handleHome}>Mua ngay</p>
                        </div>
                    )}
                </div>
                <div className="left_cart">
                    <div className="form_pay">
                        <div className="title_add">Địa chỉ nhận hàng</div>
                        <div className="address">
                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                            <span className="ps-2">{user.account.address}</span>
                        </div>
                        <div className="order">
                            <div className="title-order">Đơn hàng</div>
                            <div className="items">
                                <span className="total">Tổng tiền <p className="so_luong">({selectedItemCount} items)</p></span>
                                <span className="pri">{totalAmount}</span>
                            </div>
                            <div className="ship">
                                <span className="ship-unit">Phí vận chuyển</span>
                                <span className="price_ship">{shippingFee}</span>
                            </div>
                            <div className="total_payment">
                                <div className="tong">
                                    Tổng tiền thanh toán
                                </div>
                                <div className="tien">
                                    {totalPayment}
                                </div>
                            </div>
                            <div className="payment_method">
                                {listPayMents && listPayMents.length && listPayMents.map((item, index) => {
                                    return (
                                        <div className="option" key={index} onClick={() => handlePaymentClick(index)}>
                                            <div className="method">
                                                {item.method_name}
                                            </div>
                                            <div className="choose_method" >
                                                <i className={"fa " + (isPaymentActive(index) ? "fa-toggle-on on" : "fa-toggle-off")} aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="button-buy">
                                <div className="buy" onClick={handBuyProduct}>Buy now</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    </>);
}
export default DetailCart;