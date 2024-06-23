import { NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
import {
  getProductInStockWithPagination,
  deleteProductInStock,
} from "../../../../services/productService";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import { toast } from "react-toastify";
import ModalDelete from "./ModalDelete";
import ModalUpdate from "./ModalUpdate";

function InVentory(ropps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataProductInStockByStore, setDataProductInStockByStore] = useState(
    []
  );
  const { user } = useContext(UserContext);
  const [currentLimit] = useState(6);
  const [isShowModelDelete, setIsShowModelDelete] = useState(false);
  const [dataModel, setDataModel] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [detailSearchInput, setDetailSearchInput] = useState("");
  const [dataModalProduct, setDataModalProduct] = useState({});
  const [isShowModalProduct, setIsShowModalProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    getDataProductInStockByStore();
  }, [currentPage, refreshData]);

  const getDataProductInStockByStore = async () => {
    let response = await getProductInStockWithPagination({
      page: currentPage,
      limit: currentLimit,
      storeId: user.account.storeId,
    });
    if (response && response.EC === 0) {
      setDataProductInStockByStore(response.DT.product);
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

  const handleRefresh = async () => {
    setRefreshData(!refreshData);
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
      setIsShowModelDelete(false);
      setRefreshData(!refreshData);
      updateSelectedProductAfterDeletion(dataModel);
    } else {
      toast.error(response.EM);
    }
  };

  const updateSelectedProductAfterDeletion = (deletedProduct) => {
    if (selectedProduct) {
      const updatedSelectedProduct = selectedProduct.filter(
        (item) => item.id !== deletedProduct.id
      );
      if (updatedSelectedProduct.length === 0) {
        setSelectedProduct(null);
      } else {
        setSelectedProduct(updatedSelectedProduct);
      }
    }
  };

  //search
  const filteredData = dataProductInStockByStore.filter((item) =>
    item.ProductAttribute.Product.product_name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const groupByProductId = (products) => {
    return products.reduce((acc, product) => {
      const productId = product.ProductAttribute.Product.id;
      if (!acc[productId]) {
        acc[productId] = [];
      }
      acc[productId].push(product);
      return acc;
    }, {});
  };
  const groupedProducts = groupByProductId(filteredData);

  const onHideModalProduct = async () => {
    setIsShowModalProduct(false);
    setDataModalProduct({});
    setRefreshData(!refreshData);
  };

  const handleEditProduct = async (product) => {
    setDataModalProduct(product);
    setIsShowModalProduct(true);
  };

  const handleViewDetails = (productGroup) => {
    setSelectedProduct(productGroup);
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  const filteredDetailData = selectedProduct?.filter((item) =>
    item.ProductAttribute.AttributeValue1.name.toLowerCase().includes(detailSearchInput.toLowerCase()) ||
    item.ProductAttribute.AttributeValue2.name.toLowerCase().includes(detailSearchInput.toLowerCase())
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

              {!selectedProduct && (
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
              )}
            </div>
          </div>

          <div className="store-body">
            {!selectedProduct ? (
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Product</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(groupedProducts).length > 0 ? (
                    Object.keys(groupedProducts).map((productId, index) => {
                      const productGroup = groupedProducts[productId];
                      const firstProduct = productGroup[0];
                      return (
                        <tr key={`row-${index}`}>
                          <td>{(currentPage - 1) * currentLimit + index + 1}</td>
                          <td
                            style={{
                              maxWidth: "220px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {firstProduct.ProductAttribute.Product.product_name}
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleViewDetails(productGroup)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr style={{ textAlign: "center", fontWeight: 600 }}>
                      <td colSpan={3}>Not found product...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <>
                <button className="btn btn-secondary mb-3" onClick={handleBackToList}>
                  Back to List
                </button>
                <div className="box mb-3">
                  <form className="sbox" action="/search" method="get">
                    <input
                      className="stext"
                      type="text"
                      name="q"
                      placeholder="Search options product..."
                      value={detailSearchInput}
                      onChange={(e) => setDetailSearchInput(e.target.value)}
                    />
                    <NavLink className="sbutton" type="submit" to="">
                      <i className="fa fa-search"></i>
                    </NavLink>
                  </form>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Product</th>
                      <th>Options</th>
                      <th>Quantity</th>
                      <th style={{ width: '110px' }}>Current number</th>
                      <th style={{ width: '110px' }}>Ordered quantity</th>
                      <th style={{ width: '110px' }}>Shipping quantity</th>
                      <th style={{ width: '110px' }}>Quantity sold</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDetailData && filteredDetailData.length > 0 ? (
                      <>
                        {filteredDetailData.map((item, index) => {
                          return (
                            <tr key={`row-${index}`}>
                              <td>
                                {(currentPage - 1) * currentLimit + index + 1}
                              </td>
                              <td
                                style={{
                                  maxWidth: "220px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.ProductAttribute.Product.product_name}
                              </td>
                              <td>
                                {item.ProductAttribute.AttributeValue2.name} -{" "}
                                {item.ProductAttribute.AttributeValue1.name}
                              </td>
                              <td>{item.quantyly}</td>
                              <td>{item.currentNumber}</td>
                              <td>{item.quantyly_ordered || 0}</td>
                              <td>{item.quantyly_shipped || 0}</td>
                              <td>{item.quantity_sold || 0}</td>
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
                          <td colSpan={9}>Not found product...</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </>
            )}
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

      <ModalUpdate
        onHide={onHideModalProduct}
        show={isShowModalProduct}
        dataModalProduct={dataModalProduct}
      />
    </>
  );
}

export default InVentory;
