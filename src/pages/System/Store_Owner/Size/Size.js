import "./Size.scss";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  createSizeProduct,
  getAllSizeProduct,
  deleteSize,
  updateSizeProduct,
} from "../../../../services/productService";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";

function Size(props) {
  const [size_value, setSize_value] = useState("");
  const [validInputSize_value, setValidInputSize_value] = useState(true);
  const [attemptedSave, setAttemptedSave] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editSizeId, setEditSizeId] = useState(null);

  const [listSizes, setListSizes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const [searchInput, setSearchInput] = useState("");

  const checkValidInput = () => {
    if (!size_value) {
      setValidInputSize_value(false);
      toast.error("Empty input size value");
      return false;
    }
    return true;
  };

  const handleConfirmSizeProduct = async () => {
    setAttemptedSave(true);

    if (checkValidInput()) {
      if (editMode) {
        // Update the size if in edit mode
        let response = await updateSizeProduct({
          id: editSizeId,
          size_value,
        });

        if (response && response.EC === 0) {
          setSize_value("");
          toast.success(response.EM);
          await fetchSizesProduct();
          setAttemptedSave(false);
          setValidInputSize_value(true);
          setEditMode(false);
          setEditSizeId(null);
        } else if (response && response.EC !== 0) {
          toast.error(response.EM);
          setValidInputSize_value({
            ...validInputSize_value,
            [response.DT]: false,
          });
        }
      } else {
        // Create a new size if not in edit mode
        let response = await createSizeProduct({ size_value });

        if (response && response.EC === 0) {
          setSize_value("");
          toast.success(response.EM);
          await fetchSizesProduct();
          setAttemptedSave(false);
          setValidInputSize_value(true);
        } else if (response && response.EC !== 0) {
          toast.error(response.EM);
          setValidInputSize_value({
            ...validInputSize_value,
            [response.DT]: false,
          });
        }
      }
    }
  };

  const handleEditClick = (id, size_value) => {
    setEditMode(true);
    setEditSizeId(id);
    setSize_value(size_value);
  };

  useEffect(() => {
    fetchSizesProduct();
  }, [currentPage]);

  const fetchSizesProduct = async () => {
    let response = await getAllSizeProduct(currentPage, currentLimit);

    if (response && response.EC === 0) {
      setListSizes(response.DT.sizes);
      setTotalPages(response.DT.totalPages);
    }
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleDeleteSize = async (size) => {
    let data = await deleteSize(size);
    if (data && data.EC === 0) {
      toast.success(data.EM);
      await fetchSizesProduct();
    } else {
      toast.error(data.EM);
    }
  };

  //search
  const filteredData = listSizes.filter((item) =>
    item.size_value.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <div className="size-container">
        <div className="container">
          <div className="title-size">
            <h4>Size management</h4>
          </div>
          <div className="size-input row">
            <div className="col-11 from-group">
              <label>
                Size value (<span style={{ color: "red" }}>*</span>)
              </label>
              <input
                className={`form-control mt-1 ${
                  validInputSize_value.category_name || !attemptedSave
                    ? ""
                    : "is-invalid"
                }`}
                type="email"
                value={size_value}
                onChange={(e) => setSize_value(e.target.value)}
              />
            </div>
            <div className="col-1 from-group mt">
              <button
                className="btn btn-warning mt-3"
                onClick={() => handleConfirmSizeProduct()}
              >
                Save
              </button>
            </div>
          </div>

          <hr />
          <div className="table-size">
            <div className="header-table-size">
              <h4>List current sizes</h4>
              <div className="box">
                <form className="sbox">
                  <input
                    className="stext"
                    type="text"
                    name="q"
                    placeholder="Tìm kiếm size..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <NavLink className="sbutton" type="submit" to="">
                    <i className="fa fa-search"></i>
                  </NavLink>
                </form>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Id</th>
                  <th>Size value</th>
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
                          <td>{item.id}</td>
                          <td>{item.size_value}</td>
                          <td>
                            <button
                              title="Edit"
                              className="btn btn-warning mx-2"
                              onClick={() =>
                                handleEditClick(item.id, item.size_value)
                              }
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              title="Delete"
                              className="btn btn-danger"
                              onClick={() => handleDeleteSize(item)}
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
                      <td colSpan={6}>Not found color...</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
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
      </div>
    </>
  );
}

export default Size;
