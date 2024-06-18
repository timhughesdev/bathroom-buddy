import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

interface AddPhotoProps {
  restroomId: number;
  onPhotoUpload: (photoUrl: string) => void;
}

const AddPhoto: React.FC<AddPhotoProps> = ({ restroomId, onPhotoUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('restroomId', restroomId.toString());

    try {
      const response = await axios.post(
        'https://api.your-backend.com/upload-photo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      onPhotoUpload(response.data.photoUrl);
      setFile(null);
    } catch (err) {
      setError('Error uploading photo');
      console.error('Error uploading photo', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId='formFile'>
        <Form.Label>Upload Photo</Form.Label>
        <Form.Control type='file' onChange={handleFileChange} />
      </Form.Group>
      {error && <p className='text-danger'>{error}</p>}
      <Button variant='primary' type='submit' disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </Form>
  );
};

export default AddPhoto;
