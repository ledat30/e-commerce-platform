import "./Role.scss";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { toast } from "react-toastify";
import { createRole } from "../../../../services/roleService";

function Role(props) {
  const dataChildDefault = {
    roleName: "",
    description: "",
    isValidRoleName: true,
  };
  const [listChilds, setListChilds] = useState({
    child1: dataChildDefault,
  });

  const handleOnchangeInput = (name, value, key) => {
    let _listChilds = _.cloneDeep(listChilds);

    _listChilds[key][name] = value;
    if (value && name === "roleName") {
      _listChilds[key]["isValidRoleName"] = true;
    }
    setListChilds(_listChilds);
  };

  const handleAddNewInput = () => {
    let _listChilds = _.cloneDeep(listChilds);
    _listChilds[`child-${uuidv4()}`] = dataChildDefault;
    setListChilds(_listChilds);
  };

  const handleDeleteInput = (key) => {
    let _listChilds = _.cloneDeep(listChilds);
    delete _listChilds[key];
    setListChilds(_listChilds);
  };

  const buildDataToPersist = () => {
    _.cloneDeep(listChilds);
    let result = [];

    Object.entries(listChilds).map(([key, child], index) => {
      result.push({
        roleName: child.roleName,
        description: child.description,
      });
    });
    return result;
  };

  const handleSave = async () => {
    let invalidObj = Object.entries(listChilds).find(([key, child], index) => {
      return child && !child.roleName;
    });
    if (!invalidObj) {
      let data = buildDataToPersist();
      let res = await createRole(data);
      if (res && res.EC === 0) {
        toast.success(res.EM);

        setListChilds({ child1: dataChildDefault });
      }
    } else {
      toast.error("Input roleName must not be empty");
      let _listChilds = _.cloneDeep(listChilds);
      const key = invalidObj[0];
      _listChilds[key]["isValidRoleName"] = false;
      setListChilds(_listChilds);
    }
  };
  return (
    <div className="role-container">
      <div className="container">
        <div className="mt-3">
          <div className="title-role">
            <h4>Add a new role</h4>
          </div>
          <div className="role-parent">
            {Object.entries(listChilds).map(([key, child], index) => {
              return (
                <div className="row role-child" key={`child-${key}`}>
                  <div className={`col-5 form-group ${key}`}>
                    <label>RoleName:</label>
                    <input
                      type="text"
                      className={
                        child.isValidRoleName
                          ? `form-control`
                          : `form-control is-invalid`
                      }
                      value={child.roleName}
                      onChange={(e) =>
                        handleOnchangeInput("roleName", e.target.value, key)
                      }
                    />
                  </div>
                  <div className="col-5 form-group">
                    <label>Description:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={child.description}
                      onChange={(e) =>
                        handleOnchangeInput("description", e.target.value, key)
                      }
                    />
                  </div>
                  <div className="col-2 mt-4 actions">
                    <i
                      className="fa fa-plus-circle add"
                      onClick={() => handleAddNewInput()}
                    ></i>
                    {index >= 1 && (
                      <i
                        className="fa fa-trash-o delete"
                        onClick={() => handleDeleteInput(key)}
                      ></i>
                    )}
                  </div>
                </div>
              );
            })}

            <div>
              <button
                className="btn btn-warning mt-3"
                onClick={() => handleSave()}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Role;
