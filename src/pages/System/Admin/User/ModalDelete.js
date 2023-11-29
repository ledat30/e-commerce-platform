import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ModelDelete(props) {
  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xoá người dùng?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn chắc chắn muốn xoá người dùng này : {props.dataModel.email}!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={props.confirmDeleteUser}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModelDelete;
