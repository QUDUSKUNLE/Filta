import { motion } from 'framer-motion';
import { Facebook, Instagram, MessageCircle, Twitter, Youtube } from 'lucide-react';
import React from 'react';
import styled from 'styled-components';
import FiltaLogo from './FiltaLogo';

const FooterSection = styled.footer`
  background: #2c3e50;
  color: white;
  padding: 3rem 0 1rem;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    justify-content: center;
  }
`;

const FooterDescription = styled.p`
  color: #bdc3c7;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 480px) {
    justify-content: center;
  }
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #ecf0f1;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    transform: translateY(-2px);
  }
`;

const ColumnTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #ecf0f1;
  font-weight: 600;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLinkItem = styled.li`
  margin-bottom: 0.5rem;
`;

const FooterLink = styled.a`
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #667eea;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #34495e;
  padding-top: 1.5rem;
`;

const FooterBottomContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: #95a5a6;
  margin: 0;
`;

const FooterBottomLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FooterBottomLink = styled.a`
  color: #95a5a6;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #667eea;
  }
`;

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Download', href: '#download' },
    { name: 'Updates', href: '#updates' }
  ],
  support: [
    { name: 'Help Center', href: '#help' },
    { name: 'Contact Us', href: '#contact' },
    { name: 'WhatsApp Support', href: 'whatsapp://send?phone=2347071461496&text=Hi, I need help with Filta' },
    { name: 'Tutorials', href: '#tutorials' },
    { name: 'FAQ', href: '#faq' }
  ],
  company: [
    { name: 'About Us', href: '#about' },
    { name: 'Careers', href: '#careers' },
    { name: 'Blog', href: '#blog' },
    { name: 'Press', href: '#press' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'DMCA', href: '#dmca' }
  ]
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: MessageCircle, href: 'https://wa.me/2347071461496?text=Hi, I need help with Filta', label: 'WhatsApp' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

function Footer() {
  const scrollToSection = (sectionId) => {
    if (sectionId.startsWith('#')) {
      const element = document.getElementById(sectionId.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLinkClick = (href) => {
    if (href.startsWith('#')) {
      scrollToSection(href);
    } else if (href.startsWith('whatsapp://') || href.startsWith('https://wa.me/')) {
      // Handle WhatsApp links
      window.open(href, '_blank');
    } else {
      // Handle other external links
      console.log(`Navigate to: ${href}`);
    }
  };

  return (
    <FooterSection>
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <FooterContent>
            <motion.div variants={columnVariants}>
              <FooterColumn>
                <FooterBrand>
                  <FiltaLogo size={24} color="#667eea" />
                  Filta
                </FooterBrand>
                <FooterDescription>
                  Professional video downloader with subscription features. Download videos from multiple platforms with ease and reliability.
                </FooterDescription>
                <SocialLinks>
                  {socialLinks.map((social, index) => (
                    <SocialLink
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon size={18} />
                    </SocialLink>
                  ))}
                </SocialLinks>
              </FooterColumn>
            </motion.div>

            <motion.div variants={columnVariants}>
              <FooterColumn>
                <ColumnTitle>Product</ColumnTitle>
                <FooterLinks>
                  {footerLinks.product.map((link, index) => (
                    <FooterLinkItem key={index}>
                      <FooterLink onClick={() => handleLinkClick(link.href)}>
                        {link.name}
                      </FooterLink>
                    </FooterLinkItem>
                  ))}
                </FooterLinks>
              </FooterColumn>
            </motion.div>

            <motion.div variants={columnVariants}>
              <FooterColumn>
                <ColumnTitle>Support</ColumnTitle>
                <FooterLinks>
                  {footerLinks.support.map((link, index) => (
                    <FooterLinkItem key={index}>
                      <FooterLink onClick={() => handleLinkClick(link.href)}>
                        {link.name}
                      </FooterLink>
                    </FooterLinkItem>
                  ))}
                </FooterLinks>
              </FooterColumn>
            </motion.div>

            <motion.div variants={columnVariants}>
              <FooterColumn>
                <ColumnTitle>Company</ColumnTitle>
                <FooterLinks>
                  {footerLinks.company.map((link, index) => (
                    <FooterLinkItem key={index}>
                      <FooterLink onClick={() => handleLinkClick(link.href)}>
                        {link.name}
                      </FooterLink>
                    </FooterLinkItem>
                  ))}
                </FooterLinks>
              </FooterColumn>
            </motion.div>

            <motion.div variants={columnVariants}>
              <FooterColumn>
                <ColumnTitle>Legal</ColumnTitle>
                <FooterLinks>
                  {footerLinks.legal.map((link, index) => (
                    <FooterLinkItem key={index}>
                      <FooterLink onClick={() => handleLinkClick(link.href)}>
                        {link.name}
                      </FooterLink>
                    </FooterLinkItem>
                  ))}
                </FooterLinks>
              </FooterColumn>
            </motion.div>
          </FooterContent>
        </motion.div>

        <FooterBottom>
          <FooterBottomContent>
            <Copyright>&copy; 2025 Filta. All rights reserved.</Copyright>
            <FooterBottomLinks>
              <FooterBottomLink onClick={() => handleLinkClick('#privacy')}>
                Privacy
              </FooterBottomLink>
              <FooterBottomLink onClick={() => handleLinkClick('#terms')}>
                Terms
              </FooterBottomLink>
              <FooterBottomLink onClick={() => handleLinkClick('#cookies')}>
                Cookies
              </FooterBottomLink>
            </FooterBottomLinks>
          </FooterBottomContent>
        </FooterBottom>
      </div>
    </FooterSection>
  );
}

export default Footer;
