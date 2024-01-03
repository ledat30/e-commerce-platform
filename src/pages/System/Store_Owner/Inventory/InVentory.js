import { NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
import {
  getAllProductsInStockByStore,
  deleteProductInStock,
} from "../../../../services/productService";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import { toast } from "react-toastify";
import ModalDelete from "./ModalDelete";

function InVentory(ropps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1);
  const [dataProductInStockByStore, setDataProductInStockByStore] = useState(
    []
  );
  const { user } = useContext(UserContext);
  const [currentLimit] = useState(5);
  const [isShowModelDelete, setIsShowModelDelete] = useState(false);
  const [dataModel, setDataModel] = useState({});
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    getDataProductInStockByStore();
  }, [currentPage]);

  const getDataProductInStockByStore = async () => {
    let response = await getAllProductsInStockByStore({
      storeId: user.account.storeId,
      page: currentPage,
      limit: currentLimit,
    });
    if (response && response.EC === 0) {
      setDataProductInStockByStore(response.DT.product);
    } else {
      console.error(
        "Error fetching products. Check the response for more details."
      );
    }
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const handleRefresh = async () => {
    await getDataProductInStockByStore();
  };

  const handleDeleteProduct = async (product) => {
    setDataModel(product);
    setIsShowModelDelete(true);
  };
  const handleClose = () => {
    setIsShowModelDelete(false);
    setDataModel({});
  };

  const confirmDeleteProduct = async () => {
    let response = await deleteProductInStock(dataModel);
    if (response && response.EC === 0) {
      toast.success(response.EM);
      await getDataProductInStockByStore();
      setIsShowModelDelete(false);
    } else {
      toast.error(response.EM);
    }
  };

  //search
  const filteredData = dataProductInStockByStore.filter((item) =>
    item.Product.product_name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <div className="container">
        <div className="manage-store-container">
          <div className="store-header">
            <div className="title mt-3">
              <h3>Manage products in warehouse</h3>
            </div>
            <div className="actions my-3">
              <button
                className="btn btn-success refresh"
                onClick={() => handleRefresh()}
              >
                <i className="fa fa-refresh"></i> Refesh
              </button>

              <div className="box">
                <form className="sbox" action="/search" method="get">
                  <input
                    className="stext"
                    type="text"
                    name="q"
                    placeholder="Tìm kiếm product..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
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
                {filteredData && filteredData.length > 0 ? (
                  <>
                    {filteredData.map((item, index) => {
                      return (
                        <tr key={`row-${index}`}>
                          <td>
                            {(currentPage - 1) * currentLimit + index + 1}
                          </td>
                          <td>{item.Product.product_name}</td>
                          <td>{item.quantyly}</td>
                          <td>{item.currentNumber}</td>
                          <td>{item.quantyly_ordered || 0}</td>
                          <td>{item.quantyly_shipped || 0}</td>
                          <td>{item.quantity_sold || 0}</td>
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
                              onClick={() => handleDeleteProduct(item)}
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
                      <td colSpan={8}>Not found product...</td>
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

      <ModalDelete
        show={isShowModelDelete}
        handleClose={handleClose}
        confirmDeleteProduct={confirmDeleteProduct}
      />
    </>
  );
}

export default InVentory;
