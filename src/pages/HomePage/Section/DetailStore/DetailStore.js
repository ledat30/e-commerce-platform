import './DetailStore.scss';
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from "react-router-dom";
import HeaderHome from "../../HeaderHome/HeaderHome";
import Footer from "../../Footer/Footer";
import { useParams } from 'react-router-dom';
import { getAllProductByStoreId, getCategoriesByStore } from '../../../../services/storeService';
import ReactPaginate from "react-paginate";
const { Buffer } = require("buffer");

function DetailStore() {
    const [isOpen, setIsOpen] = useState(false);
    const [listProducts, setListProducts] = useState([]);
    const { storeId: storeById } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(15);
    const [totalPages, setTotalPages] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [listCategory, setListCategory] = useState([]);
    const [selectedCategoryProducts, setSelectedCategoryProducts] = useState([]);
    const [showAllProducts, setShowAllProducts] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const handleCategoryClick = (category) => {
        setShowAllProducts(false);
        setSelectedCategoryId(category.id);
        setSelectedCategoryProducts(category.Products);
    };

    const handleShowAllProducts = () => {
        setShowAllProducts(true);
        setSelectedCategoryProducts([]);
        setSelectedCategoryId(null);
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const fetchCategory = async () => {
        let response = await getCategoriesByStore(storeById);

        if (response && response.EC === 0) {
            setListCategory(response.DT)
        }
    }

    const filteredData = listProducts.filter((item) =>
        item.product_name.toLowerCase().includes(searchInput.toLowerCase())
    );

    const filteredData2 = selectedCategoryProducts.filter((item) =>
        item.product_name.toLowerCase().includes(searchInput.toLowerCase())
    );

    useEffect(() => {
        fetchAllProducts();
    }, [currentPage]);

    const fetchAllProducts = async () => {
        let response = await getAllProductByStoreId(currentPage, currentLimit, storeById);
        if (response && response.EC === 0) {
            setListProducts(response.DT.product)
            setTotalPages(response.DT.totalPages);
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className='container-detail-store'>
            <HeaderHome />
            <div className="grid wide">
                <div className='name-store'>
                    <div className='pt-3'>
                        <div className='name'>{listProducts[0]?.Store?.name}</div>
                    </div>
                </div>
                <div className='header-store'>
                    <div className='container-header-store'>
                        <div className='header-store-left'>
                            <ul className='list-category' onClick={toggleMenu}>
                                Danh mục <i className="fa fa-angle-down" aria-hidden="true"></i>
                                <div className='list-item' >
                                    {listCategory && listCategory.map((category, index) => (
                                        isOpen ? (
                                            <li className={`item-category ${selectedCategoryId === category.id ? 'active' : ''}`} key={index} onClick={() => handleCategoryClick(category)}>{category.category_name}</li>
                                        ) : null
                                    ))}
                                </div>
                            </ul>
                            <div className='all_product'>
                                <div className={`title ${showAllProducts ? 'active' : ''}`} onClick={handleShowAllProducts}>Tất cả sản phẩm</div>
                            </div>
                        </div>

                        <div className='header-store-right'>
                            <div className="box">
                                <form className="sbox">
                                    <input
                                        className="stext"
                                        type=""
                                        placeholder="Search in store..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
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
                    {showAllProducts &&
                        <div className="title">
                            <div className="title-name">Sản phẩm mới nhất</div>
                        </div>
                    }

                    <div className='product'>
                        {showAllProducts ? (
                            filteredData.length === 0 ? (
                                <div>Không tìm thấy sản phẩm phù hợp</div>
                            ) : (
                                filteredData.map((item, index) => {
                                    let imageBase64 = '';
                                    imageBase64 = new Buffer.from(item.image, 'base64').toString('binary');
                                    return (
                                        <Link className='product-item' key={index} to={`/product/${item.id}`}>
                                            <div className='img_product' style={{ backgroundImage: `url(${imageBase64})` }}></div>
                                            <div className='content-product'>
                                                <div className='name-product'><span className='buy-now'>Buy now</span>{item.product_name}</div>
                                                <div className='price'>
                                                    <div className='price-new'>{item.price}đ</div>
                                                    <div className='price-bottom'>
                                                        <div className='price-old'>{item.old_price}đ</div>
                                                        <div className='price-promotion'>-{item.promotion}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })
                            )
                        ) : (
                            filteredData2.length > 0 ? (
                                filteredData2.map((item, index) => {
                                    let imageBase64 = '';
                                    imageBase64 = new Buffer.from(item.image, 'base64').toString('binary');
                                    return (
                                        <div className='product-item' key={index}>
                                            <div className='img_product' style={{ backgroundImage: `url(${imageBase64})` }}></div>
                                            <div className='content-product'>
                                                <div className='name-product'>
                                                    <span className='buy-now'>Buy now</span>
                                                    {item.product_name}
                                                </div>
                                                <div className='price'>
                                                    <div className='price-new'>{item.price}đ</div>
                                                    <div className='price-bottom'>
                                                        <div className='price-old'>{item.old_price}đ</div>
                                                        <div className='price-promotion'>-{item.promotion}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div>Không tìm thấy sản phẩm phù hợp</div>
                            )
                        )}
                    </div>

                    {showAllProducts && totalPages > 0 && (
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
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default DetailStore;