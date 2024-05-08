import './DetailStore.scss';
import React, { useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import HeaderHome from "../../HeaderHome/HeaderHome";
import Footer from "../../Footer/Footer";

function DetailStore() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className='container-detail-store'>
            <HeaderHome />
            <div className="grid wide">
                <div className='name-store'>
                    <div className='pt-3'>
                        <div className='name'>Carave vietnam</div>
                    </div>
                </div>
                <div className='header-store'>
                    <div className='container-header-store'>
                        <div className='header-store-left'>
                            <ul className='list-category' onClick={toggleMenu}>
                                Danh mục <i className="fa fa-angle-down" aria-hidden="true"></i>
                                {isOpen && (
                                    <div className='list-item'>
                                        <li className='item-category'>Sữa rửa mặt</li>
                                        <li className='item-category'>Sữa rửa mặt</li>
                                        <li className='item-category'>Sữa rửa mặt</li>
                                    </div>
                                )}
                            </ul>
                        </div>
                        <div className='header-store-right'>
                            <div className="box">
                                <form className="sbox">
                                    <input
                                        className="stext"
                                        type=""
                                        placeholder="Search in store..."
                                    />
                                    <NavLink className="sbutton" type="submit" to="">
                                        <i className="fa fa-search"></i>
                                    </NavLink>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className="title">
                        <div className="title-name">Sản phẩm mới nhất</div>
                    </div>
                    <div className='product'>
                        <div className='product-item'>
                            <div className='img'>
                                <img src='https://lzd-img-global.slatic.net/g/p/cec3573ae164b42fc902773a7d69f3d5.png_200x200q80.png_.webp' className='img_product' />
                            </div>
                            <div className='content-product'>
                                <div className='name-product'><span className='buy-now'>Buy now</span>Sữa rửa mặt carave trai xanh</div>
                                <div className='price'>
                                    <div className='price-new'>300.000đ</div>
                                    <div className='price-bottom'>
                                        <div className='price-old'>400.000đ</div>
                                        <div className='price-promotion'>-10%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='product-item'>
                            <div className='img'>
                                <img src='https://lzd-img-global.slatic.net/g/p/cec3573ae164b42fc902773a7d69f3d5.png_200x200q80.png_.webp' className='img_product' />
                            </div>
                            <div className='content-product'>
                                <div className='name-product'><span className='buy-now'>Buy now</span>Sữa rửa mặt carave trai xanh</div>
                                <div className='price'>
                                    <div className='price-new'>300.000đ</div>
                                    <div className='price-bottom'>
                                        <div className='price-old'>400.000đ</div>
                                        <div className='price-promotion'>-10%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='product-item'>
                            <div className='img'>
                                <img src='https://lzd-img-global.slatic.net/g/p/cec3573ae164b42fc902773a7d69f3d5.png_200x200q80.png_.webp' className='img_product' />
                            </div>
                            <div className='content-product'>
                                <div className='name-product'><span className='buy-now'>Buy now</span>Sữa rửa mặt carave trai xanh</div>
                                <div className='price'>
                                    <div className='price-new'>300.000đ</div>
                                    <div className='price-bottom'>
                                        <div className='price-old'>400.000đ</div>
                                        <div className='price-promotion'>-10%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='product-item'>
                            <div className='img'>
                                <img src='https://lzd-img-global.slatic.net/g/p/cec3573ae164b42fc902773a7d69f3d5.png_200x200q80.png_.webp' className='img_product' />
                            </div>
                            <div className='content-product'>
                                <div className='name-product'><span className='buy-now'>Buy now</span>Sữa rửa mặt carave trai xanh</div>
                                <div className='price'>
                                    <div className='price-new'>300.000đ</div>
                                    <div className='price-bottom'>
                                        <div className='price-old'>400.000đ</div>
                                        <div className='price-promotion'>-10%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='product-item'>
                            <div className='img'>
                                <img src='https://lzd-img-global.slatic.net/g/p/cec3573ae164b42fc902773a7d69f3d5.png_200x200q80.png_.webp' className='img_product' />
                            </div>
                            <div className='content-product'>
                                <div className='name-product'><span className='buy-now'>Buy now</span>Sữa rửa mặt carave trai xanh</div>
                                <div className='price'>
                                    <div className='price-new'>300.000đ</div>
                                    <div className='price-bottom'>
                                        <div className='price-old'>400.000đ</div>
                                        <div className='price-promotion'>-10%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='product-item'>
                            <div className='img'>
                                <img src='https://lzd-img-global.slatic.net/g/p/cec3573ae164b42fc902773a7d69f3d5.png_200x200q80.png_.webp' className='img_product' />
                            </div>
                            <div className='content-product'>
                                <div className='name-product'><span className='buy-now'>Buy now</span>Sữa rửa mặt carave trai xanh</div>
                                <div className='price'>
                                    <div className='price-new'>300.000đ</div>
                                    <div className='price-bottom'>
                                        <div className='price-old'>400.000đ</div>
                                        <div className='price-promotion'>-10%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default DetailStore;