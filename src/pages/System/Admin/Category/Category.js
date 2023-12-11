import "./Category.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import { createCategory } from "../../../../services/categoryService";

function Category(props) {
  const [category_name, setCategory_name] = useState("");
  const [validInputCategory, setValidInputCategory] = useState(true);
  const [attemptedSave, setAttemptedSave] = useState(false);

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
        setAttemptedSave(false);
        setValidInputCategory(true);
      } else if (response && response.EC !== 0) {
        toast.error(response.EM);
        setValidInputCategory({ ...validInputCategory, [response.DT]: false });
      }
    }
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
        </div>

        <div className="table-category"></div>
      </div>
    </>
  );
}

export default Category;
