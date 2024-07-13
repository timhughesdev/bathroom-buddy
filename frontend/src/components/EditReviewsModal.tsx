import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useUser } from '../contexts/UserContext';
import { editReview, RestroomToPost, submitReview,  User } from '../services/api';

interface EditReviewModalProps {
  show: boolean;
  handleClose: () => void;
  handleAddReview: (review: { user: User; comment: string; rating: number; restroom: RestroomToPost }) => void;
  restroom: RestroomToPost;
  review_id: number;
}

const EditReviewModal: React.FC<EditReviewModalProps> = ({ show, handleClose, handleAddReview, restroom, review_id}) => {
  const { user } = useUser();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    if (user) {
      const review = { user, comment, rating, restroom }; // user is of type User
      console.log(review);
      try {
        const editedReview = await editReview(review, review_id);
        handleAddReview(editedReview);
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
        <Modal.Title>Edit Review</Modal.Title>
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

export default EditReviewModal;