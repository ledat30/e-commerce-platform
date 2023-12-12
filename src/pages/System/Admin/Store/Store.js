import "./Store.scss";
import { NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStores } from "../../../../store/action/actions";
import ModalStore from "./ModalStore";

function Store(ropps) {
  const dispatch = useDispatch();

  const listStores = useSelector((state) => state.user.listStores);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1);

  const [isShowModalStore, setIsShowModalStore] = useState(false);
  const [actionModalStore, setActionModalStore] = useState("CREATE");
  const [dataModalStore, setDataModalStore] = useState({});

  useEffect(() => {
    dispatch(fetchAllStores(currentPage, 5));
  }, [dispatch, currentPage]);

  const handlePageChange = (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleRefresh = () => {
    dispatch(fetchAllStores(currentPage, 5));
  };

  const onHideModalUser = async () => {
    setIsShowModalStore(false);
    setDataModalStore({});
    dispatch(fetchAllStores(currentPage, 5));
  };

  const handleAddStore = () => {
    dispatch(fetchAllStores(currentPage, 5));
  };

  const handleEditStore = async (store) => {
    setActionModalStore("UPDATE");
    setDataModalStore(store);
    setIsShowModalStore(true);
  };
  return (
    <>
      <div className="container">
        <div className="manage-store-container">
          <div className="store-header">
            <div className="title mt-3">
              <h3>Manage Store</h3>
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
                  setIsShowModalStore(true);
                  setActionModalStore("CREATE");
                }}
              >
                <i className="fa fa-plus-circle"></i> Add new store
              </button>

              <div className="box">
                <form className="sbox" action="/search" method="get">
                  <input
                    className="stext"
                    type="text"
                    name="q"
                    placeholder="Tìm kiếm store..."
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
                  <th>Store name</th>
                  <th>Store owner</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {listStores && listStores.length > 0 ? (
                  <>
                    {listStores.map((item, index) => {
                      return (
                        <tr key={`row-${index}`}>
                          <td>{index + 1}</td>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>
                            {item.user.username || (item.user ? item.user : "")}
                          </td>
                          <td>
                            <button
                              title="Edit"
                              className="btn btn-warning mx-2"
                              onClick={() => handleEditStore(item)}
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

      <ModalStore
        title={"Create new user"}
        onHide={onHideModalUser}
        show={isShowModalStore}
        onAddStore={handleAddStore}
        action={actionModalStore}
        dataModalStore={dataModalStore}
      />
    </>
  );
}

export default Store;
