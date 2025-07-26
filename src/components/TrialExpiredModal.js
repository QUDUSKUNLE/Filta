import React from 'react';
import { X, AlertTriangle, Crown } from 'lucide-react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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
  text-align: center;
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

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ModalTitle = styled.h2`
  margin-bottom: 1rem;
  color: #333;
  font-weight: 700;
  font-size: 1.75rem;
`;

const ModalDescription = styled.p`
  margin-bottom: 2rem;
  color: #666;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const BenefitsList = styled.ul`
  list-style: none;
  margin: 1.5rem 0;
  text-align: left;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: #333;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const benefits = [
  'Unlimited video downloads',
  'HD & 4K quality support',
  'Priority customer support',
  'Batch download feature',
  'No daily limits'
];

function TrialExpiredModal() {
  const { showTrialExpiredModal, hideTrialExpiredModal } = useUser();

  const handleViewPlans = () => {
    hideTrialExpiredModal();
    // Scroll to pricing section
    setTimeout(() => {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleClose = () => {
    hideTrialExpiredModal();
  };

  return (
    <AnimatePresence>
      {showTrialExpiredModal && (
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
          <CloseButton onClick={handleClose}>
            <X size={24} />
          </CloseButton>

          <IconContainer>
            <AlertTriangle size={40} />
          </IconContainer>

          <ModalTitle>Trial Period Expired</ModalTitle>
          
          <ModalDescription>
            Your 7-day free trial has ended. Upgrade to Premium to continue enjoying unlimited video downloads with enhanced features.
          </ModalDescription>

          <BenefitsList>
            {benefits.map((benefit, index) => (
              <BenefitItem key={index}>
                <Crown size={20} color="#667eea" />
                {benefit}
              </BenefitItem>
            ))}
          </BenefitsList>

          <ButtonGroup>
            <button 
              className="btn btn-outline"
              onClick={handleClose}
            >
              Maybe Later
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleViewPlans}
            >
              <Crown size={20} />
              View Plans
            </button>
          </ButtonGroup>
        </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
}

export default TrialExpiredModal;
