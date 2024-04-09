import "./DetailCart.scss";
import HeaderHome from "../../HeaderHome/HeaderHome";
import Footer from "../../Footer/Footer";

function DetailCart() {
    return (<>
        <HeaderHome />
        <div className="container_detail_cart">
            <div className="grid wide">
                <div className="detail">
                    Sản phẩm đã chọn
                </div>
            </div>
        </div>
        <Footer />
    </>);
}

export default DetailCart;