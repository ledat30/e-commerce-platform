import "./Category.scss";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  createCategory,
  getAllCategories,
} from "../../../../services/categoryService";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";

function Category(props) {
  const [category_name, setCategory_name] = useState("");
  const [validInputCategory, setValidInputCategory] = useState(true);
  const [attemptedSave, setAttemptedSave] = useState(false);

  const [listCategories, setListCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const checkValidInput = () => {
    if (!category_name) {
      setValidInputCategory(false);
      toast.error("Empty input category name");
      return false;
    }
    return true;
  };

  const handleConfirmCategory = async () => {
    setAttemptedSave(true);
    if (checkValidInput()) {
      let response = await createCategory({ category_name });

      if (response && response.EC === 0) {
        setCategory_name("");
        toast.success(response.EM);
        await fetchCategories();
        setAttemptedSave(false);
        setValidInputCategory(true);
      } else if (response && response.EC !== 0) {
        toast.error(response.EM);
        setValidInputCategory({ ...validInputCategory, [response.DT]: false });
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const fetchCategories = async () => {
    let response = await getAllCategories(currentPage, currentLimit);

    if (response && response.EC === 0) {
      setListCategories(response.DT.categories);
      setTotalPages(response.DT.totalPages);
    }
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  return (
    <>
      <div className="category-container">
        <div className="container">
          <div className="title-category">
            <h4>Add category</h4>
          </div>
          <div className="category-input row">
            <div className="col-11 from-group">
              <label>
                Category name (<span style={{ color: "red" }}>*</span>)
              </label>
              <input
                className={`form-control mt-1 ${
                  validInputCategory.category_name || !attemptedSave
                    ? ""
                    : "is-invalid"
                }`}
                type="email"
                value={category_name}
                onChange={(e) => setCategory_name(e.target.value)}
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
          <div className="table-category">
            <div className="header-table-category">
              <h4>List current categories</h4>
              <div className="box">
                <form className="sbox">
                  <input
                    className="stext"
                    type=""
                    placeholder="Tìm kiếm role..."
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
                  <th>Category name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {listCategories && listCategories.length > 0 ? (
                  <>
                    {listCategories.map((item, index) => {
                      return (
                        <tr key={`row-${index}`}>
                          <td>
                            {(currentPage - 1) * currentLimit + index + 1}
                          </td>
                          <td>{item.id}</td>
                          <td>{item.category_name}</td>
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
                      <td colSpan={6}>Not found users...</td>
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
              activeClassName="active"
              renderOnZeroPageCount={null}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Category;
