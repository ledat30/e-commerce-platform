import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import { getAllCommentByStore } from '../../../../../services/productService';
import { useContext } from "react";
import { UserContext } from "../../../../../context/userContext";

function Comment() {
    const { user } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [listComments, setListComments] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        fetcListComment();
    }, [currentPage]);

    const fetcListComment = async () => {
        let response = await getAllCommentByStore(currentPage, currentLimit, user.account.storeId);

        if (response && response.EC === 0) {
            setListComments(response.DT);
            setTotalPages(response.DT.totalPages);
        }
    }

    const filteredData = listComments?.comments?.filter((item) =>
        item.Product.product_name.toLowerCase().includes(searchInput.toLowerCase())
    );


    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };
    return (
        <div className="table-category table">
            <div className="header-table-category header_table">
                <div className='table_manage'>Bảng quản lý bình luận</div>
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
                        <th>Product</th>
                        <th>User</th>
                        <th>Comment</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData && filteredData.length > 0 ? (
                        <>
                            {filteredData.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {(currentPage - 1) * currentLimit + index + 1}
                                        </td>
                                        <td>{item.Product.product_name}</td>
                                        <td>{item.User.username}</td>
                                        <td>{item.content}</td>
                                    </tr>
                                )
                            })}

                        </>
                    ) : (
                        <>
                            <tr style={{ textAlign: "center", fontWeight: 600 }}>
                                <td colSpan={7}>Not found ...</td>
                            </tr>
                        </>
                    )}
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

export default Comment;