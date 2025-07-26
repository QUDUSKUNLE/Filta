import React, { useState } from 'react';
import { X, Check, CreditCard } from 'lucide-react';
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/[^0-9]/gi, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()
        .substring(0, 19);
    }

    // Format expiry date
    if (name === 'expiry') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 5);
    }

    // Format CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }

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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Card number validation (basic length check)
    if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      toast.error('Please enter a valid card number');
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

          <Form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
                disabled={isProcessing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                className="form-input"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                required
                disabled={isProcessing}
              />
            </div>

            <FormRow>
              <div className="form-group">
                <label htmlFor="expiry">Expiry Date</label>
                <input
                  type="text"
                  id="expiry"
                  name="expiry"
                  className="form-input"
                  value={formData.expiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  required
                  disabled={isProcessing}
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  className="form-input"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  required
                  disabled={isProcessing}
                />
              </div>
            </FormRow>

            <button 
              type="submit" 
              className="btn btn-primary btn-full btn-large"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Subscribe Now
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