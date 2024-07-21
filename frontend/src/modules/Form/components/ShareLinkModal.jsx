import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateShareLink } from "../../../core/Features/Forms";
import toast from "react-hot-toast";
import "./ShareLinkModal.css";

const ShareLinkModal = ({ formId, onClose }) => {
  const dispatch = useDispatch();
  const shareLinkInfo = useSelector((state) => state.formsStore.shareLinks[formId]);
  const form = useSelector((state) => state.formsStore.forms.find(f => f.id === formId));

  const handleGenerateLink = () => {
    dispatch(generateShareLink({ formId }));
  };

  const handleCopyLink = () => {
    if (shareLinkInfo && shareLinkInfo.link) {
      navigator.clipboard.writeText(shareLinkInfo.link);
      toast.success("Link copied to clipboard");
    } else {
      toast.error("No link to copy");
    }
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
          <p>The link will expire when the form's deadline is over. To extend the deadline, update the form.</p>
          {shareLinkInfo && shareLinkInfo.link && (
            <div className="form-group">
              <label htmlFor="generatedLink">Generated Link</label>
              <input
                type="text"
                id="generatedLink"
                className="form-control"
                value={shareLinkInfo.link}
                readOnly
              />
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={shareLinkInfo && shareLinkInfo.link ? handleCopyLink : handleGenerateLink}
          >
            {shareLinkInfo && shareLinkInfo.link ? "Copy Link" : "Generate Link"}
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
