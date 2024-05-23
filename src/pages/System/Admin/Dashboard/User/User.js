import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import { adminDashboardUser } from '../../../../../services/storeService';
import Select from "react-select";

function User() {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [allUsers, setAllUsers] = useState([]);
    const [listUsers, setListUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [selectedGroupId, setSelectedGroupId] = useState(null);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchInput, selectedGroupId]);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    useEffect(() => {
        const filteredData = allUsers.filter((item) => {
            const matchesSearch = item.username.toLowerCase().includes(searchInput.toLowerCase());
            const matchesGroup = selectedGroupId ? item.Group?.id === selectedGroupId : true;
            return matchesSearch && matchesGroup;
        });

        const totalPageCount = Math.ceil(filteredData.length / currentLimit);
        setTotalPages(totalPageCount);
        const offset = (currentPage - 1) * currentLimit;
        const paginatedUsers = filteredData.slice(offset, offset + currentLimit);
        setListUsers(paginatedUsers);
    }, [searchInput, selectedGroupId, currentPage, allUsers, currentLimit]);

    const fetchAllUsers = async () => {
        let response = await adminDashboardUser(1, 1000);

        if (response && response.EC === 0) {
            setAllUsers(response.DT.users);
        }
    }

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const uniqueGroups = Array.from(new Set(allUsers?.map(item => item.Group?.id)))
        .map(id => {
            const group = allUsers?.find(item => item.Group?.id === id).Group;
            return {
                label: group?.name,
                value: group?.id
            };
        });

    const handleRefresh = async () => {
        setSelectedGroupId(null);
        setSearchInput("");
        setCurrentPage(1);
        await fetchAllUsers();
    };

    return (
        <div className="table-category table">
            <div className="header-table-category header_table header_table_prd">
                <div className='table_manage'>Bảng quản lý người dùng</div>
                <button
                    title="refresh"
                    className="btn btn-success refresh"
                    onClick={() => handleRefresh()}
                >
                    <i className="fa fa-refresh"></i> Refesh
                </button>
                <div>
                    <Select
                        className='mb-4 select'
                        value={uniqueGroups.find(option => option.value === selectedGroupId) || null}
                        onChange={(selected) => {
                            setSelectedGroupId(selected?.value || null);
                        }}
                        options={uniqueGroups}
                    />
                </div>
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
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phonenumber</th>
                        <th>address</th>
                        <th>Group</th>
                    </tr>
                </thead>
                <tbody>
                    {listUsers && listUsers.length > 0 ? (
                        <>
                            {listUsers.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {(currentPage - 1) * currentLimit + index + 1}
                                        </td>
                                        <td>{item.username}</td>
                                        <td>{item.email}</td>
                                        <td>{item.phonenumber}</td>
                                        <td>{item.address}</td>
                                        <td>{item.Group.name}</td>
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

export default User;
