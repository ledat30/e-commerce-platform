import { NavLink } from "react-router-dom";
import "./User.scss";
import ReactPaginate from "react-paginate";

function User(ropps) {
  return (
    <div className="container">
      <div className="manage-users-container">
        <div className="user-header">
          <div className="title mt-3">
            <h3>Manage Users</h3>
          </div>
          <div className="actions my-3">
            <button className="btn btn-success refresh">
              <i className="fa fa-refresh"></i> Refesh
            </button>
            <button className="btn btn-primary">
              <i className="fa fa-plus-circle"></i> Add new user
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
              <tr>
                <td>1</td>
                <td>12</td>
                <td>ledat</td>
                <td>Ledat@gmail.com</td>
                <td>Admin</td>
                <td>
                  <button title="Edit" className="btn btn-warning mx-2">
                    <i className="fa fa-pencil"></i>
                  </button>
                  <button title="Delete" className="btn btn-danger">
                    <i className="fa fa-trash-o"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>12</td>
                <td>ledat</td>
                <td>Ledat@gmail.com</td>
                <td>Admin</td>
                <td>
                  <button title="Edit" className="btn btn-warning mx-2">
                    <i className="fa fa-pencil"></i>
                  </button>
                  <button title="Delete" className="btn btn-danger">
                    <i className="fa fa-trash-o"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>12</td>
                <td>ledat</td>
                <td>Ledat@gmail.com</td>
                <td>Admin</td>
                <td>
                  <button title="Edit" className="btn btn-warning mx-2">
                    <i className="fa fa-pencil"></i>
                  </button>
                  <button title="Delete" className="btn btn-danger">
                    <i className="fa fa-trash-o"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>12</td>
                <td>ledat</td>
                <td>Ledat@gmail.com</td>
                <td>Admin</td>
                <td>
                  <button title="Edit" className="btn btn-warning mx-2">
                    <i className="fa fa-pencil"></i>
                  </button>
                  <button title="Delete" className="btn btn-danger">
                    <i className="fa fa-trash-o"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>12</td>
                <td>ledat</td>
                <td>Ledat@gmail.com</td>
                <td>Admin</td>
                <td>
                  <button title="Edit" className="btn btn-warning mx-2">
                    <i className="fa fa-pencil"></i>
                  </button>
                  <button title="Delete" className="btn btn-danger">
                    <i className="fa fa-trash-o"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="user-footer mt-4">
          <ReactPaginate
            nextLabel="next >"
            onPageChange={1}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={5}
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
      </div>
    </div>
  );
}

export default User;
