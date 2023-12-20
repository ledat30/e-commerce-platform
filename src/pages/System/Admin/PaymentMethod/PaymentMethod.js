import "./PaymentMethod.scss";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  createPayment,
  getAllPayment,
  updatePayment,
  deletePayment,
  searchPayment,
} from "../../../../services/paymentMethodService";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";
import { debounce } from "lodash";

function PaymentMethod(props) {
  const [listPayment, setListPayment] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const [method_name, setMethod_name] = useState("");
  const [validInput, setValidInput] = useState(true);
  const [attemptedSave, setAttemptedSave] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editMethodId, setEditMethodId] = useState(null);

  useEffect(() => {
    fetchPayment();
  }, [currentPage]);

  const checkValidInput = () => {
    if (!method_name) {
      setValidInput(false);
      toast.error("Empty input method name");
      return false;
    }
    return true;
  };

  const handleConfirm = async () => {
    setAttemptedSave(true);
    if (checkValidInput()) {
      if (editMode) {
        let response = await updatePayment({
          id: editMethodId,
          method_name,
        });

        if (response && response.EC === 0) {
          setMethod_name("");
          toast.success(response.EM);
          await fetchPayment();
          setAttemptedSave(false);
          setValidInput(true);
          setEditMode(false);
          setEditMethodId(null);
        } else if (response && response.EC !== 0) {
          toast.error(response.EM);
          setValidInput({
            ...validInput,
            [response.DT]: false,
          });
        }
      } else {
        let response = await createPayment({ method_name });

        if (response && response.EC === 0) {
          setMethod_name("");
          toast.success(response.EM);
          await fetchPayment();
          setAttemptedSave(false);
          setValidInput(true);
        } else if (response && response.EC !== 0) {
          toast.error(response.EM);
          setValidInput({ ...validInput, [response.DT]: false });
        }
      }
    }
  };

  const fetchPayment = async () => {
    let response = await getAllPayment(currentPage, currentLimit);

    if (response && response.EC === 0) {
      setListPayment(response.DT.payment);
      setTotalPages(response.DT.totalPages);
    }
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleEditClick = (id, name) => {
    setEditMode(true);
    setEditMethodId(id);
    setMethod_name(name);
  };

  const handleDeleteMethod = async (method) => {
    let data = await deletePayment(method);
    if (data && data.EC === 0) {
      toast.success(data.EM);
      await fetchPayment();
    } else {
      toast.error(data.EM);
    }
  };

  const searchHandle = debounce(async (e) => {
    let key = e.target.value;
    if (key) {
      try {
        let response = await searchPayment(key);
        if (response.EC === 0) {
          setListPayment(response.DT);
          setCurrentPage(1);
        } else {
          setListPayment([]);
          setCurrentPage(1);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      await fetchPayment();
    }
  }, 300);

  return (
    <>
      <div className="method-container">
        <div className="container">
          <div className="title-method">
            <h4>Manage payment method</h4>
          </div>
          <div className="method-input row">
            <div className="col-11 from-group">
              <label>
                Method name (<span style={{ color: "red" }}>*</span>)
              </label>
              <input
                className={`form-control mt-1 ${
                  validInput.method_name || !attemptedSave ? "" : "is-invalid"
                }`}
                type="email"
                value={method_name}
                onChange={(e) => setMethod_name(e.target.value)}
              />
            </div>
            <div className="col-1 from-group mt">
              <button
                className="btn btn-warning mt-3"
                onClick={() => handleConfirm()}
              >
                Save
              </button>
            </div>
          </div>
          <hr />
          <div className="table-method">
            <div className="header-table-method">
              <h4>List current methods</h4>
              <div className="box">
                <form className="sbox">
                  <input
                    className="stext"
                    type=""
                    placeholder="Tìm kiếm method..."
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
                  <th>Method name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {listPayment && listPayment.length > 0 ? (
                  <>
                    {listPayment.map((item, index) => {
                      return (
                        <tr key={`row-${index}`}>
                          <td>
                            {(currentPage - 1) * currentLimit + index + 1}
                          </td>
                          <td>{item.id}</td>
                          <td>{item.method_name}</td>
                          <td>
                            <button
                              title="Edit"
                              className="btn btn-warning mx-2"
                              onClick={() =>
                                handleEditClick(item.id, item.method_name)
                              }
                            >
                              <i className="fa fa-pencil"></i>
                            </button>
                            <button
                              title="Delete"
                              className="btn btn-danger"
                              onClick={() => handleDeleteMethod(item)}
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

export default PaymentMethod;
