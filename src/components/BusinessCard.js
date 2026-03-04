import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { FaLinkedinIn, FaTwitter, FaInstagram, FaGlobe, FaTimes, FaFilePdf, FaFileImage, FaDownload, FaLink, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const THEMES = {
  midnight: { front: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', accent: '#e94560', text: '#ffffff', subtext: 'rgba(255,255,255,0.6)', bottom: '#0f3460', bottomText: '#ffffff', bottomSub: 'rgba(255,255,255,0.65)', icon: '#e94560' },
  slate:    { front: 'linear-gradient(135deg, #2d3561 0%, #1b1f3b 100%)', accent: '#a8edea', text: '#ffffff', subtext: 'rgba(255,255,255,0.6)', bottom: '#232741', bottomText: '#ffffff', bottomSub: 'rgba(255,255,255,0.65)', icon: '#a8edea' },
  forest:   { front: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', accent: '#f6d365', text: '#ffffff', subtext: 'rgba(255,255,255,0.65)', bottom: '#0d3b47', bottomText: '#ffffff', bottomSub: 'rgba(255,255,255,0.65)', icon: '#f6d365' },
  rose:     { front: 'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)', accent: '#ffffff', text: '#ffffff', subtext: 'rgba(255,255,255,0.7)', bottom: '#8c1558', bottomText: '#ffffff', bottomSub: 'rgba(255,255,255,0.65)', icon: '#ffffff' },
  ivory:    { front: 'linear-gradient(135deg, #f5f5f0 0%, #e8e4dc 100%)', accent: '#2c2c2c', text: '#1a1a1a', subtext: '#666666', bottom: '#ffffff', bottomText: '#1a1a1a', bottomSub: '#888888', icon: '#2c2c2c' },
  gold:     { front: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', accent: '#d4af37', text: '#ffffff', subtext: 'rgba(255,255,255,0.6)', bottom: '#111111', bottomText: '#d4af37', bottomSub: 'rgba(212,175,55,0.7)', icon: '#d4af37' },
};

export const SIZES = {
  standard: { label: 'Standard',  w: 460, h: 260, mm: [86, 54] },
  square:   { label: 'Square',    w: 300, h: 300, mm: [70, 70] },
  euro:     { label: 'European',  w: 430, h: 242, mm: [85, 55] },
};

// ── Shared card face base ──────────────────────────────────────────────
const CardFaceBase = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 16px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0,0,0,0.45), 0 8px 20px rgba(0,0,0,0.3);
`;

// ── TEMPLATE: CLASSIC ─────────────────────────────────────────────────
const ClassicFront = styled(CardFaceBase)`
  background: ${({ $theme }) => $theme.front};
  display: flex; flex-direction: column;
`;
const ClassicTop = styled.div`
  flex: 1; display: flex; align-items: center;
  padding: ${({ $sq }) => $sq ? '20px' : '24px 28px'}; gap: 18px;
`;
const ClassicBottom = styled.div`
  background: ${({ $theme }) => $theme.bottom};
  padding: ${({ $sq }) => $sq ? '12px 20px' : '14px 28px'};
  display: flex; justify-content: space-between; align-items: center;
`;
const AccentLine = styled.div`
  height: 1px; margin: 0 28px;
  background: ${({ $theme }) => $theme.accent}; opacity: 0.25;
`;

// ── TEMPLATE: MINIMAL ─────────────────────────────────────────────────
const MinimalFront = styled(CardFaceBase)`
  background: ${({ $theme }) => $theme.front};
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  text-align: center; padding: 28px;
`;
const MinimalDivider = styled.div`
  width: 32px; height: 2px; border-radius: 2px;
  background: ${({ $theme }) => $theme.accent};
  margin: 10px auto;
`;

// ── TEMPLATE: BOLD ────────────────────────────────────────────────────
const BoldFront = styled(CardFaceBase)`
  background: ${({ $theme }) => $theme.front};
  display: flex; flex-direction: column;
`;
const BoldAccentBar = styled.div`
  width: 6px; height: 100%; position: absolute; left: 0; top: 0;
  background: ${({ $theme }) => $theme.accent};
`;
const BoldInner = styled.div`
  flex: 1; display: flex; flex-direction: column;
  justify-content: center; padding: 24px 28px 24px 36px; position: relative;
`;
const BoldContactRow = styled.div`
  background: ${({ $theme }) => $theme.bottom};
  padding: 10px 28px 10px 36px;
  display: flex; gap: 20px; align-items: center; flex-wrap: wrap;
`;

// ── TEMPLATE: COMPACT ─────────────────────────────────────────────────
const CompactFront = styled(CardFaceBase)`
  background: ${({ $theme }) => $theme.front};
  display: grid;
  grid-template-columns: 42% 58%;
`;
const CompactLeft = styled.div`
  background: ${({ $theme }) => $theme.bottom};
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  padding: 16px; gap: 8px;
`;
const CompactRight = styled.div`
  display: flex; flex-direction: column;
  justify-content: center; padding: 16px 20px; gap: 6px;
`;

// ── Shared sub-elements ───────────────────────────────────────────────
const AvatarCircle = styled.div`
  width: ${({ $size }) => $size || 52}px;
  height: ${({ $size }) => $size || 52}px;
  border-radius: 50%;
  background: ${({ $theme, $img }) => $img ? 'transparent' : $theme.accent};
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: ${({ $size }) => ($size || 52) * 0.35}px;
  font-weight: 700; color: #1a1a1a; flex-shrink: 0;
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const CardName = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: ${({ $fs }) => $fs || 1.2}rem;
  font-weight: 700; color: ${({ $theme }) => $theme.text};
  margin: 0 0 3px; line-height: 1.2;
`;
const CardJobTitle = styled.p`
  font-size: 0.7rem; font-weight: 500;
  letter-spacing: 1.5px; text-transform: uppercase;
  color: ${({ $theme }) => $theme.accent}; margin: 0 0 2px;
`;
const CardCompany = styled.p`
  font-size: 0.68rem; color: ${({ $theme }) => $theme.subtext};
  margin: 0; font-weight: 300;
`;
const ContactItem = styled.p`
  font-size: 0.62rem; color: ${({ $theme }) => $theme.bottomSub};
  margin: 0; font-weight: 400; letter-spacing: 0.3px;
`;
const SocialIconsRow = styled.div`
  display: flex; gap: 10px; align-items: center;
`;
const IconLink = styled.a`
  color: ${({ $theme }) => $theme.icon};
  display: flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border-radius: 50%;
  border: 1px solid ${({ $theme }) => $theme.icon};
  opacity: 0.85; transition: opacity 0.2s; flex-shrink: 0;
  &:hover { opacity: 1; }
`;

// ── Card back (shared) ────────────────────────────────────────────────
const CardBack = styled(CardFaceBase)`
  background: ${({ $theme }) => $theme.front};
  transform: rotateY(180deg);
  display: flex; flex-direction: column;
  justify-content: center; align-items: center; gap: 8px;
`;
const BackLine = styled.div`
  width: 40px; height: 2px; border-radius: 2px;
  background: ${({ $theme }) => $theme.accent}; margin: 4px 0;
`;
const BackName = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem; font-weight: 700;
  color: ${({ $theme }) => $theme.text}; letter-spacing: 1px;
`;
const BackTitle = styled.p`
  font-size: 0.68rem; letter-spacing: 3px; text-transform: uppercase;
  color: ${({ $theme }) => $theme.accent};
`;

// ── Scene / wrapper ───────────────────────────────────────────────────
const Wrapper = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 20px;
`;
const CardScene = styled.div`
  width: ${({ $w }) => $w}px;
  height: ${({ $h }) => $h}px;
  perspective: 1200px;
  transition: width 0.4s ease, height 0.4s ease;
  @media (max-width: 520px) {
    width: ${({ $w }) => Math.min($w, 320)}px;
    height: ${({ $h, $w }) => Math.round($h * Math.min(320, $w) / $w)}px;
  }
`;
const CardInner = styled(motion.div)`
  width: 100%; height: 100%; position: relative; transform-style: preserve-3d;
`;

// ── Buttons ───────────────────────────────────────────────────────────
const ButtonRow = styled.div`display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;`;
const Btn = styled(motion.button)`
  padding: 10px 20px; border-radius: 8px; border: none;
  font-family: 'Inter', sans-serif; font-size: 0.8rem; font-weight: 500;
  cursor: pointer; display: flex; align-items: center; gap: 8px;
`;
const FlipBtn = styled(Btn)`
  background: rgba(255,255,255,0.1); color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
  &:hover { background: rgba(255,255,255,0.18); }
`;
const ExportBtn = styled(Btn)`
  background: linear-gradient(135deg, #f6d365, #fda085); color: #1a1a1a;
`;
const ShareBtn = styled(Btn)`
  background: rgba(255,255,255,0.08); color: #fff;
  border: 1px solid rgba(255,255,255,0.15);
`;

// ── Modal ─────────────────────────────────────────────────────────────
const Overlay = styled(motion.div)`
  position: fixed; inset: 0; background: rgba(0,0,0,0.75);
  backdrop-filter: blur(6px); display: flex;
  justify-content: center; align-items: center; z-index: 9999;
`;
const Modal = styled(motion.div)`
  background: #1e1e2e; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px; padding: 36px; width: 90%; max-width: 400px; position: relative;
`;
const ModalTitle = styled.h3`
  font-family: 'Playfair Display', serif; color: #fff;
  font-size: 1.3rem; margin-bottom: 8px;
`;
const ModalSub = styled.p`color: rgba(255,255,255,0.45); font-size: 0.82rem; margin-bottom: 28px;`;
const ExportOptions = styled.div`display: flex; gap: 16px; justify-content: center;`;
const ExportOption = styled.button`
  flex: 1; padding: 20px 16px; border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04);
  color: #fff; cursor: pointer; display: flex; flex-direction: column;
  align-items: center; gap: 10px; font-family: 'Inter', sans-serif;
  font-size: 0.8rem; font-weight: 500; transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
`;
const CloseBtn = styled.button`
  position: absolute; top: 16px; right: 16px;
  background: rgba(255,255,255,0.08); border: none;
  color: rgba(255,255,255,0.5); width: 30px; height: 30px;
  border-radius: 50%; cursor: pointer; display: flex;
  align-items: center; justify-content: center;
  &:hover { color: #fff; background: rgba(255,255,255,0.15); }
`;
const ShareUrlBox = styled.div`
  display: flex; gap: 0; margin-top: 8px;
  input {
    flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
    border-right: none; border-radius: 8px 0 0 8px; padding: 10px 14px;
    color: #fff; font-size: 0.78rem; font-family: 'Inter', sans-serif; outline: none;
  }
  button {
    background: linear-gradient(135deg, #f6d365, #fda085); border: none;
    border-radius: 0 8px 8px 0; padding: 0 16px; cursor: pointer;
    color: #1a1a1a; font-weight: 600; display: flex; align-items: center; gap: 6px;
    font-size: 0.78rem; transition: opacity 0.2s;
    &:hover { opacity: 0.9; }
  }
`;

// ── Helpers ───────────────────────────────────────────────────────────
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function buildShareURL(data) {
  try {
    // exclude avatar from URL (too large)
    const { avatar, ...rest } = data;
    return `${window.location.origin}${window.location.pathname}#${btoa(JSON.stringify(rest))}`;
  } catch (_) { return window.location.href; }
}

// ── Template renderers ────────────────────────────────────────────────
function AvatarEl({ data, theme, size = 52 }) {
  return (
    <AvatarCircle $theme={theme} $size={size} $img={!!data.avatar}>
      {data.avatar ? <img src={data.avatar} alt="avatar" /> : getInitials(data.name)}
    </AvatarCircle>
  );
}

function SocialLinks({ data, theme }) {
  const links = [
    data.linkedin  && { href: data.linkedin,  icon: <FaLinkedinIn size={10} /> },
    data.twitter   && { href: data.twitter,   icon: <FaTwitter size={10} /> },
    data.instagram && { href: data.instagram, icon: <FaInstagram size={10} /> },
    data.website   && { href: data.website.startsWith('http') ? data.website : `https://${data.website}`, icon: <FaGlobe size={10} /> },
  ].filter(Boolean);
  if (!links.length) return null;
  return (
    <SocialIconsRow>
      {links.map((s, i) => (
        <IconLink key={i} href={s.href} target="_blank" rel="noopener noreferrer" $theme={theme}>
          {s.icon}
        </IconLink>
      ))}
    </SocialIconsRow>
  );
}

function TemplateClassic({ data, theme, sq }) {
  return (
    <ClassicFront $theme={theme}>
      <ClassicTop $sq={sq}>
        <AvatarEl data={data} theme={theme} size={sq ? 48 : 54} />
        <div>
          <CardName $theme={theme} $fs={sq ? 1.05 : 1.2}>{data.name || 'Your Name'}</CardName>
          <CardJobTitle $theme={theme}>{data.title || 'Title'}</CardJobTitle>
          <CardCompany $theme={theme}>{data.company || 'Company'}</CardCompany>
        </div>
      </ClassicTop>
      <AccentLine $theme={theme} />
      <ClassicBottom $theme={theme} $sq={sq}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {data.email   && <ContactItem $theme={theme}>{data.email}</ContactItem>}
          {data.phone   && <ContactItem $theme={theme}>{data.phone}</ContactItem>}
          {data.website && <ContactItem $theme={theme}>{data.website}</ContactItem>}
        </div>
        <SocialLinks data={data} theme={theme} />
      </ClassicBottom>
    </ClassicFront>
  );
}

function TemplateMinimal({ data, theme }) {
  return (
    <MinimalFront $theme={theme}>
      <CardName $theme={theme} $fs={1.35} style={{ textAlign: 'center' }}>{data.name || 'Your Name'}</CardName>
      <MinimalDivider $theme={theme} />
      <CardJobTitle $theme={theme} style={{ textAlign: 'center', marginBottom: 4 }}>{data.title || 'Title'}</CardJobTitle>
      <CardCompany $theme={theme} style={{ textAlign: 'center', marginBottom: 14 }}>{data.company || 'Company'}</CardCompany>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        {data.email   && <ContactItem $theme={theme}>{data.email}</ContactItem>}
        {data.phone   && <ContactItem $theme={theme}>{data.phone}</ContactItem>}
        {data.website && <ContactItem $theme={theme}>{data.website}</ContactItem>}
      </div>
      <div style={{ marginTop: 14 }}>
        <SocialLinks data={data} theme={theme} />
      </div>
    </MinimalFront>
  );
}

function TemplateBold({ data, theme }) {
  return (
    <BoldFront $theme={theme}>
      <BoldAccentBar $theme={theme} />
      <BoldInner>
        <CardName $theme={theme} $fs={1.5} style={{ marginBottom: 6 }}>{data.name || 'Your Name'}</CardName>
        <CardJobTitle $theme={theme} style={{ marginBottom: 4 }}>{data.title || 'Title'}</CardJobTitle>
        <CardCompany $theme={theme}>{data.company || 'Company'}</CardCompany>
      </BoldInner>
      <BoldContactRow $theme={theme}>
        {data.email   && <ContactItem $theme={theme}>{data.email}</ContactItem>}
        {data.phone   && <ContactItem $theme={theme}>{data.phone}</ContactItem>}
        <div style={{ marginLeft: 'auto' }}><SocialLinks data={data} theme={theme} /></div>
      </BoldContactRow>
    </BoldFront>
  );
}

function TemplateCompact({ data, theme }) {
  return (
    <CompactFront $theme={theme}>
      <CompactLeft $theme={theme}>
        <AvatarEl data={data} theme={theme} size={56} />
        <SocialLinks data={data} theme={theme} />
      </CompactLeft>
      <CompactRight>
        <CardName $theme={theme} $fs={1.05}>{data.name || 'Your Name'}</CardName>
        <CardJobTitle $theme={theme}>{data.title || 'Title'}</CardJobTitle>
        <CardCompany $theme={theme} style={{ marginBottom: 10 }}>{data.company || 'Company'}</CardCompany>
        {data.email   && <ContactItem $theme={theme}>{data.email}</ContactItem>}
        {data.phone   && <ContactItem $theme={theme}>{data.phone}</ContactItem>}
        {data.website && <ContactItem $theme={theme}>{data.website}</ContactItem>}
      </CompactRight>
    </CompactFront>
  );
}

// ── Main component ────────────────────────────────────────────────────
const BusinessCard = ({ data }) => {
  const [isFlipped, setIsFlipped]     = useState(false);
  const [showExport, setShowExport]   = useState(false);
  const [showShare, setShowShare]     = useState(false);
  const [copied, setCopied]           = useState(false);
  const cardFrontRef = useRef();

  const theme    = THEMES[data.theme]    || THEMES.midnight;
  const sizeConf = SIZES[data.size]      || SIZES.standard;
  const sq       = data.size === 'square';

  const captureCard = async () => {
    return html2canvas(cardFrontRef.current, {
      scale: 3, useCORS: true, backgroundColor: null, logging: false,
    });
  };

  const exportJPEG = async () => {
    const canvas = await captureCard();
    const link = document.createElement('a');
    link.download = `${(data.name || 'card').toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  const exportPDF = async () => {
    const canvas = await captureCard();
    const [mmW, mmH] = sizeConf.mm;
    const pdf = new jsPDF({ orientation: mmW > mmH ? 'landscape' : 'portrait', unit: 'mm', format: [mmW, mmH] });
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, mmW, mmH);
    pdf.save(`${(data.name || 'card').toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildShareURL(data)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const renderFront = () => {
    switch (data.template) {
      case 'minimal':  return <TemplateMinimal data={data} theme={theme} />;
      case 'bold':     return <TemplateBold    data={data} theme={theme} />;
      case 'compact':  return <TemplateCompact data={data} theme={theme} />;
      default:         return <TemplateClassic data={data} theme={theme} sq={sq} />;
    }
  };


  return (
    <Wrapper>
      <CardScene $w={sizeConf.w} $h={sizeConf.h}>
        <CardInner
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front — cloned ref for html2canvas */}
          <div ref={cardFrontRef} style={{ position: 'absolute', inset: 0 }}>
            {renderFront()}
          </div>

          <CardBack $theme={theme}>
            <BackLine $theme={theme} />
            <BackName $theme={theme}>{data.name || 'Your Name'}</BackName>
            <BackTitle $theme={theme}>{data.company || 'Company'}</BackTitle>
            <BackLine $theme={theme} />
          </CardBack>
        </CardInner>
      </CardScene>

      <ButtonRow>
        <FlipBtn whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setIsFlipped(f => !f)}>
          {isFlipped ? 'View Front' : 'View Back'}
        </FlipBtn>
        <ShareBtn whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowShare(true)}>
          <FaLink size={11} /> Share
        </ShareBtn>
        <ExportBtn whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowExport(true)}>
          <FaDownload size={11} /> Export
        </ExportBtn>
      </ButtonRow>

      {/* Export modal */}
      {ReactDOM.createPortal(
        <AnimatePresence>
          {showExport && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={e => e.target === e.currentTarget && setShowExport(false)}>
              <Modal initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }} transition={{ duration: 0.2 }}>
                <CloseBtn onClick={() => setShowExport(false)}><FaTimes size={12} /></CloseBtn>
                <ModalTitle>Export Card</ModalTitle>
                <ModalSub>Download in your preferred format · {sizeConf.label} size</ModalSub>
                <ExportOptions>
                  <ExportOption onClick={exportJPEG}>
                    <FaFileImage size={28} color="#a8edea" />JPEG Image
                  </ExportOption>
                  <ExportOption onClick={exportPDF}>
                    <FaFilePdf size={28} color="#f6a0a0" />PDF File
                  </ExportOption>
                </ExportOptions>
              </Modal>
            </Overlay>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Share modal */}
      {ReactDOM.createPortal(
        <AnimatePresence>
          {showShare && (
            <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={e => e.target === e.currentTarget && setShowShare(false)}>
              <Modal initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }} transition={{ duration: 0.2 }}>
                <CloseBtn onClick={() => setShowShare(false)}><FaTimes size={12} /></CloseBtn>
                <ModalTitle>Share Card</ModalTitle>
                <ModalSub>Anyone with this link can view your card design</ModalSub>
                <ShareUrlBox>
                  <input readOnly value={buildShareURL(data)} onClick={e => e.target.select()} />
                  <button onClick={handleCopy}>
                    {copied ? <FaCheck size={12} /> : <FaLink size={12} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </ShareUrlBox>
              </Modal>
            </Overlay>
          )}
        </AnimatePresence>,
        document.body
      )}
    </Wrapper>
  );
};

export default BusinessCard;
