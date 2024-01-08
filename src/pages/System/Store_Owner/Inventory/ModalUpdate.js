import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import { updateProductInStockByStore } from "../../../../services/productService";
import { toast } from "react-toastify";

function ModalUpdate(props) {
  const { dataModalProduct } = props;
  console.log(dataModalProduct);
  const [quantyly, setQuantity] = useState("");
  console.log("Initial quantyly:", quantyly);

  useEffect(() => {
    setQuantity(dataModalProduct.quantyly || "");
  }, [dataModalProduct]);

  const handleCloseModalProduct = () => {
    props.onHide();
    setQuantity("");
  };

  const handleConfirmProduct = async () => {
    try {
      const id = dataModalProduct.id;

      // Make sure quantity is not empty
      if (quantyly.trim() === "") {
        toast.error("Quantity cannot be empty!");
        return;
      }

      // Convert quantity to a number
      const quantityValue = parseInt(quantyly, 10);

      // Validate quantity (you can add more validation if needed)
      if (isNaN(quantityValue) || quantityValue < 0) {
        toast.error("Invalid quantity");
        return;
      }
      const response = await updateProductInStockByStore({
        id: id,
        quantyly: quantityValue,
      });
      if (response && response.EC === 0) {
        toast.success("Update product in stock successfully!");
        handleCloseModalProduct();
      } else {
        console.error(
          "Error fetching products. Check the response for more details."
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
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
              <span>Edit quantity product</span>
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="content-body row">
            <div className="col-12 col-sm-6 from-group">
              <label>Product</label>
              <input
                className={"form-control mt-1"}
                type="text"
                value={
                  dataModalProduct.Product &&
                  dataModalProduct.Product.product_name
                    ? dataModalProduct.Product.product_name
                    : ""
                }
                disabled
              />
            </div>
            <div className="col-12 col-sm-6 from-group">
              <label>
                Quantity in stock(<span style={{ color: "red" }}>*</span>)
              </label>
              <input
                className={"form-control mt-1"}
                type="text"
                value={quantyly}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCloseModalProduct()}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => handleConfirmProduct()}>
            Sửa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalUpdate;
