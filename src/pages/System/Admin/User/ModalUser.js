import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import { fetchRoles, createNewUser } from "../../../../services/userService";
import { CommonUtils } from "../../../../utils";

const ModalUser = (props) => {
  const [userRole, setUserRole] = useState([]);
  const [previewImgURL, setPreviewImgURL] = useState("");

  const defaultUserData = {
    username: "",
    address: "",
    email: "",
    image: "",
    role: "",
    phonenumber: "",
    password: "",
  };

  const validInputsDefault = {
    username: true,
    address: true,
    email: true,
    image: true,
    role: true,
    phonenumber: true,
    password: true,
  };
  const [userData, setUserData] = useState(defaultUserData);
  const [validInputs, setValidInputs] = useState(validInputsDefault);

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    try {
      let response = await fetchRoles();

      if (response && response.EC === 0) {
        setUserRole(response.DT);
        if (response.DT && response.DT.length > 0) {
          let roles = response.DT;
          setUserData({ ...userData, role: roles[0].id });
        }
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
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
    setValidInputs(validInputsDefault);
    console.log(">>check user data", userData);
    let arr = ["email", "phonenumber", "password", "role"];
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
      let response = await createNewUser({
        ...userData,
        roleId: userData["role"],
      });
      if (response && response.EC === 0) {
        props.onHide();
        setUserData({ ...defaultUserData, role: userRole[0].id });
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

  return (
    <>
      <Modal
        size="lg"
        show={props.show}
        className="modal-user"
        onHide={props.onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span>{props.title}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="content-body row">
            <div className="col-12 col-sm-6 from-group">
              <label>
                Email address (<span style={{ color: "red" }}>*</span>)
              </label>
              <input
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
                className={
                  validInputs.password
                    ? "form-control mt-1"
                    : "form-control mt-1 is-invalid"
                }
                type="password"
                value={userData.password}
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
                Role (<span style={{ color: "red" }}>*</span>)
              </label>
              <select
                className={
                  validInputs.role
                    ? "form-select mt-1"
                    : "form-select mt-1 is-invalid"
                }
                onChange={(e) => handleOnChangeInput(e.target.value, "role")}
                value={userData.role}
              >
                {userRole.length > 0 &&
                  userRole.map((item, index) => {
                    return (
                      <option key={`role-${index}`} value={item.id}>
                        {item.roleName}
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
          <Button variant="secondary" onClick={props.onHide}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => handleConfirmUser()}>
            Thêm mới
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalUser;
