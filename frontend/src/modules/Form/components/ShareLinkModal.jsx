import React from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { UserData } from "../../../utils/UserData";



// Function to perform base64 URL encoding
const base64UrlEncode = (str) => {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Function to perform base64 URL decoding
const base64UrlDecode = (str) => {
  let base64 = str
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  // Add padding if necessary
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
};

const ShareLinkModal = ({ formId, onClose }) => {
  const dispatch = useDispatch();
const userData=UserData();



  const handleCopyLink = () => {
      navigator.clipboard.writeText(shareLink);
      toast.success("Link copied to clipboard");

  };
  const token=base64UrlEncode(JSON.stringify({userId:userData.id,formId}))

  const shareLink=`${window.location.origin}/form/${token}`

  return (
    <div className="modal fade show"
    id="modalCenter"
    tabIndex={-1}
    style={{ display: "block" }}
    aria-modal="true"
    role="dialog">
              <div className="modal-dialog modal-dialog-centered" role="document">

      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Share Form</h5>
          <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  onClose()
                }}
              />
        
        </div>
        <div className="modal-body">
          <p>The link will expire when the form's deadline is over. To extend the deadline, update the form.</p>
     
            <div className="form-group">
              <label htmlFor="generatedLink">Generated Link</label>
              <input
                type="text"
                style={{cursor:"not-allowed",opacity:0.7}}
                id="generatedLink"
                className="form-control"
                value={shareLink}
                readOnly
              />
            </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={ handleCopyLink }
          >
           Copy Link
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ShareLinkModal;
