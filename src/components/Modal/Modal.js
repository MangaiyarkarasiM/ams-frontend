import './Modal.css'

const Modal = (props) => {
    if (!props.open) {
      return null;
    }
    return (

      <div className="profileModal d-flex justify-content-center align-items-center">
        <div className="dialog bg-white rounded w-75 my-1">
          {/* Modal Header */}
          <div className="d-flex bg-secondary justify-content-between align-items-center py-2 px-4">
            <h5 className="text-white m-0 my-2 ">{props.title}</h5>
            <button type="button" className="close text-white my-2" onClick={props.onClose} >&times;</button>
          </div>
          
          {/* Modal Body */}
          <div className="p-2 mt-2 scrollable">
            {
              props.children
            }
          </div>
          
          {/* Modal Footer */}
          {
            props.showFooter ? (
              <div className="p-2">
                <button onClick={props.onClose}>Close</button>
              </div>
            ) : null
          }
        </div>
      </div>
    );
  };
  
  export default Modal;
  