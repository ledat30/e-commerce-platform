import "./Product.scss";
import { NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import {
  getAllProductsByStore,
  deleteProduct,
  searchProduct,
} from "../../../../services/productService";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import ModalProduct from "./ModalProduct";
import { toast } from "react-toastify";
import ModelDelete from "./ModelDelete";
import { debounce } from "lodash";

function Product(ropps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataProductByStore, setDataProductByStore] = useState([]);
  const { user } = useContext(UserContext);
  const [totalPages, setTotalPages] = useState(1);
  const [currentLimit] = useState(5);

  const [isShowModalProduct, setIsShowModalProduct] = useState(false);
  const [actionModalProduct, setActionModalProduct] = useState("CREATE");
  const [dataModalProduct, setDataModalProduct] = useState({});

  const [isShowModelDelete, setIsShowModelDelete] = useState(false);
  const [dataModel, setDataModel] = useState({});

  useEffect(() => {
    getDataProductByStore();
  }, [currentPage]);

  const getDataProductByStore = async () => {
    let response = await getAllProductsByStore({
      storeId: user.account.storeId,
      page: currentPage,
      limit: currentLimit,
    });

    if (response && response.EC === 0) {
      setDataProductByStore(response.DT.product);
      setTotalPages(response.DT.totalPages);
    } else {
      console.error(
        "Error fetching products. Check the response for more details."
      );
    }
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const onHideModalProduct = async () => {
    setIsShowModalProduct(false);
    setDataModalProduct({});
    await getAllProductsByStore({
      storeId: user.account.storeId,
      page: currentPage,
      limit: currentLimit,
    });
  };

  const handleAddProduct = (updatedProductList) => {
    setDataProductByStore(updatedProductList);
  };

  const handleEditProduct = async (product) => {
    setActionModalProduct("UPDATE");
    setDataModalProduct(product);
    setIsShowModalProduct(true);
  };

  const handleRefresh = async () => {
    await getDataProductByStore();
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
    let response = await deleteProduct(dataModel);
    if (response && response.EC === 0) {
      toast.success(response.EM);
      await getDataProductByStore();
      setIsShowModelDelete(false);
    } else {
      toast.error(response.EM);
    }
  };

  const searchHandle = debounce(async (e) => {
    let key = e.target.value;
    if (key) {
      try {
        let response = await searchProduct(key);
        if (response.EC === 0) {
          setDataProductByStore(response.DT);
          setCurrentPage(1);
        } else {
          setDataProductByStore([]);
          setCurrentPage(1);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      await getDataProductByStore();
    }
  }, 300);

  return (
    <>
      <div className="container">
        <div className="manage-store-container">
          <div className="store-header">
            <div className="title mt-3">
              <h3>Manage Product</h3>
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
                onClick={() => {
                  setIsShowModalProduct(true);
                  setActionModalProduct("CREATE");
                }}
              >
                <i className="fa fa-plus-circle"></i> Add new product
              </button>

              <div className="box">
                <form className="sbox" action="/search" method="get">
                  <input
                    className="stext"
                    type="text"
                    name="q"
                    placeholder="Tìm kiếm product..."
                    onChange={(e) => searchHandle(e)}
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
                  <th>Old price</th>
                  <th>Current price</th>
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
                              onClick={() => handleEditProduct(item)}
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
                      <td colSpan={6}>Not found product...</td>
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
      <ModalProduct
        title={"Create new product"}
        onHide={onHideModalProduct}
        show={isShowModalProduct}
        onAddStore={handleAddProduct}
        action={actionModalProduct}
        dataModalProduct={dataModalProduct}
      />

      <ModelDelete
        show={isShowModelDelete}
        handleClose={handleClose}
        confirmDeleteProduct={confirmDeleteProduct}
        dataModel={dataModel}
      />
    </>
  );
}

export default Product;
