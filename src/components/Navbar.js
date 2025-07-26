import React, { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import styled from 'styled-components';
import { useUser } from '../contexts/UserContext';
import FiltaLogo from './FiltaLogo';

const Nav = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Brand = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${props => props.isOpen ? '0' : '-100%'};
    width: 300px;
    height: 100vh;
    background: white;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 80px;
    transition: right 0.3s ease;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  }
`;

const NavLink = styled.a`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #667eea;
  }

  @media (max-width: 768px) {
    padding: 1rem 0;
    font-size: 1.1rem;
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    padding: 0 2rem;
    gap: 1rem;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 25px;
  font-weight: 500;
  color: #333;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #dc3545;
  border-radius: 8px;
  color: #dc3545;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #dc3545;
    color: white;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { 
    resetTrial, 
    expireTrial, 
    isAuthenticated, 
    user, 
    showAuthModal, 
    logout 
  } = useUser();

  console.log('Navbar render:', { isAuthenticated, showAuthModal: typeof showAuthModal });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
  };

  const handleLogin = () => {
    console.log('Login button clicked, showAuthModal:', showAuthModal);
    showAuthModal('login');
    closeMenu();
  };

  const handleSignup = () => {
    console.log('Signup button clicked, showAuthModal:', showAuthModal);
    showAuthModal('signup');
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <Nav>
      <NavContainer>
        <Brand>
          <FiltaLogo size={28} />
          Filta
        </Brand>
        
        <NavMenu isOpen={isMenuOpen}>
          <NavLink onClick={() => scrollToSection('home')}>
            Home
          </NavLink>
          <NavLink onClick={() => scrollToSection('features')}>
            Features
          </NavLink>
          <NavLink onClick={() => scrollToSection('pricing')}>
            Pricing
          </NavLink>
          
          <ButtonGroup>
            {/* Debug buttons - remove in production */}
            <button 
              className="btn btn-secondary"
              onClick={resetTrial}
              style={{ fontSize: '11px', padding: '6px 10px' }}
            >
              Reset
            </button>
            <button 
              className="btn btn-secondary"
              onClick={expireTrial}
              style={{ fontSize: '11px', padding: '6px 10px' }}
            >
              Expire
            </button>
            
            {isAuthenticated ? (
              <UserMenu>
                <UserInfo>
                  <User size={18} />
                  {user?.name || user?.email || 'User'}
                </UserInfo>
                <LogoutButton onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </LogoutButton>
              </UserMenu>
            ) : (
              <>
                <button 
                  className="btn btn-outline"
                  onClick={handleLogin}
                >
                  Login
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleSignup}
                >
                  Sign Up
                </button>
              </>
            )}
          </ButtonGroup>
        </NavMenu>

        <MenuToggle onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </MenuToggle>
      </NavContainer>
    </Nav>
  );
}

export default Navbar;