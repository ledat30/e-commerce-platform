import { NavLink } from "react-router-dom";
import "./User.scss";
import ReactPaginate from "react-paginate";
import ModalUser from "./ModalUser";
import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../../../services/userService";
import { toast } from "react-toastify";
import ModelDelete from "./ModalDelete";

function User(ropps) {
  const [isShowModalUser, setIsShowModalUser] = useState(false);
  const [listUsers, setListUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [isShowModelDelete, setIsShowModelDelete] = useState(false);
  const [dataModel, setDataModel] = useState({});

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    let response = await getAllUsers(currentPage, currentLimit);

    if (response && response.EC === 0) {
      setListUsers(response.DT.users);
      setTotalPages(response.DT.totalPages);
    }
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const onHideModalUser = () => {
    setIsShowModalUser(false);
    fetchUsers();
  };

  const handleDeleteUser = async (user) => {
    setDataModel(user);
    setIsShowModelDelete(true);
  };
  const handleClose = () => {
    setIsShowModelDelete(false);
    setDataModel({});
  };

  const confirmDeleteUser = async () => {
    let response = await deleteUser(dataModel);
    if (response && response.EC === 0) {
      toast.success(response.EM);
      await fetchUsers();
      setIsShowModelDelete(false);
    } else {
      toast.error(response.EM);
    }
  };

  const handleRefresh = async () => {
    await fetchUsers();
  };

  return (
    <>
      <div className="container">
        <div className="manage-users-container">
          <div className="user-header">
            <div className="title mt-3">
              <h3>Manage Users</h3>
            </div>
            <div className="actions my-3">
              <button
                className="btn btn-success refresh"
                onClick={() => handleRefresh()}
              >
                <i className="fa fa-refresh"></i> Refesh
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setIsShowModalUser(true)}
              >
                Add new user
              </button>

              <div className="box">
                <form className="sbox" action="/search" method="get">
                  <input
                    className="stext"
                    type="text"
                    name="q"
                    placeholder="Tìm kiếm người dùng..."
                  />
                  <NavLink className="sbutton" type="submit" to="">
                    <i className="fa fa-search"></i>
                  </NavLink>
                </form>
              </div>
            </div>
          </div>

          <div className="user-body">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Id</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {listUsers && listUsers.length > 0 ? (
                  <>
                    {listUsers.map((item, index) => {
                      return (
                        <tr key={`row-${index}`}>
                          <td>
                            {(currentPage - 1) * currentLimit + index + 1}
                          </td>
                          <td>{item.id}</td>
                          <td>{item.username}</td>
                          <td>{item.email}</td>
                          <td>{item.Role ? item.Role.roleName : ""}</td>
                          <td>
                            <button
                              title="Edit"
                              className="btn btn-warning mx-2"
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              title="Delete"
                              className="btn btn-danger"
                              onClick={() => handleDeleteUser(item)}
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
                      <td colSpan={6}>Not found users...</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 0 && (
            <div className="user-footer mt-4">
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
                activeClassName="active"
                renderOnZeroPageCount={null}
              />
            </div>
          )}
        </div>
      </div>
      <ModelDelete
        show={isShowModelDelete}
        handleClose={handleClose}
        confirmDeleteUser={confirmDeleteUser}
        dataModel={dataModel}
      />

      <ModalUser
        title={"Create new user"}
        onHide={onHideModalUser}
        show={isShowModalUser}
      />
    </>
  );
}

export default User;
