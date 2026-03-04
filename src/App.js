import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import BusinessCard from './components/BusinessCard';
import CardForm from './components/CardForm';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #0f0c29; }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  padding: 48px 20px 80px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 56px;
`;

const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

const BrandDot = styled.span`
  width: 10px; height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f6d365, #fda085);
  display: inline-block;
`;

const Title = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 0.95rem;
  font-weight: 300;
  letter-spacing: 0.5px;
  margin-top: 6px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  max-width: 1200px;
  margin: 0 auto;
  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
`;

const PreviewPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  position: sticky;
  top: 40px;
`;

const PreviewLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
`;

const FormPanel = styled.div`
  flex: 1;
  max-width: 520px;
  width: 100%;
`;

const DEFAULT_CARD = {
  name: 'Alexandra Chen',
  title: 'Creative Director',
  company: 'Vogue Studio',
  socialHandle: '@alexandrachen',
  website: 'alexandrachen.com',
  email: 'hello@alexandrachen.com',
  phone: '+1 (555) 000-1234',
  linkedin: '',
  twitter: '',
  instagram: '',
  theme: 'midnight',
  template: 'classic',
  size: 'standard',
  avatar: null,
};

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('cardStudioData');
    if (saved) return { ...DEFAULT_CARD, ...JSON.parse(saved) };
  } catch (_) {}
  return null;
}

function loadFromURL() {
  try {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const decoded = JSON.parse(atob(hash));
      return { ...DEFAULT_CARD, ...decoded };
    }
  } catch (_) {}
  return null;
}

function App() {
  const [cardData, setCardData] = useState(() => loadFromURL() || loadFromStorage() || DEFAULT_CARD);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('cardStudioData', JSON.stringify(cardData));
    } catch (_) {}
  }, [cardData]);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <Brand>
            <BrandDot />
            <Title>Card Studio</Title>
            <BrandDot />
          </Brand>
          <Subtitle>Design your professional business card</Subtitle>
        </Header>
        <Content>
          <PreviewPanel>
            <PreviewLabel>Live Preview</PreviewLabel>
            <BusinessCard data={cardData} />
          </PreviewPanel>
          <FormPanel>
            <CardForm data={cardData} onCardUpdate={setCardData} />
          </FormPanel>
        </Content>
      </AppContainer>
    </>
  );
}

export default App;
