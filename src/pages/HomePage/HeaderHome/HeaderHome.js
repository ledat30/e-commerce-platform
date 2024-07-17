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
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAM1BMVEX////a2tqysrLd3d2vr6/X19f8/Pzy8vLg4OC5ubm9vb3Nzc319fXj4+O1tbXr6+vGxsa5MvUTAAAFI0lEQVR4nO2c27ajIAxAixEUvP7/1w5Q26NWTbQa7Kzsl5l5OGe5JyRyCT4egiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIwi9jTF2MqI1J/UQHMUXRdU0JoAYAyqbrvFHqJ9uJqbum8RZaqwnh32XTdHXqB6RTdyWomcZEScGv+HQNrHv84X1SPylKRxF5cW+dbp4k22h9Wx1T7BEZdFRxy+JWl7ui8tYp71cKzK5kmdLdLDhFc9xFqaZI/fxjOjg0xF5ouE8hMF+FZQjOTYZaXX7v4mc5t6gDNemFjwM3sDnwclkjeRk40SW5TXHSGHsCSW3q70ryHJ0ybw7OYDZs0tU005zs4m2SvW+60128TaK5QHGBi7dJUgTMFSqBFAPtlEnMEiW/yxfrFwz2tKmvc+GfpZ0w6191UQ2vy65pDET2/ABrRaMvx7yFriJa0YVYX53UwHiR3jnbeqx1faWpP8cYGkN794PuXZvleRbxf7aup+loxg0b0uISVG+zQeRFntmeIsNY0EiBAe2yRRwlOHyhoQQGqmWVQEX5ea7QEGaYUOXrMjnBhmu+iS9jYNOFZsNUnWs0MKA3XbwNnjeaZ5zho0y32y5Z1qI2POOM8PZfqWNjHPofUnKMM4NmzEYh+wNNG80hg6aMdkjGxKzBQ8ORNNgbEyo0YwItFhqWrQ1suUwKjA9Nj40zjuUz8ghKW4pLllt0uF7vguU/Lf0D6Di7vgKg+d+TRlkYZ1hkrq8AWP4TUybUM+w3XV8BsFfmeTIM+xr/lQxamWnFzIOWs+trMzoLOU8G0stQh1mGDrP0MoqeM9hvEplzZbZXzCOZCvtN6nIZ9L+TNmkmTJvvEBnqrBnNf4bSjB6YQU+LDL61eb0MugMAtDeNxTdo0k9nqKEh7DlfL4NvNIGyaNbgSzOWzSZ8C5C0PsP3NIFhPYPuNIXnQBdo6AaA4tlrwp/C2yDbgI505HS9C6mZAWCzolna1QcGGeIR4EZsnKLIsOybESqAioeA7WLi5G1PcuHZ0aRUgEjl5kea4VDT4fPLQYZl45zaAwB6rhNUqKfnTKdN5D6z0M8QTpwHMktvBGA7B9zXaKa9UKTaeVGI5+Rsb+t/7JvZ3TLM1XFyTT/jFLbuxnNuMmzD1xN8RdvsFMbmmbMuZqzD2AxI7Go6DmdX08n3GT5hbQWkzwLeDY27eht5m+gpoYkdjb1zzkb8X8IMgGLEffUECU0QCW2AHxuCsRkQ02Hunn2YrQfyKn4BsLJ0zv0iYDs8wN5Av3U/q7JrJi8fu7UQSHC1YW2g6QrfaQp7TdVaeU9wF2Bl8qyxqIyjs6yT5DrQwnwTllaXqzp+qbaQOoku0X3MA6BaXvev6nweayT73MGsWdMXY3pYXsGZdW2nu3M2tQFNSfwPHTsOTkKXyd1GIBWxBZvRUEv81Yb3rVOo9g6xN2+bpHdOnzaDC60gL8dmyJvULi8bva+MzWyyaJPe5bkjcCj3Rzbh6OkeXzfwixtyi8majbvNdydMeTxhBpmcpSWbhCGcYm662DQTshW6/otqlvf3+VJLpFZH61neqluk/oSO2jY7c+nv+empZv8kIM+41/t0yn06eZZiVUkHws1MmkjrOM6Tv8I0YbWJXdMKq8z7DrAxRTybXd9qiqe0yT//Q6eIe4DPo8y/gRX+GXcBf8jkSd014bzZ2adT3rZxe/ZXvqD5iYnfbH1R1D/3qVZBEARBEARBEARBEARBEARBEARBEARBEIQT+AfxPkeIjBFFWQAAAABJRU5ErkJggg=="
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
                    EcomZone
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
                                if (orderItem.ProductAttribute.Product.image) {
                                  imageBase64 = new Buffer.from(orderItem.ProductAttribute.Product.image, 'base64').toString('binary');
                                }
                                return (
                                  <li className="header__cart-item" key={orderIndex} >
                                    <div className="header__cart-img" style={{ backgroundImage: `url(${imageBase64})` }}
                                    />
                                    <div className="header__cart-item-info">
                                      <div className="header__cart-item-head">
                                        <h5 className="header__cart-item-name">
                                          {orderItem.ProductAttribute.Product.product_name}
                                        </h5>
                                        <div className="header__cart-item-price-wrap">
                                          <span className="header__cart-item-price">
                                            {orderItem.ProductAttribute.Product.price}
                                          </span>
                                          <span className="header__cart-item-miltiply">
                                            x
                                          </span>
                                          <span className="header__cart-item-qnt">{orderItem.quantily}</span>
                                        </div>
                                      </div>

                                      <div className="header__cart-item-body">
                                        <span className="header__cart-item-description">
                                          {orderItem.ProductAttribute.Product.description}
                                        </span>
                                        <span className="header__cart-item-remove"
                                          onClick={() => handleDeleteProduct(orderItem.id)}
                                        >
                                          Xoá
                                        </span>
                                      </div>
                                      <div>
                                        <span className="color_size">{orderItem.ProductAttribute.AttributeValue1.Attribute.name} : {orderItem.ProductAttribute.AttributeValue1.name}
                                        </span>
                                        <span className="color_size pl-1">
                                          , {orderItem.ProductAttribute.AttributeValue2.Attribute.name} : {orderItem.ProductAttribute.AttributeValue2.name}
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
