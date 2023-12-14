import "./ShippingUnit.scss";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  createShippingUnit,
  getAllShippingUnit,
  deleteShippingUnit,
  searchShippingUnit,
  updateShippingUnit,
} from "../../../../services/shippingUnitService";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";
import { debounce } from "lodash";

function Shipping_Unit(props) {
  const [shipping_unit_name, setShipping_unit_name] = useState("");
  const [validInputShippingUnit, setValidInputShippingUnit] = useState(true);
  const [attemptedSave, setAttemptedSave] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editShippingUnitId, setEditShippingUnitId] = useState(null);

  const [listShippingUnit, setListShippingUnit] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchShippingUnit();
  }, [currentPage]);

  const fetchShippingUnit = async () => {
    let response = await getAllShippingUnit(currentPage, currentLimit);

    if (response && response.EC === 0) {
      setListShippingUnit(response.DT.shippingUnit);
      setTotalPages(response.DT.totalPages);
    }
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const checkValidInput = () => {
    if (!shipping_unit_name) {
      setValidInputShippingUnit(false);
      toast.error("Empty input shipping unit name");
      return false;
    }
    return true;
  };

  const handleConfirmShippingUnit = async () => {
    setAttemptedSave(true);
    if (checkValidInput()) {
      if (editMode) {
        let response = await updateShippingUnit({
          id: editShippingUnitId,
          shipping_unit_name,
        });

        if (response && response.EC === 0) {
          setShipping_unit_name("");
          toast.success(response.EM);
          await fetchShippingUnit();
          setAttemptedSave(false);
          setValidInputShippingUnit(true);
          setEditMode(false);
          setEditShippingUnitId(null);
        } else if (response && response.EC !== 0) {
          toast.error(response.EM);
          setValidInputShippingUnit({
            ...validInputShippingUnit,
            [response.DT]: false,
          });
        }
      } else {
        let response = await createShippingUnit({ shipping_unit_name });

        if (response && response.EC === 0) {
          setShipping_unit_name("");
          toast.success(response.EM);
          await fetchShippingUnit();
          setAttemptedSave(false);
          setValidInputShippingUnit(true);
        } else if (response && response.EC !== 0) {
          toast.error(response.EM);
          setValidInputShippingUnit({
            ...validInputShippingUnit,
            [response.DT]: false,
          });
        }
      }
    }
  };

  const handleEditClick = (id, name) => {
    setEditMode(true);
    setEditShippingUnitId(id);
    setShipping_unit_name(name);
  };

  const handleDeleteShippingUnit = async (shippingUnit) => {
    let data = await deleteShippingUnit(shippingUnit);
    if (data && data.EC === 0) {
      toast.success(data.EM);
      await fetchShippingUnit();
    } else {
      toast.error(data.EM);
    }
  };

  const searchHandle = debounce(async (e) => {
    let key = e.target.value;
    if (key) {
      try {
        let response = await searchShippingUnit(key);
        if (response.EC === 0) {
          setListShippingUnit(response.DT);
          setCurrentPage(1);
        } else {
          setListShippingUnit([]);
          setCurrentPage(1);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      await fetchShippingUnit();
    }
  }, 300);

  return (
    <>
      <div className="shipping_unit-container">
        <div className="container">
          <div className="title-category">
            <h4>Manage shipping unit</h4>
          </div>
          <div className="category-input row">
            <div className="col-11 from-group">
              <label>
                Shipping unit name (<span style={{ color: "red" }}>*</span>)
              </label>
              <input
                className={`form-control mt-1 ${
                  validInputShippingUnit.shipping_unit_name || !attemptedSave
                    ? ""
                    : "is-invalid"
                }`}
                type="email"
                value={shipping_unit_name}
                onChange={(e) => setShipping_unit_name(e.target.value)}
              />
            </div>
            <div className="col-1 from-group mt">
              <button
                className="btn btn-warning mt-3"
                onClick={() => handleConfirmShippingUnit()}
              >
                Save
              </button>
            </div>
          </div>

          <hr />
          <div className="table-shipping_unit">
            <div className="header-table-shipping_unit">
              <h4>List current shipping unit</h4>
              <div className="box">
                <form className="sbox">
                  <input
                    className="stext"
                    type=""
                    placeholder="Tìm kiếm shipping unit..."
                    onChange={(e) => searchHandle(e)}
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
                  <th>Shipping unit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {listShippingUnit && listShippingUnit.length > 0 ? (
                  <>
                    {listShippingUnit.map((item, index) => {
                      return (
                        <tr key={`row-${index}`}>
                          <td>
                            {(currentPage - 1) * currentLimit + index + 1}
                          </td>
                          <td>{item.id}</td>
                          <td>{item.shipping_unit_name}</td>
                          <td>
                            <button
                              title="Edit"
                              className="btn btn-warning mx-2"
                              onClick={() =>
                                handleEditClick(
                                  item.id,
                                  item.shipping_unit_name
                                )
                              }
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              title="Delete"
                              className="btn btn-danger"
                              onClick={() => handleDeleteShippingUnit(item)}
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
                      <td colSpan={6}>Not found shipping unit...</td>
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

export default Shipping_Unit;
