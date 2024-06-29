import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";

function SellerProduct({ dataStatistical }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [sellerProducts, setSellerProducts] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        if (dataStatistical && dataStatistical.topSellerProducts) {
            setSellerProducts(dataStatistical.topSellerProducts);
            setTotalPages(Math.ceil(dataStatistical.topSellerProducts.length / currentLimit));
        }
    }, [dataStatistical, currentLimit]);

    const filteredData = sellerProducts.filter((item) =>
        item.ProductAttribute.Product.product_name.toLowerCase().includes(searchInput.toLowerCase())
    );

    const renderViews = () => {
        const startIndex = (currentPage - 1) * currentLimit;
        const selectedSellerProduct = filteredData.slice(startIndex, startIndex + currentLimit);
        if (selectedSellerProduct.length === 0) {
            return (
                <tr style={{ textAlign: "center", fontWeight: 600 }}>
                    <td colSpan="5">Not Found...</td>
                </tr>
            );
        }
        return selectedSellerProduct.map((sellerProduct, index) => (
            <tr key={sellerProduct.id}>
                <td>{startIndex + index + 1}</td>
                <td>{sellerProduct.ProductAttribute.id}</td>
                <td>{sellerProduct.ProductAttribute.Product.product_name}</td>
                <td>{sellerProduct.ProductAttribute.AttributeValue1.name} - {sellerProduct.ProductAttribute.AttributeValue2.name}</td>
                <td>{sellerProduct.quantity_sold} đã bán</td>
            </tr>
        ));
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };
    return (
        <div className="table-category table">
            <div className="header-table-category header_table">
                <div className='table_manage'>Bảng quản lý mặt hàng bán chạy</div>
                <div className="box search">
                    <form className="sbox">
                        <input
                            className="stext"
                            type=""
                            placeholder="Tìm kiếm ..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </form>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Id</th>
                        <th>Product</th>
                        <th>Option</th>
                        <th>Sold</th>
                    </tr>
                </thead>
                <tbody>
                    {renderViews()}
                </tbody>
            </table>
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
    );
}

export default SellerProduct;