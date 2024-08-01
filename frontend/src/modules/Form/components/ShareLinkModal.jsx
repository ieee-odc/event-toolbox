import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { UserData } from "../../../utils/UserData";

const base64UrlEncode = (str) => {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
};

const ShareLinkModal = ({ formId, onClose }) => {
  const userData = UserData();
  const modalRef = useRef(null);

  const token = base64UrlEncode(
    JSON.stringify({ userId: userData.id, formId })
  );
  const shareLink = `${window.location.origin}/form/${token}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied to clipboard");
  };

  const handleFacebookShare = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareLink
    )}&hashtag=%23ExampleForm`;
    window.open(facebookShareUrl, "_blank");
  };

  const handleLinkedInShare = () => {
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      "https://facebook.com"
    )}`;
    window.open(linkedInShareUrl, "_blank");
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="modal fade show"
      id="modalCenter"
      tabIndex={-1}
      style={{ display: "block" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content" ref={modalRef}>
          <div className="modal-header">
            <h5 className="modal-title">Share Form</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body">
            <p>
              The link will expire when the form's deadline is over. To extend
              the deadline, update the form.
            </p>
            <div className="form-group">
              <label htmlFor="generatedLink">Generated Link</label>
              <input
                type="text"
                style={{ cursor: "not-allowed", opacity: 0.7 }}
                id="generatedLink"
                className="form-control"
                value={shareLink}
                readOnly
              />
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-between align-items-center">
            <div>
              <button
                type="button"
                className="btn btn-facebook me-2"
                onClick={handleFacebookShare}
                style={{ padding: "0px" }}
              >
                <i
                  className="bx bxl-facebook-square bx-lg"
                  style={{
                    color: "var(--primary-color)",
                    cursor: "pointer",
                  }}
                />
              </button>
              <button
                type="button"
                className="btn btn-linkedin"
                style={{ padding: "0px" }}
                onClick={handleLinkedInShare}
              >
                <i
                  className="bx bxl-linkedin-square bx-lg"
                  style={{
                    color: "var(--primary-color)",
                    cursor: "pointer",
                  }}
                />
              </button>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-primary me-2"
                onClick={handleCopyLink}
              >
                Copy Link
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareLinkModal;
