import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #2C3E50;
    box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.2);
  }
`;

const CardForm = ({ onCardUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    socialMedia: '',
    website: '',
    email: '',
    phone: '',
    facebook: '',
    twitter: '',
    instagram: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    onCardUpdate(newFormData);
  };

  return (
    <FormContainer>
      <h2>Customize Your Card</h2>
      <FormGroup>
        <Label>Company Name</Label>
        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <Label>Title/Position</Label>
        <Input
          type="text"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <Label>Social Media Handle (Display)</Label>
        <Input 
          type="text" 
          name="socialMedia" 
          value={formData.socialMedia}
          onChange={handleChange}
          placeholder="@yourhandle"
        />
      </FormGroup>
      <FormGroup>
        <Label>Facebook URL</Label>
        <Input 
          type="url" 
          name="facebook" 
          value={formData.facebook}
          onChange={handleChange}
          placeholder="https://facebook.com/yourprofile"
        />
      </FormGroup>
      <FormGroup>
        <Label>Twitter URL</Label>
        <Input 
          type="url" 
          name="twitter" 
          value={formData.twitter}
          onChange={handleChange}
          placeholder="https://twitter.com/yourhandle"
        />
      </FormGroup>
      <FormGroup>
        <Label>Instagram URL</Label>
        <Input 
          type="url" 
          name="instagram" 
          value={formData.instagram}
          onChange={handleChange}
          placeholder="https://instagram.com/yourhandle"
        />
      </FormGroup>
      <FormGroup>
        <Label>Website</Label>
        <Input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <Label>Phone Number</Label>
        <Input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </FormGroup>
    </FormContainer>
  );
};

export default CardForm;
