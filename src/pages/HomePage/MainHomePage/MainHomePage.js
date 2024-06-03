import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MainHomePage.scss";
import {
  getAllCategory,
  getDetailCategoryById,
} from "../../../services/categoryService";
import { getAllProducts } from "../../../services/productService";
import { useNavigate } from "react-router-dom";
import Popular from "./Popular/Popular";
import ReactPaginate from "react-paginate";

function MainHomePage() {
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  let navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [activeFilter, setActiveFilter] = useState('allProducts');
  const [sortOrder, setSortOrder] = useState('');

  const handleSortChange = (sortType) => {
    setSortOrder(sortType);
    if (sortType === 'priceLowHigh') {
      const sortedProducts = [...allProducts].sort((a, b) => parseFloat(a.price.replace(/\./g, '')) - parseFloat(b.price.replace(/\./g, '')));
      setAllProducts(sortedProducts);
    } else if (sortType === 'priceHighLow') {
      const sortedProducts = [...allProducts].sort((a, b) => parseFloat(b.price.replace(/\./g, '')) - parseFloat(a.price.replace(/\./g, '')));
      setAllProducts(sortedProducts);
    }
  };

  useEffect(() => {
    if (!sortOrder) {
      fetchProducts();
    }
  }, [sortOrder]);

  const handleToStore = () => {
    navigate(`/store`);
  }

  const showBestSelling = () => {
    setActiveFilter('bestSelling');
  };

  const showAllProducts = () => {
    setActiveFilter('allProducts');
    setCurrentPage(1);
    returnToNewProduct();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  useEffect(() => {
    const filtered = allCategories.filter((item) =>
      item.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, allCategories]);

  const fetchCategories = async () => {
    let response = await getAllCategory();

    if (response && response.EC === 0) {
      setAllCategories(response.DT);
    }
  };

  const fetchProducts = async () => {
    try {
      let response = await getAllProducts({
        page: currentPage,
        limit: currentLimit,
      });

      if (response && response.EC === 0) {
        setAllProducts(response.DT.product);
        setTotalPages(response.DT.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCategoryClick = async (id) => {
    try {
      if (id === null) {
        await fetchProducts();
        setSelectedCategory(null);
      } else {
        let response = await getDetailCategoryById({ id });
        if (response && response.EC === 0) {
          setAllProducts(response.DT);
          setTotalPages(response.DT.totalPages);
          setSelectedCategory(id);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const returnToNewProduct = async () => {
    try {
      await fetchProducts();
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error reloading new products:", error);
    }
  };

  return (
    <div className="app__container">
      <div className="grid wide">
        <div className="row sm-gutter app__content">
          <div className="col l-2 m-0 c-0">
            <nav className="category">
              <h3 className="category__heading">
                <i className="category__heading-icon fa fa-list-ul"></i> Danh
                mục
              </h3>

              <div className="search-category-home">
                <div className="search-sbox">
                  <input
                    className="search-stext"
                    type="text"
                    name="q"
                    placeholder="Tìm kiếm danh mục..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <div className="icon-search">
                    <i className="fa fa-search"></i>
                  </div>
                </div>
              </div>

              {filteredCategories && filteredCategories.length > 0 ? (
                <ul className="category-list">
                  <li
                    className={`category-item ${selectedCategory === null
                      ? "category-item__link-active"
                      : ""
                      }`}
                    onClick={() => handleCategoryClick(null)}
                  >
                    <div className="category-item__link">Tất cả</div>
                  </li>
                  {filteredCategories.map((item, index) => {
                    return (
                      <div key={index}>
                        <li
                          className={`category-item ${selectedCategory === item.id
                            ? "category-item__link-active"
                            : ""
                            }`}
                          onClick={() => handleCategoryClick(item.id)}
                          key={item.id}
                        >
                          <div className="category-item__link">
                            {item.category_name}
                          </div>
                        </li>
                      </div>
                    );
                  })}
                </ul>
              ) : (
                <div className="no-result-message">Không tìm thấy ...</div>
              )}
            </nav>
          </div>

          <div className="col l-10 m-12 c-12">
            <div className="home-filter hideOnMobile-tablet">
              <span className="home-filter__label">Sắp xếp theo</span>
              <button
                className={`home-filter_btn btn-container ${activeFilter === 'allProducts' ? 'btn--primary' : ''}`}
                onClick={showAllProducts}
              >
                Mới nhất
              </button>
              <button
                className={`home-filter_btn btn-container ${activeFilter === 'bestSelling' ? 'btn--primary' : ''}`}
                onClick={showBestSelling}
              >
                Bán chạy
              </button>
              <button
                className='home-filter_btn btn-container'
                onClick={handleToStore}
              >
                Cửa hàng
              </button>

              <div className="select-input">
                <span className="select-input__label">Giá</span>
                <i className="select-input__icon fa fa-angle-down"></i>

                <ul className="select-input__list">
                  <li className="select-input__item">
                    <button
                      onClick={() => handleSortChange('priceLowHigh')}
                      className={`select-input__link ${sortOrder === 'priceLowHigh' ? 'active' : ''}`}
                    >
                      Giá: Thấp đến cao
                    </button>
                  </li>
                  <li className="select-input__item">
                    <button
                      onClick={() => handleSortChange('priceHighLow')}
                      className={`select-input__link ${sortOrder === 'priceHighLow' ? 'active' : ''}`}
                    >
                      Giá: Cao đến thấp
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="home-product">
              {activeFilter === 'bestSelling' ? (
                <Popular />
              ) : (
                <div>
                  <div className="row sm-gutter">
                    {allProducts && allProducts.length > 0 ? (
                      allProducts.map((item, index) => (
                        <div className="col l-2-4 m-4 c-6 product-mr" key={index}>
                          <Link
                            to={`/product/${item.id}`}
                            className="home-product-item"
                          >
                            <div
                              className="home-product-item__img"
                              style={{ backgroundImage: `url(${item.image})` }}
                            ></div>
                            <h4 className="home-product-item__name">
                              {item.product_name}
                            </h4>
                            <div className="home-product-item__price">
                              <span className="home-product-item__price-old">
                                {item.old_price}đ
                              </span>
                              <span className="home-product-item__price-current">
                                {item.price}đ
                              </span>
                            </div>
                            <div className="home-product-item__action">
                              <span className="home-product-item__brand">
                                {item.Store.name}
                              </span>
                            </div>
                            <div className="home-product-item__new">
                              <span className="pr">New</span>
                            </div>
                            <div className="home-product-item__sale-off">
                              <span className="home-product-item__sale-off-percent">
                                {item.promotion}
                              </span>
                              <span className="home-product-item__sale-off-lable">
                                GIẢM
                              </span>
                            </div>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="no-products-message">
                        <p>Không có sản phẩm nào.</p>
                      </div>
                    )}
                  </div>
                  {selectedCategory === null && allProducts && allProducts.length > 0 && (
                    <ul className="pagination home-product__pagination">
                      <ReactPaginate
                        nextLabel="next >"
                        onPageChange={handlePageChange}
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
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                      />
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default MainHomePage;
