import React, { useState, useEffect } from "react";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { getGroupStore } from "../../../../services/userService";
import { createStore, updateStore } from "../../../../services/storeService";
import { CommonUtils } from "../../../../utils";
import _ from "lodash";
import { toast } from "react-toastify";
const { Buffer } = require("buffer");

const ModalStore = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [userGroupStore, setUserGroupStore] = useState([]);
  const [previewImgURL, setPreviewImgURL] = useState("");
  const { action, dataModalStore } = props;

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

  useEffect(() => {
    if (action === "UPDATE") {
      setStoreData({
        ...dataModalStore,
        user: dataModalStore.user ? dataModalStore.user.id : "",
      });
      // Convert Buffer to base64 for image preview
      let imageBase64 = "";
      if (dataModalStore.image) {
        imageBase64 = new Buffer.from(dataModalStore.image, "base64").toString(
          "binary"
        );
      }
      setPreviewImgURL(imageBase64);
    }
  }, [action, dataModalStore]);

  useEffect(() => {
    if (action === "CREATE") {
      if (userGroupStore && userGroupStore.length > 0) {
        setStoreData({ ...storeData, role: userGroupStore[0].id });
      }
    }
  }, [action, userGroupStore]);

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
    if (action === "UPDATE") return true;
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
      let response =
        action === "CREATE"
          ? await createStore({
              ...storeData,
              userId: storeData["user"],
            })
          : await updateStore({ ...storeData, userId: storeData["user"] });
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
        let _validInputs = _.cloneDeep(validInputsDefault);
        _validInputs[response.DT] = false;
        setValidInputs(_validInputs);
      }
    }
  };

  const handleCloseModalStore = () => {
    props.onHide();
    setStoreData(defaultStoreData);
    setValidInputs(validInputsDefault);
  };

  const options = userGroupStore.map((item) => ({
    label: item.username,
    value: item.id,
  }));

  return (
    <>
      <Modal
        size="lg"
        show={props.show}
        className="modal-user"
        onHide={() => handleCloseModalStore()}
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
                Choose store owner(<span style={{ color: "red" }}>*</span>)
              </label>
              <Select
                className="mt-1"
                value={
                  options.find((option) => option.value === storeData.user) ||
                  null
                }
                onChange={(selected) => {
                  setSelectedOption(selected);
                  handleOnChangeInput(selected.value, "user");
                }}
                options={options}
              />
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
          <Button variant="secondary" onClick={() => handleCloseModalStore()}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => handleConfirmUser()}>
            {action === "CREATE" ? "Lưu" : "Sửa"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalStore;
