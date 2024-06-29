import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";

function ShippingUnit({ dataStatistical }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [ShippingUnit, setShippingUnit] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        if (dataStatistical && dataStatistical.totalOrdersForShippingUnits) {
            setShippingUnit(dataStatistical.totalOrdersForShippingUnits);
            setTotalPages(Math.ceil(dataStatistical.totalOrdersForShippingUnits.length / currentLimit));
        }
    }, [dataStatistical, currentLimit]);

    const filteredData = ShippingUnit.filter((item) =>
        item.ShippingUnit.shipping_unit_name.toLowerCase().includes(searchInput.toLowerCase())
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
                <td>{shippingunit.ShippingUnit.shipping_unit_name}</td>
                <td>{shippingunit.totalOrders}</td>
            </tr>
        ));
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    return (
        <div className="table-category table">
            <div className="header-table-category header_table">
                <div className='table_manage'>Bảng quản lý đơn đã giao cho đơn vị vận chuyển</div>
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
                        <th>Name shipping unit</th>
                        <th>Total orders</th>
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