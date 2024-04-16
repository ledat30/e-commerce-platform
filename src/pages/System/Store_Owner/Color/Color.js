import "./Color.scss";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import { toast } from "react-toastify";
import {
  createColorProduct,
  getAllColorsProduct,
  deleteColor,
  updateColorProduct,
} from "../../../../services/productService";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";

function Color(props) {
  const { user } = useContext(UserContext);

  const [name, setName] = useState("");
  const [validInputNameColor, setValidInputNameColor] = useState(true);
  const [attemptedSave, setAttemptedSave] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editColorId, setEditColorId] = useState(null);

  const [listColors, setListColors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const [searchInput, setSearchInput] = useState("");

  const checkValidInput = () => {
    if (!name) {
      setValidInputNameColor(false);
      toast.error("Empty input color name");
      return false;
    }
    return true;
  };

  const handleConfirmCategory = async () => {
    setAttemptedSave(true);

    if (checkValidInput()) {
      if (editMode) {
        // Update the category if in edit mode
        let response = await updateColorProduct({
          id: editColorId,
          name,
        });

        if (response && response.EC === 0) {
          setName("");
          toast.success(response.EM);
          await fetchColorsProduct();
          setAttemptedSave(false);
          setValidInputNameColor(true);
          setEditMode(false);
          setEditColorId(null);
        } else if (response && response.EC !== 0) {
          toast.error(response.EM);
          setValidInputNameColor({
            ...validInputNameColor,
            [response.DT]: false,
          });
        }
      } else {
        // Create a new color if not in edit mode
        let response = await createColorProduct({ name }, user.account.storeId);

        if (response && response.EC === 0) {
          setName("");
          toast.success(response.EM);
          await fetchColorsProduct();
          setAttemptedSave(false);
          setValidInputNameColor(true);
        } else if (response && response.EC !== 0) {
          toast.error(response.EM);
          setValidInputNameColor({
            ...validInputNameColor,
            [response.DT]: false,
          });
        }
      }
    }
  };

  const handleEditClick = (id, name) => {
    setEditMode(true);
    setEditColorId(id);
    setName(name);
  };

  useEffect(() => {
    fetchColorsProduct();
  }, [currentPage]);

  const fetchColorsProduct = async () => {
    let response = await getAllColorsProduct(
      currentPage,
      currentLimit,
      user.account.storeId
    );

    if (response && response.EC === 0) {
      setListColors(response.DT.colors);
      setTotalPages(response.DT.totalPages);
    }
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleDeleteCategory = async (color) => {
    let data = await deleteColor(color);
    if (data && data.EC === 0) {
      toast.success(data.EM);
      await fetchColorsProduct();
    } else {
      toast.error(data.EM);
    }
  };

  //search
  const filteredData = listColors.filter((item) =>
    item.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <div className="color-container">
        <div className="container">
          <div className="title-color">
            <h4>Color management</h4>
          </div>
          <div className="color-input row">
            <div className="col-11 from-group">
              <label>
                Color name (<span style={{ color: "red" }}>*</span>)
              </label>
              <input
                className={`form-control mt-1 ${validInputNameColor.category_name || !attemptedSave
                  ? ""
                  : "is-invalid"
                  }`}
                type="email"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-1 from-group mt">
              <button
                className="btn btn-warning mt-3"
                onClick={() => handleConfirmCategory()}
              >
                Save
              </button>
            </div>
          </div>

          <hr />
          <div className="table-color">
            <div className="header-table-color">
              <h4>List current colors</h4>
              <div className="box">
                <form className="sbox">
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
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Id</th>
                  <th>Color name</th>
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
                          <td>{item.name}</td>
                          <td>
                            <button
                              title="Edit"
                              className="btn btn-warning mx-2"
                              onClick={() =>
                                handleEditClick(item.id, item.name)
                              }
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              title="Delete"
                              className="btn btn-danger"
                              onClick={() => handleDeleteCategory(item)}
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

export default Color;
