import React from 'react';
import { Carousel, ListGroup } from 'react-bootstrap';
import AddReviewForm from './AddReviewForm';
import AddPhoto from './AddPhoto';

type Review = {
  user: string;
  comment: string;
};

type Photo = {
  url: string;
};

type Restroom = {
  id: number;
  name: string;
  address: string;
  photos: Photo[];
  reviews: Review[];
};

interface RestroomDetailProps {
  restroom: Restroom;
}

const RestroomDetail: React.FC<RestroomDetailProps> = ({ restroom }) => {
  const handleAddReview = (review: Review) => {
    // Update the restroom reviews list
    // This can also be done by calling a backend API to update the review
    restroom.reviews.push(review);
  };

  const handlePhotoUpload = (photoUrl: string) => {
    // Update the restroom photos list
    // This can also be done by calling a backend API to update the photo
    restroom.photos.push({ url: photoUrl });
  };

  return (
    <div>
      <h3>{restroom.name}</h3>
      <p>{restroom.address}</p>
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
      <ListGroup>
        {restroom.reviews.map((review, index) => (
          <ListGroup.Item key={index}>
            <h5>{review.user}</h5>
            <p>{review.comment}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <AddReviewForm onAddReview={handleAddReview} />
      <AddPhoto restroomId={restroom.id} onPhotoUpload={handlePhotoUpload} />
    </div>
  );
};

export default RestroomDetail;
