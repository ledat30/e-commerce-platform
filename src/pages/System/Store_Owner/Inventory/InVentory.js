import { NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";

function InVentory(ropps) {
  return (
    <>
      <div className="container">
        <div className="manage-store-container">
          <div className="store-header">
            <div className="title mt-3">
              <h3>Manage products in warehouse</h3>
            </div>
            <div className="actions my-3">
              <button className="btn btn-success refresh">
                <i className="fa fa-refresh"></i> Refesh
              </button>

              <div className="box">
                <form className="sbox" action="/search" method="get">
                  <input
                    className="stext"
                    type="text"
                    name="q"
                    placeholder="Tìm kiếm product..."
                  />
                  <NavLink className="sbutton" type="submit" to="">
                    <i className="fa fa-search"></i>
                  </NavLink>
                </form>
              </div>
            </div>
          </div>

          <div className="store-body">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Current number</th>
                  <th>Ordered quantity</th>
                  <th>Shipping quantity</th>
                  <th>Quantity sold</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>sửa rửa mặt caravel</td>
                  <td>100</td>
                  <td>30</td>
                  <td>40</td>
                  <td>20</td>
                  <td>70</td>
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
              {/* <tbody>
                {dataProductByStore && dataProductByStore.length > 0 ? (
                  <>
                    {dataProductByStore.map((item, index) => {
                      return (
                        <tr key={`row-${index}`}>
                          <td>
                            {" "}
                            {(currentPage - 1) * currentLimit + index + 1}
                          </td>
                          <td>{item.id}</td>
                          <td>{item.product_name}</td>
                          <td>{item.old_price}.vnđ</td>
                          <td>{item.price}.vnđ</td>
                          <td>
                            {item.Category?.category_name ||
                              (item.categoryId ? item.categoryId : "")}
                          </td>
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
                      <td colSpan={6}>Not found product...</td>
                    </tr>
                  </>
                )}
              </tbody> */}
            </table>
          </div>
          <div className="store-footer mt-4">
            <ReactPaginate
              nextLabel="next >"
              onPageChange={5}
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
    </>
  );
}

export default InVentory;
