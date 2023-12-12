import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import { getGroupStore } from "../../../../services/userService";
import { createStore } from "../../../../services/storeService";
import { CommonUtils } from "../../../../utils";
import _ from "lodash";
import { toast } from "react-toastify";

const ModalStore = (props) => {
  const [userGroupStore, setUserGroupStore] = useState([]);
  const [previewImgURL, setPreviewImgURL] = useState("");

  const defaultStoreData = {
    name: "",
    image: "",
    user: "",
  };

  const validInputsDefault = {
    name: true,
    image: true,
    user: true,
  };
  const [storeData, setStoreData] = useState(defaultStoreData);
  const [validInputs, setValidInputs] = useState(validInputsDefault);

  useEffect(() => {
    getGroupsStore();
  }, []);

  const getGroupsStore = async () => {
    let response = await getGroupStore();

    if (response && response.EC === 0) {
      setUserGroupStore(response.DT);
      if (response.DT && response.DT.length > 0) {
        let groupStore = response.DT;
        setStoreData({ ...storeData, user: groupStore[0].id });
      }
    }
  };

  const handleOnChangeInput = (value, name) => {
    let _storeData = _.cloneDeep(storeData);
    _storeData[name] = value;
    setStoreData(_storeData);
  };

  const checkValidInput = () => {
    setValidInputs(validInputsDefault);
    let arr = ["name", "user", "image"];
    let check = true;
    for (let i = 0; i < arr.length; i++) {
      if (!storeData[arr[i]]) {
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

  const handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      setPreviewImgURL(objectUrl);
      setStoreData({ ...storeData, image: base64 });
    }
  };

  const handleConfirmUser = async () => {
    let check = checkValidInput();
    if (check === true) {
      let response = await createStore({
        ...storeData,
        userId: storeData["user"],
      });
      if (response && response.EC === 0) {
        props.onHide();
        props.onAddStore();
        setStoreData({
          ...defaultStoreData,
          user:
            userGroupStore && userGroupStore.length > 0
              ? userGroupStore[0].id
              : "",
        });
        setPreviewImgURL("");
        toast.success("Create new store successfully");
      } else {
        toast.error(response.EM);
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
            <div className="col-12 col-sm-12 from-group">
              <label>
                Store name(<span style={{ color: "red" }}>*</span>)
              </label>
              <input
                className={
                  validInputs.name
                    ? "form-control mt-1"
                    : "form-control mt-1 is-invalid"
                }
                type="text"
                value={storeData.name}
                onChange={(e) => handleOnChangeInput(e.target.value, "name")}
              />
            </div>
            <div className="col-12 col-sm-6 from-group mt-2">
              <label>
                Store owner (<span style={{ color: "red" }}>*</span>)
              </label>
              <select
                className={
                  validInputs.user
                    ? "form-select mt-1"
                    : "form-select mt-1 is-invalid"
                }
                onChange={(e) => handleOnChangeInput(e.target.value, "user")}
              >
                {userGroupStore.length > 0 &&
                  userGroupStore.map((item, index) => {
                    return (
                      <option key={`group-${index}`} value={item.id}>
                        {item.username}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="col-12 col-sm-6 from-group mt-2">
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
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalStore;
