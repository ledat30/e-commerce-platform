
function Model({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className='close' onClick={onClose}>Close</button>
                {children}
            </div>
        </div>
    );
}

export default Model;