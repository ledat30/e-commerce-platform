import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";

function ListStoreNew({ dataStatistical }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [listStoreNew, setListStoreNew] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        if (dataStatistical && dataStatistical.listStoreNew) {
            setListStoreNew(dataStatistical.listStoreNew);
            setTotalPages(Math.ceil(dataStatistical.listStoreNew.length / currentLimit));
        }
    }, [dataStatistical, currentLimit]);

    const filteredData = listStoreNew.filter((item) =>
        item.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    const renderViews = () => {
        const startIndex = (currentPage - 1) * currentLimit;
        const selectedListStoreNew = filteredData.slice(startIndex, startIndex + currentLimit);
        if (selectedListStoreNew.length === 0) {
            return (
                <tr style={{ textAlign: "center", fontWeight: 600 }}>
                    <td colSpan="4">Not Found...</td>
                </tr>
            );
        }
        return selectedListStoreNew.map((storeNew, index) => {
            return (
                <tr key={storeNew.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{storeNew.id}</td>
                    <td>{storeNew.name}</td>
                    <td>{storeNew.createdAt}</td>
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
                <div className='table_manage'>Danh sách cửa hàng mới hoạt động</div>
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
                        <th style={{ width: '130px' }}>No</th>
                        <th style={{ width: '150px' }}>Id</th>
                        <th style={{ width: '500px' }}>Name store</th>
                        <th>Operation day</th>
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

export default ListStoreNew;