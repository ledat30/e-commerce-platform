import './CheckOut.scss';
import { useLocation } from 'react-router-dom';
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/userContext";
import React, { useState, useEffect } from "react";
import HeaderHome from "../../HeaderHome/HeaderHome";
import Footer from "../../Footer/Footer";
import { getAllPaymentClient } from "../../../../services/paymentMethodService";
import { buyNowProduct } from '../../../../services/productService';
import { point, distance } from '@turf/turf';
import axios from 'axios';
import { toast } from "react-toastify";
const { Buffer } = require("buffer");

function CheckOut() {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const { quantily, size, color, product } = location.state || {};
    const [previewImgURL, setPreviewImgURL] = useState("");
    const [totalPriceProduct, setTotalPriceProduct] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [listPayMents, setListPayMents] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [total, setTotal] = useState(0);
    let navigate = useNavigate();

    useEffect(() => {
        fetchAllPayMent();
    }, []);

    const fetchAllPayMent = async () => {
        let response = await getAllPaymentClient();
        if (response && response.EC === 0) {
            setListPayMents(response.DT)
        }
    }

    useEffect(() => {
        if (shippingFee !== undefined) {
            const total = product.price * quantily;
            const formattedTotalAmount = (total * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

            const payment = total + parseFloat(shippingFee);
            const formattedTotalPayment = (payment * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

            setTotal(payment);
            setTotalPriceProduct(formattedTotalAmount);
            setTotalPayment(formattedTotalPayment);
        }
    }, [product.price, quantily, shippingFee]);

    useEffect(() => {
        const calculateShippingFee = async () => {
            try {
                const address = user.account.address;
                if (!address) {
                    throw new Error('Địa chỉ người dùng không tồn tại.');
                }
                const destinationCoordinates = await geocodeAddress(address);

                const storeCoordinates = { lat: 21.024813, lng: 105.988944 };

                const distanceInKm = calculateDistance(destinationCoordinates, storeCoordinates);
                const roundedDistance = distanceInKm.toFixed(1);

                const shippingRatePerKm = 2000;

                const shippingTotal = (roundedDistance / 1000) * shippingRatePerKm;
                const ship = shippingTotal;
                const formattedShip = (ship * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

                setShippingFee(formattedShip);

            } catch (error) {
                console.error('Lỗi khi tính phí vận chuyển:', error);
            }
        };
        calculateShippingFee();
    }, [user]);

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

    const calculateDistance = (source, destination) => {
        const sourcePoint = point([source.lng, source.lat]);
        const destinationPoint = point([destination.lng, destination.lat]);
        const options = { units: 'kilometers' };
        const distanceInKm = distance(sourcePoint, destinationPoint, options);
        return distanceInKm;
    };

    useEffect(() => {
        if (product.image) {
            const imageBase64 = new Buffer.from(product.image, "base64").toString("binary");
            setPreviewImgURL(imageBase64);
        }
    }, [product]);

    const handlePaymentClick = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    const isPaymentActive = (index) => {
        return index === activeIndex;
    };

    const handleBuyNow = async () => {
        if (activeIndex === null) {
            toast.info("Please select a payment method.");
            return;
        }

        const matchedProductAttribute = product.ProductAttributes.find(attr => {
            const attrValues = [attr.AttributeValue1, attr.AttributeValue2];
            return attrValues.some(value => value.name === size) && attrValues.some(value => value.name === color);
        });

        if (!matchedProductAttribute) {
            toast.error("No matching product found for the selected options.");
            return;
        }

        const response = await buyNowProduct(
            matchedProductAttribute.id,
            user.account.id,
            product.Store.id,
            {
                quantily, total,
                price_item: product.price,
                payment_methodID: listPayMents[activeIndex].id
            }
        );

        if (response && response.EC === 0) {
            toast.success(response.EM);
            navigate(`/profile-user`);
        }
    }

    return (
        <div className="container-checkout">
            <HeaderHome />
            <div className="grid wide">
                <div className='containe'>
                    <div className='left'>
                        <div className='title-left'>
                            Shipping address
                        </div>
                        <div className='info'>
                            <div className='name-user'>
                                {user.account.username}
                            </div>
                            <div className='sđt'>{user.account.phonenumber}</div>
                        </div>
                        <div className='address'>
                            <span className='home'>Home</span> {user.account.address}
                        </div>
                        <div className='title-product'>Sản phẩm</div>
                        <div className='product'>
                            <div className='info_product'>
                                <div className='img_prod'>
                                    <div className='img' style={{ backgroundImage: `url(${previewImgURL})` }}>
                                    </div>
                                </div>

                                <div className='detail-product'>
                                    <div className='name-prod'>
                                        {product.product_name}
                                    </div>
                                    <div className='size_color'>{size} , {color}</div>
                                </div>
                                <div className='price'>
                                    <div className='price_new'>
                                        {product.price} đ
                                    </div>
                                    <div className='price_old'>{product.old_price} đ</div>
                                    <div className='sale'>{product.promotion}</div>
                                </div>
                                <div className='quantity'>Số lượng : x {quantily}</div>
                            </div>
                        </div>
                    </div>
                    <div className='right'>
                        <div className="order">
                            <div className="title-order">Thanh toán đơn hàng</div>
                            <div className="items">
                                <span className="total">Tổng tiền</span>
                                <span className="pri">{totalPriceProduct}</span>
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
                                <div className="buy" onClick={handleBuyNow}>Buy now</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div >
    );
}

export default CheckOut;