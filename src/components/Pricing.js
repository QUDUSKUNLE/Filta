import React from 'react';
import { Check, X, Star } from 'lucide-react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

const PricingSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const PricingCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
  border: ${props => props.popular ? '3px solid #667eea' : '1px solid #e9ecef'};

  &:hover {
    transform: translateY(-10px);
  }

  @media (max-width: 768px) {
    transform: none !important;
    
    &:hover {
      transform: translateY(-5px);
    }
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: #667eea;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardHeader = styled.div`
  margin-bottom: 2rem;
`;

const PlanTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 600;
`;

const Price = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
  
  span {
    font-size: 1rem;
    color: #666;
    font-weight: 400;
  }
`;

const Savings = styled.div`
  color: #10b981;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const FeaturesList = styled.ul`
  list-style: none;
  margin: 2rem 0;
  text-align: left;
`;

const FeatureItem = styled.li`
  padding: 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  
  svg {
    flex-shrink: 0;
  }
`;

const plans = [
  {
    id: 'trial',
    title: 'Free Trial',
    price: '0',
    period: '/7 days',
    features: [
      { text: '10 downloads per day', included: true },
      { text: 'Standard quality', included: true },
      { text: 'Basic support', included: true },
      { text: 'HD downloads', included: false },
      { text: 'Batch downloads', included: false }
    ],
    buttonText: 'Current Plan',
    disabled: true,
    current: true
  },
  {
    id: 'monthly',
    title: 'Monthly',
    price: 'N4,000',
    period: '/month',
    popular: true,
    features: [
      { text: 'Unlimited downloads', included: true },
      { text: 'HD & 4K quality', included: true },
      { text: 'Priority support', included: true },
      { text: 'Batch downloads', included: true },
      { text: 'Advanced analytics', included: false }
    ],
    buttonText: 'Choose Monthly'
  },
  {
    id: 'yearly',
    title: 'Yearly',
    price: 'N40,000',
    period: '/year',
    savings: 'Save 16.67%',
    features: [
      { text: 'Everything in Monthly', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'API access', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Priority phone support', included: true }
    ],
    buttonText: 'Choose Yearly'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

function Pricing() {
  const { isSubscribed, subscriptionPlan, showSubscriptionModal } = useUser();

  const handleSelectPlan = (planId) => {
    if (planId === 'trial') return;
    
    const plan = plans.find(p => p.id === planId);
    showSubscriptionModal(plan);
  };

  const getButtonText = (plan) => {
    if (isSubscribed && subscriptionPlan?.toLowerCase().includes(plan.title.toLowerCase())) {
      return 'Current Plan';
    }
    return plan.buttonText;
  };

  const isCurrentPlan = (plan) => {
    if (plan.id === 'trial' && !isSubscribed) return true;
    if (isSubscribed && subscriptionPlan?.toLowerCase().includes(plan.title.toLowerCase())) return true;
    return false;
  };

  return (
    <PricingSection id="pricing">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SectionTitle>Choose Your Plan</SectionTitle>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <PricingGrid>
            {plans.map((plan, index) => (
              <PricingCard
                key={plan.id}
                variants={cardVariants}
                popular={plan.popular}
                whileHover={{ 
                  scale: window.innerWidth > 768 ? 1.05 : 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                {plan.popular && (
                  <PopularBadge>
                    <Star size={16} />
                    Most Popular
                  </PopularBadge>
                )}
                
                <CardHeader>
                  <PlanTitle>{plan.title}</PlanTitle>
                  <Price>
                    {plan.price}
                    <span>{plan.period}</span>
                  </Price>
                  {plan.savings && <Savings>{plan.savings}</Savings>}
                </CardHeader>

                <FeaturesList>
                  {plan.features.map((feature, featureIndex) => (
                    <FeatureItem key={featureIndex}>
                      {feature.included ? (
                        <Check size={20} color="#10b981" />
                      ) : (
                        <X size={20} color="#ef4444" />
                      )}
                      <span style={{ 
                        color: feature.included ? '#333' : '#999',
                        textDecoration: feature.included ? 'none' : 'line-through'
                      }}>
                        {feature.text}
                      </span>
                    </FeatureItem>
                  ))}
                </FeaturesList>

                <button
                  className={`btn ${isCurrentPlan(plan) ? 'btn-outline' : 'btn-primary'} btn-full`}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan(plan)}
                >
                  {getButtonText(plan)}
                </button>
              </PricingCard>
            ))}
          </PricingGrid>
        </motion.div>
      </div>
    </PricingSection>
  );
}

export default Pricing;
