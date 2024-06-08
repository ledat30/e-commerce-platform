import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";
import { getAllContacts, deleteContact } from '../../../../services/contactService';

function Contact() {
    const [listContacts, setListContacts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        fetchContacts();
    }, [currentPage]);

    const fetchContacts = async () => {
        let response = await getAllContacts(currentPage, currentLimit);

        if (response && response.EC === 0) {
            setListContacts(response.DT.contacts);
            setTotalPages(response.DT.totalPages);
        }
    };

    const filteredData = listContacts.filter((item) =>
        item.username.toLowerCase().includes(searchInput.toLowerCase())
    );

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleDeleteCategory = async (contact) => {
        let data = await deleteContact(contact);
        if (data && data.EC === 0) {
            toast.success(data.EM);
            await fetchContacts();
        } else {
            toast.error(data.EM);
        }
    };

    const handleRefresh = async () => {
        setSearchInput("");
        setCurrentPage(1);
        await fetchContacts();
    }

    return (
        <>
            <div className="category-container">
                <div className="container mt-3">
                    <div className="table-category">
                        <div className="header-table-category">
                            <h4>List current contact</h4>
                            <div style={{ marginLeft: '-400px', paddingBottom: '10px' }}>
                                <button
                                    title="refresh"
                                    className="btn btn-success refresh"
                                    onClick={() => handleRefresh()}
                                >
                                    <i className="fa fa-refresh"></i> Refesh
                                </button>
                            </div>
                            <div className="box">
                                <form className="sbox">
                                    <input
                                        className="stext"
                                        type=""
                                        placeholder="Tìm kiếm contact..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
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
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Message</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData && filteredData.length > 0 ? (
                                    <>
                                        {filteredData.map((item, index) => {
                                            return (
                                                <tr key={`row-${index}`}>
                                                    <td>{item.id}</td>
                                                    <td>{item.username}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.message}</td>
                                                    <td>
                                                        <button
                                                            title="Delete"
                                                            className="btn btn-danger"
                                                            onClick={() => handleDeleteCategory(item)}
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
                                            <td colSpan={5}>Not found contact...</td>
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

export default Contact;
