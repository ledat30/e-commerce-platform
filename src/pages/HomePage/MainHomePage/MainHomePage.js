import { useEffect, useState } from "react";
import "./MainHomePage.scss";
import { getAllCategory } from "../../../services/categoryService";

function MainHomePage() {
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleCategoryClick = (index) => {
    setSelectedCategory(index);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

              <div className="box">
                <div className="sbox">
                  <input
                    className="stext"
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
                  {filteredCategories.map((item, index) => {
                    const isActive = index === selectedCategory;
                    const categoryClasses = `category-item ${
                      isActive ? "category-item__link-active" : ""
                    }`;
                    return (
                      <li
                        className={categoryClasses}
                        onClick={() => handleCategoryClick(index)}
                        key={index}
                      >
                        <div className="category-item__link">
                          {item.category_name}
                        </div>
                      </li>
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
              <button className="home-filter_btn btn-container btn--primary">
                Mới nhất
              </button>
              <button className="home-filter_btn btn-container">
                Phổ biến
              </button>
              <button className="home-filter_btn btn-container">
                Bán chạy
              </button>

              <div className="select-input">
                <span className="select-input__label">Giá</span>
                <i className="select-input__icon fa fa-angle-down"></i>

                <ul className="select-input__list">
                  <li className="select-input__item">
                    <a href="/" className="select-input__link">
                      Giá: Thấp đến cao
                    </a>
                  </li>
                  <li className="select-input__item">
                    <a href="/" className="select-input__link">
                      Giá: Cao đến thấp
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <nav className="mobile-category">
              <ul className="mobile-category__list">
                <li className="mobile-category__item">
                  <a href="/" className="mobile-category__link">
                    Dụng cụ nhà bếp
                  </a>
                </li>
                <li className="mobile-category__item">
                  <a href="/" className="mobile-category__link">
                    Thiết bị hỗ trợ sửa chữa đồ đạc
                  </a>
                </li>
                <li className="mobile-category__item">
                  <a href="/" className="mobile-category__link">
                    Điện thoại Khuyến mãi cục lớn
                  </a>
                </li>
                <li className="mobile-category__item">
                  <a href="/" className="mobile-category__link">
                    Máy tính
                  </a>
                </li>
                <li className="mobile-category__item">
                  <a href="/" className="mobile-category__link">
                    Tai nghe
                  </a>
                </li>
                <li className="mobile-category__item">
                  <a href="/" className="mobile-category__link">
                    Cặp sách
                  </a>
                </li>
                <li className="mobile-category__item">
                  <a href="/" className="mobile-category__link">
                    Túi sách
                  </a>
                </li>
                <li className="mobile-category__item">
                  <a href="/" className="mobile-category__link">
                    Ví da
                  </a>
                </li>
                <li className="mobile-category__item">
                  <a href="/" className="mobile-category__link">
                    Giầy da
                  </a>
                </li>
              </ul>
            </nav>

            <div className="home-product">
              <div className="row sm-gutter">
                <div className="col l-2-4 m-4 c-6 product-mr">
                  <a href="/" className="home-product-item">
                    <div
                      className="home-product-item__img"
                      style={{
                        backgroundImage:
                          "url(https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llzw5de97h0fd0_tn)",
                      }}
                    ></div>
                    <h4 className="home-product-item__name">
                      SỮA TẮM LIFEBUOY 800GR DETOX VÀ SẠCH SÂU KHỎI BỤI MỊN
                      PM2.5 DETOX 100% TỪ THIÊN NHIÊN DIỆT KHUẨN
                    </h4>
                    <div className="home-product-item__price">
                      <span className="home-product-item__price-old">
                        1.200.000đ
                      </span>
                      <span className="home-product-item__price-current">
                        999.000đ
                      </span>
                    </div>
                    <div className="home-product-item__action">
                      <span className="home-product-item__brand">Whoo</span>
                      <span className="home-product-item__sold">
                        100 Đã bán
                      </span>
                    </div>
                    <div className="home-product-item__new">
                      <span className="pr">New</span>
                    </div>
                    <div className="home-product-item__sale-off">
                      <span className="home-product-item__sale-off-percent">
                        43%
                      </span>
                      <span className="home-product-item__sale-off-lable">
                        GIẢM
                      </span>
                    </div>
                  </a>
                </div>
                <div className="col l-2-4 m-4 c-6 product-mr">
                  <a href="/" className="home-product-item">
                    <div
                      className="home-product-item__img"
                      style={{
                        backgroundImage:
                          "url(https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llzw5de97h0fd0_tn)",
                      }}
                    ></div>
                    <h4 className="home-product-item__name">
                      SỮA TẮM LIFEBUOY 800GR DETOX VÀ SẠCH SÂU KHỎI BỤI MỊN
                      PM2.5 DETOX 100% TỪ THIÊN NHIÊN DIỆT KHUẨN
                    </h4>
                    <div className="home-product-item__price">
                      <span className="home-product-item__price-old">
                        1.200.000đ
                      </span>
                      <span className="home-product-item__price-current">
                        999.000đ
                      </span>
                    </div>
                    <div className="home-product-item__action">
                      <span className="home-product-item__brand">Whoo</span>
                      <span className="home-product-item__sold">
                        100 Đã bán
                      </span>
                    </div>
                    <div className="home-product-item__new">
                      <span className="pr">New</span>
                    </div>
                    <div className="home-product-item__sale-off">
                      <span className="home-product-item__sale-off-percent">
                        43%
                      </span>
                      <span className="home-product-item__sale-off-lable">
                        GIẢM
                      </span>
                    </div>
                  </a>
                </div>
                <div className="col l-2-4 m-4 c-6 product-mr">
                  <a href="/" className="home-product-item">
                    <div
                      className="home-product-item__img"
                      style={{
                        backgroundImage:
                          "url(https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llzw5de97h0fd0_tn)",
                      }}
                    ></div>
                    <h4 className="home-product-item__name">
                      SỮA TẮM LIFEBUOY 800GR DETOX VÀ SẠCH SÂU KHỎI BỤI MỊN
                      PM2.5 DETOX 100% TỪ THIÊN NHIÊN DIỆT KHUẨN
                    </h4>
                    <div className="home-product-item__price">
                      <span className="home-product-item__price-old">
                        1.200.000đ
                      </span>
                      <span className="home-product-item__price-current">
                        999.000đ
                      </span>
                    </div>
                    <div className="home-product-item__action">
                      <span className="home-product-item__brand">Whoo</span>
                      <span className="home-product-item__sold">
                        100 Đã bán
                      </span>
                    </div>
                    <div className="home-product-item__new">
                      <span className="pr">New</span>
                    </div>
                    <div className="home-product-item__sale-off">
                      <span className="home-product-item__sale-off-percent">
                        43%
                      </span>
                      <span className="home-product-item__sale-off-lable">
                        GIẢM
                      </span>
                    </div>
                  </a>
                </div>
                <div className="col l-2-4 m-4 c-6 product-mr">
                  <a href="/" className="home-product-item">
                    <div
                      className="home-product-item__img"
                      style={{
                        backgroundImage:
                          "url(https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llzw5de97h0fd0_tn)",
                      }}
                    ></div>
                    <h4 className="home-product-item__name">
                      SỮA TẮM LIFEBUOY 800GR DETOX VÀ SẠCH SÂU KHỎI BỤI MỊN
                      PM2.5 DETOX 100% TỪ THIÊN NHIÊN DIỆT KHUẨN
                    </h4>
                    <div className="home-product-item__price">
                      <span className="home-product-item__price-old">
                        1.200.000đ
                      </span>
                      <span className="home-product-item__price-current">
                        999.000đ
                      </span>
                    </div>
                    <div className="home-product-item__action">
                      <span className="home-product-item__brand">Whoo</span>
                      <span className="home-product-item__sold">
                        100 Đã bán
                      </span>
                    </div>
                    <div className="home-product-item__new">
                      <span className="pr">New</span>
                    </div>
                    <div className="home-product-item__sale-off">
                      <span className="home-product-item__sale-off-percent">
                        43%
                      </span>
                      <span className="home-product-item__sale-off-lable">
                        GIẢM
                      </span>
                    </div>
                  </a>
                </div>
                <div className="col l-2-4 m-4 c-6 product-mr">
                  <a href="/" className="home-product-item">
                    <div
                      className="home-product-item__img"
                      style={{
                        backgroundImage:
                          "url(https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llzw5de97h0fd0_tn)",
                      }}
                    ></div>
                    <h4 className="home-product-item__name">
                      SỮA TẮM LIFEBUOY 800GR DETOX VÀ SẠCH SÂU KHỎI BỤI MỊN
                      PM2.5 DETOX 100% TỪ THIÊN NHIÊN DIỆT KHUẨN
                    </h4>
                    <div className="home-product-item__price">
                      <span className="home-product-item__price-old">
                        1.200.000đ
                      </span>
                      <span className="home-product-item__price-current">
                        999.000đ
                      </span>
                    </div>
                    <div className="home-product-item__action">
                      <span className="home-product-item__brand">Whoo</span>
                      <span className="home-product-item__sold">
                        100 Đã bán
                      </span>
                    </div>
                    <div className="home-product-item__new">
                      <span className="pr">New</span>
                    </div>
                    <div className="home-product-item__sale-off">
                      <span className="home-product-item__sale-off-percent">
                        43%
                      </span>
                      <span className="home-product-item__sale-off-lable">
                        GIẢM
                      </span>
                    </div>
                  </a>
                </div>
                <div className="col l-2-4 m-4 c-6 product-mr">
                  <a href="/" className="home-product-item">
                    <div
                      className="home-product-item__img"
                      style={{
                        backgroundImage:
                          "url(https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llzw5de97h0fd0_tn)",
                      }}
                    ></div>
                    <h4 className="home-product-item__name">
                      SỮA TẮM LIFEBUOY 800GR DETOX VÀ SẠCH SÂU KHỎI BỤI MỊN
                      PM2.5 DETOX 100% TỪ THIÊN NHIÊN DIỆT KHUẨN
                    </h4>
                    <div className="home-product-item__price">
                      <span className="home-product-item__price-old">
                        1.200.000đ
                      </span>
                      <span className="home-product-item__price-current">
                        999.000đ
                      </span>
                    </div>
                    <div className="home-product-item__action">
                      <span className="home-product-item__brand">Whoo</span>
                      <span className="home-product-item__sold">
                        100 Đã bán
                      </span>
                    </div>
                    <div className="home-product-item__new">
                      <span className="pr">New</span>
                    </div>
                    <div className="home-product-item__sale-off">
                      <span className="home-product-item__sale-off-percent">
                        43%
                      </span>
                      <span className="home-product-item__sale-off-lable">
                        GIẢM
                      </span>
                    </div>
                  </a>
                </div>
                <div className="col l-2-4 m-4 c-6 product-mr">
                  <a href="/" className="home-product-item">
                    <div
                      className="home-product-item__img"
                      style={{
                        backgroundImage:
                          "url(https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llzw5de97h0fd0_tn)",
                      }}
                    ></div>
                    <h4 className="home-product-item__name">
                      SỮA TẮM LIFEBUOY 800GR DETOX VÀ SẠCH SÂU KHỎI BỤI MỊN
                      PM2.5 DETOX 100% TỪ THIÊN NHIÊN DIỆT KHUẨN
                    </h4>
                    <div className="home-product-item__price">
                      <span className="home-product-item__price-old">
                        1.200.000đ
                      </span>
                      <span className="home-product-item__price-current">
                        999.000đ
                      </span>
                    </div>
                    <div className="home-product-item__action">
                      <span className="home-product-item__brand">Whoo</span>
                      <span className="home-product-item__sold">
                        100 Đã bán
                      </span>
                    </div>
                    <div className="home-product-item__new">
                      <span className="pr">New</span>
                    </div>
                    <div className="home-product-item__sale-off">
                      <span className="home-product-item__sale-off-percent">
                        43%
                      </span>
                      <span className="home-product-item__sale-off-lable">
                        GIẢM
                      </span>
                    </div>
                  </a>
                </div>
                <div className="col l-2-4 m-4 c-6 product-mr">
                  <a href="/" className="home-product-item">
                    <div
                      className="home-product-item__img"
                      style={{
                        backgroundImage:
                          "url(https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llzw5de97h0fd0_tn)",
                      }}
                    ></div>
                    <h4 className="home-product-item__name">
                      SỮA TẮM LIFEBUOY 800GR DETOX VÀ SẠCH SÂU KHỎI BỤI MỊN
                      PM2.5 DETOX 100% TỪ THIÊN NHIÊN DIỆT KHUẨN
                    </h4>
                    <div className="home-product-item__price">
                      <span className="home-product-item__price-old">
                        1.200.000đ
                      </span>
                      <span className="home-product-item__price-current">
                        999.000đ
                      </span>
                    </div>
                    <div className="home-product-item__action">
                      <span className="home-product-item__brand">Whoo</span>
                      <span className="home-product-item__sold">
                        100 Đã bán
                      </span>
                    </div>
                    <div className="home-product-item__new">
                      <span className="pr">New</span>
                    </div>
                    <div className="home-product-item__sale-off">
                      <span className="home-product-item__sale-off-percent">
                        43%
                      </span>
                      <span className="home-product-item__sale-off-lable">
                        GIẢM
                      </span>
                    </div>
                  </a>
                </div>
                <div className="col l-2-4 m-4 c-6 product-mr">
                  <a href="/" className="home-product-item">
                    <div
                      className="home-product-item__img"
                      style={{
                        backgroundImage:
                          "url(https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llzw5de97h0fd0_tn)",
                      }}
                    ></div>
                    <h4 className="home-product-item__name">
                      SỮA TẮM LIFEBUOY 800GR DETOX VÀ SẠCH SÂU KHỎI BỤI MỊN
                      PM2.5 DETOX 100% TỪ THIÊN NHIÊN DIỆT KHUẨN
                    </h4>
                    <div className="home-product-item__price">
                      <span className="home-product-item__price-old">
                        1.200.000đ
                      </span>
                      <span className="home-product-item__price-current">
                        999.000đ
                      </span>
                    </div>
                    <div className="home-product-item__action">
                      <span className="home-product-item__brand">Whoo</span>
                      <span className="home-product-item__sold">
                        100 Đã bán
                      </span>
                    </div>
                    <div className="home-product-item__new">
                      <span className="pr">New</span>
                    </div>
                    <div className="home-product-item__sale-off">
                      <span className="home-product-item__sale-off-percent">
                        43%
                      </span>
                      <span className="home-product-item__sale-off-lable">
                        GIẢM
                      </span>
                    </div>
                  </a>
                </div>
                <div className="col l-2-4 m-4 c-6 product-mr">
                  <a href="/" className="home-product-item">
                    <div
                      className="home-product-item__img"
                      style={{
                        backgroundImage:
                          "url(https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llzw5de97h0fd0_tn)",
                      }}
                    ></div>
                    <h4 className="home-product-item__name">
                      SỮA TẮM LIFEBUOY 800GR DETOX VÀ SẠCH SÂU KHỎI BỤI MỊN
                      PM2.5 DETOX 100% TỪ THIÊN NHIÊN DIỆT KHUẨN
                    </h4>
                    <div className="home-product-item__price">
                      <span className="home-product-item__price-old">
                        1.200.000đ
                      </span>
                      <span className="home-product-item__price-current">
                        999.000đ
                      </span>
                    </div>
                    <div className="home-product-item__action">
                      <span className="home-product-item__brand">Whoo</span>
                      <span className="home-product-item__sold">
                        100 Đã bán
                      </span>
                    </div>
                    <div className="home-product-item__new">
                      <span className="pr">New</span>
                    </div>
                    <div className="home-product-item__sale-off">
                      <span className="home-product-item__sale-off-percent">
                        43%
                      </span>
                      <span className="home-product-item__sale-off-lable">
                        GIẢM
                      </span>
                    </div>
                  </a>
                </div>
                <div className="col l-2-4 m-4 c-6 product-mr">
                  <a href="/" className="home-product-item">
                    <div
                      className="home-product-item__img"
                      style={{
                        backgroundImage:
                          "url(https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llzw5de97h0fd0_tn)",
                      }}
                    ></div>
                    <h4 className="home-product-item__name">
                      SỮA TẮM LIFEBUOY 800GR DETOX VÀ SẠCH SÂU KHỎI BỤI MỊN
                      PM2.5 DETOX 100% TỪ THIÊN NHIÊN DIỆT KHUẨN
                    </h4>
                    <div className="home-product-item__price">
                      <span className="home-product-item__price-old">
                        1.200.000đ
                      </span>
                      <span className="home-product-item__price-current">
                        999.000đ
                      </span>
                    </div>
                    <div className="home-product-item__action">
                      <span className="home-product-item__brand">Whoo</span>
                      <span className="home-product-item__sold">
                        100 Đã bán
                      </span>
                    </div>
                    <div className="home-product-item__new">
                      <span className="pr">New</span>
                    </div>
                    <div className="home-product-item__sale-off">
                      <span className="home-product-item__sale-off-percent">
                        43%
                      </span>
                      <span className="home-product-item__sale-off-lable">
                        GIẢM
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <ul className="pagination home-product__pagination">
              <li className="pagination-item">
                <a href="/" className="pagination-item__link">
                  <i className="pagination-item__icon fa fa-angle-left"></i>
                </a>
              </li>
              <li className="pagination-item pagination-item--action">
                <a href="/" className="pagination-item__link">
                  1
                </a>
              </li>
              <li className="pagination-item">
                <a href="/" className="pagination-item__link">
                  2
                </a>
              </li>
              <li className="pagination-item">
                <a href="/" className="pagination-item__link">
                  3
                </a>
              </li>
              <li className="pagination-item">
                <a href="/" className="pagination-item__link">
                  4
                </a>
              </li>
              <li className="pagination-item">
                <a href="/" className="pagination-item__link">
                  5
                </a>
              </li>
              <li className="pagination-item">
                <a href="/" className="pagination-item__link">
                  ...
                </a>
              </li>
              <li className="pagination-item">
                <a href="/" className="pagination-item__link">
                  14
                </a>
              </li>
              <li className="pagination-item">
                <a href="/" className="pagination-item__link">
                  <i className="pagination-item__icon fa fa-angle-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainHomePage;
