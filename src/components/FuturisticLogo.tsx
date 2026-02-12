import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FuturisticLogo = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoStyle: React.CSSProperties = {
    position: 'relative',
    width: isScrolled ? '180px' : '120px',
    height: isScrolled ? '40px' : '60px',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const hexContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: 0,
    transform: 'translateY(-50%)',
    width: '100%',
    height: '100%',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isScrolled ? 0 : 1,
    pointerEvents: isScrolled ? 'none' : 'auto',
  };

  return (
    <div 
      className="logo-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to="/" style={{ textDecoration: 'none', position: 'relative', display: 'block' }}>
        <div style={logoStyle}>
          {/* Hexagon Container */}
          <div style={hexContainerStyle}>
            <div className="hexagon">
              <div 
                className="hex-shape"
                style={{
                  animation: isHovered ? 'hexRotate 2s linear infinite' : 'hexRotate 8s linear infinite',
                }}
              />
              <div className="hex-inner" />
              <div 
                className="nj-letters"
                style={{
                  animation: isHovered ? 'textGlow 0.5s ease-in-out' : 'textGlow 2s ease-in-out infinite',
                }}
              >
                NJ
              </div>
              <div className="scan-line" />
            </div>
            
            {/* Corner Accents */}
            <div className="corner-accent tl" />
            <div className="corner-accent tr" />
            <div className="corner-accent bl" />
            <div className="corner-accent br" />
            
            {/* Particles */}
            <div className="particles">
              <div className="particle" style={{ animationDelay: '0s' }} />
              <div className="particle" style={{ animationDelay: '0.8s' }} />
              <div className="particle" style={{ animationDelay: '1.6s' }} />
              <div className="particle" style={{ animationDelay: '2.4s' }} />
            </div>
          </div>
          
          {/* Full Name (appears on scroll) */}
          <div 
            className="full-name"
            style={{
              opacity: isScrolled ? 1 : 0,
              letterSpacing: isScrolled ? '4px' : '2px',
            }}
          >
            <span style={{ 
              opacity: isScrolled ? 1 : 0,
              transform: isScrolled ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: isScrolled ? '0.1s' : '0s',
              display: 'inline-block'
            }}>N</span>
            <span style={{ 
              opacity: isScrolled ? 1 : 0,
              transform: isScrolled ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: isScrolled ? '0.15s' : '0s',
              display: 'inline-block'
            }}>A</span>
            <span style={{ 
              opacity: isScrolled ? 1 : 0,
              transform: isScrolled ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: isScrolled ? '0.2s' : '0s',
              display: 'inline-block'
            }}>M</span>
            <span style={{ 
              opacity: isScrolled ? 1 : 0,
              transform: isScrolled ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: isScrolled ? '0.25s' : '0s',
              display: 'inline-block'
            }}>A</span>
            <span style={{ 
              opacity: isScrolled ? 1 : 0,
              transform: isScrolled ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: isScrolled ? '0.3s' : '0s',
              display: 'inline-block'
            }}>N</span>
            <span style={{ 
              opacity: isScrolled ? 1 : 0,
              transform: isScrolled ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: isScrolled ? '0.35s' : '0s',
              display: 'inline-block'
            }}></span>
            <span style={{ 
              opacity: isScrolled ? 1 : 0,
              transform: isScrolled ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: isScrolled ? '0.4s' : '0s',
              display: 'inline-block'
            }}>J</span>
            <span style={{ 
              opacity: isScrolled ? 1 : 0,
              transform: isScrolled ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: isScrolled ? '0.45s' : '0s',
              display: 'inline-block'
            }}>A</span>
            <span style={{ 
              opacity: isScrolled ? 1 : 0,
              transform: isScrolled ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: isScrolled ? '0.5s' : '0s',
              display: 'inline-block'
            }}>I</span>
            <span style={{ 
              opacity: isScrolled ? 1 : 0,
              transform: isScrolled ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: isScrolled ? '0.55s' : '0s',
              display: 'inline-block'
            }}>N</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FuturisticLogo;