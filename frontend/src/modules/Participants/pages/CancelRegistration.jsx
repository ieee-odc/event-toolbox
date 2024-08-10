import React from "react";

function CancelRegistration() {
  JSON.stringify({ userId: userData.id, formId });
  const { token } = useParams();

  const decodedToken = base64UrlDecode(token);
  let tokenData;

  try {
    tokenData = JSON.parse(decodedToken);
  } catch (error) {
    console.error("Invalid token format", error);
  }
  return <div>CancelRegistration</div>;
}

export default CancelRegistration;
