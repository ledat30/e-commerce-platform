import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import DetailOrder from './DetailOrder/DetailOrder';

function OrderByArea({ dataStatistical }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [OrderByArea, setOrderByArea] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        if (dataStatistical && dataStatistical.topOrderByArea) {
            setOrderByArea(dataStatistical.topOrderByArea);
            setTotalPages(Math.ceil(dataStatistical.topOrderByArea.length / currentLimit));
        }
    }, [dataStatistical, currentLimit]);

    const filteredData = OrderByArea.filter((item) =>
        item.Province.province_full_name.toLowerCase().includes(searchInput.toLowerCase())
    );

    const renderViews = () => {
        const startIndex = (currentPage - 1) * currentLimit;
        const selectedOrderByArea = filteredData.slice(startIndex, startIndex + currentLimit);
        if (selectedOrderByArea.length === 0) {
            return (
                <tr style={{ textAlign: "center", fontWeight: 600 }}>
                    <td colSpan="4">Not Found...</td>
                </tr>
            );
        }
        return selectedOrderByArea.map((area, index) => (
            <tr key={area.id}>
                <td>{startIndex + index + 1}</td>
                <td>{area.District.district_full_name} , {area.Province.province_full_name}</td>
                <td>{area.totalOrders} orders</td>
                <td>
                    <button className="btn btn-primary" onClick={() => setSelectedOrder(area)}>Details</button>
                </td>
            </tr>
        ));
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    if (selectedOrder) {
        return <DetailOrder order={selectedOrder} onClose={() => setSelectedOrder(null)} />;
    }

    return (
        <div className="table-category table">
            <div className="header-table-category header_table">
                <div className='table_manage'>Bảng quản lý mặt hàng bán chạy</div>
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
                        <th>Area</th>
                        <th>Total orders</th>
                        <th>Detail</th>
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

export default OrderByArea;