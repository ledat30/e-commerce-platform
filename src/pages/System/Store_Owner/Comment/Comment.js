import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import { toast } from "react-toastify";
import {
    getAllCommentByStore, deleteComemnt, searchComment,
} from "../../../../services/productService";
import { debounce } from "lodash";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";

function Comment() {
    const { user } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [listComment, setListComment] = useState([]);

    useEffect(() => {
        fetchComments();
    }, [currentPage]);

    const fetchComments = async () => {
        let response = await getAllCommentByStore(currentPage, currentLimit, user.account.storeId);

        if (response && response.EC === 0) {
            setListComment(response.DT.comments);
            setTotalPages(response.DT.totalPages);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleDeleteComment = async (comment) => {
        let data = await deleteComemnt(comment);
        if (data && data.EC === 0) {
            toast.success(data.EM);
            await fetchComments(currentPage);
        } else {
            toast.error(data.EM);
        }
    };

    const searchHandle = debounce(async (e) => {
        let key = e.target.value;
        if (key) {
            try {
                let response = await searchComment(key);
                if (response.EC === 0) {
                    setListComment(response.DT);
                    setCurrentPage(1);
                } else {
                    setListComment([]);
                    setCurrentPage(1);
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            await fetchComments();
        }
    }, 300);

    return (
        <>
            <div className="category-container">
                <div className="container">
                    <div className="title-category">
                        <h4>Comment management</h4>
                    </div>
                    <hr />
                    <div className="table-category">
                        <div className="header-table-category">
                            <h4>List current comments</h4>
                            <div className="box">
                                <form className="sbox">
                                    <input
                                        className="stext"
                                        type=""
                                        placeholder="Tìm kiếm comment..."
                                        onChange={(e) => searchHandle(e)}
                                    />
                                    <NavLink className="sbutton" type="submit" to="">
                                        <i className="fa fa-search"></i>
                                    </NavLink>
                                </form>
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Id</th>
                                    <th>Product</th>
                                    <th>User</th>
                                    <th>Comment</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listComment && listComment.length > 0 ? (
                                    <>
                                        {listComment.map((item, index) => {
                                            return (
                                                <tr key={`row-${index}`}>
                                                    <td>
                                                        {(currentPage - 1) * currentLimit + index + 1}
                                                    </td>
                                                    <td>{item.id}</td>
                                                    <td>{item.Product.product_name}</td>
                                                    <td>{item.User.username}</td>
                                                    <td>{item.content}</td>
                                                    <td>
                                                        <button
                                                            title="Delete"
                                                            className="btn btn-danger"
                                                            onClick={() => handleDeleteComment(item)}
                                                        >
                                                            <i className="fa fa-trash-o"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <>
                                        <tr style={{ textAlign: "center", fontWeight: 600 }}>
                                            <td colSpan={6}>Not found comment...</td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {totalPages > 0 && (
                    <div className="user-footer mt-3">
                        <ReactPaginate
                            nextLabel="next >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            pageCount={totalPages}
                            previousLabel="< previous"
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
        </>
    );
}

export default Comment;
