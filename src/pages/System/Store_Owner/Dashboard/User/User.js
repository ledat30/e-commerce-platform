import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";

function User({ dataSummary }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        if (dataSummary && dataSummary.totalUsers) {
            setUsers(dataSummary.totalUsers);
            setTotalPages(Math.ceil(dataSummary.totalUsers.length / currentLimit));
        }
    }, [dataSummary, currentLimit]);

    const filteredData = users.filter((item) =>
        item.username.toLowerCase().includes(searchInput.toLowerCase())
    );

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const renderUsers = () => {
        const startIndex = (currentPage - 1) * currentLimit;
        const selectedUsers = filteredData.slice(startIndex, startIndex + currentLimit);
        if (selectedUsers.length === 0) {
            return (
                <tr style={{ textAlign: "center", fontWeight: 600 }}>
                    <td colSpan="4">Not Found...</td>
                </tr>
            );
        }
        return selectedUsers.map((user, index) => (
            <tr key={user.id}>
                <td>{startIndex + index + 1}</td>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
            </tr>
        ));
    };

    return (
        <div className="table-category table">
            <div className="header-table-category header_table">
                <div className='table_manage'>Bảng quản lý khách hàng</div>
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
                        <th>User</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {renderUsers()}
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

export default User;