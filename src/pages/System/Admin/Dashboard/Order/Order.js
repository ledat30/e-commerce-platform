import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import { findInactiveAccounts } from '../../../../../services/storeService';
import { toast } from "react-toastify";
import { deleteAccountInactive } from "../../../../../services/userService";

function Order() {
    const [findInactiveAccount, setFindInactiveAccounts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchAllFindInactiveAccounts();
    }, [currentPage, currentLimit]);

    const fetchAllFindInactiveAccounts = async () => {
        let response = await findInactiveAccounts(currentPage, currentLimit);

        if (response && response.EC === 0) {
            setFindInactiveAccounts(response.DT.users);
            setTotalPages(response.DT.totalPages);
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleDeleteUser = async (id) => {
        let response = await deleteAccountInactive(id);
        if (response && response.EC === 0) {
            toast.success(response.EM);
            await fetchAllFindInactiveAccounts();
        } else {
            toast.error(response.EM);
        }
    }

    return (
        <div className="table-category table">
            <div className="header-table-category header_table header_table_prd">
                <div className='table_manage'>Bảng quản lý tài khoản cảnh báo hoạt động</div>
                <div className="box search">
                    <form className="sbox">
                        <input
                            className="stext"
                            type=""
                            placeholder="Tìm kiếm ..."
                        />
                    </form>
                </div>
            </div>
            <table style={{ marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phonenumber</th>
                        <th>Last Order Date</th>
                        <th>InactiveDays</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {findInactiveAccount && findInactiveAccount.length > 0 ? (
                        <>
                            {findInactiveAccount.map((item, index) => {
                                const lastOrderDate = new Date(item.lastOrderDate);
                                const formattedDate = lastOrderDate.toLocaleString('vi-VN', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                });
                                return (
                                    <tr key={index}>
                                        <td>{(totalPages - 1) * currentLimit + index + 1}</td>
                                        <td>{item.username}</td>
                                        <td>{item.email}</td>
                                        <td>{item.phonenumber}</td>
                                        <td>{formattedDate}</td>
                                        <td>{item.inactiveDays} ngày</td>
                                        <td>
                                            <button
                                                title="Delete"
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteUser(item.id)}
                                            >
                                                <i className="fa fa-trash-o"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </>
                    ) : (
                        <tr style={{ textAlign: "center", fontWeight: 600 }}>
                            <td colSpan={7}>Not found ...</td>
                        </tr>
                    )}
                </tbody>
            </table>
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
        </div >
    );
}

export default Order;