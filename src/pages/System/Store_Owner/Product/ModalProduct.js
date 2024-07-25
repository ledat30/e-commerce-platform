import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import {
  createProduct,
  updateProduct,
} from "../../../../services/productService";
import { getAllCategory } from "../../../../services/categoryService";
import {
  readAttributeByStore,
  readVariantByStore,
} from "../../../../services/attributeAndVariantService";
import { CommonUtils } from "../../../../utils";
import _ from "lodash";
import { toast } from "react-toastify";
import Select from "react-select";
import { getAllProductsByStore } from "../../../../services/productService";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
const { Buffer } = require("buffer");

const mdParser = new MarkdownIt(/* Markdown-it options */);

const ModalProduct = (props) => {
  const [category, setCategory] = useState([]);
  const [filteredAttributes, setFilteredAttributes] = useState([]);
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [currentPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [previewImgURL, setPreviewImgURL] = useState("");
  const { action, dataModalProduct } = props;

  const { user } = useContext(UserContext);
  const [editorVisible, setEditorVisible] = useState(false);

  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);

  const defaultProductData = {
    price: "",
    old_price: "",
    product_name: "",
    description: "",
    image: "",
    category: "",
    contentHtml: "",
    contentMarkdown: "",
  };

  const validInputsDefault = {
    price: true,
    old_price: true,
    product_name: true,
    description: true,
    image: true,
    promotion: true,
    category: true,
    quantyly: true,
  };
  const [productData, setProductData] = useState(defaultProductData);
  const [validInputs, setValidInputs] = useState(validInputsDefault);

  useEffect(() => {
    getCategory();
    getAttribute();
    getVariant();
  }, []);

  useEffect(() => {
    if (action === "UPDATE") {
      const selectedAttributeIds = dataModalProduct?.ProductAttributes?.flatMap(
        (item) => [item.AttributeValue1?.Attribute?.id, item.AttributeValue2?.Attribute?.id].filter(Boolean)
      );
      const selectedVariantIds = dataModalProduct?.ProductAttributes?.flatMap(
        (item) => [item.AttributeValue1?.id, item.AttributeValue2?.id].filter(Boolean)
      );

      setSelectedAttributes(selectedAttributeIds);
      setSelectedVariants(selectedVariantIds);

      setProductData({
        ...dataModalProduct,
        category: dataModalProduct.Category ? dataModalProduct.Category.id : "",
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

      // Fetch attributes and variants based on category
      const categoryId = dataModalProduct.Category
        ? dataModalProduct.Category.id
        : "";
      getAttribute(categoryId);
    }
  }, [action, dataModalProduct]);

  useEffect(() => {
    if (action === "CREATE") {
      if (category && category.length > 0) {
        setProductData({ ...productData, category: category[0].id });
      }
    }
  }, [action, category]);

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

  const getAttribute = async (categoryId) => {
    let response = await readAttributeByStore(user.account.storeId, categoryId);
    if (response && response.EC === 0) {
      const attributeWithId = response.DT.map((attribute) => ({
        ...attribute,
        id: attribute.id,
      }));
      setFilteredAttributes(attributeWithId);
      setFilteredVariants([]);
    }
  };

  const getVariant = async (attributeId) => {
    let response = await readVariantByStore(user.account.storeId, attributeId);
    if (response && response.EC === 0) {
      const variantWithId = response.DT.map((variant) => ({
        ...variant,
        id: variant.id,
      }));
      setFilteredVariants(variantWithId);
    }
  };

  const handleOnChangeInput = (value, name) => {
    let _productData = _.cloneDeep(productData);
    _productData[name] = value;

    if (name === "old_price" || name === "price") {
      const oldPrice = parseFloat(_productData["old_price"]) || 0;
      const currentPrice = parseFloat(_productData["price"]) || 0;

      const promotionPercentage =
        oldPrice !== 0 ? ((oldPrice - currentPrice) / oldPrice) * 100 : 0;

      _productData["promotion"] = promotionPercentage.toFixed(0) + "%";
    }

    setProductData(_productData);
  };

  const checkValidInput = () => {
    if (action === "UPDATE") return true;
    setValidInputs(validInputsDefault);
    let arr = [
      "product_name",
      "image",
      "category",
      "quantyly",
      "description",
      "old_price",
      "price",
      "promotion",
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

  const handleEditorChange = ({ html, text }) => {
    setProductData({
      ...productData,
      contentHtml: html,
      contentMarkdown: text,
    });
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

  const handleSelectAttribute = (attributeId) => {
    setSelectedAttributes((prevAttributes) => {
      const index = prevAttributes.indexOf(attributeId);
      if (index === -1) {
        // Fetch variants for the selected attribute
        getVariant(attributeId);
        return [...prevAttributes, attributeId];
      } else {
        // Remove variants when deselecting an attribute
        setFilteredVariants([]);
        return prevAttributes.filter((id) => id !== attributeId);
      }
    });
  };

  const handleSelectVariant = (variantId) => {
    setSelectedVariants((prevVariants) => {
      const index = prevVariants.indexOf(variantId);
      if (index === -1) {
        return [...prevVariants, variantId];
      } else {
        return prevVariants.filter((id) => id !== variantId);
      }
    });
  };

  const handleCategoryChange = (selected) => {
    const categoryId = selected.value;
    setSelectedOption(categoryId);
    handleOnChangeInput(categoryId, "category");
    getAttribute(categoryId);
    setSelectedAttributes([]);
    setSelectedVariants([]);
    setFilteredVariants([]);
  };

  const handleConfirmProduct = async () => {
    let check = checkValidInput();
    if (check === true) {
      let response =
        action === "CREATE"
          ? await createProduct(
            {
              ...productData,
              categoryId: productData["category"],
              quantyly: productData.quantyly,
            },
            user.account.storeId,
            selectedAttributes,
            selectedVariants
          )
          : await updateProduct(
            {
              ...productData,
              categoryId: productData["category"],
            },
            user.account.storeId,
            selectedAttributes,
            selectedVariants
          );
      if (response && response.EC === 0) {
        // Fetch the updated list of products
        const updatedProductsResponse = await getAllProductsByStore({
          storeId: user.account.storeId,
          page: currentPage,
          limit: 5,
        });

        if (updatedProductsResponse && updatedProductsResponse.EC === 0) {
          const updatedProductList = updatedProductsResponse.DT.products;
          const updatedTotalProducts = updatedProductsResponse.DT.totalProducts;

          // Pass the updated list of products to the onHide function
          props.onHide(updatedProductList);
        }

        toast.success(response.EM);
        props.onHide();
        setSelectedAttributes([]);
        setSelectedVariants([]);
        setPreviewImgURL("");
        setProductData(defaultProductData);
      } else {
        toast.error(response.EM);
      }
    }
  };

  const options = category.map((item) => ({
    label: item.category_name,
    value: item.id,
  }));

  const handleCloseModalProduct = () => {
    props.onHide();
    setProductData(defaultProductData);
    setValidInputs(validInputsDefault);
    setPreviewImgURL("");
    setEditorVisible(false);
  };

  return (
    <>
      <Modal
        size="xl"
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
                Choose category(<span style={{ color: "red" }}>*</span>)
              </label>
              <Select
                className="mt-1"
                value={options.find((option) => option.value === productData.category) || null}
                onChange={handleCategoryChange}
                options={options}
                isDisabled={action === "CREATE" ? false : true}
              />
            </div>
            <div className="col-12 col-sm-6 from-group mt-2">
              <label style={{ paddingRight: "6px", paddingBottom: "3px" }}>
                Choose attribute(<span style={{ color: "red" }}>*</span>)
              </label>
              <div className="input-fake">
                {selectedAttributes && Array.isArray(filteredAttributes) && filteredAttributes.length > 0 &&
                  filteredAttributes.map((item, index) => {
                    const isSelected = selectedAttributes.includes(item.id);
                    const buttonClass = isSelected ? "button-fake active-button-fake" : "button-fake";
                    return (
                      <div
                        className={buttonClass}
                        key={index}
                        onClick={() => handleSelectAttribute(item.id)}
                      >
                        {item.name}
                      </div>
                    );
                  })
                }
              </div>
            </div>
            <div className="col-12 col-sm-6 from-group mt-2">
              <label style={{ paddingRight: "6px", paddingBottom: "3px" }}>
                Choose variant(<span style={{ color: "red" }}>*</span>)
              </label>
              <div className="input-fake">
                {selectedVariants && Array.isArray(filteredVariants) && filteredVariants.length > 0 &&
                  filteredVariants.map((item, index) => {
                    const isSelected = selectedVariants.includes(item.id);
                    const buttonClass = isSelected
                      ? "button-fake active-button-fake"
                      : "button-fake";
                    return (
                      <div
                        className={buttonClass}
                        key={index}
                        onClick={() => handleSelectVariant(item.id)}
                      >
                        {item.name}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="col-12 col-sm-12 from-group mt-2">
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
            {props.action === "CREATE" && (
              <div className="col-12 col-sm-4 from-group mt-2">
                <label>
                  Quantyly(<span style={{ color: "red" }}>*</span>)
                </label>
                <input
                  className={
                    validInputs.quantyly
                      ? "form-control mt-1"
                      : "form-control mt-1 is-invalid"
                  }
                  type="text"
                  value={productData.quantyly}
                  onChange={(e) =>
                    handleOnChangeInput(e.target.value, "quantyly")
                  }
                />
              </div>
            )}
            {user && user.isAuthenticated === true && (
              <div className="col-12 col-sm-4 from-group mt-2">
                <label>Store</label>
                <input
                  readOnly
                  className={"form-control mt-1"}
                  value={user.account.nameStore}
                  onMouseDown={(e) => e.preventDefault()}
                />
              </div>
            )}
            <div className="col-12 col-sm-4 from-group mt-2">
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
            <div className="col-12 col-sm-4 from-group mt-2">
              <label>
                Old price(<span style={{ color: "red" }}>*</span>)
              </label>
              <input
                className={
                  validInputs.old_price
                    ? "form-control mt-1"
                    : "form-control mt-1 is-invalid"
                }
                type="text"
                value={productData.old_price}
                onChange={(e) =>
                  handleOnChangeInput(e.target.value, "old_price")
                }
              />
            </div>
            <div className="col-12 col-sm-4 from-group mt-2">
              <label>
                Current price(<span style={{ color: "red" }}>*</span>)
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
            <div className="col-12 col-sm-4 from-group mt-2">
              <label>Promotion</label>
              <input
                className={"form-control mt-1"}
                type="text"
                value={productData.promotion}
                readOnly
                onMouseDown={(e) => e.preventDefault()}
              />
            </div>
            {editorVisible ? (
              <div className="manage-content-editor mt-2">
                <label>Content</label>
                <MdEditor
                  style={{ height: "500px" }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={handleEditorChange}
                  value={productData.contentMarkdown}
                />
                <Button
                  variant="secondary"
                  onClick={() => setEditorVisible(false)}
                  className="mt-2"
                >
                  Đóng
                </Button>
              </div>
            ) : (
              <div className="col-12 col-sm-4 from-group mt-2">
                <label style={{ paddingRight: "6px" }}>
                  Nhấn để nhập nội dung
                </label>
                <Button
                  variant="primary"
                  onClick={() => setEditorVisible(true)}
                >
                  Mở
                </Button>
              </div>
            )}
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
