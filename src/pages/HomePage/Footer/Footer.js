function Footer() {
  return (
    <footer className="footer">
      <div className="grid wide footer__content">
        <div className="row">
          <div className="col l-2-4 m-4 c-6">
            <h3 className="footer-heading">Chăm sóc khách hàng</h3>
            <ul className="footer__list">
              <li className="footer__list-item">
                <a href="/" className="footer__list-item--link">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li className="footer__list-item">
                <a href="/" className="footer__list-item--link">
                  Shop mall
                </a>
              </li>
              <li className="footer__list-item">
                <a href="/" className="footer__list-item--link">
                  Hướng dẫn mua hàng
                </a>
              </li>
            </ul>
          </div>
          <div className="col l-2-4 m-4 c-6">
            <h3 className="footer-heading">Giới thiệu</h3>
            <ul className="footer__list">
              <li className="footer__list-item">
                <a href="/" className="footer__list-item--link">
                  Giới thiệu
                </a>
              </li>
              <li className="footer__list-item">
                <a href="/" className="footer__list-item--link">
                  Tuyển dụng
                </a>
              </li>
              <li className="footer__list-item">
                <a href="/" className="footer__list-item--link">
                  Điều khoản
                </a>
              </li>
            </ul>
          </div>
          <div className="col l-2-4 m-4 c-6">
            <h3 className="footer-heading">Cửa hàng</h3>
            <ul className="footer__list">
              <li className="footer__list-item">
                <a href="/" className="footer__list-item--link">
                  Trang điểm mặt
                </a>
              </li>
              <li className="footer__list-item">
                <a href="/" className="footer__list-item--link">
                  Trang điểm môi
                </a>
              </li>
            </ul>
          </div>
          <div className="col l-2-4 m-4 c-6">
            <h3 className="footer-heading">Theo dõi chúng tôi</h3>
            <ul className="footer__list">
              <li className="footer__list-item">
                <a href="/" className="footer__list-item--link">
                  <i className="footer__list-item-icon fa fa-facebook-official"></i>
                  FaceBook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="grid wide">
          <p className="footer__text">
            © 2023 - © 2024 -- Bản quyền thuộc về Lê Đạt e-commerce
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
