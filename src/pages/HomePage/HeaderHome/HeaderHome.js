import { useContext } from "react";
import React, { } from "react";
import { UserContext } from "../../../context/userContext";
import { useCart } from '../../../context/cartContext';
import "./HeaderHome.scss";
import { logoutUser } from "../../../services/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { deleteProductCart } from "../../../services/productService";
import { Link } from 'react-router-dom';
const { Buffer } = require("buffer");

function HeaderHome() {
  const { user, logoutContext } = useContext(UserContext);
  const { cartItems, fetchCartItems } = useCart();
  let navigate = useNavigate();

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProductCart(productId);
      toast.success("Product removed from cart successfully");
      fetchCartItems(user.account.id);
    } catch (error) {
      console.error("Error deleting product from cart:", error);
      toast.error("Failed to remove product from cart");
    }
  };

  const handleDetailCart = () => {
    navigate("/detail-cart");
  };

  const handleProfile = () => {
    navigate('/profile-user');
  }

  const handleLogout = async () => {
    let data = await logoutUser();
    localStorage.removeItem("jwt");
    logoutContext();
    if (data && +data.EC === 0) {
      toast.success("Logout successful");
      navigate("/login");
    } else {
      toast.error(data.EM);
    }
  };

  if (user && user.isAuthenticated === true) {
    return (
      <div className="header-container">
        <header className="header">
          <div className="grid wide">
            <nav className="header__navbar hideOnMobile-tablet">
              <ul className="header__navbar-list">
                <li className="header__navbar-item">
                  <span className="header__navbar-title-no-poiter">
                    Kết nối với chúng tôi
                  </span>
                  <a href="/" className="header__navbar-icon-link">
                    <i className="header__navbar-icon fa fa-facebook-official"></i>
                  </a>
                </li>
              </ul>
              <ul className="header__navbar-list">
                <li className="header__navbar-item header__navbar-item--has-notify">
                  <a href="/" className="header__navbar-item-link">
                    <i className="header__navbar-icon fa fa-bell-o"></i>
                    Thông báo
                  </a>
                  <div className="header__notify">
                    <header className="header__notify-header">
                      <h3>Thông báo mới nhất</h3>
                    </header>
                    <ul className="header__notify-list">
                      <li className="header__notify-item header__notify-item--view">
                        <a href="/" className="header__notify-link">
                          <img
                            src="https://juro.com.vn/wp-content/uploads/chup-anh-san-pham-my-pham.jpg"
                            alt=""
                            className="header__notify-img"
                          />
                          <div className="header__notify-info">
                            <span className="header__notify-name">
                              Mỹ phẩm Ohui chính hãng
                            </span>
                            <span className="header__notify-descriotion">
                              Sản phẩm chăm sóc sắc đẹp hàng đầu của thương hiệu
                              Ohui
                            </span>
                          </div>
                        </a>
                      </li>
                      <li className="header__notify-item header__notify-item--view">
                        <a href="/" className="header__notify-link">
                          <img
                            src="https://juro.com.vn/wp-content/uploads/chup-anh-san-pham-my-pham.jpg"
                            alt=""
                            className="header__notify-img"
                          />
                          <div className="header__notify-info">
                            <span className="header__notify-name">
                              Mỹ phẩm Ohui chính hãng
                            </span>
                            <span className="header__notify-descriotion">
                              Sản phẩm chăm sóc sắc đẹp hàng đầu của thương hiệu
                              Ohui
                            </span>
                          </div>
                        </a>
                      </li>
                      <li className="header__notify-item">
                        <a href="/" className="header__notify-link">
                          <img
                            src="https://juro.com.vn/wp-content/uploads/chup-anh-san-pham-my-pham.jpg"
                            alt=""
                            className="header__notify-img"
                          />
                          <div className="header__notify-info">
                            <span className="header__notify-name">
                              Mỹ phẩm Ohui chính hãng thương hiệu số 1 hàn quốc
                            </span>
                            <span className="header__notify-descriotion">
                              Sản phẩm chăm sóc sắc đẹp hàng đầu của thương hiệu
                              Ohui
                            </span>
                          </div>
                        </a>
                      </li>
                    </ul>
                    <footer className="header__notyfy-footer">
                      <a href="/" className="header__notyfy-footer-btn">
                        Xem tất cả
                      </a>
                    </footer>
                  </div>
                </li>
                <li className="header__navbar-item" >
                  <Link to={'/contact'} className="header__navbar-item-link">
                    <i className="header__navbar-icon fa fa-question-circle-o"></i>{" "}
                    Trợ giúp
                  </Link>
                </li>

                {user && user.isAuthenticated === true && (
                  <li className="header__navbar-item header__navbar-user">
                    <img
                      src="https://yt3.ggpht.com/yti/ADpuP3Pw7-Bz5mpDvQd0BeBhytP5DVie47taUvKQnnfOQg=s88-c-k-c0x00ffffff-no-rj"
                      alt=""
                      className="header__navbar-user-img"
                    />
                    <span className="header__navbar-user-name">
                      {user.account.username}
                    </span>

                    <ul className="header__navbar-user-menu">
                      <li className="header__navbar-user-item" onClick={handleProfile}>
                        <span>Tài khoản của tôi</span>
                      </li>
                      <li
                        className="header__navbar-user-item"
                        onClick={() => handleLogout()}
                      >
                        <span>Đăng xuất</span>
                      </li>
                    </ul>
                  </li>
                )}
              </ul>
            </nav>

            {/* header search  */}
            <div className="header-with-search">
              <div className="header-left-mobile">
                <label htmlFor="bar-mobile" className="header-bar-mobile">
                  <i className="header-bar-mobile-icon fas fa-bars"></i>
                </label>

                <label
                  htmlFor="mobile-search-checkbox"
                  className="header__mobile-search"
                >
                  <i className="header__mobile-search-icon fas fa-search"></i>
                </label>
              </div>

              <Link to="/home" className="header__logo">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 220 44"
                  className="header__logo-img"
                  height="50"
                >
                  <text
                    x="0"
                    y="40"
                    fontFamily="cursive, sans-serif"
                    fontSize="40"
                    fill="#fff"
                  >
                    EliteEmporium
                  </text>
                </svg>
              </Link>

              <input
                type="checkbox"
                hidden
                id="mobile-search-checkbox"
                className="header__search-checkobx"
              />

              <div className="header__search">
                <div className="header__search-input-wrap">
                  <input
                    type="text"
                    className="header__search-input"
                    placeholder="Tìm kiếm sản phẩm ..."
                  />

                  {/* search history */}
                  <div className="header__search-history">
                    <h3 className="header__search-history-heading">
                      Lịch sử tìm kiếm
                    </h3>
                    <ul className="header__search-history-list">
                      <li className="header__search-history-item">
                        <a href="/">Kem dưỡng da</a>
                      </li>
                      <li className="header__search-history-item">
                        <a href="/">Kem trị mụn</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <button className="header__search-btn">
                  <i className="header__search-btn-icon fa fa-search"></i>
                </button>
              </div>

              {/* cart layout */}
              <div className="header__cart">
                <div className="header-cart-wrap">
                  <i className="header__cart-icon fa fa-shopping-cart"></i>

                  <span className="header-cart-notice">
                    {cartItems.map(product => product.OrderItems.length).reduce((total, count) => total + count, 0)}
                  </span>

                  <div className="header__cart-list header__cart-list-co-cart">
                    {cartItems && cartItems.length > 0 && cartItems[0].OrderItems.length > 0 ? (
                      <>
                        <h4 className="header__cart-heading">Sản phẩm đã thêm</h4>
                        {cartItems && cartItems.map((item, index) => {
                          return (
                            <ul className="header__cart-list-item" key={index}>
                              {item.OrderItems.map((orderItem, orderIndex) => {
                                let imageBase64 = '';
                                if (orderItem.Product_size_color.Product.image) {
                                  imageBase64 = new Buffer.from(orderItem.Product_size_color.Product.image, 'base64').toString('binary');
                                }
                                return (
                                  <li className="header__cart-item" key={orderIndex} >
                                    <div className="header__cart-img" style={{ backgroundImage: `url(${imageBase64})` }}
                                    />
                                    <div className="header__cart-item-info">
                                      <div className="header__cart-item-head">
                                        <h5 className="header__cart-item-name">
                                          {orderItem.Product_size_color.Product.product_name}
                                        </h5>
                                        <div className="header__cart-item-price-wrap">
                                          <span className="header__cart-item-price">
                                            {orderItem.Product_size_color.Product.price}
                                          </span>
                                          <span className="header__cart-item-miltiply">
                                            x
                                          </span>
                                          <span className="header__cart-item-qnt">{orderItem.quantily}</span>
                                        </div>
                                      </div>

                                      <div className="header__cart-item-body">
                                        <span className="header__cart-item-description">
                                          {orderItem.Product_size_color.Product.description}
                                        </span>
                                        <span className="header__cart-item-remove"
                                          onClick={() => handleDeleteProduct(orderItem.id)}
                                        >
                                          Xoá
                                        </span>
                                      </div>
                                      <div>
                                        <span className="color_size">Color : {orderItem.Product_size_color.Color.name}
                                        </span>
                                        <span className="color_size pl-1">
                                          , Size : {orderItem.Product_size_color.Size.size_value}
                                        </span >
                                      </div>
                                    </div>
                                  </li>
                                )
                              })}
                            </ul>
                          )
                        })}
                        <button className="btn-container btn--primary header__cart-view-cart" onClick={handleDetailCart}>
                          Xem giỏ hàng
                        </button>
                      </>
                    ) : (
                      <>
                        <img
                          src="https://banhtombaloc4475.abaha.vn/assets/images/no-cart.png"
                          alt=""
                          className="header__cart-no-cart-img"
                        />
                        <span className="header__cart-list-msg">
                          Chưa có sản phẩm
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ul className="header__sort-bar">
            <li className="header__sort-item">
              <a href="/" className="header__sort-link">
                Liên quan
              </a>
            </li>
            <li className="header__sort-item header__sort-item-active">
              <a href="/" className="header__sort-link">
                Mới nhất
              </a>
            </li>
            <li className="header__sort-item">
              <a href="/" className="header__sort-link">
                Bán chạy
              </a>
            </li>
            <li className="header__sort-item">
              <a href="/" className="header__sort-link">
                Giá
              </a>
            </li>
          </ul>
        </header >
      </div >
    );
  } else {
    return <></>;
  }
}

export default HeaderHome;
