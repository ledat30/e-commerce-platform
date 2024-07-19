import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";

function ShippingUnit({ dataStatistical }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [ShippingUnit, setShippingUnit] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        if (dataStatistical && dataStatistical.totalOutOfStock) {
            setShippingUnit(dataStatistical.totalOutOfStock);
            setTotalPages(Math.ceil(dataStatistical.totalOutOfStock.length / currentLimit));
        }
    }, [dataStatistical, currentLimit]);

    const filteredData = ShippingUnit.filter((item) =>
        item.ProductAttribute.Product.product_name.toLowerCase().includes(searchInput.toLowerCase())
    );

    const renderViews = () => {
        const startIndex = (currentPage - 1) * currentLimit;
        const selectedShippingUnit = filteredData.slice(startIndex, startIndex + currentLimit);
        if (selectedShippingUnit.length === 0) {
            return (
                <tr style={{ textAlign: "center", fontWeight: 600 }}>
                    <td colSpan="4">Not Found...</td>
                </tr>
            );
        }
        return selectedShippingUnit.map((shippingunit, index) => (
            <tr key={shippingunit.id}>
                <td>{startIndex + index + 1}</td>
                <td>{shippingunit.ProductAttribute.Product.product_name}</td>
                <td>{shippingunit.ProductAttribute.AttributeValue1.name} - {shippingunit.ProductAttribute.AttributeValue2.name}</td>
                <td style={{ color: 'red' }}>Còn lại {shippingunit.currentNumber} sản phẩm</td>
            </tr>
        ));
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    return (
        <div className="table-category table">
            <div className="header-table-category header_table">
                <div className='table_manage'>Bảng quản lý sản phẩm sắp hết hàng</div>
                <div className="box search">
                    <form className="sbox">
                        <input
                            className="stext"
                            type="text"
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
                        <th>Product</th>
                        <th>Option</th>
                        <th>CurrentNumber</th>
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

export default ShippingUnit;