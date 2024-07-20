import './CheckOut.scss';
import { useLocation } from 'react-router-dom';
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/userContext";
import React, { useState, useEffect } from "react";
import HeaderHome from "../../HeaderHome/HeaderHome";
import Footer from "../../Footer/Footer";
import { getAllPaymentClient } from "../../../../services/paymentMethodService";
import { getAllProvinceDistrictWard } from "../../../../services/attributeAndVariantService";
import { buyNowProduct } from '../../../../services/productService';
import { point, distance } from '@turf/turf';
import axios from 'axios';
import { toast } from "react-toastify";
import _ from "lodash";
import Select from "react-select";
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
    const [locations, setLocations] = useState([]);
    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [filteredWards, setFilteredWards] = useState([]);
    const [isRelative, setIsRelative] = useState(false);

    const defaultUserData = {
        province: "",
        district: "",
        ward: "",
        customerName: "",
        phonenumber: "",
        address_detail: "",
    };
    const validInputsDefault = {
        province: true,
        district: true,
        ward: true,
        customerName: true,
        phonenumber: true,
        address_detail: true,
    };
    const [userData, setUserData] = useState(defaultUserData);
    const [validInputs, setValidInputs] = useState(validInputsDefault);

    const handleOnChangeInput = (selected, name) => {
        let _userData = _.cloneDeep(userData);
        _userData[name] = selected.value;
        setUserData(_userData);

        if (name === "province") {
            const selectedProvince = locations.find(prov => prov.id === selected.value);
            const districts = selectedProvince ? selectedProvince.Districts : [];
            setFilteredDistricts(districts);
            setFilteredWards([]);
            setUserData({ ..._userData, province: selectedProvince, district: "", ward: "" });
        }

        if (name === "district") {
            const selectedDistrict = filteredDistricts.find(dist => dist.id === selected.value);
            const wards = selectedDistrict ? selectedDistrict.Wards : [];
            setFilteredWards(wards);
            setUserData({ ..._userData, district: selectedDistrict, ward: "" });
        }

        if (name === "ward") {
            const selectedWard = filteredWards.find(ward => ward.id === selected.value);
            setUserData({ ..._userData, ward: selectedWard });
        }
    };

    const handleOnChangeInputDetail = (value, name) => {
        let _userData = _.cloneDeep(userData);
        _userData[name] = value;
        setUserData(_userData);
    }

    const checkValidInput = () => {
        setValidInputs(validInputsDefault);
        let arr = ["province", "district", "ward", "phonenumber", "customerName", "address_detail"];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            if (!userData[arr[i]]) {
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[arr[i]] = false;
                setValidInputs(_validInputs);

                toast.error(`Empty input ${arr[i]}`);
                check = false;
                break;
            }
        }
        return check;
    };

    useEffect(() => {
        getAllLocationData();
    }, []);

    const getAllLocationData = async () => {
        try {
            let response = await getAllProvinceDistrictWard();
            if (response && response.EC === 0) {
                setLocations(response.DT);
            }
        } catch (error) {
            console.error("Error fetching location data:", error);
        }
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
                const address = isRelative
                    ? `${userData.ward?.ward_name}, ${userData.district?.district_name}, ${userData.province?.province_name}`
                    : `${user.account.wardName}, ${user.account.districtName}, ${user.account.provinceName}`;
                if (!address) {
                    throw new Error('Địa chỉ người dùng không tồn tại.');
                }
                const destinationCoordinates = await geocodeAddress(address);

                const storeCoordinates = { lat: 21.024813, lng: 105.988944 };

                const distanceInKm = calculateDistance(destinationCoordinates, storeCoordinates);
                const roundedDistance = distanceInKm.toFixed(1);

                const shippingRatePerKm = 1000;

                const shippingTotal = (roundedDistance / 1000) * shippingRatePerKm;
                const ship = shippingTotal;
                const formattedShip = (ship * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

                setShippingFee(formattedShip);

            } catch (error) {
                console.error('Lỗi khi tính phí vận chuyển:', error);
            }
        };
        calculateShippingFee();
    }, [user, userData, isRelative]);

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
        if (isRelative && !checkValidInput()) {
            return;
        };
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

        const ward = isRelative ? `${userData.ward.id}` : `${user.account.wardId}`;
        const province = isRelative ? `${userData.province.id}` : `${user.account.provinceId}`;
        const district = isRelative ? `${userData.district.id}` : `${user.account.districtId}`;

        const response = await buyNowProduct(
            matchedProductAttribute.id,
            user.account.id,
            product.Store.id,
            {
                quantily, total,
                price_item: product.price,
                payment_methodID: listPayMents[activeIndex].id,
                ward: ward, province: province, district: district,
                phonenumber: userData.phonenumber, address_detail: userData.address_detail, customerName: userData.customerName,
            }
        );

        if (response && response.EC === 0) {
            toast.success(response.EM);
            navigate(`/profile-user`);
        }
    }

    const handleToggleRelative = () => {
        setIsRelative(prevState => !prevState);
    };

    return (
        <div className="container-checkout">
            <HeaderHome />
            <div className="grid wide">
                <div className='containe'>
                    <div className='left'>
                        <div className='title-left'>
                            Shipping address <span className={`order_relatives ${isRelative ? 'active' : ''} `} onClick={handleToggleRelative}>
                                Đặt cho người thân
                            </span>
                        </div>
                        {isRelative ? (
                            <>
                                <div className="select_option">
                                    <div className="col-12 col-sm-5 from-group ">
                                        <Select
                                            className={validInputs.province ? 'mb-4' : 'mb-4 is-invalid'}
                                            value={locations.find(option => option.id === userData.province)}
                                            onChange={(selected) => handleOnChangeInput(selected, 'province')}
                                            options={locations.map(province => ({
                                                value: province.id,
                                                label: province.province_name,
                                            }))}
                                        />
                                    </div>
                                    <div className="col-12 col-sm-5 from-group">
                                        <Select
                                            className={validInputs.district ? 'mb-4' : 'mb-4 is-invalid'}
                                            value={filteredDistricts.find(option => option.id === userData.district)}
                                            onChange={(selected) => handleOnChangeInput(selected, 'district')}
                                            options={filteredDistricts.map(district => ({
                                                value: district.id,
                                                label: district.district_name,
                                            }))}
                                        />
                                    </div>
                                    <div className="col-12 col-sm-5 from-group ">
                                        <Select
                                            className={validInputs.ward ? 'mb-4' : 'mb-4 is-invalid'}
                                            value={filteredWards.find(option => option.id === userData.ward)}
                                            onChange={(selected) => handleOnChangeInput(selected, 'ward')}
                                            options={filteredWards.map(ward => ({
                                                value: ward.id,
                                                label: ward.ward_name,
                                            }))}
                                        />
                                    </div>
                                </div>
                                <div className="all_option">
                                    <div className="selected_option">
                                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                                        <span style={{ paddingLeft: '5px' }}>
                                            {userData.province?.province_name || 'Chưa chọn'} , {userData.district?.district_name || 'Chưa chọn'} ,  {userData.ward?.ward_name || 'Chưa chọn'}</span>
                                    </div>
                                </div>
                                <div style={{ marginRight: '19px' }}>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{ width: '100%', marginRight: '10px' }}>
                                            <input type="text"
                                                className={validInputs.phonenumber ? 'form-control mt-1' : 'form-control mt-1 is-invalid'}
                                                placeholder="Số điện thoại"
                                                name="phonenumber"
                                                value={userData.phonenumber}
                                                onChange={(e) =>
                                                    handleOnChangeInputDetail(e.target.value, "phonenumber")
                                                }
                                            />
                                        </span>
                                        <input type="text"
                                            className={validInputs.customerName ? 'form-control mt-1 ' : 'form-control mt-1 is-invalid'}
                                            placeholder="Tên người nhận hàng"
                                            name="customerName"
                                            value={userData.customerName}
                                            onChange={(e) =>
                                                handleOnChangeInputDetail(e.target.value, "customerName")
                                            }
                                        />
                                    </div>
                                    <input type="text"
                                        className={validInputs.address_detail ? 'form-control mt-2 mb-2' : 'form-control mt-2 mb-2 is-invalid'}
                                        placeholder="Địa chỉ chi tiết"
                                        name="address_detail"
                                        value={userData.address_detail}
                                        onChange={(e) =>
                                            handleOnChangeInputDetail(e.target.value, "address_detail")
                                        }
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='info'>
                                    <div className='name-user'>
                                        {user.account.username}
                                    </div>
                                    <div className='sđt'>{user.account.phonenumber}</div>
                                </div>
                                <div className='address'>
                                    <span className='home'>Home</span> {user.account.wardName} , {user.account.districtName} , {user.account.provinceName}
                                </div>
                                <div style={{ marginRight: '19px' }}>
                                    <input type="text"
                                        className='form-control mb-2'
                                        placeholder="Địa chỉ chi tiết"
                                        name="address_detail"
                                        value={userData.address_detail}
                                        onChange={(e) =>
                                            handleOnChangeInputDetail(e.target.value, "address_detail")
                                        }
                                    />
                                </div>
                            </>
                        )}
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