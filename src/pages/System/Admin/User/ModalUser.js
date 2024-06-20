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
import { getAllProvinceDistrictWard } from "../../../../services/attributeAndVariantService";
import { CommonUtils } from "../../../../utils";
import Select from "react-select";
const { Buffer } = require("buffer");

const ModalUser = (props) => {
  const [userGroup, setUserGroup] = useState([]);
  const [previewImgURL, setPreviewImgURL] = useState("");
  const [locations, setLocations] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredWards, setFilteredWards] = useState([]);
  const { action, dataModalUser } = props;

  const defaultUserData = {
    username: "",
    email: "",
    image: "",
    group: "",
    phonenumber: "",
    password: "",
    province: "",
    district: "",
    ward: "",
  };

  const validInputsDefault = {
    username: true,
    email: true,
    image: true,
    group: true,
    phonenumber: true,
    password: true,
    province: true,
    district: true,
    ward: true,
  };
  const [userData, setUserData] = useState(defaultUserData);
  const [validInputs, setValidInputs] = useState(validInputsDefault);

  useEffect(() => {
    getGroups();
    getAllLocationData();
  }, []);

  useEffect(() => {
    if (action === "UPDATE" && dataModalUser) {
      setUserData({
        ...defaultUserData,
        id: dataModalUser.id,
        username: dataModalUser.username,
        email: dataModalUser.email,
        phonenumber: dataModalUser.phonenumber,
        province: dataModalUser.Province ? dataModalUser.Province.id : '',
        district: dataModalUser.District ? dataModalUser.District.id : '',
        ward: dataModalUser.Ward ? dataModalUser.Ward.id : '',
        group: dataModalUser.Group ? dataModalUser.Group.id : '',
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
    getAllLocationData();
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

  const getAllLocationData = async () => {
    try {
      let response = await getAllProvinceDistrictWard();
      if (response && response.EC === 0) {
        setLocations(response.DT);
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const handleOnChangeInput = (selected, name) => {
    let _userData = _.cloneDeep(userData);
    _userData[name] = selected.value;
    setUserData(_userData);

    if (name === "province") {
      const selectedProvince = locations.find(prov => prov.id === selected.value);
      const districts = selectedProvince ? selectedProvince.Districts : [];
      setFilteredDistricts(districts);
      setFilteredWards([]);
      setUserData({ ..._userData, province: selectedProvince, district: "", ward: "" });
    }

    if (name === "district") {
      const selectedDistrict = filteredDistricts.find(dist => dist.id === selected.value);
      const wards = selectedDistrict ? selectedDistrict.Wards : [];
      setFilteredWards(wards);
      setUserData({ ..._userData, district: selectedDistrict, ward: "" });
    }

    if (name === "ward") {
      const selectedWard = filteredWards.find(ward => ward.id === selected.value);
      setUserData({ ..._userData, ward: selectedWard });
    }
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
    if (action === "UPDATE") return true;
    setValidInputs(validInputsDefault);
    let arr = ["email", "phonenumber", "password", "group", "province", "district", "ward"];
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
        setUserData({ ...defaultUserData, group: userData.group });
        setLocations([]);
        setFilteredDistricts([]);
        setFilteredWards([]);
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
    setFilteredDistricts([]);
    setFilteredWards([]);
    setLocations([]);
  };

  if (!dataModalUser) {
    return null;
  }

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
                Email (<span style={{ color: "red" }}>*</span>)
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
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
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
                onChange={(e) => setUserData({ ...userData, phonenumber: e.target.value })}
              />
            </div>
            <div className="col-12 col-sm-6 from-group mt-1">
              <label>Username</label>
              <input
                className="form-control mt-1"
                type="text"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
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
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
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
                onChange={(e) => setUserData({ ...userData, group: e.target.value })}
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
            <div className="col-12 col-sm-4 from-group mt-1">
              <label>Province</label>
              {action === 'CREATE' ? (
                <Select
                  className={validInputs.province ? 'mb-4' : 'mb-4 is-invalid'}
                  value={locations.find(option => option.id === userData.province)}
                  onChange={(selected) => handleOnChangeInput(selected, 'province')}
                  options={locations.map(province => ({
                    value: province.id,
                    label: province.province_name,
                  }))}
                />
              ) : (
                <Select
                  isDisabled
                  value={{ value: dataModalUser.Province ? dataModalUser.Province.id : '', label: dataModalUser.Province ? dataModalUser.Province.province_name : '' }}
                  options={[
                    { value: dataModalUser.Province ? dataModalUser.Province.id : '', label: dataModalUser.Province ? dataModalUser.Province.province_name : '', isDisabled: true },
                  ]}
                />
              )}
            </div>
            <div className="col-12 col-sm-4 from-group mt-1">
              <label>District</label>
              {action === 'CREATE' ? (
                <Select
                  className={validInputs.district ? 'mb-4' : 'mb-4 is-invalid'}
                  value={filteredDistricts.find(option => option.id === userData.district)}
                  onChange={(selected) => handleOnChangeInput(selected, 'district')}
                  options={filteredDistricts.map(district => ({
                    value: district.id,
                    label: district.district_name,
                  }))}
                />
              ) : (
                <Select
                  isDisabled
                  value={{ value: dataModalUser.District ? dataModalUser.District.id : '', label: dataModalUser.District ? dataModalUser.District.district_full_name : '' }}
                  options={[
                    { value: dataModalUser.District ? dataModalUser.District.id : '', label: dataModalUser.District ? dataModalUser.District.district_full_name : '', isDisabled: true },
                  ]}
                />
              )}
            </div>
            <div className="col-12 col-sm-4 from-group mt-1">
              <label>Ward</label>
              {action === 'CREATE' ? (
                <Select
                  className={validInputs.ward ? 'mb-4' : 'mb-4 is-invalid'}
                  value={filteredWards.find(option => option.id === userData.ward)}
                  onChange={(selected) => handleOnChangeInput(selected, 'ward')}
                  options={filteredWards.map(ward => ({
                    value: ward.id,
                    label: ward.ward_name,
                  }))}
                />
              ) : (
                <Select
                  isDisabled
                  value={{ value: dataModalUser.Ward ? dataModalUser.Ward.id : '', label: dataModalUser.Ward ? dataModalUser.Ward.ward_full_name : '' }}
                  options={[
                    { value: dataModalUser.Ward ? dataModalUser.Ward.id : '', label: dataModalUser.Ward ? dataModalUser.Ward.ward_full_name : '', isDisabled: true },
                  ]}
                />
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCloseModalUser()}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleConfirmUser()}>
            {action === "CREATE" ? "Create" : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalUser;