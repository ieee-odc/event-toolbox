import React from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, googleProvider } from '../../../utils/firebaseConfig';
import './GoogleLoginButton.css';

const GoogleLoginButton = ({ buttonText, onSuccess, onFailure, action }) => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth, googleProvider);

  const handleClick = async () => {
    try {
      const userCredential = await signInWithGoogle();
      if (userCredential) {
        const tokenId = await userCredential.user.getIdToken();// Log Google token ID
        await action({ tokenId });
        onSuccess(userCredential);
      }
    } catch (error) {
      console.error('Google sign-in error:', error); // Log Google sign-in error
      onFailure(error);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleClick}
        disabled={loading}
        className="btn btn-lg google-button d-flex align-items-center justify-content-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="15"
          viewBox="0 0 488 512"
          className="bi bi-google google-icon me-2"
        >
          <path
            fill="#4285F4"
            d="M488 252c0-17-2.3-34.1-6.7-50.6H248v94h131c-6.1 33-24.7 61.1-52.5 80.3v66h84.4c49.5-45.7 77.8-113.2 77.8-189.7z"
          />
          <path
            fill="#34A853"
            d="M248 512c70.4 0 129.2-23.2 172.8-62.8l-84.4-66c-23.7 16.2-53.7 25.7-88.4 25.7-67.8 0-125.2-45.8-145.8-107.5l-85.7 67.2C68.4 441.2 154.7 512 248 512z"
          />
          <path
            fill="#FBBC05"
            d="M102.2 305.5c-8.1-24.2-8-50.5.1-74.6L16 164.6C3.3 202.4 0 241.1 0 280c0 38.9 3.3 77.6 16 115.4l86.3-66.8z"
          />
          <path
            fill="#EA4335"
            d="M248 100.3c35.4 0 67.8 12.2 93.1 32.1l69.9-69.1C377.3 23.2 318.4 0 248 0 154.7 0 68.4 70.8 33.4 164.7l85.7 66.8c20.6-61.6 78-107.2 148.9-130.1z"
          />
        </svg>
        {buttonText}
      </button>
    </div>
  );
};

export default GoogleLoginButton;
