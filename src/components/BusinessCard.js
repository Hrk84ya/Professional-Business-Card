import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaLinkedinIn, FaTwitter, FaInstagram, FaGlobe, FaTimes, FaFilePdf, FaFileImage, FaDownload } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const THEMES = {
  midnight: {
    front: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    accent: '#e94560',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.6)',
    bottom: '#0f3460',
    bottomText: '#ffffff',
    bottomSub: 'rgba(255,255,255,0.65)',
    icon: '#e94560',
  },
  slate: {
    front: 'linear-gradient(135deg, #2d3561 0%, #1b1f3b 100%)',
    accent: '#a8edea',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.6)',
    bottom: '#232741',
    bottomText: '#ffffff',
    bottomSub: 'rgba(255,255,255,0.65)',
    icon: '#a8edea',
  },
  forest: {
    front: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    accent: '#f6d365',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.65)',
    bottom: '#0d3b47',
    bottomText: '#ffffff',
    bottomSub: 'rgba(255,255,255,0.65)',
    icon: '#f6d365',
  },
  rose: {
    front: 'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)',
    accent: '#ffffff',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.7)',
    bottom: '#8c1558',
    bottomText: '#ffffff',
    bottomSub: 'rgba(255,255,255,0.65)',
    icon: '#ffffff',
  },
  ivory: {
    front: 'linear-gradient(135deg, #f5f5f0 0%, #e8e4dc 100%)',
    accent: '#2c2c2c',
    text: '#1a1a1a',
    subtext: '#666666',
    bottom: '#ffffff',
    bottomText: '#1a1a1a',
    bottomSub: '#888888',
    icon: '#2c2c2c',
  },
  gold: {
    front: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    accent: '#d4af37',
    text: '#ffffff',
    subtext: 'rgba(255,255,255,0.6)',
    bottom: '#111111',
    bottomText: '#d4af37',
    bottomSub: 'rgba(212,175,55,0.7)',
    icon: '#d4af37',
  },
};

// --- Styled Components ---

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const CardScene = styled.div`
  width: 460px;
  height: 260px;
  perspective: 1200px;

  @media (max-width: 520px) {
    width: 340px;
    height: 192px;
  }
`;

const CardInner = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
`;

const CardFace = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 16px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0,0,0,0.45), 0 8px 20px rgba(0,0,0,0.3);
`;

const CardFront = styled(CardFace).attrs(() => ({}))`
  background: ${({ theme }) => theme.front};
  display: flex;
  flex-direction: column;
`;

const CardBack = styled(CardFace)`
  background: ${({ theme }) => theme.front};
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const TopSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 24px 28px;
  gap: 18px;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.id === 'ivory' ? '#1a1a1a' : '#1a1a1a'};
  flex-shrink: 0;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
`;

const NameBlock = styled.div`
  flex: 1;
`;

const CardName = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0 0 4px 0;
  line-height: 1.2;
`;

const CardTitle = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.accent};
  margin: 0 0 2px 0;
`;

const CardCompany = styled.p`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.subtext};
  margin: 0;
  font-weight: 300;
`;

const AccentLine = styled.div`
  height: 1px;
  margin: 0 28px;
  background: ${({ theme }) => theme.accent};
  opacity: 0.25;
`;

const BottomSection = styled.div`
  background: ${({ theme }) => theme.bottom};
  padding: 14px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContactBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const ContactItem = styled.p`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.bottomSub};
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.3px;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const IconLink = styled.a`
  color: ${({ theme }) => theme.icon};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.icon};
  opacity: 0.85;
  transition: opacity 0.2s;
  &:hover { opacity: 1; }
`;

// Back face
const BackName = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  letter-spacing: 1px;
`;

const BackTitle = styled.p`
  font-size: 0.7rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.accent};
`;

const BackLine = styled.div`
  width: 40px;
  height: 2px;
  background: ${({ theme }) => theme.accent};
  border-radius: 2px;
  margin: 4px 0;
`;

// Buttons
const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
`;

const Btn = styled(motion.button)`
  padding: 10px 22px;
  border-radius: 8px;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
`;

const FlipBtn = styled(Btn)`
  background: rgba(255,255,255,0.1);
  color: #ffffff;
  border: 1px solid rgba(255,255,255,0.2);
  &:hover { background: rgba(255,255,255,0.18); }
`;

const ExportBtn = styled(Btn)`
  background: linear-gradient(135deg, #f6d365, #fda085);
  color: #1a1a1a;
  &:hover { opacity: 0.9; }
`;

// Modal
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled(motion.div)`
  background: #1e1e2e;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 36px;
  width: 90%;
  max-width: 380px;
  position: relative;
`;

const ModalTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  color: #ffffff;
  font-size: 1.3rem;
  margin-bottom: 8px;
`;

const ModalSub = styled.p`
  color: rgba(255,255,255,0.45);
  font-size: 0.82rem;
  margin-bottom: 28px;
`;

const ExportOptions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const ExportOption = styled.button`
  flex: 1;
  padding: 20px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s;
  &:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.25);
    transform: translateY(-2px);
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255,255,255,0.08);
  border: none;
  color: rgba(255,255,255,0.5);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { color: #fff; background: rgba(255,255,255,0.15); }
`;

// --- Component ---

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const BusinessCard = ({ data }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const cardFrontRef = useRef();

  const theme = THEMES[data.theme] || THEMES.midnight;

  const socialLinks = [
    data.linkedin && { href: data.linkedin, icon: <FaLinkedinIn size={11} /> },
    data.twitter && { href: data.twitter, icon: <FaTwitter size={11} /> },
    data.instagram && { href: data.instagram, icon: <FaInstagram size={11} /> },
    data.website && { href: data.website.startsWith('http') ? data.website : `https://${data.website}`, icon: <FaGlobe size={11} /> },
  ].filter(Boolean);

  const captureCard = async () => {
    const canvas = await html2canvas(cardFrontRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
    return canvas;
  };

  const exportJPEG = async () => {
    const canvas = await captureCard();
    const link = document.createElement('a');
    link.download = `${(data.name || 'business-card').toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  const exportPDF = async () => {
    const canvas = await captureCard();
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [86, 54] });
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'JPEG', 0, 0, w, h);
    pdf.save(`${(data.name || 'business-card').toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <Wrapper>
      <CardScene>
        <CardInner
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <CardFront theme={theme} ref={cardFrontRef}>
            <TopSection>
              <Avatar theme={theme}>{getInitials(data.name)}</Avatar>
              <NameBlock>
                <CardName theme={theme}>{data.name || 'Your Name'}</CardName>
                <CardTitle theme={theme}>{data.title || 'Title / Position'}</CardTitle>
                <CardCompany theme={theme}>{data.company || 'Company Name'}</CardCompany>
              </NameBlock>
            </TopSection>
            <AccentLine theme={theme} />
            <BottomSection theme={theme}>
              <ContactBlock>
                {data.email && <ContactItem theme={theme}>{data.email}</ContactItem>}
                {data.phone && <ContactItem theme={theme}>{data.phone}</ContactItem>}
                {data.website && <ContactItem theme={theme}>{data.website}</ContactItem>}
              </ContactBlock>
              {socialLinks.length > 0 && (
                <SocialIcons>
                  {socialLinks.map((s, i) => (
                    <IconLink key={i} href={s.href} target="_blank" rel="noopener noreferrer" theme={theme}>
                      {s.icon}
                    </IconLink>
                  ))}
                </SocialIcons>
              )}
            </BottomSection>
          </CardFront>

          <CardBack theme={theme}>
            <BackLine theme={theme} />
            <BackName theme={theme}>{data.name || 'Your Name'}</BackName>
            <BackTitle theme={theme}>{data.company || 'Company'}</BackTitle>
            <BackLine theme={theme} />
          </CardBack>
        </CardInner>
      </CardScene>

      <ButtonRow>
        <FlipBtn
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsFlipped(f => !f)}
        >
          {isFlipped ? 'View Front' : 'View Back'}
        </FlipBtn>
        <ExportBtn
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowExport(true)}
        >
          <FaDownload size={12} /> Export
        </ExportBtn>
      </ButtonRow>

      <AnimatePresence>
        {showExport && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setShowExport(false)}
          >
            <Modal
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <CloseBtn onClick={() => setShowExport(false)}><FaTimes size={12} /></CloseBtn>
              <ModalTitle>Export Card</ModalTitle>
              <ModalSub>Download your card in your preferred format</ModalSub>
              <ExportOptions>
                <ExportOption onClick={exportJPEG}>
                  <FaFileImage size={28} color="#a8edea" />
                  JPEG Image
                </ExportOption>
                <ExportOption onClick={exportPDF}>
                  <FaFilePdf size={28} color="#f6a0a0" />
                  PDF File
                </ExportOption>
              </ExportOptions>
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

export default BusinessCard;
