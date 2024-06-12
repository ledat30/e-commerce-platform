import "./Color.scss";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import { toast } from "react-toastify";
import { getAllCategory } from "../../../../services/categoryService";
import { createAttributeProduct, getAllAttributeProduct, updateAttributeProduct, deleteAttribute } from '../../../../services/attributeAndVariantService';
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { NavLink } from "react-router-dom";

function Color(props) {
  const [category, setCategory] = useState([]);
  const { user } = useContext(UserContext);

  const [name, setName] = useState("");
  const [validInputNameColor, setValidInputNameColor] = useState(true);
  const [attemptedSave, setAttemptedSave] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editAttibuteId, setEditAttributeId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [listAttribute, setListAttribute] = useState([]);
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
        let response = await updateAttributeProduct({
          id: editAttibuteId,
          name,
        }, user.account.storeId);

        if (response && response.EC === 0) {
          setName("");
          toast.success(response.EM);
          await fetchAttributeProduct();
          setAttemptedSave(false);
          setValidInputNameColor(true);
          setEditMode(false);
          setEditAttributeId(null);
          setSelectedOption(null);
        } else if (response && response.EC !== 0) {
          toast.error(response.EM);
          setValidInputNameColor({
            ...validInputNameColor,
            [response.DT]: false,
          });
        }
      } else {
        // Create a new attribute if not in edit mode
        let response = await createAttributeProduct({ name, categoryId: selectedOption.value }, user.account.storeId);

        if (response && response.EC === 0) {
          setName("");
          toast.success(response.EM);
          await fetchAttributeProduct();
          setAttemptedSave(false);
          setValidInputNameColor(true);
          setSelectedOption(null);
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

  const handleEditClick = (id, name, category_name) => {
    setEditMode(true);
    setEditAttributeId(id);
    setName(name);
    const selectedCategory = category.find((cat) => cat.category_name === category_name);
    setSelectedOption(selectedCategory ? { label: selectedCategory.category_name, value: selectedCategory.id } : null);
  };

  useEffect(() => {
    fetchAttributeProduct();
    getCategory();
  }, [currentPage]);

  const fetchAttributeProduct = async () => {
    let response = await getAllAttributeProduct(
      currentPage,
      currentLimit,
      user.account.storeId
    );

    if (response && response.EC === 0) {
      setListAttribute(response.DT.colors);
      setTotalPages(response.DT.totalPages);
    }
  };

  const getCategory = async () => {
    let response = await getAllCategory();

    if (response && response.EC === 0) {
      setCategory(response.DT);
    }
  };

  const options = category.map((item) => ({
    label: item.category_name,
    value: item.id,
  }));

  const handleOnChangeInput = (value, key) => {
    const updatedCategory = category.map(categoryName =>
      categoryName.id === value ? { ...categoryName, [key]: value } : categoryName
    );
    setCategory(updatedCategory);
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleDeleteAttribute = async (attribute) => {
    let data = await deleteAttribute(attribute);
    if (data && data.EC === 0) {
      toast.success(data.EM);
      await fetchAttributeProduct();
    } else {
      toast.error(data.EM);
    }
  };

  //search
  const filteredData = listAttribute.filter((item) =>
    item.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <div className="color-container">
        <div className="container">
          <div className="title-color">
            <h4>Attibute management</h4>
          </div>
          <div className="color-input row">
            <div className="col-8 from-group">
              <label>
                Attibute name (<span style={{ color: "red" }}>*</span>)
              </label>
              <input
                className={`form-control mt-1 ${validInputNameColor.name || !attemptedSave
                  ? ""
                  : "is-invalid"
                  }`}
                type="email"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-3 from-group">
              <label>
                Choose category(<span style={{ color: "red" }}>*</span>)
              </label>
              <Select
                className="mt-1"
                value={selectedOption}
                onChange={(selected) => {
                  setSelectedOption(selected);
                  handleOnChangeInput(selected.value, "category");
                }}
                options={options}
                isDisabled={editMode}
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
              <h4>List current attribute</h4>
              <div className="box">
                <form className="sbox">
                  <input
                    className="stext"
                    type="text"
                    name="q"
                    placeholder="Tìm kiếm attribute..."
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
                  <th>Attribute name</th>
                  <th>Category</th>
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
                          <td>{item.Category.category_name}</td>
                          <td>
                            <button
                              title="Edit"
                              className="btn btn-warning mx-2"
                              onClick={() =>
                                handleEditClick(item.id, item.name, item.Category.category_name)
                              }
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              title="Delete"
                              className="btn btn-danger"
                              onClick={() => handleDeleteAttribute(item)}
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
                      <td colSpan={6}>Not found attribute...</td>
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
