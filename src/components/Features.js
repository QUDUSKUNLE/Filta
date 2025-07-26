import React from 'react';
import { Zap, Shield, Smartphone, Video } from 'lucide-react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FeaturesSection = styled.section`
  padding: 80px 0;
  background: white;
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

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const FeatureCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  border-radius: 15px;
  background: #f8f9fa;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Download videos at maximum speed with our optimized servers and advanced compression algorithms.'
  },
  {
    icon: Shield,
    title: 'Secure & Safe',
    description: 'Your downloads are protected with enterprise-grade security and encrypted connections.'
  },
  {
    icon: Smartphone,
    title: 'Multi-Platform',
    description: 'Works seamlessly across all devices and platforms - desktop, mobile, and tablet.'
  },
  {
    icon: Video,
    title: 'High Quality',
    description: 'Download in multiple formats and resolutions up to 4K with crystal clear quality.'
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

function Features() {
  return (
    <FeaturesSection id="features">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SectionTitle>Why Choose Filta?</SectionTitle>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <FeatureIcon>
                  <feature.icon size={32} />
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </motion.div>
      </div>
    </FeaturesSection>
  );
}

export default Features;
