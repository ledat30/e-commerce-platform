import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";

function TopCategoryUseByProduct({ dataStatistical }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [listTopCategory, setListTopCategory] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        if (dataStatistical && dataStatistical.TopCategoryUseByStore) {
            setListTopCategory(dataStatistical.TopCategoryUseByStore);
            setTotalPages(Math.ceil(dataStatistical.TopCategoryUseByStore.length / currentLimit));
        }
    }, [dataStatistical, currentLimit]);

    const filteredData = listTopCategory.filter((item) =>
        item.categoryName.toLowerCase().includes(searchInput.toLowerCase())
    );

    const renderViews = () => {
        const startIndex = (currentPage - 1) * currentLimit;
        const selectedListTopCategory = filteredData.slice(startIndex, startIndex + currentLimit);
        if (selectedListTopCategory.length === 0) {
            return (
                <tr style={{ textAlign: "center", fontWeight: 600 }}>
                    <td colSpan="3">Not Found...</td>
                </tr>
            );
        }
        return selectedListTopCategory.map((category, index) => {
            return (
                <tr key={category.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{category.categoryName}</td>
                    <td>{category.totalProducts} sản phẩm</td>
                </tr>
            )
        });
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    return (
        <div className="table-category table">
            <div className="header-table-category header_table">
                <div className='table_manage'>Danh sách danh mục ưu thích</div>
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
                        <th style={{ width: '170px' }}>No</th>
                        <th style={{ width: '600px' }}>Category name</th>
                        <th>The number of products</th>
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

export default TopCategoryUseByProduct;