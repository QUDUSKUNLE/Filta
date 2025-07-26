import React, { useState } from 'react';
import { X, Check, CreditCard, Shield, Lock } from 'lucide-react';
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
  max-width: 500px;
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
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 700;
  text-align: center;
`;

const SelectedPlan = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  text-align: center;
  border: 2px solid #667eea;
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const PlanPrice = styled.div`
  font-size: 2rem;
  color: #667eea;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  text-align: left;
  margin-top: 1rem;
`;

const PlanFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-size: 0.9rem;
  color: #666;
`;

const PaymentSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SupportedCards = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

const CardIcon = styled.div`
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;

  &.active {
    border-color: #667eea;
    background: #f0f4ff;
  }

  img {
    height: 24px;
    width: auto;
    max-width: 100%;
  }

  .card-name {
    font-size: 0.7rem;
    font-weight: 600;
    color: #666;
    margin-top: 0.25rem;
    text-align: center;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
    font-size: 0.9rem;
  }

  .form-input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e9ecef;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &.error {
      border-color: #dc3545;
    }

    &.valid {
      border-color: #28a745;
    }
  }
`;

const CardNumberGroup = styled(FormGroup)`
  .card-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .detected-card {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    height: 24px;
    width: auto;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SecurityInfo = styled.div`
  background: #e8f5e8;
  border: 1px solid #28a745;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #155724;

  .security-icon {
    color: #28a745;
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

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// Card type detection and validation
const cardTypes = {
  visa: {
    name: 'Visa',
    pattern: /^4/,
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzE0MzQ4NyIvPgo8cGF0aCBkPSJNMTYuNzUgN0gxNC4yNUwxMi41IDE3SDE1TDE2Ljc1IDdaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjMuMjUgN0gyMC43NUwxOSAxN0gyMS41TDIzLjI1IDdaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
  },
  mastercard: {
    name: 'Mastercard',
    pattern: /^5[1-5]/,
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0VCMDAxQiIvPgo8Y2lyY2xlIGN4PSIxNSIgY3k9IjEyIiByPSI2IiBmaWxsPSIjRkY1RjAwIi8+CjxjaXJjbGUgY3g9IjI1IiBjeT0iMTIiIHI9IjYiIGZpbGw9IiNGRkY1RjAiLz4KPC9zdmc+'
  },
  amex: {
    name: 'American Express',
    pattern: /^3[47]/,
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNkZDRiIvPgo8dGV4dCB4PSIyMCIgeT0iMTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFNRVg8L3RleHQ+Cjwvc3ZnPg=='
  },
  discover: {
    name: 'Discover',
    pattern: /^6(?:011|5)/,
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0ZGNjAwMCIvPgo8dGV4dCB4PSIyMCIgeT0iMTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI2IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkRJU0NPVKVSPC90ZXh0Pgo8L3N2Zz4='
  }
};

function SubscriptionModal() {
  const { 
    showSubscriptionModal, 
    selectedPlan, 
    hideSubscriptionModal, 
    subscribe 
  } = useUser();

  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedCardType, setDetectedCardType] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const detectCardType = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    for (const [key, card] of Object.entries(cardTypes)) {
      if (card.pattern.test(cleanNumber)) {
        return key;
      }
    }
    return null;
  };

  const validateCardNumber = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    // Luhn algorithm for card validation
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0 && cleanNumber.length >= 13;
  };

  const validateExpiry = (expiry) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    
    const [month, year] = expiry.split('/').map(num => parseInt(num, 10));
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (month < 1 || month > 12) return false;
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
    
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    const newErrors = { ...validationErrors };

    // Format card number
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/[^0-9]/gi, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()
        .substring(0, 19);
      
      const cardType = detectCardType(formattedValue);
      setDetectedCardType(cardType);
      
      // Validate card number
      if (formattedValue.length > 0) {
        const isValid = validateCardNumber(formattedValue);
        if (!isValid && formattedValue.replace(/\s/g, '').length >= 13) {
          newErrors.cardNumber = 'Invalid card number';
        } else {
          delete newErrors.cardNumber;
        }
      }
    }

    // Format expiry date
    if (name === 'expiry') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 5);
      
      // Validate expiry
      if (formattedValue.length === 5) {
        const isValid = validateExpiry(formattedValue);
        if (!isValid) {
          newErrors.expiry = 'Invalid or expired date';
        } else {
          delete newErrors.expiry;
        }
      }
    }

    // Format CVV
    if (name === 'cvv') {
      const maxLength = detectedCardType === 'amex' ? 4 : 3;
      formattedValue = value.replace(/\D/g, '').substring(0, maxLength);
      
      // Validate CVV
      if (formattedValue.length > 0 && formattedValue.length < maxLength) {
        newErrors.cvv = `CVV must be ${maxLength} digits`;
      } else {
        delete newErrors.cvv;
      }
    }

    // Email validation
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value.length > 0 && !emailRegex.test(value)) {
        newErrors.email = 'Invalid email address';
      } else {
        delete newErrors.email;
      }
    }

    setValidationErrors(newErrors);
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.cardNumber || !formData.expiry || !formData.cvv) {
      toast.error('Please fill in all fields');
      return;
    }

    // Check for validation errors
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // Final validations
    if (!validateCardNumber(formData.cardNumber)) {
      toast.error('Please enter a valid card number');
      return;
    }

    if (!validateExpiry(formData.expiry)) {
      toast.error('Please enter a valid expiry date');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful subscription
      subscribe(selectedPlan.title + ' Plan');
      toast.success('Subscription successful! Welcome to Premium!');
      
      // Reset form
      setFormData({
        email: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
      });
      setDetectedCardType(null);
      setValidationErrors({});
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      hideSubscriptionModal();
      setFormData({
        email: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
      });
      setDetectedCardType(null);
      setValidationErrors({});
    }
  };

  return (
    <AnimatePresence>
      {showSubscriptionModal && selectedPlan && (
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
            <CloseButton onClick={handleClose} disabled={isProcessing}>
              <X size={24} />
            </CloseButton>

            <ModalTitle>Complete Your Subscription</ModalTitle>

            <SelectedPlan>
              <PlanName>{selectedPlan.title} Plan</PlanName>
              <PlanPrice>{selectedPlan.price}{selectedPlan.period}</PlanPrice>
              {selectedPlan.savings && (
                <div style={{ color: '#10b981', fontWeight: '600', fontSize: '0.9rem' }}>
                  {selectedPlan.savings}
                </div>
              )}
              <PlanFeatures>
                {selectedPlan.features?.filter(f => f.included).map((feature, index) => (
                  <PlanFeature key={index}>
                    <Check size={16} color="#10b981" />
                    {feature.text}
                  </PlanFeature>
                ))}
              </PlanFeatures>
            </SelectedPlan>

            <PaymentSection>
              <SectionTitle>
                <CreditCard size={18} />
                Payment Information
              </SectionTitle>

              <SupportedCards>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
                  We Accept
                </div>
                <CardsGrid>
                  {Object.entries(cardTypes).map(([key, card]) => (
                    <CardIcon 
                      key={key} 
                      className={detectedCardType === key ? 'active' : ''}
                      title={card.name}
                    >
                      <div>
                        <img src={card.icon} alt={card.name} />
                        <div className="card-name">{card.name}</div>
                      </div>
                    </CardIcon>
                  ))}
                </CardsGrid>
              </SupportedCards>

              <SecurityInfo>
                <Shield className="security-icon" size={20} />
                <div>
                  <strong>Secure Payment:</strong> Your payment information is encrypted and secure. We never store your card details.
                </div>
              </SecurityInfo>
            </PaymentSection>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${validationErrors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                  disabled={isProcessing}
                />
                {validationErrors.email && (
                  <ErrorMessage>{validationErrors.email}</ErrorMessage>
                )}
              </FormGroup>

              <CardNumberGroup>
                <label htmlFor="cardNumber">Card Number</label>
                <div className="card-input-wrapper">
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    className={`form-input ${validationErrors.cardNumber ? 'error' : detectedCardType ? 'valid' : ''}`}
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                    disabled={isProcessing}
                  />
                  {detectedCardType && (
                    <img 
                      src={cardTypes[detectedCardType].icon} 
                      alt={cardTypes[detectedCardType].name}
                      className="detected-card"
                    />
                  )}
                </div>
                {validationErrors.cardNumber && (
                  <ErrorMessage>{validationErrors.cardNumber}</ErrorMessage>
                )}
              </CardNumberGroup>

              <FormRow>
                <FormGroup>
                  <label htmlFor="expiry">Expiry Date</label>
                  <input
                    type="text"
                    id="expiry"
                    name="expiry"
                    className={`form-input ${validationErrors.expiry ? 'error' : ''}`}
                    value={formData.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                    disabled={isProcessing}
                  />
                  {validationErrors.expiry && (
                    <ErrorMessage>{validationErrors.expiry}</ErrorMessage>
                  )}
                </FormGroup>
                <FormGroup>
                  <label htmlFor="cvv">
                    CVV {detectedCardType === 'amex' ? '(4 digits)' : '(3 digits)'}
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    className={`form-input ${validationErrors.cvv ? 'error' : ''}`}
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder={detectedCardType === 'amex' ? '1234' : '123'}
                    required
                    disabled={isProcessing}
                  />
                  {validationErrors.cvv && (
                    <ErrorMessage>{validationErrors.cvv}</ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>

              <button 
                type="submit" 
                className="btn btn-primary btn-full btn-large"
                disabled={isProcessing || Object.keys(validationErrors).length > 0}
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Subscribe Securely
                  </>
                )}
              </button>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
}

export default SubscriptionModal;