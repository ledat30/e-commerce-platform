import './CheckOut.scss';
import HeaderHome from "../../HeaderHome/HeaderHome";
import Footer from "../../Footer/Footer";

function CheckOut() {
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
                                Lê Văn Đạt
                            </div>
                            <div className='sđt'>0386582177</div>
                        </div>
                        <div className='address'>
                            <span className='home'>Home</span> Gần trường mần non kim sơn, Xã kim sơn , Huyện gia lâm, Hà nội
                        </div>
                        <div className='title-product'>Sản phẩm</div>
                        <div className='product'>
                            <div className='info_product'>
                                <div className='img_prod'>
                                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy7fbYGhskg-hnIcKP39a045twclUS7PWexQ&s' className='img' />
                                </div>
                                <div className='detail-product'>
                                    <div className='name-prod'>
                                        Sữa rửa mặt carave trai xanh lá dịu nhẹ phù hợp mọi loại da
                                    </div>
                                    <div className='size_color'>Đen , XL</div>
                                </div>
                                <div className='price'>
                                    <div className='price_new'>
                                        150.000 đ
                                    </div>
                                    <div className='price_old'>200.000 đ</div>
                                    <div className='sale'>10%</div>
                                </div>
                                <div className='quantity'>Số lượng : x 1</div>
                            </div>
                        </div>
                    </div>
                    <div className='right'>
                        <div className="order">
                            <div className="title-order">Thanh toán đơn hàng</div>
                            <div className="items">
                                <span className="total">Tổng tiền</span>
                                <span className="pri">100.000đ</span>
                            </div>
                            <div className="ship">
                                <span className="ship-unit">Phí vận chuyển</span>
                                <span className="price_ship">29.000đ</span>
                            </div>
                            <div className="total_payment">
                                <div className="tong">
                                    Tổng tiền thanh toán
                                </div>
                                <div className="tien">
                                    110.000đ
                                </div>
                            </div>
                            <div className="payment_method">
                                <div className="option" >
                                    <div className="method">
                                        Chuyển khoản
                                    </div>
                                    <div className="choose_method" >
                                        <i className="fa fa-toggle-off" aria-hidden="true"></i>
                                    </div>
                                </div>
                                <div className="option" >
                                    <div className="method">
                                        Thanh toán khi nhận hàng
                                    </div>
                                    <div className="choose_method" >
                                        <i className="fa fa-toggle-off" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="button-buy">
                                <div className="buy" >Buy now</div>
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