import "./Product.scss";
import { NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import { getAllProductsByStore } from "../../../../services/productService";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";

function Store(ropps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1);
  const [dataProductByStore, setDataProductByStore] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    getDataProductByStore();
  }, [currentPage]);

  const getDataProductByStore = async () => {
    let response = await getAllProductsByStore({
      storeId: user.account.storeId,
      page: currentPage,
      limit: 5,
    });

    if (response && response.EC === 0) {
      setDataProductByStore(response.DT.product);
    } else {
      console.error(
        "Error fetching products. Check the response for more details."
      );
    }
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };
  return (
    <>
      <div className="container">
        <div className="manage-store-container">
          <div className="store-header">
            <div className="title mt-3">
              <h3>Manage Product</h3>
            </div>
            <div className="actions my-3">
              <button className="btn btn-success refresh">
                <i className="fa fa-refresh"></i> Refesh
              </button>
              <button className="btn btn-primary">
                <i className="fa fa-plus-circle"></i> Add new product
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
                  <th>Id</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataProductByStore && dataProductByStore.length > 0 ? (
                  <>
                    {dataProductByStore.map((item, index) => {
                      return (
                        <tr key={`row-${index}`}>
                          <td>{index + 1}</td>
                          <td>{item.id}</td>
                          <td>{item.product_name}</td>
                          <td>{item.price}</td>
                          <td>
                            {item.Category.category_name ||
                              (item.Category ? item.Category : "")}
                          </td>
                          <td>
                            <button
                              title="Edit"
                              className="btn btn-warning mx-2"
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button title="Delete" className="btn btn-danger">
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
                      <td colSpan={6}>Not found stores...</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div className="store-footer mt-4">
            <ReactPaginate
              nextLabel="next >"
              onPageChange={handlePageChange}
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
        </div>
      </div>
    </>
  );
}

export default Store;
