import React from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, googleProvider } from '../../../utils/firebaseConfig'
import './GoogleLoginButton.css';

const GoogleLoginButton = ({ buttonText, onSuccess, onFailure }) => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth, googleProvider);

  const handleClick = async () => {
    try {
      await signInWithGoogle();
      if (user) {
        onSuccess(user);
      }
    } catch (error) {
      onFailure(error);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading} className="google-button">
      <i className="bi bi-google google-icon"></i>
      {buttonText}
    </button>
  );
};

export default GoogleLoginButton;
