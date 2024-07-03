import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

interface RestroomFormProps {
  initialData?: {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  onSubmit: (restroom: {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    photos: { url: string }[];
    reviews: { user: string; comment: string; rating: number }[];
  }) => void;
}

const RestroomForm: React.FC<RestroomFormProps> = ({ initialData, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [latitude, setLatitude] = useState<number | string>(initialData?.latitude || '');
  const [longitude, setLongitude] = useState<number | string>(initialData?.longitude || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      id: initialData?.id || 0, 
      name, 
      address, 
      latitude: Number(latitude), 
      longitude: Number(longitude), 
      photos: [], 
      reviews: [] 
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId='formName'>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId='formAddress'>
        <Form.Label>Address</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId='formLatitude'>
        <Form.Label>Latitude</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter latitude'
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId='formLongitude'>
        <Form.Label>Longitude</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter longitude'
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
      </Form.Group>
      <Button variant='primary' type='submit'>
        Submit
      </Button>
    </Form>
  );
};

export default RestroomForm;


