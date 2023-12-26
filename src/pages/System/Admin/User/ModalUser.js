import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import {
  fetchGroups,
  createNewUser,
  updateUser,
} from "../../../../services/userService";
import { CommonUtils } from "../../../../utils";
const { Buffer } = require("buffer");

const ModalUser = (props) => {
  const [userGroup, setUserGroup] = useState([]);
  const [previewImgURL, setPreviewImgURL] = useState("");
  const { action, dataModalUser } = props;

  const defaultUserData = {
    username: "",
    address: "",
    email: "",
    image: "",
    group: "",
    phonenumber: "",
    password: "",
  };

  const validInputsDefault = {
    username: true,
    address: true,
    email: true,
    image: true,
    group: true,
    phonenumber: true,
    password: true,
  };
  const [userData, setUserData] = useState(defaultUserData);
  const [validInputs, setValidInputs] = useState(validInputsDefault);

  useEffect(() => {
    getGroups();
  }, []);

  useEffect(() => {
    if (action === "UPDATE") {
      setUserData({
        ...dataModalUser,
        group: dataModalUser.Group ? dataModalUser.Group.id : "",
      });
      // Convert Buffer to base64 for image preview
      let imageBase64 = "";
      if (dataModalUser.image) {
        imageBase64 = new Buffer.from(dataModalUser.image, "base64").toString(
          "binary"
        );
      }
      setPreviewImgURL(imageBase64);
    }
  }, [action, dataModalUser]);

  useEffect(() => {
    if (action === "CREATE") {
      if (userGroup && userGroup.length > 0) {
        setUserData({ ...userData, group: userGroup[0].id });
      }
    }
  }, [action, userGroup]);

  const getGroups = async () => {
    try {
      let response = await fetchGroups();

      if (response && response.EC === 0) {
        setUserGroup(response.DT);
        if (response.DT && response.DT.length > 0) {
          let groups = response.DT;
          setUserData({ ...userData, group: groups[0].id });
        }
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleOnChangeInput = (value, name) => {
    let _userData = _.cloneDeep(userData);
    _userData[name] = value;
    setUserData(_userData);
  };

  const handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      setPreviewImgURL(objectUrl);
      setUserData({ ...userData, image: base64 });
    }
  };

  const checkValidInput = () => {
    //check create user
    if (action === "UPDATE") return true;
    setValidInputs(validInputsDefault);
    let arr = ["email", "phonenumber", "password", "group"];
    let check = true;
    for (let i = 0; i < arr.length; i++) {
      if (!userData[arr[i]]) {
        let _validInputs = _.cloneDeep(validInputsDefault);
        _validInputs[arr[i]] = false;
        setValidInputs(_validInputs);

        toast.error(`Empty input ${arr[i]}`);
        check = false;
        break;
      }
    }
    return check;
  };

  const handleConfirmUser = async () => {
    let check = checkValidInput();
    if (check === true) {
      let response =
        action === "CREATE"
          ? await createNewUser({
              ...userData,
              groupId: userData["group"],
            })
          : await updateUser({ ...userData, groupId: userData["group"] });
      if (response && response.EC === 0) {
        props.onHide();
        setUserData({
          ...defaultUserData,
          group: userGroup && userGroup.length > 0 ? userGroup[0].id : "",
        });
        setPreviewImgURL("");
        toast.success(response.EM);
      }
      if (response && response.EC !== 0) {
        toast.error(response.EM);
        let _validInputs = _.cloneDeep(validInputsDefault);
        _validInputs[response.DT] = false;
        setValidInputs(_validInputs);
      }
    }
  };

  const handleCloseModalUser = () => {
    props.onHide();
    setUserData(defaultUserData);
    setValidInputs(validInputsDefault);
  };

  return (
    <>
      <Modal
        size="lg"
        show={props.show}
        className="modal-user"
        onHide={() => handleCloseModalUser()}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span>
              {props.action === "CREATE" ? "Create new user" : "Edit a user"}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="content-body row">
            <div className="col-12 col-sm-6 from-group">
              <label>
                Email address (<span style={{ color: "red" }}>*</span>)
              </label>
              <input
                disabled={action === "CREATE" ? false : true}
                className={
                  validInputs.email
                    ? "form-control mt-1"
                    : "form-control mt-1 is-invalid"
                }
                type="email"
                value={userData.email}
                onChange={(e) => handleOnChangeInput(e.target.value, "email")}
              />
            </div>
            <div className="col-12 col-sm-6 from-group">
              <label>
                Phone number (<span style={{ color: "red" }}>*</span>)
              </label>
              <input
                disabled={action === "CREATE" ? false : true}
                className={
                  validInputs.phonenumber
                    ? "form-control mt-1"
                    : "form-control mt-1 is-invalid"
                }
                type="text"
                value={userData.phonenumber}
                onChange={(e) =>
                  handleOnChangeInput(e.target.value, "phonenumber")
                }
              />
            </div>
            <div className="col-12 col-sm-6 from-group mt-1">
              <label>Username</label>
              <input
                className="form-control mt-1"
                type="text"
                value={userData.username}
                onChange={(e) =>
                  handleOnChangeInput(e.target.value, "username")
                }
              />
            </div>
            <div className="col-12 col-sm-6 from-group mt-1">
              <label>
                Password (<span style={{ color: "red" }}>*</span>)
              </label>
              <input
                disabled={action !== "CREATE"}
                className={
                  validInputs.password
                    ? "form-control mt-1"
                    : "form-control mt-1 is-invalid"
                }
                type="password"
                value={action !== "CREATE" ? "**********" : userData.password}
                onChange={(e) =>
                  handleOnChangeInput(e.target.value, "password")
                }
              />
            </div>
            <div className="col-12 col-sm-12 from-group mt-1">
              <label>Address</label>
              <input
                className="form-control mt-1"
                type="text"
                value={userData.address}
                onChange={(e) => handleOnChangeInput(e.target.value, "address")}
              />
            </div>
            <div className="col-12 col-sm-6 from-group mt-1">
              <label>
                Group (<span style={{ color: "red" }}>*</span>)
              </label>
              <select
                className={
                  validInputs.group
                    ? "form-select mt-1"
                    : "form-select mt-1 is-invalid"
                }
                onChange={(e) => handleOnChangeInput(e.target.value, "group")}
                value={userData.group}
              >
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
            <div className="col-12 col-sm-6 from-group mt-1">
              <label>Image</label>
              <div className="preview-img-container">
                <input
                  id="prevewimg"
                  type="file"
                  hidden
                  onChange={(e) => handleOnChangeImage(e, "image")}
                />
                <div className="upload">
                  <label htmlFor="prevewimg" className="lable-upload mt-1">
                    Upload <i className="fa fa-upload" aria-hidden="true"></i>
                  </label>
                  <div
                    className="preview-image"
                    style={{ backgroundImage: `url(${previewImgURL})` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCloseModalUser()}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => handleConfirmUser()}>
            {action === "CREATE" ? "Thêm mới" : "Sửa"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalUser;