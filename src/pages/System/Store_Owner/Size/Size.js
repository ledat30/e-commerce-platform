import "./Size.scss";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import { toast } from "react-toastify";
import { createVariantProduct, getAllVariantProduct, updateVariantProduct, deleteVariant, getAllAttributes } from '../../../../services/attributeAndVariantService';
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { NavLink } from "react-router-dom";

function Color(props) {
  const { user } = useContext(UserContext);

  const [name, setName] = useState("");
  const [validInputNameColor, setValidInputNameColor] = useState(true);
  const [attemptedSave, setAttemptedSave] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editVariantId, setEditVariantId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [listVariant, setListVariant] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const [searchInput, setSearchInput] = useState("");

  const [listAttribute, setListAttribute] = useState([]);

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
        let response = await updateVariantProduct({
          id: editVariantId,
          name,
        }, user.account.storeId);

        if (response && response.EC === 0) {
          setName("");
          toast.success(response.EM);
          await fetchVariantProduct();
          setAttemptedSave(false);
          setValidInputNameColor(true);
          setEditMode(false);
          setEditVariantId(null);
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
        let response = await createVariantProduct({ name, attributeId: selectedOption.value }, user.account.storeId);

        if (response && response.EC === 0) {
          setName("");
          toast.success(response.EM);
          await fetchVariantProduct();
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

  const handleEditClick = (id, name, nameAttribute) => {
    setEditMode(true);
    setEditVariantId(id);
    setName(name);
    const selectedAttribute = listAttribute.find((cat) => cat.name === nameAttribute);
    setSelectedOption(selectedAttribute ? { label: selectedAttribute.name, value: selectedAttribute.id } : null);
  };

  useEffect(() => {
    fetchVariantProduct();
    getAttribute();
  }, [currentPage]);

  const fetchVariantProduct = async () => {
    let response = await getAllVariantProduct(
      currentPage,
      currentLimit,
      user.account.storeId
    );

    if (response && response.EC === 0) {
      setListVariant(response.DT.colors);
      setTotalPages(response.DT.totalPages);
    }
  };

  const getAttribute = async () => {
    let response = await getAllAttributes();

    if (response && response.EC === 0) {
      setListAttribute(response.DT);
    }
  };

  const options = listAttribute.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const handleOnChangeInput = (value, key) => {
    const updatedCategory = listAttribute.map(name =>
      name.id === value ? { ...name, [key]: value } : name
    );
    setListAttribute(updatedCategory);
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleDeleteVariant = async (variant) => {
    let data = await deleteVariant(variant);
    if (data && data.EC === 0) {
      toast.success(data.EM);
      await fetchVariantProduct();
    } else {
      toast.error(data.EM);
    }
  };

  //search
  const filteredData = listVariant.filter((item) =>
    item.Attribute.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <div className="color-container">
        <div className="container">
          <div className="title-color">
            <h4>Value management</h4>
          </div>
          <div className="color-input row">
            <div className="col-8 from-group">
              <label>
                Value name (<span style={{ color: "red" }}>*</span>)
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
                Choose attribute(<span style={{ color: "red" }}>*</span>)
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
              <h4>List current value</h4>
              <div className="box">
                <form className="sbox">
                  <input
                    className="stext"
                    type="text"
                    name="q"
                    placeholder="Tìm kiếm value..."
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
                  <th>Attribute</th>
                  <th>Value</th>
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
                          <td>{item.Attribute.name}</td>
                          <td>{item.name}</td>
                          <td>
                            <button
                              title="Edit"
                              className="btn btn-warning mx-2"
                              onClick={() =>
                                handleEditClick(item.id, item.name, item.Attribute.name)
                              }
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              title="Delete"
                              className="btn btn-danger"
                              onClick={() => handleDeleteVariant(item)}
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
                      <td colSpan={6}>Not found value...</td>
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
