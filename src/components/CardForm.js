import React from 'react';
import styled from 'styled-components';
import { FaLinkedinIn, FaTwitter, FaInstagram, FaGlobe } from 'react-icons/fa';

const THEMES = [
  { id: 'midnight', label: 'Midnight', colors: ['#1a1a2e', '#e94560'] },
  { id: 'slate',    label: 'Slate',    colors: ['#2d3561', '#a8edea'] },
  { id: 'forest',   label: 'Forest',   colors: ['#134e5e', '#f6d365'] },
  { id: 'rose',     label: 'Rose',     colors: ['#f953c6', '#ffffff'] },
  { id: 'ivory',    label: 'Ivory',    colors: ['#f5f5f0', '#2c2c2c'] },
  { id: 'gold',     label: 'Gold',     colors: ['#1a1a1a', '#d4af37'] },
];

// --- Styled Components ---

const Form = styled.div`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 32px;
  backdrop-filter: blur(10px);
`;

const SectionLabel = styled.p`
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-bottom: 16px;
  margin-top: 28px;
  &:first-of-type { margin-top: 0; }
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ cols }) => cols === 2 ? '1fr 1fr' : '1fr'};
  gap: 14px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255,255,255,0.55);
  letter-spacing: 0.3px;
`;

const Input = styled.input`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 10px 14px;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #ffffff;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  width: 100%;

  &::placeholder { color: rgba(255,255,255,0.2); }

  &:focus {
    border-color: rgba(246,211,101,0.5);
    background: rgba(255,255,255,0.09);
  }
`;

const SocialField = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: rgba(246,211,101,0.5);
  }
`;

const SocialIcon = styled.div`
  padding: 0 12px;
  color: rgba(255,255,255,0.3);
  display: flex;
  align-items: center;
  border-right: 1px solid rgba(255,255,255,0.08);
  height: 40px;
`;

const SocialInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px 14px;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #ffffff;
  outline: none;
  &::placeholder { color: rgba(255,255,255,0.2); }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 24px 0 0;
`;

// Theme picker
const ThemeGrid = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ThemeSwatch = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const SwatchCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ c1 }) => c1}, ${({ c2 }) => c2});
  border: 2px solid ${({ active }) => active ? '#f6d365' : 'transparent'};
  box-shadow: ${({ active }) => active ? '0 0 0 3px rgba(246,211,101,0.25)' : 'none'};
  transition: all 0.2s;
`;

const SwatchLabel = styled.span`
  font-size: 0.62rem;
  color: rgba(255,255,255,0.4);
  font-family: 'Inter', sans-serif;
`;

// --- Component ---

const CardForm = ({ data, onCardUpdate }) => {
  const update = (field, value) => onCardUpdate({ ...data, [field]: value });

  return (
    <Form>
      <SectionLabel>Identity</SectionLabel>
      <FieldGrid>
        <Field>
          <Label>Full Name</Label>
          <Input value={data.name} onChange={e => update('name', e.target.value)} placeholder="Alexandra Chen" />
        </Field>
        <Field>
          <Label>Title / Position</Label>
          <Input value={data.title} onChange={e => update('title', e.target.value)} placeholder="Creative Director" />
        </Field>
        <Field>
          <Label>Company</Label>
          <Input value={data.company} onChange={e => update('company', e.target.value)} placeholder="Vogue Studio" />
        </Field>
        <Field>
          <Label>Social Handle</Label>
          <Input value={data.socialHandle} onChange={e => update('socialHandle', e.target.value)} placeholder="@yourhandle" />
        </Field>
      </FieldGrid>

      <Divider />
      <SectionLabel>Contact</SectionLabel>
      <FieldGrid>
        <Field>
          <Label>Email</Label>
          <Input type="email" value={data.email} onChange={e => update('email', e.target.value)} placeholder="hello@you.com" />
        </Field>
        <Field>
          <Label>Phone</Label>
          <Input type="tel" value={data.phone} onChange={e => update('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
        </Field>
        <Field style={{ gridColumn: '1 / -1' }}>
          <Label>Website</Label>
          <Input value={data.website} onChange={e => update('website', e.target.value)} placeholder="yourwebsite.com" />
        </Field>
      </FieldGrid>

      <Divider />
      <SectionLabel>Social Links</SectionLabel>
      <FieldGrid>
        <Field>
          <Label>LinkedIn</Label>
          <SocialField>
            <SocialIcon><FaLinkedinIn size={13} /></SocialIcon>
            <SocialInput value={data.linkedin} onChange={e => update('linkedin', e.target.value)} placeholder="linkedin.com/in/you" />
          </SocialField>
        </Field>
        <Field>
          <Label>Twitter / X</Label>
          <SocialField>
            <SocialIcon><FaTwitter size={13} /></SocialIcon>
            <SocialInput value={data.twitter} onChange={e => update('twitter', e.target.value)} placeholder="twitter.com/you" />
          </SocialField>
        </Field>
        <Field style={{ gridColumn: '1 / -1' }}>
          <Label>Instagram</Label>
          <SocialField>
            <SocialIcon><FaInstagram size={13} /></SocialIcon>
            <SocialInput value={data.instagram} onChange={e => update('instagram', e.target.value)} placeholder="instagram.com/you" />
          </SocialField>
        </Field>
      </FieldGrid>

      <Divider />
      <SectionLabel>Card Theme</SectionLabel>
      <ThemeGrid>
        {THEMES.map(t => (
          <ThemeSwatch key={t.id} onClick={() => update('theme', t.id)}>
            <SwatchCircle c1={t.colors[0]} c2={t.colors[1]} active={data.theme === t.id} />
            <SwatchLabel>{t.label}</SwatchLabel>
          </ThemeSwatch>
        ))}
      </ThemeGrid>
    </Form>
  );
};

export default CardForm;
