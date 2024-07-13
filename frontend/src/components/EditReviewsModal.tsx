import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useUser } from '../contexts/UserContext';
import { editReview, RestroomToPost, User } from '../services/api';

interface EditReviewModalProps {
  show: boolean;
  handleClose: () => void;
  handleEditReview: (
    review: {
      user: User;
      comment: string;
      rating: number;
      restroom: RestroomToPost;
    },
    reviewId: number
  ) => void;
  restroom: RestroomToPost;
  review_id: number;
  existingComment: string;
  existingRating: number;
}

const EditReviewModal: React.FC<EditReviewModalProps> = ({
  show,
  handleClose,
  handleEditReview,
  restroom,
  review_id,
  existingComment,
  existingRating,
}) => {
  const { user } = useUser();
  const [comment, setComment] = useState(existingComment);
  const [rating, setRating] = useState(existingRating);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    setComment(existingComment);
    setRating(existingRating);
  }, [existingComment, existingRating]);

  const handleSubmit = async () => {
    if (user && rating > 0 && comment.trim() !== '') {
      const review = { user, comment, rating, restroom };
      try {
        const editedReview = await editReview(review, review_id);
        handleEditReview(editedReview, review_id);
        handleClose();
        setComment('');
        setRating(0);
      } catch (error) {
        console.error('Error editing review:', error);
      }
    } else {
      setValidated(true);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated}>
          <Form.Group controlId='rating'>
            <Form.Label>Rating</Form.Label>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    cursor: 'pointer',
                    color: rating >= star ? 'orange' : 'gray',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            {validated && rating === 0 && (
              <Form.Control.Feedback
                type='invalid'
                style={{ display: 'block' }}
              >
                Please provide a rating.
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group controlId='comment'>
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            {validated && comment.trim() === '' && (
              <Form.Control.Feedback
                type='invalid'
                style={{ display: 'block' }}
              >
                Please provide a comment.
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Cancel
        </Button>
        <Button variant='primary' onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditReviewModal;
