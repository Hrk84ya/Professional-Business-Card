import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram, FaGlobe, FaShare, FaTimes, FaFilePdf, FaFileImage } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const CardContainer = styled.div`
  perspective: 1000px;
  width: 350px;
  height: 200px;
  margin: 20px;
`;

const Card = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
  transform: ${({ flipped }) => (flipped ? 'rotateY(180deg)' : 'rotateY(0)')};
  cursor: pointer;
  will-change: transform;
  backface-visibility: hidden;
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  /* Add this to ensure proper rendering in screenshots */
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
`;

const CardFront = styled(CardFace).attrs({
  className: 'card-face'
})`
  display: flex;
  flex-direction: column;
`;

const ShareOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ShareContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  position: relative;
`;

const ShareTitle = styled.h3`
  margin-bottom: 20px;
  color: #3A4A5F;
`;

const ShareInput = styled.div`
  display: flex;
  margin-bottom: 20px;
  
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px 0 0 4px;
    font-size: 14px;
  }
  
  button {
    background: #3A4A5F;
    color: white;
    border: none;
    padding: 0 15px;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
    transition: background 0.3s;
    
    &:hover {
      background: #2C3A4A;
    }
  }
`;

const ShareSocial = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  
  a {
    color: #3A4A5F;
    font-size: 24px;
    transition: color 0.3s;
    
    &:hover {
      color: #1E88E5;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ShareButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: #333d35;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;
  
  &:hover {
    background: #2C3A4A;
    transform: scale(1.1);
  }
`;

const CardBack = styled(CardFace).attrs({
  className: 'card-face'
})`
  background: #333d35;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
  color: white;
`;

const CompanyName = styled.h2`
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 600;
  color: white;
`;

const JobTitle = styled.p`
  margin: 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
`;

const TopSection = styled.div`
  background: #333d35;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const BottomSection = styled.div`
  background: #F0EEE8;
  flex: 1;
  display: flex;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-right: 1px solid #ddd;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin: 10px 0;
  color: #333d35;
  
  a {
    color: inherit;
    transition: color 0.3s;
    
    &:hover {
      color: #4a5d4f;
    }
  }
`;

const Title = styled.h1`
  margin: 0;
  color: white;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 5px 0 0 0;
  color: white;
  font-size: 14px;
  text-align: center;
`;

const ContactInfo = styled.p`
  margin: 5px 0;
  color: #2C3E50;
  font-size: 12px;
  text-align: left;
`;

const SocialHandle = styled.p`
  margin: 5px 0 0 0;
  color: #2C3E50;
  font-size: 10px;
  text-align: center;
`;

const FlipButton = styled(motion.button)`
  margin-top: 20px;
  padding: 8px 16px;
  background: #2C3E50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: #1A252F;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BusinessCard = ({ 
  title = 'VISIONARY VOGUE', 
  subtitle = 'TITLE', 
  socialMedia = '@SOCIALMEDIAHANDLES', 
  website = 'WWW.WEBSITE.COM', 
  email = 'MYWORKGMAIL.COM', 
  phone = '123-456-789',
  facebook = '',
  twitter = '',
  instagram = ''
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef();
  
  const socialLinks = {
    facebook: facebook || '#',
    twitter: twitter || '#',
    instagram: instagram || '#',
    website: website.startsWith('http') ? website : `https://${website}`
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    setShowShare(true);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsJPEG = async () => {
    try {
      // Create a temporary container for the card
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '350px';
      tempContainer.style.height = '200px';
      document.body.appendChild(tempContainer);
      
      // Clone the card and append to temp container
      const cardClone = cardRef.current.cloneNode(true);
      tempContainer.appendChild(cardClone);
      
      // Make sure we're showing the front of the card
      cardClone.style.transform = 'rotateY(0)';
      
      // Create canvas from the cloned card
      const canvas = await html2canvas(cardClone, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        onclone: (clonedDoc, element) => {
          // Ensure we're showing the front of the card
          const cardFaces = element.querySelectorAll('.card-face');
          cardFaces[0].style.display = 'flex';
          cardFaces[1].style.display = 'none';
        }
      });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-business-card.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error('Error generating JPEG:', error);
    }
  };

  const exportAsPDF = async () => {
    try {
      // Create a temporary container for the card
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '350px';
      tempContainer.style.height = '200px';
      document.body.appendChild(tempContainer);
      
      // Clone the card and append to temp container
      const cardClone = cardRef.current.cloneNode(true);
      tempContainer.appendChild(cardClone);
      
      // Make sure we're showing the front of the card
      cardClone.style.transform = 'rotateY(0)';
      
      // Create canvas from the cloned card
      const canvas = await html2canvas(cardClone, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        onclone: (clonedDoc, element) => {
          // Ensure we're showing the front of the card
          const cardFaces = element.querySelectorAll('.card-face');
          cardFaces[0].style.display = 'flex';
          cardFaces[1].style.display = 'none';
        }
      });
      
      // Create PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [86, 54] // Standard business card size in mm (3.37" x 2.125")
      });
      
      // Calculate dimensions to maintain aspect ratio
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Clean up
      document.body.removeChild(tempContainer);
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}-business-card.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <CardContainer>
        <Card 
          ref={cardRef}
          animate={{ 
            rotateY: isFlipped ? 180 : 0,
            scale: 1.02
          }}
          transition={{ 
            rotateY: { duration: 0.6, ease: "easeInOut" },
            scale: { duration: 0.2 }
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            // Only flip if we're not clicking on a button
            if (!e.target.closest('button')) {
              setIsFlipped(!isFlipped);
            }
          }}
        >
          <CardFront>
            <TopSection>
              <Title>{title}</Title>
              <Subtitle>{subtitle}</Subtitle>
            </TopSection>
            <BottomSection>
              <LeftSection>
                <SocialIcons>
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" title="Facebook">
                    <FaFacebook size={16} />
                  </a>
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" title="Twitter">
                    <FaTwitter size={16} />
                  </a>
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                    <FaInstagram size={16} />
                  </a>
                  <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" title="Website">
                    <FaGlobe size={16} />
                  </a>
                </SocialIcons>
                <SocialHandle>{socialMedia}</SocialHandle>
              </LeftSection>
              <RightSection>
                <ContactInfo>{website}</ContactInfo>
                <ContactInfo>{email}</ContactInfo>
                <ContactInfo>{phone}</ContactInfo>
              </RightSection>
            </BottomSection>
          </CardFront>
          <CardBack>
            <CompanyName>{title}</CompanyName>
            <JobTitle>{subtitle}</JobTitle>
          </CardBack>
        </Card>
      </CardContainer>
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <FlipButton 
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsFlipped(!isFlipped);
          }}
        >
          {isFlipped ? 'View Front' : 'View Back'}
        </FlipButton>
        <ShareButton 
          onClick={handleShareClick}
          style={{
            position: 'static',
            transform: 'none',
            marginLeft: '10px',
            width: 'auto',
            padding: '0 15px',
            borderRadius: '4px',
            display: 'inline-flex',
            gap: '8px'
          }}
        >
          <FaShare size={14} />
          <span>Export</span>
        </ShareButton>
      </div>

      {showShare && (
        <ShareOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowShare(false);
            }
          }}
        >
          <ShareContent>
            <CloseButton onClick={() => setShowShare(false)}>
              <FaTimes />
            </CloseButton>
            <ShareTitle>Export Business Card</ShareTitle>
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <p style={{ color: '#666', marginBottom: '20px' }}>Download your business card as an image or PDF</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                <button 
                  onClick={exportAsJPEG}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    background: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    width: '120px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FaFileImage size={32} color="#3A4A5F" style={{ marginBottom: '10px' }} />
                  <span>JPEG</span>
                </button>
                
                <button 
                  onClick={exportAsPDF}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    background: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    width: '120px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <FaFilePdf size={32} color="#E74C3C" style={{ marginBottom: '10px' }} />
                  <span>PDF</span>
                </button>
              </div>
              
              <div style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
                <p>Standard business card size (3.5" x 2")</p>
                <p>High resolution (2x scale)</p>
              </div>
            </div>
          </ShareContent>
        </ShareOverlay>
      )}
    </div>
  );
};

export default BusinessCard;
