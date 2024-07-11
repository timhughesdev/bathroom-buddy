import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useUser } from '../contexts/UserContext';
import { RestroomToPost, submitReview, User } from '../services/api';

interface AddReviewModalProps {
  show: boolean;
  handleClose: () => void;
  handleAddReview: (review: { user: User; comment: string; rating: number; restroom: RestroomToPost }) => void;
  restroom: RestroomToPost;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({ show, handleClose, handleAddReview, restroom }) => {
  const { user } = useUser();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    if (user) {
      const review = { user: { username: user.username }, comment, rating, restroom }; // Ensure user is of type User
      console.log(review);
      try {
        const submittedReview = await submitReview(review);
        handleAddReview(submittedReview);
        handleClose();
        setComment('');
        setRating(0);
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="rating">
            <Form.Label>Rating</Form.Label>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{ cursor: 'pointer', color: rating >= star ? 'orange' : 'gray' }}
                >
                  ★
                </span>
              ))}
            </div>
          </Form.Group>
          <Form.Group controlId="comment">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddReviewModal;







