import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import {
  createProduct,
  updateProduct,
} from "../../../../services/productService";
import { getAllCategory } from "../../../../services/categoryService";
import { getAllStore } from "../../../../services/storeService";
import { CommonUtils } from "../../../../utils";
import _ from "lodash";
import { toast } from "react-toastify";
import Select from "react-select";
import { getAllProductsByStore } from "../../../../services/productService";
const { Buffer } = require("buffer");

const ModalProduct = (props) => {
  const [category, setCategory] = useState([]);
  const [store, setStore] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [previewImgURL, setPreviewImgURL] = useState("");
  const { action, dataModalProduct } = props;

  const defaultProductData = {
    price: "",
    product_name: "",
    description: "",
    image: "",
    store: "",
    category: "",
  };

  const validInputsDefault = {
    price: true,
    product_name: true,
    description: true,
    image: true,
    store: true,
    category: true,
  };
  const [productData, setProductData] = useState(defaultProductData);
  const [validInputs, setValidInputs] = useState(validInputsDefault);

  useEffect(() => {
    getCategory();
    getStore();
  }, []);

  useEffect(() => {
    if (action === "UPDATE") {
      setProductData({
        ...dataModalProduct,
        category: dataModalProduct.Category ? dataModalProduct.Category.id : "",
        store: dataModalProduct.Store ? dataModalProduct.Store.id : "",
      });
      // Convert Buffer to base64 for image preview
      let imageBase64 = "";
      if (dataModalProduct.image) {
        imageBase64 = new Buffer.from(
          dataModalProduct.image,
          "base64"
        ).toString("binary");
      }
      setPreviewImgURL(imageBase64);
    }
  }, [action, dataModalProduct]);

  useEffect(() => {
    if (action === "CREATE") {
      if (category && category.length > 0) {
        setProductData({ ...productData, category: category[0].id });
      }
      if (store && store.length > 0) {
        setProductData({ ...productData, store: store[0].id });
      }
    }
  }, [action, category, store]);

  const getCategory = async () => {
    let response = await getAllCategory();

    if (response && response.EC === 0) {
      setCategory(response.DT);
      if (response.DT && response.DT.length > 0) {
        let category = response.DT;
        setProductData({ ...productData, category: category[0].id });
      }
    }
  };

  const getStore = async () => {
    let response = await getAllStore();

    if (response && response.EC === 0) {
      setStore(response.DT);
      if (response.DT && response.DT.length > 0) {
        let store = response.DT;
        setProductData({ ...productData, store: store[0].id });
      }
    }
  };

  const handleOnChangeInput = (value, name) => {
    let _productData = _.cloneDeep(productData);
    _productData[name] = value;
    setProductData(_productData);
  };

  const checkValidInput = () => {
    if (action === "UPDATE") return true;
    setValidInputs(validInputsDefault);
    let arr = [
      "product_name",
      "price",
      "description",
      "category",
      "store",
      "image",
    ];
    let check = true;
    for (let i = 0; i < arr.length; i++) {
      if (!productData[arr[i]]) {
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
      setProductData({ ...productData, image: base64 });
    }
  };

  const handleConfirmProduct = async () => {
    let check = checkValidInput();
    if (check === true) {
      let response =
        action === "CREATE"
          ? await createProduct({
              ...productData,
              categoryId: productData["category"],
              storeId: productData["store"],
            })
          : await updateProduct({
              ...productData,
              categoryId: productData["category"],
              storeId: productData["store"],
            });

      if (response && response.EC === 0) {
        // Fetch the updated list of products
        const updatedProductsResponse = await getAllProductsByStore({
          storeId: productData["store"],
          page: currentPage,
          limit: 5,
        });

        if (updatedProductsResponse && updatedProductsResponse.EC === 0) {
          // Update the dataProductByStore state in the parent component
          props.onAddStore(updatedProductsResponse.DT.product);
          toast.success("Create new product successfully");
        } else {
          console.error(
            "Error fetching updated products. Check the response for more details."
          );
        }

        props.onHide();
        setProductData({
          ...defaultProductData,
          category: category && category.length > 0 ? category[0].id : "",
          store: store && store.length > 0 ? store[0].id : "",
        });
        setPreviewImgURL("");
      } else {
        toast.error(response.EM);
      }
    }
  };

  const options = category.map((item) => ({
    label: item.category_name,
    value: item.id,
  }));

  const Selectoptions = store.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const handleCloseModalProduct = () => {
    props.onHide();
    setProductData(defaultProductData);
    setValidInputs(validInputsDefault);
  };

  return (
    <>
      <Modal
        size="lg"
        show={props.show}
        className="modal-user"
        onHide={() => handleCloseModalProduct()}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span>
              <span>
                {props.action === "CREATE"
                  ? "Create new product"
                  : "Edit a product"}
              </span>
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="content-body row">
            <div className="col-12 col-sm-6 from-group">
              <label>
                Product name(<span style={{ color: "red" }}>*</span>)
              </label>
              <input
                className={
                  validInputs.product_name
                    ? "form-control mt-1"
                    : "form-control mt-1 is-invalid"
                }
                type="text"
                value={productData.product_name}
                onChange={(e) =>
                  handleOnChangeInput(e.target.value, "product_name")
                }
              />
            </div>
            <div className="col-12 col-sm-6 from-group">
              <label>
                Price(<span style={{ color: "red" }}>*</span>)
              </label>
              <input
                className={
                  validInputs.price
                    ? "form-control mt-1"
                    : "form-control mt-1 is-invalid"
                }
                type="text"
                value={productData.price}
                onChange={(e) => handleOnChangeInput(e.target.value, "price")}
              />
            </div>
            <div className="col-12 col-sm-12 from-group mt-1">
              <label>
                Description(<span style={{ color: "red" }}>*</span>)
              </label>
              <input
                className={
                  validInputs.description
                    ? "form-control mt-1"
                    : "form-control mt-1 is-invalid"
                }
                type="text"
                value={productData.description}
                onChange={(e) =>
                  handleOnChangeInput(e.target.value, "description")
                }
              />
            </div>
            <div className="col-12 col-sm-6 from-group mt-2">
              <label>
                Choose category(<span style={{ color: "red" }}>*</span>)
              </label>
              <Select
                className="mt-1"
                value={
                  options.find(
                    (option) => option.value === productData.category
                  ) || null
                }
                onChange={(selected) => {
                  setSelectedOption(selected.value);
                  handleOnChangeInput(selected.value, "category");
                }}
                options={options}
                isDisabled={action === "CREATE" ? false : true}
              />
            </div>
            <div className="col-12 col-sm-6 from-group mt-2">
              <label>
                Choose store(<span style={{ color: "red" }}>*</span>)
              </label>
              <Select
                className="mt-1"
                value={
                  Selectoptions.find(
                    (option) => option.value === productData.store
                  ) || null
                }
                onChange={(selected) => {
                  setSelectedOption(selected.value);
                  handleOnChangeInput(selected.value, "store");
                }}
                options={Selectoptions}
                isDisabled={action === "CREATE" ? false : true}
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
          <Button variant="secondary" onClick={() => handleCloseModalProduct()}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => handleConfirmProduct()}>
            {action === "CREATE" ? "Lưu" : "Sửa"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalProduct;
