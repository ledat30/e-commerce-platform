import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
  getAllRoles,
  deleteRole,
  searchRole,
} from "../../../../services/roleService";
import { toast } from "react-toastify";
import "./Role.scss";
import ReactPaginate from "react-paginate";
import { debounce } from "lodash";

const TableRole = forwardRef((props, ref) => {
  const [listRoles, setListRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchAllRoles();
  }, [currentPage]);

  useImperativeHandle(ref, () => ({
    fetchListRolesAgain() {
      fetchAllRoles();
    },
  }));

  const fetchAllRoles = async () => {
    let response = await getAllRoles(currentPage, currentLimit);
    if (response && +response.EC === 0) {
      setListRole(response.DT.roles);
      setTotalPages(response.DT.totalPages);
    }
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleDeleteRole = async (role) => {
    let data = await deleteRole(role);
    if (data && data.EC === 0) {
      toast.success(data.EM);
      await fetchAllRoles();
    }
  };

  const searchHandle = debounce(async (e) => {
    let key = e.target.value;
    if (key) {
      try {
        let response = await searchRole(key);
        if (response.EC === 0) {
          setListRole(response.DT);
          setCurrentPage(1);
        } else {
          setListRole([]);
          setCurrentPage(1);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      await fetchAllRoles();
    }
  }, 300);
  props.searchHandleRef(searchHandle);

  const handleEditRoleName = (nameRole) => {
    props.onEditRoleName(nameRole);
  };

  return (
    <>
      <div className="list-role-table">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Id</th>
              <th>RoleName</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listRoles && listRoles.length > 0 ? (
              <>
                {listRoles.map((item, index) => {
                  return (
                    <tr key={`row-${index}`}>
                      <td>{(currentPage - 1) * currentLimit + index + 1}</td>
                      <td>{item.id}</td>
                      <td>{item.roleName}</td>
                      <td>{item.description}</td>
                      <td>
                        <button
                          title="Edit"
                          className="btn btn-warning mx-2"
                          onClick={() => handleEditRoleName(item)}
                        >
                          <i className="fa fa-pencil"></i>
                        </button>
                        <button
                          title="Delete"
                          className="btn btn-danger"
                          onClick={() => handleDeleteRole(item)}
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
                  <td colSpan={6}>Not found role...</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
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
    </>
  );
});

export default TableRole;
