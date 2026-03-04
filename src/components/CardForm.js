import React, { useRef } from 'react';
import styled from 'styled-components';
import { FaLinkedinIn, FaTwitter, FaInstagram, FaUpload, FaTimes } from 'react-icons/fa';

const THEMES = [
  { id: 'midnight', label: 'Midnight', colors: ['#1a1a2e', '#e94560'] },
  { id: 'slate',    label: 'Slate',    colors: ['#2d3561', '#a8edea'] },
  { id: 'forest',   label: 'Forest',   colors: ['#134e5e', '#f6d365'] },
  { id: 'rose',     label: 'Rose',     colors: ['#f953c6', '#ffffff'] },
  { id: 'ivory',    label: 'Ivory',    colors: ['#f5f5f0', '#2c2c2c'] },
  { id: 'gold',     label: 'Gold',     colors: ['#1a1a1a', '#d4af37'] },
];

const TEMPLATES = [
  { id: 'classic', label: 'Classic',  desc: 'Avatar + split bottom' },
  { id: 'minimal', label: 'Minimal',  desc: 'Centered, text-only' },
  { id: 'bold',    label: 'Bold',     desc: 'Large name, accent bar' },
  { id: 'compact', label: 'Compact',  desc: 'Two-column layout' },
];

const SIZES = [
  { id: 'standard', label: 'Standard', sub: '3.5 × 2 in' },
  { id: 'square',   label: 'Square',   sub: '2.5 × 2.5 in' },
  { id: 'euro',     label: 'European', sub: '3.35 × 2.17 in' },
];

// ── Styled components ─────────────────────────────────────────────────
const Form = styled.div`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px; padding: 32px;
  backdrop-filter: blur(10px);
`;
const SectionLabel = styled.p`
  font-size: 0.68rem; font-weight: 600; letter-spacing: 2px;
  text-transform: uppercase; color: rgba(255,255,255,0.35);
  margin-bottom: 16px; margin-top: 28px;
  &:first-of-type { margin-top: 0; }
`;
const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $cols }) => $cols === 2 ? '1fr 1fr' : '1fr'};
  gap: 14px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;
const Field = styled.div`display: flex; flex-direction: column; gap: 6px;`;
const Label = styled.label`font-size: 0.75rem; font-weight: 500; color: rgba(255,255,255,0.55);`;
const Input = styled.input`
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; padding: 10px 14px; font-family: 'Inter', sans-serif;
  font-size: 0.85rem; color: #fff; outline: none; width: 100%;
  transition: border-color 0.2s, background 0.2s;
  &::placeholder { color: rgba(255,255,255,0.2); }
  &:focus { border-color: rgba(246,211,101,0.5); background: rgba(255,255,255,0.09); }
`;
const SocialField = styled.div`
  display: flex; align-items: center;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; overflow: hidden;
  &:focus-within { border-color: rgba(246,211,101,0.5); }
`;
const SocialIcon = styled.div`
  padding: 0 12px; color: rgba(255,255,255,0.3);
  display: flex; align-items: center;
  border-right: 1px solid rgba(255,255,255,0.08); height: 40px;
`;
const SocialInput = styled.input`
  flex: 1; background: transparent; border: none;
  padding: 10px 14px; font-family: 'Inter', sans-serif;
  font-size: 0.85rem; color: #fff; outline: none;
  &::placeholder { color: rgba(255,255,255,0.2); }
`;
const Divider = styled.div`height: 1px; background: rgba(255,255,255,0.06); margin: 24px 0 0;`;

// Theme swatches
const ThemeGrid = styled.div`display: flex; gap: 10px; flex-wrap: wrap;`;
const ThemeSwatch = styled.button`
  display: flex; flex-direction: column; align-items: center;
  gap: 6px; background: none; border: none; cursor: pointer; padding: 0;
`;
const SwatchCircle = styled.div`
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, ${({ $c1 }) => $c1}, ${({ $c2 }) => $c2});
  border: 2px solid ${({ $active }) => $active ? '#f6d365' : 'transparent'};
  box-shadow: ${({ $active }) => $active ? '0 0 0 3px rgba(246,211,101,0.25)' : 'none'};
  transition: all 0.2s;
`;
const SwatchLabel = styled.span`font-size: 0.62rem; color: rgba(255,255,255,0.4); font-family: 'Inter', sans-serif;`;

// Template cards
const TemplateGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 10px;`;
const TemplateCard = styled.button`
  background: ${({ $active }) => $active ? 'rgba(246,211,101,0.12)' : 'rgba(255,255,255,0.04)'};
  border: 1px solid ${({ $active }) => $active ? 'rgba(246,211,101,0.5)' : 'rgba(255,255,255,0.1)'};
  border-radius: 10px; padding: 12px 14px; cursor: pointer; text-align: left;
  transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.08); }
`;
const TemplateName = styled.p`font-size: 0.82rem; font-weight: 600; color: #fff; margin: 0 0 3px;`;
const TemplateDesc = styled.p`font-size: 0.68rem; color: rgba(255,255,255,0.4); margin: 0;`;

// Size pills
const SizeRow = styled.div`display: flex; gap: 10px; flex-wrap: wrap;`;
const SizePill = styled.button`
  background: ${({ $active }) => $active ? 'rgba(246,211,101,0.12)' : 'rgba(255,255,255,0.04)'};
  border: 1px solid ${({ $active }) => $active ? 'rgba(246,211,101,0.5)' : 'rgba(255,255,255,0.1)'};
  border-radius: 8px; padding: 8px 16px; cursor: pointer; transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.08); }
`;
const SizeName = styled.p`font-size: 0.8rem; font-weight: 600; color: #fff; margin: 0 0 2px;`;
const SizeSub  = styled.p`font-size: 0.65rem; color: rgba(255,255,255,0.4); margin: 0;`;

// Avatar upload
const AvatarUploadArea = styled.div`
  display: flex; align-items: center; gap: 16px;
`;
const AvatarPreview = styled.div`
  width: 64px; height: 64px; border-radius: 50%; overflow: hidden;
  background: rgba(255,255,255,0.08); border: 2px dashed rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
`;
const AvatarInitials = styled.span`
  font-family: 'Playfair Display', serif; font-size: 1.2rem;
  font-weight: 700; color: rgba(255,255,255,0.3);
`;
const UploadBtn = styled.label`
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px; padding: 9px 16px; cursor: pointer; color: rgba(255,255,255,0.7);
  font-size: 0.8rem; font-family: 'Inter', sans-serif; transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.1); }
  input { display: none; }
`;
const RemoveAvatarBtn = styled.button`
  background: none; border: none; color: rgba(255,255,255,0.3);
  cursor: pointer; font-size: 0.75rem; display: flex; align-items: center; gap: 4px;
  padding: 4px 0; font-family: 'Inter', sans-serif;
  &:hover { color: rgba(255,255,255,0.6); }
`;

// ── Component ─────────────────────────────────────────────────────────
const CardForm = ({ data, onCardUpdate }) => {
  const fileInputRef = useRef();
  const update = (field, value) => onCardUpdate({ ...data, [field]: value });

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => update('avatar', ev.target.result);
    reader.readAsDataURL(file);
  };

  const initials = (data.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Form>
      {/* ── Identity ── */}
      <SectionLabel>Identity</SectionLabel>
      <FieldGrid $cols={2}>
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

      {/* ── Avatar ── */}
      <Divider />
      <SectionLabel>Avatar / Logo</SectionLabel>
      <AvatarUploadArea>
        <AvatarPreview>
          {data.avatar
            ? <img src={data.avatar} alt="avatar" />
            : <AvatarInitials>{initials}</AvatarInitials>
          }
        </AvatarPreview>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <UploadBtn>
            <FaUpload size={12} /> Upload Photo
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} />
          </UploadBtn>
          {data.avatar && (
            <RemoveAvatarBtn onClick={() => update('avatar', null)}>
              <FaTimes size={10} /> Remove
            </RemoveAvatarBtn>
          )}
        </div>
      </AvatarUploadArea>

      {/* ── Contact ── */}
      <Divider />
      <SectionLabel>Contact</SectionLabel>
      <FieldGrid $cols={2}>
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

      {/* ── Social ── */}
      <Divider />
      <SectionLabel>Social Links</SectionLabel>
      <FieldGrid $cols={2}>
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

      {/* ── Template ── */}
      <Divider />
      <SectionLabel>Card Template</SectionLabel>
      <TemplateGrid>
        {TEMPLATES.map(t => (
          <TemplateCard key={t.id} $active={data.template === t.id} onClick={() => update('template', t.id)}>
            <TemplateName>{t.label}</TemplateName>
            <TemplateDesc>{t.desc}</TemplateDesc>
          </TemplateCard>
        ))}
      </TemplateGrid>

      {/* ── Theme ── */}
      <Divider />
      <SectionLabel>Color Theme</SectionLabel>
      <ThemeGrid>
        {THEMES.map(t => (
          <ThemeSwatch key={t.id} onClick={() => update('theme', t.id)}>
            <SwatchCircle $c1={t.colors[0]} $c2={t.colors[1]} $active={data.theme === t.id} />
            <SwatchLabel>{t.label}</SwatchLabel>
          </ThemeSwatch>
        ))}
      </ThemeGrid>

      {/* ── Size ── */}
      <Divider />
      <SectionLabel>Card Size</SectionLabel>
      <SizeRow>
        {SIZES.map(s => (
          <SizePill key={s.id} $active={data.size === s.id} onClick={() => update('size', s.id)}>
            <SizeName>{s.label}</SizeName>
            <SizeSub>{s.sub}</SizeSub>
          </SizePill>
        ))}
      </SizeRow>
    </Form>
  );
};

export default CardForm;
