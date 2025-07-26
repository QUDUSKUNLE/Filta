import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useUser } from '../contexts/UserContext';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: #f8f9fa;
    color: #333;
  }
`;

const ModalTitle = styled.h2`
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 700;
  text-align: center;
  font-size: 1.8rem;
`;

const ModalSubtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: #6c757d;
  z-index: 1;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  background: white;
  color: #333;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  &:hover {
    border-color: #667eea;
    background: #f8f9fa;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const GoogleIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e9ecef;
  }
  
  span {
    padding: 0 1rem;
    color: #6c757d;
    font-size: 0.9rem;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled(motion.div)`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
`;

const ForgotPassword = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 0.5rem;
  align-self: flex-end;

  &:hover {
    color: #5a6fd8;
  }
`;

const SwitchMode = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
  color: #666;
  font-size: 0.9rem;
`;

const SwitchButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 0.25rem;

  &:hover {
    color: #5a6fd8;
  }
`;

function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful login
      const userData = {
        id: Date.now(),
        email: formData.email,
        name: formData.email.split('@')[0], // Use email prefix as name
        loginMethod: 'email'
      };
      
      login(userData);
      toast.success('Login successful! Welcome back!');
      
      // Reset form
      setFormData({ email: '', password: '' });
      onClose();
      
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now(),
        email: 'user@gmail.com',
        name: 'Google User',
        loginMethod: 'google'
      };
      
      login(userData);
      toast.success('Google login successful!');
      onClose();
    } catch (error) {
      toast.error('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      toast.error('Please enter your email address first');
      return;
    }
    toast.success('Password reset link sent to your email!');
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ email: '', password: '' });
      setShowPassword(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={handleClose} disabled={isLoading}>
              <X size={24} />
            </CloseButton>

            <ModalTitle>Welcome Back</ModalTitle>
            <ModalSubtitle>Sign in to your Filta account</ModalSubtitle>

            <GoogleButton onClick={handleGoogleLogin} disabled={isLoading}>
              <GoogleIcon 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyLjU2IDEyLjI1QzIyLjU2IDExLjQ3IDIyLjQ5IDEwLjcyIDIyLjM2IDEwSDEyVjE0LjI2SDE3LjkyQzE3LjY2IDE1LjYgMTYuOTIgMTYuNzQgMTUuODQgMTcuNVYyMC4yNkgxOS4yOEMyMS4zNiAxOC40MyAyMi41NiAxNS42IDIyLjU2IDEyLjI1WiIgZmlsbD0iIzQyODVGNCIvPgo8cGF0aCBkPSJNMTIgMjFDMTUuMDQgMjEgMTcuNTYgMTkuOTIgMTkuMjggMTguMjZMMTUuODQgMTUuNUMxNC43OCAxNi4xMyAxMy40NyAxNi41IDEyIDE2LjVDOS4wNiAxNi41IDYuNTUgMTQuNjcgNS42OSAxMi4xSDIuMTZWMTQuODNDMy45MiAxOC4zMSA3LjcgMjEgMTIgMjFaIiBmaWxsPSIjMzRBODUzIi8+CjxwYXRoIGQ9Ik01LjY5IDEyLjFDNS40OSAxMS41IDUuMzggMTAuODYgNS4zOCAxMC4yQzUuMzggOS41NCA1LjQ5IDguOSA1LjY5IDguMVY1LjM3SDIuMTZDMS40NCA2Ljc3IDEgOC4zNSAxIDEwLjJDMSAxMi4wNSAxLjQ0IDEzLjYzIDIuMTYgMTUuMDNMNS42OSAxMi4xWiIgZmlsbD0iI0ZCQkMwNSIvPgo8cGF0aCBkPSJNMTIgNC43NUMxMy42NyA0Ljc1IDE1LjE2IDUuMzMgMTYuMzIgNi40NUwxOS4zNiAzLjQxQzE3LjU2IDEuNzQgMTUuMDQgMC43NSAxMiAwLjc1QzcuNyAwLjc1IDMuOTIgMy40NCAyLjE2IDYuOTJMNS42OSA5LjY1QzYuNTUgNy4wOCA5LjA2IDQuNzUgMTIgNC43NVoiIGZpbGw9IiNFQTQzMzUiLz4KPC9zdmc+Cg=="
                alt="Google"
              />
              Continue with Google
            </GoogleButton>

            <Divider>
              <span>or</span>
            </Divider>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <Mail size={18} />
                  </InputIcon>
                  <FormInput
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <Lock size={18} />
                  </InputIcon>
                  <FormInput
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </PasswordToggle>
                </InputWrapper>
                <ForgotPassword type="button" onClick={handleForgotPassword}>
                  Forgot password?
                </ForgotPassword>
              </FormGroup>

              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </SubmitButton>
            </Form>

            <SwitchMode>
              Don't have an account?
              <SwitchButton onClick={onSwitchToSignup} disabled={isLoading}>
                Sign up
              </SwitchButton>
            </SwitchMode>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
}

export default LoginModal;