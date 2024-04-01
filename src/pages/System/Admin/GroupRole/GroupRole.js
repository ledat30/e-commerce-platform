import { useState, useEffect } from "react";
import "./GroupRole.scss";
import { fetchGroups, fetchRoles } from "../../../../services/userService";
import {
  getRoleByGroup,
  assignRoleToGroup,
} from "../../../../services/roleService";
import _ from "lodash";
import { toast } from "react-toastify";

function GroupRole() {
  const [userGroup, setUserGroup] = useState([]);
  const [listRoles, setListRole] = useState([]);
  const [selectGroup, setSelectGroup] = useState("");

  const [assignRoleByGroup, setAssignRoleByGroup] = useState([]);

  useEffect(() => {
    getGroups();
    fetchAllRoles();
  }, []);

  const getGroups = async () => {
    let response = await fetchGroups();
    console.log("response", response);

    if (response && response.EC === 0) {
      setUserGroup(response.DT);
    }
  };

  const fetchAllRoles = async () => {
    let data = await fetchRoles();
    if (data && +data.EC === 0) {
      setListRole(data.DT);
    }
  };

  const handleOnchangeGroup = async (value) => {
    setSelectGroup(value);
    if (value) {
      let data = await getRoleByGroup(value);
      if (data && +data.EC === 0) {
        let result = buldDataRolesByGroup(data.DT.Roles, listRoles);
        setAssignRoleByGroup(result);
      }
    }
  };

  const buldDataRolesByGroup = (groupRoles, allRoles) => {
    let result = [];
    if (allRoles && allRoles.length > 0) {
      // eslint-disable-next-line array-callback-return
      allRoles.map((role) => {
        let object = {};
        object.roleName = role.roleName;
        object.id = role.id;
        object.description = role.description;
        object.isAssigned = false;
        if (groupRoles && groupRoles.length > 0) {
          object.isAssigned = groupRoles.some(
            (item) => item.roleName === object.roleName
          );
        }
        result.push(object);
      });
    }
    return result;
  };

  const handleSelectRole = (value) => {
    const _assignRoleByGroup = _.cloneDeep(assignRoleByGroup);
    let foundIndex = _assignRoleByGroup.findIndex(
      (item) => +item.id === +value
    );
    if (foundIndex > -1) {
      _assignRoleByGroup[foundIndex].isAssigned =
        !_assignRoleByGroup[foundIndex].isAssigned;
    }
    setAssignRoleByGroup(_assignRoleByGroup);
  };

  const buildDataSave = () => {
    let result = {};
    const _assignRoleByGroup = _.cloneDeep(assignRoleByGroup);
    result.groupId = selectGroup;

    let groupRolesFilter = _assignRoleByGroup.filter(
      (item) => item.isAssigned === true
    );

    let finalGroupRoles = groupRolesFilter.map((item) => {
      let data = { groupId: +selectGroup, roleId: +item.id };
      return data;
    });
    result.groupRoles = finalGroupRoles;
    return result;
  };

  const handleSave = async () => {
    let data = buildDataSave();

    let res = await assignRoleToGroup(data);
    if (res && res.EC === 0) {
      toast.success(res.EM);
    }
  };

  return (
    <>
      <div className="group-role-container">
        <div className="container">
          <div className="container mt-3">
            <h4>Group role</h4>
            <div className="assign-group-role">
              <div className="col-12 col-sm-3 from-group">
                <label>Select Group</label>
                <select
                  className="form-select"
                  onChange={(e) => handleOnchangeGroup(e.target.value)}
                >
                  <option value="">Please select your group</option>
                  {userGroup.length > 0 &&
                    userGroup.map((item, index) => {
                      return (
                        <option key={`group-${index}`} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <hr />
              {selectGroup && (
                <>
                  <div className="roles">
                    <h5>Assign Roles:</h5>
                    <div className="roles-container">
                      {assignRoleByGroup &&
                        assignRoleByGroup.length > 0 &&
                        assignRoleByGroup.map((item, index) => {
                          return (
                            <div
                              className="form-check role-item"
                              key={`list-role-${index}`}
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={item.id}
                                id={`list-role-${index}`}
                                checked={item.isAssigned}
                                onChange={(e) =>
                                  handleSelectRole(e.target.value)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`list-role-${index}`}
                              >
                                {item.description}
                              </label>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className="mt-3">
                    <button
                      className="btn btn-warning"
                      onClick={() => handleSave()}
                    >
                      Save
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GroupRole;
