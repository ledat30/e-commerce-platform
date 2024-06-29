import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";

function TopView({ dataStatistical }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [topViews, setTopViews] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        if (dataStatistical && dataStatistical.topViewProducts) {
            setTopViews(dataStatistical.topViewProducts);
            setTotalPages(Math.ceil(dataStatistical.topViewProducts.length / currentLimit));
        }
    }, [dataStatistical, currentLimit]);

    const filteredData = topViews.filter((item) =>
        item.product_name.toLowerCase().includes(searchInput.toLowerCase())
    );

    const renderViews = () => {
        const startIndex = (currentPage - 1) * currentLimit;
        const selectedTopViewProducts = filteredData.slice(startIndex, startIndex + currentLimit);
        if (selectedTopViewProducts.length === 0) {
            return (
                <tr style={{ textAlign: "center", fontWeight: 600 }}>
                    <td colSpan="4">Not Found...</td>
                </tr>
            );
        }
        return selectedTopViewProducts.map((topView, index) => (
            <tr key={topView.id}>
                <td>{startIndex + index + 1}</td>
                <td>{topView.id}</td>
                <td>{topView.product_name}</td>
                <td>{topView.Category.category_name}</td>
                <td>{topView.view_count} views</td>
            </tr>
        ));
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };
    return (
        <div className="table-category table">
            <div className="header-table-category header_table">
                <div className='table_manage'>Bảng quản lý sản phẩm được quan tâm</div>
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
                        <th>Category</th>
                        <th>Views</th>
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

export default TopView;