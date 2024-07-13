import React from 'react';
import { Carousel, ListGroup } from 'react-bootstrap';
import AddReviewForm from './AddReviewForm';
import AddPhoto from './AddPhoto';

type Review = {
  user: string;
  comment: string;
  rating: number;
};

type Photo = {
  url: string;
};

type Restroom = {
  id: number;
  api_restroom_key: number;
  name: string;
  address: string;
  photos: Photo[];
  reviews: Review[];
};

interface RestroomDetailProps {
  restroom: Restroom | null;
}

const RestroomDetail: React.FC<RestroomDetailProps> = ({ restroom }) => {
  if (!restroom) {
    return <p>No restroom selected.</p>;
  }

  const handleAddReview = (review: Review) => {
    if (restroom) {
      restroom.reviews.push(review);
    }
  };

  const handlePhotoUpload = (photoUrl: string) => {
    if (restroom) {
      restroom.photos.push({ url: photoUrl });
    }
  };

  const averageRating =
    restroom.reviews && restroom.reviews.length
      ? (
          restroom.reviews.reduce((acc, review) => acc + review.rating, 0) /
          restroom.reviews.length
        ).toFixed(1)
      : null;

  return (
    <div>
      <h3>{restroom.name}</h3>
      <p>{restroom.address}</p>
      {restroom.photos && restroom.photos.length > 0 ? (
        <Carousel>
          {restroom.photos.map((photo, index) => (
            <Carousel.Item key={index}>
              <img
                className='d-block w-100'
                src={photo.url}
                alt={`Photo ${index + 1}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p>No image available.</p>
      )}
      <div>
        <h4>
          Average Rating: {averageRating ? averageRating : 'No reviews yet'}
        </h4>
        <ListGroup>
          {restroom.reviews && restroom.reviews.length ? (
            restroom.reviews.map((review, index) => (
              <ListGroup.Item key={index}>
                <h5>{review.user}</h5>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </ListGroup>
      </div>
      <AddReviewForm onAddReview={handleAddReview} />
      <AddPhoto restroomId={restroom.id} onPhotoUpload={handlePhotoUpload} />
    </div>
  );
};

export default RestroomDetail;
