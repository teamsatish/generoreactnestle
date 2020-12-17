import React from "react";

const Modal = ({ handleClose, show, children, className = "" }) => {
  const showHideClassName = show ? "modal aolp-modal d-block" : "modal aolp-modal d-none";

  if (show) {
    document.body.classList.add('modal-open');
  } else if (!show) {
    document.body.classList.remove('modal-open');
  }

  return (
    <div className={showHideClassName}>
      <div className={`modal-dialog modal-dialog-centered ${className}`}>
        <div className="modal-content">
          <button className="modal-close" type="button" onClick={handleClose}></button>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
