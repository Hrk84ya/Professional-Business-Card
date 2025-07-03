import React, { useState } from 'react';
import styled from 'styled-components';
import BusinessCard from './components/BusinessCard';
import CardForm from './components/CardForm';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f0f2f5;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #2C3E50;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 992px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
`;

const CardPreview = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const FormWrapper = styled.div`
  flex: 1;
  max-width: 500px;
`;

function App() {
  const [cardData, setCardData] = useState({
    title: 'VISIONARY VOGUE',
    subtitle: 'TITLE',
    socialMedia: '@SOCIALMEDIAHANDLES',
    website: 'WWW.WEBSITE.COM',
    email: 'MYWORKGMAIL.COM',
    phone: '123-456-789',
    facebook: '',
    twitter: '',
    instagram: ''
  });

  const handleCardUpdate = (newData) => {
    setCardData(newData);
  };

  return (
    <AppContainer>
      <Header>
        <Title>Professional Card Maker</Title>
        <Subtitle>Create your custom business card</Subtitle>
      </Header>
      <Content>
        <CardPreview>
          <BusinessCard 
            title={cardData.title}
            subtitle={cardData.subtitle}
            socialMedia={cardData.socialMedia}
            website={cardData.website}
            email={cardData.email}
            phone={cardData.phone}
            facebook={cardData.facebook}
            twitter={cardData.twitter}
            instagram={cardData.instagram}
          />
        </CardPreview>
        <FormWrapper>
          <CardForm onCardUpdate={handleCardUpdate} />
        </FormWrapper>
      </Content>
    </AppContainer>
  );
}

export default App;
