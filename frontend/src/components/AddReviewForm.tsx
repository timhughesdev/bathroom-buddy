import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

interface AddReviewFormProps {
  onAddReview: (review: { user: string; comment: string }) => void;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ onAddReview }) => {
  const [user, setUser] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReview({ user, comment });
    setUser('');
    setComment('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId='formUserName'>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter your name'
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId='formComment'>
        <Form.Label>Comment</Form.Label>
        <Form.Control
          as='textarea'
          rows={3}
          placeholder='Enter your comment'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Form.Group>
      <Button variant='primary' type='submit'>
        Submit
      </Button>
    </Form>
  );
};

export default AddReviewForm;
