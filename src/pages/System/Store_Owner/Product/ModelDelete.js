import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ModelDelete(props) {
  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xoá sản phẩm?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn chắc chắn muốn xoá sản phẩm này : {props.dataModel.product_name}!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={props.confirmDeleteProduct}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModelDelete;
