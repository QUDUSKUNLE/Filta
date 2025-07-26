import React from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { useUser } from '../contexts/UserContext';

function AuthManager() {
  const { 
    showAuthModal: isAuthModalOpen, 
    authModalType, 
    hideAuthModal, 
    showAuthModal 
  } = useUser();

  console.log('AuthManager render:', { isAuthModalOpen, authModalType });

  const handleSwitchToSignup = () => {
    console.log('Switching to signup');
    showAuthModal('signup');
  };

  const handleSwitchToLogin = () => {
    console.log('Switching to login');
    showAuthModal('login');
  };

  const handleClose = () => {
    console.log('Closing auth modal');
    hideAuthModal();
  };

  return (
    <>
      <LoginModal
        isOpen={isAuthModalOpen && authModalType === 'login'}
        onClose={handleClose}
        onSwitchToSignup={handleSwitchToSignup}
      />
      <SignupModal
        isOpen={isAuthModalOpen && authModalType === 'signup'}
        onClose={handleClose}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}

export default AuthManager;