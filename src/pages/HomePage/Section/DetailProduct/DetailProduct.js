import "./DetailProduct.scss";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import { useCart } from '../../../../context/cartContext';
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import HeaderHome from "../../HeaderHome/HeaderHome";
import Footer from "../../Footer/Footer";
import { Link } from "react-router-dom";
import { getDetailProductById, getRamdomProduct, getAllCommentByProduct, createCommentProduct, deleteCommentProduct, addToCart } from '../../../../../src/services/productService';
import _ from 'lodash';
import { marked } from 'marked';
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
const { Buffer } = require("buffer");

function DetailProduct() {
  const { user } = useContext(UserContext);
  const { fetchCartItems } = useCart();
  const [quantily, setQuantily] = useState(1);
  const [price_per_item, setPrice_per_item] = useState("");
  const [dataDetailProduct, setDataDetailproduct] = useState({});
  const { id: productId } = useParams();
  const [shouldReloadPage, setShouldReloadPage] = useState(false);
  const [previewImgURL, setPreviewImgURL] = useState("");
  const renderer = new marked.Renderer();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [randomProduct, setRamdomProduct] = useState([]);
  const [listComments, setListComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [attemptedSave, setAttemptedSave] = useState(false);
  const [content, setContent] = useState("");
  const [validInputComment, setValidInputComment] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const checkValidInput = () => {
    if (!content) {
      setValidInputComment(false);
      toast.error("Empty input content!");
      return false;
    }
    return true;
  };

  const handleConfirmComment = async () => {
    setAttemptedSave(true);

    if (checkValidInput() && productId) {
      let response = await createCommentProduct(productId, user.account.id, { content });
      if (response && response.EC === 0) {
        setContent("");
        toast.success(response.EM);
        await fetchComment(currentPage);
        setAttemptedSave(false);
        setValidInputComment(true);
      } else if (response && response.EC !== 0) {
        toast.error(response.EM);
        setValidInputComment({
          ...validInputComment,
          [response.DT]: false,
        });
      }
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteCommentProduct(user.account.id, commentId);
      if (response && response.EC === 0) {
        toast.success(response.EM);
        await fetchComment(currentPage);
      } else {
        toast.error(response.EM);
      }
    } catch (error) {
      toast.error('Error deleting comment. Please try again later.');
    }
  };

  renderer.image = function (href, text) {
    return `<p style="text-align: center;"><img src="${href}" alt="${text}" width="500px" height="250px"></p>`;
  };
  marked.setOptions({ renderer });

  const markdownToHtml = (markdown) => {
    return marked(markdown, { sanitize: true });
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      if (productId) {
        const product = await getDetailProductById(productId);
        setDataDetailproduct(product.data);
        setPrice_per_item(product.data.price)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (dataDetailProduct.image) {
      const imageBase64 = new Buffer.from(dataDetailProduct.image, "base64").toString("binary");
      setPreviewImgURL(imageBase64);
    }
  }, [dataDetailProduct]);

  useEffect(() => {
    fetchComment();
  }, [currentPage]);

  const fetchComment = async () => {
    try {
      if (productId) {
        let response = await getAllCommentByProduct(currentPage, currentLimit, productId);
        if (response && response.EC === 0) {
          setListComments(response.DT.comment);
          setTotalPages(response.DT.totalPages);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchRamdomProducts();
  }, []);

  useEffect(() => {
    if (shouldReloadPage) {
      window.location.reload();
    }
  }, [shouldReloadPage]);

  const fetchRamdomProducts = async () => {
    try {
      let response = await getRamdomProduct();
      if (response) {
        setRamdomProduct(response);
      }
    } catch (error) {
      console.error("Error fetching ramdom products:", error);
    }
  }

  const handleRandomProductClick = () => {
    setShouldReloadPage(true);
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      setQuantily(value);
    }
  };

  const incrementQuantity = () => {
    setQuantily(quantily + 1);
  };

  const decrementQuantity = () => {
    if (quantily > 1) {
      setQuantily(quantily - 1);
    }
  };

  const handleSizeClick = (size_value) => {
    setSelectedSize(size_value === selectedSize ? null : size_value);
  };

  const handleColorClick = (name) => {
    setSelectedColor(name === selectedColor ? null : name);
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleAddToCart = async () => {

    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }
    try {
      const selectedColorSize = dataDetailProduct.Product_size_colors.find(item =>
        item.Color.name === selectedColor &&
        item.Size.size_value === selectedSize
      );
      if (selectedColorSize) {
        const productColorSizeId = selectedColorSize.id;

        const response = await addToCart(
          productColorSizeId,
          user.account.id,
          dataDetailProduct.Store.id,
          { quantily: quantily, price_per_item: price_per_item, }
        );
        if (response && response.EC === 0) {
          toast.success(response.EM);
          fetchProduct();
          fetchCartItems(user.account.id);
          setQuantily(1);
          setSelectedColor("");
          setSelectedSize("");
        } else {
          toast.error(response.EM);
        }
      } else {
        toast.error("Selected color, size are not available");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add product to cart. Please try again later.");
    }
  }

  return (
    <div className="container-detail">
      <HeaderHome />
      <div className="grid wide">
        {dataDetailProduct && !_.isEmpty(dataDetailProduct)
          &&
          <>
            <div className="detail-product">
              <div className="content-product">
                <div className="image-product">
                  <div
                    className="image"
                    style={{ backgroundImage: `url(${previewImgURL})` }}
                    alt="Placeholder Image"
                  />
                </div>
                <div className="content-middle">
                  <div className="name-product">
                    {dataDetailProduct.product_name}
                  </div>
                  <div className="store">
                    Store : <span className="store-name">{dataDetailProduct.Store.name}</span>
                    <span className="view_detail-product">View : {dataDetailProduct.view_count} lượt xem</span>
                  </div>
                  <div className="price">
                    <span className="old">{dataDetailProduct.old_price}đ</span>{" "}
                    <span className="current">{dataDetailProduct.price}đ</span> -{dataDetailProduct.promotion}
                  </div>
                  <div className="choose-color-size">
                    <div className="size-color">
                      Chọn size
                      <div className="choose-size-color">
                        {Array.from(new Set(dataDetailProduct?.Product_size_colors?.map(item => item.Size.size_value))).map((size_value, index) => {
                          const isActive = size_value === selectedSize && dataDetailProduct.Inventories[0].currentNumber > 0;
                          const isNoHover = dataDetailProduct.Inventories[0].currentNumber === 0;
                          return (
                            <div key={index}
                              className={`choose ${isActive ? 'active' : ''} ${isNoHover ? 'no-hover' : ''}`}
                              onClick={() => dataDetailProduct.Inventories[0].currentNumber > 0 && handleSizeClick(size_value)}
                            >
                              {size_value}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="size-color">
                      Chọn màu
                      <div className="choose-size-color">
                        {Array.from(new Set(dataDetailProduct?.Product_size_colors?.map(item => item.Color.name))).map((name, index) => {
                          const isActive = name === selectedColor && dataDetailProduct.Inventories[0].currentNumber > 0;
                          const isNoHover = dataDetailProduct.Inventories[0].currentNumber === 0;
                          return (
                            <div key={index}
                              className={`choose ${isActive ? 'active' : ''} ${isNoHover ? 'no-hover' : ''}`}
                              onClick={() => dataDetailProduct.Inventories[0].currentNumber > 0 && handleColorClick(name)}
                            >
                              {name}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="quantily">
                      <div className="cong-tru">
                        Số lượng
                        <button
                          className={
                            quantily === 1
                              ? "button-quantily disabled ml"
                              : "button-quantily ml"
                          }
                          onClick={decrementQuantity}
                          disabled={quantily === 1}
                        >
                          -
                        </button>
                        <input
                          className="input-quantily"
                          id="quantityInput"
                          type="number"
                          value={quantily}
                          onChange={handleQuantityChange}
                          readOnly={true}
                        />
                        <button
                          className="button-quantily"
                          onClick={incrementQuantity}
                          disabled={quantily >= dataDetailProduct.Inventories[0].currentNumber}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="button-buy-add_cart">
                      {
                        dataDetailProduct.Inventories[0].currentNumber > 0 ? (
                          <>
                            <div className="buy">Buy now</div>
                            <div className="add_cart" onClick={handleAddToCart}>Add to cart</div>
                          </>
                        ) : (
                          <div className="out_of_stock">Hết hàng</div>
                        )
                      }
                    </div>
                  </div>
                </div>
                <div className="content-right">
                  <div className="note">Lưu ý</div>
                  <div className="information">
                    <i className="fa fa-truck" aria-hidden="true"></i> Giá vận
                    chuyển sẽ giao động từ 20.000đ - 40.000đ
                  </div>
                  <div className="information">
                    <i className="fa fa-handshake-o" aria-hidden="true"></i> Giao
                    hàng tiêu chuẩn 3 - 5 ngày
                  </div>
                  <div className="information">
                    <i className="fa fa-money" aria-hidden="true"></i> Chuẩn bị sẵn
                    tiền mặt khi nhận hàng
                  </div>
                  <div className="note">Trả hàng & bảo hành</div>
                  <div className="information">
                    <i className="fa fa-check-square-o" aria-hidden="true"></i> 100%
                    Authentic
                  </div>
                  <div className="information">
                    <i className="fa fa-check-square-o" aria-hidden="true"></i> 7
                    ngày đổi trả hàng
                  </div>
                  <div className="information">
                    <i className="fa fa-check-square-o" aria-hidden="true"></i> Hỗ
                    trợ nhiệt tình từ nhà bán hàng
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-content-product">
              <div className="name-product">
                {dataDetailProduct.product_name}
              </div>
              <div className={`content ${!isExpanded ? 'content-with-shadow' : ''}`}>
                <p className={`content-product ${isExpanded ? 'content-product_open' : ''}`} dangerouslySetInnerHTML={{ __html: markdownToHtml(dataDetailProduct.contentMarkdown) }}>
                </p>
                {isExpanded ? (
                  <span className="more-detail_product" onClick={toggleContent}>Ẩn bớt</span>
                ) : (
                  <span className="more-detail_product" onClick={toggleContent}>Xem thêm</span>
                )}
              </div>
            </div>

            <div className="comment">
              <div className="div"></div>
              <div className="container justify-content-center border-left border-right">
                <div className="d-flex justify-content-center pt-3 pb-2">
                  <input
                    type="text"
                    name="text"
                    placeholder="+ Thêm bình luận"
                    className={`form-control addtxt ${validInputComment.content || !attemptedSave
                      ? ""
                      : "is-invalid"
                      }`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <span className="submit-comment" onClick={() => handleConfirmComment()}>Đăng</span>
                </div>
                {listComments && listComments.length > 0 && listComments.map((item, index) => {
                  return (
                    <div className="d-flex justify-content-center py-2" key={index}>
                      <div className="second py-2 px-2">
                        <span className="text1">
                          {item.content}
                        </span>
                        <div className="d-flex justify-content-between py-1 pt-2">
                          <div>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbnLy2TDFa9Gl29wA4q8nihtL1lDK9iuez6Hn885ePAskQ84QA7ZRsqzg56-cwjJS2VGk&usqp=CAU" width="20" />
                            <span className="text2">{item.User.username}</span>
                          </div>
                          {user && user.account.id === item.userId
                            && (
                              <div>
                                <span className="text3" onClick={() => handleDeleteComment(item.id)}>
                                  <i className="fa fa-trash" aria-hidden="true"></i>
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {totalPages > 0 && (
                <div className="user-footer mt-3">
                  <ReactPaginate
                    nextLabel="sau >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={totalPages}
                    previousLabel="< Trước"
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
            </div>

            <div className="random-product">
              <div className="product_rd">
                <div className="title">
                  <div className="title-name">Sản phẩm có thể bạn quan tâm</div>
                </div>
                <div className="recommend-product-list">
                  {randomProduct && randomProduct.length > 0 && randomProduct.map((product, index) => {
                    return (
                      <div className="recommend-product-item" key={index}>
                        <Link to={`/product/${product.id}`} className="product-item-link" onClick={handleRandomProductClick}>
                          <div className="pdp-common-image product-image">
                            <div className="lazyload-wrapper">
                              <img
                                className="img"
                                src={product.image}
                                alt="Placeholder Image"
                              />
                            </div>
                          </div>
                          <div className="product-info">
                            <div className="product-title">
                              {product.product_name}
                            </div>
                            <div className="product-item__price">
                              <span className="product-item__price-old">{product.old_price}đ</span>
                              <span className="product-item__price-current">
                                {product.price}đ
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        }
      </div>
      <Footer />
    </div>
  );
}

export default DetailProduct;
