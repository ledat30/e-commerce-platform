import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ModelDelete(props) {
  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xoá cửa hàng?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn chắc chắn muốn xoá cửa hàng này : {props.dataModel.name}!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={props.confirmDeleteStore}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModelDelete;
