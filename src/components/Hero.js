import React, { useState } from 'react';
import { Download, Clock, Crown, AlertTriangle, Folder } from 'lucide-react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useUser } from '../contexts/UserContext';
import DownloadForm from './DownloadForm';

const HeroSection = styled.section`
  padding: 120px 0 80px;
  text-align: center;
  color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
`;

const HeroContent = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const TrialStatus = styled(motion.div)`
  background: ${props => {
    if (props.isSubscribed) return 'rgba(16, 185, 129, 0.2)';
    if (props.isExpired) return 'rgba(239, 68, 68, 0.2)';
    return 'rgba(255, 255, 255, 0.2)';
  }};
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  border-radius: 50px;
  margin: 2rem auto;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
`;

function Hero() {
  const { 
    trialDaysRemaining, 
    isSubscribed, 
    subscriptionPlan,
    showTrialExpiredModal 
  } = useUser();

  const renderTrialStatus = () => {
    if (isSubscribed) {
      return (
        <TrialStatus 
          isSubscribed={true}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Crown size={20} />
          <span>Premium Member - {subscriptionPlan}</span>
        </TrialStatus>
      );
    } else if (trialDaysRemaining > 0) {
      return (
        <TrialStatus
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Clock size={20} />
          <span>
            {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} remaining in your free trial
          </span>
        </TrialStatus>
      );
    } else {
      return (
        <TrialStatus 
          isExpired={true}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AlertTriangle size={20} />
          <span>Trial Expired - Subscribe to continue</span>
        </TrialStatus>
      );
    }
  };

  return (
    <HeroSection id="home">
      <div className="container">
        <HeroContent>
          <Title
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Download Videos Instantly
          </Title>
          
          <Subtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Fast, reliable video downloads from any URL. Start your 7-day free trial today!
          </Subtitle>

          {renderTrialStatus()}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <DownloadForm />
          </motion.div>
        </HeroContent>
      </div>
    </HeroSection>
  );
}

export default Hero;