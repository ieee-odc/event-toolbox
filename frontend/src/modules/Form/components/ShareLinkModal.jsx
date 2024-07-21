import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateShareLink } from "../../../core/Features/Forms";
import toast from "react-hot-toast";
import "./ShareLinkModal.css";

const ShareLinkModal = ({ formId, onClose }) => {
  const dispatch = useDispatch();
  const shareLink = useSelector((state) => state.formsStore.shareLink);
  const [expirationDate, setExpirationDate] = useState("");
  const [isLinkGenerated, setIsLinkGenerated] = useState(false);

  const handleGenerateLink = () => {
    if (!expirationDate) {
      toast.error("Please select an expiration date");
      return;
    }

    dispatch(generateShareLink({ formId, expirationDate }));
    setIsLinkGenerated(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Share Form</h5>
          <button type="button" className="close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="expirationDate">Expiration Date</label>
            <input
              type="datetime-local"
              id="expirationDate"
              className="form-control"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>
          {shareLink && (
            <div className="form-group">
              <label htmlFor="generatedLink">Generated Link</label>
              <input
                type="text"
                id="generatedLink"
                className="form-control"
                value={shareLink}
                readOnly
              />
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={isLinkGenerated ? handleCopyLink : handleGenerateLink}
          >
            {isLinkGenerated ? "Copy Link" : "Generate Link"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareLinkModal;
