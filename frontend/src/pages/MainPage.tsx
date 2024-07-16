import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import MapComponent from '../components/MapComponent';
import RestroomList from '../components/RestroomList';
import PlacesAutocomplete from '../components/PlacesAutoComplete';
import AddReviewModal from '../components/AddReviewModal';
import {
  fetchNearbyRestrooms,
  fetchGenderNeutralRestrooms,
  getReviewsForRestroom,
  submitReview,
  Restroom,
  Review,
  RestroomToPost,
  User,
  submitRestroom,
  deleteReview,
  editReview,
} from '../services/api';
import potty1 from '../assets/MockImages/potty1.jpg';
import potty2 from '../assets/MockImages/potty2.jpg';
import potty3 from '../assets/MockImages/potty3.jpg';
import potty4 from '../assets/MockImages/potty4.jpg';
import potty5 from '../assets/MockImages/potty5.jpg';
import '../App.css';
import EditReviewModal from '../components/EditReviewsModal';
import { useUser } from '../contexts/UserContext'; // Assuming you have a user context

const MainPage: React.FC = () => {
  const { user } = useUser(); // Get current user information
  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [selectedRestroomId, setSelectedRestroomId] = useState<number | null>(
    null
  );
  const [restroomObjectToPost, setRestroomObjectToPost] =
    useState<RestroomToPost | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [showGenderNeutral, setShowGenderNeutral] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewIdToEdit, setReviewIdToEdit] = useState<number | null>(null);
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const photoGalleryRef = useRef<HTMLDivElement>(null);

  const selectedRestroom = restrooms.find(
    (restroom) => restroom.id === selectedRestroomId
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => console.error('Error fetching location', error)
    );
  }, []);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setLoading(true);
      fetchNearbyRestrooms(latitude, longitude)
        .then((data) => setRestrooms(data))
        .catch((error) => console.error('Error fetching restrooms', error))
        .finally(() => setLoading(false));
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (showGenderNeutral) {
      setLoading(true);
      fetchGenderNeutralRestrooms()
        .then((data) => setRestrooms(data))
        .catch((error) =>
          console.error('Error fetching gender-neutral restrooms', error)
        )
        .finally(() => setLoading(false));
    } else if (latitude !== null && longitude !== null) {
      setLoading(true);
      fetchNearbyRestrooms(latitude, longitude)
        .then((data) => setRestrooms(data))
        .catch((error) => console.error('Error fetching restrooms', error))
        .finally(() => setLoading(false));
    }
  }, [showGenderNeutral, latitude, longitude]);

  useEffect(() => {
    if (selectedRestroom) {
      const restroomToPost: RestroomToPost = {
        api_restroom_key: selectedRestroom.id,
        name: selectedRestroom.name,
        address: selectedRestroom.street,
        latitude: selectedRestroom.latitude,
        longitude: selectedRestroom.longitude,
      };
      setRestroomObjectToPost(restroomToPost);
      submitRestroom(restroomToPost).catch((error) => {
        console.error('Error submitting restroom:', error);
      });
    }
  }, [selectedRestroom]);

  const handleSelectRestroom = (id: number) => {
    setSelectedRestroomId(id);
    getReviewsForRestroom(id)
      .then((data) => setReviews(data))
      .catch((error) => console.error('Error fetching reviews', error));
  };

  const handleToggleGenderNeutral = () => {
    setShowGenderNeutral(!showGenderNeutral);
  };

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.geometry) {
      const newLatitude = place.geometry.location?.lat();
      const newLongitude = place.geometry.location?.lng();
      if (newLatitude !== undefined && newLongitude !== undefined) {
        setLatitude(newLatitude);
        setLongitude(newLongitude);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReview(id);
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== id)
      );
    } catch (error) {
      console.error('Error deleting review', error);
    }
  };

  const totalRating = reviews.reduce((acc, review) => {
    const rating =
      typeof review.rating === 'number'
        ? review.rating
        : parseFloat(review.rating);
    return acc + rating;
  }, 0);

  const averageRating = reviews.length
    ? (totalRating / reviews.length).toFixed(1)
    : 'No Reviews Yet';

  const handleAddReview = async (review: {
    user: User;
    comment: string;
    rating: number;
    restroom: RestroomToPost;
  }) => {
    try {
      const newReview = await submitReview(review);
      setReviews((prevReviews) => [...prevReviews, newReview]);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleEditReview = async (
    review: {
      user: User;
      comment: string;
      rating: number;
      restroom: RestroomToPost;
    },
    id: number
  ) => {
    try {
      const updatedReview = await editReview(review, id);
      setReviews((prevReviews) =>
        prevReviews.map((r) => (r.id === id ? updatedReview : r))
      );
    } catch (error) {
      console.error('Error editing review:', error);
    }
  };

  useEffect(() => {
    const photoGallery = photoGalleryRef.current;
    if (photoGallery) {
      const handleWheel = (event: WheelEvent) => {
        if (event.deltaY !== 0) {
          event.preventDefault();
          photoGallery.scrollBy({
            left: event.deltaY < 0 ? -100 : 100,
          });
        }
      };
      photoGallery.addEventListener('wheel', handleWheel);
      return () => {
        photoGallery.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          {latitude !== null && longitude !== null && (
            <MapComponent
              restrooms={restrooms}
              center={{ lat: latitude, lng: longitude }}
            />
          )}
          {loading && <Spinner animation='border' />}
        </Col>
      </Row>
      <Row>
        <Col md={4} className='mt-2'>
          <div className='location-input'>
            <h4>Enter Your Location</h4>
            <PlacesAutocomplete onPlaceSelected={handlePlaceSelected} />
            <Button variant='primary' className='mt-2'>
              Submit
            </Button>
          </div>
        </Col>
        <Col md={4} className='mt-2'>
          <RestroomList
            restrooms={restrooms}
            onSelectRestroom={handleSelectRestroom}
            onToggleGenderNeutral={handleToggleGenderNeutral}
            showGenderNeutral={showGenderNeutral}
          />
        </Col>
        <Col md={4} className='mt-2'>
          <div className='photos-reviews'>
            {selectedRestroom && (
              <>
                <h2>
                  <strong style={{ textDecoration: 'underline' }}>
                    {selectedRestroom.name}
                  </strong>
                </h2>
                <div className='reviews'>
                  <h4>Recent Reviews</h4>
                  {averageRating !== 'No Reviews Yet' ? (
                    <p>Average Rating: {averageRating}</p>
                  ) : (
                    <p>No Reviews yet</p>
                  )}

                  {reviews.length ? (
                    <ul>
                      {reviews.map((review, index) => (
                        <li key={index}>
                          <strong>{review.user.username}:</strong>{' '}
                          {review.comment}
                          {user && user.username === review.user.username && (
                            <>
                              <Button
                                variant='secondary'
                                onClick={() => {
                                  setShowEditReviewModal(true);
                                  setReviewIdToEdit(review.id);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant='danger'
                                onClick={() => handleDelete(review.id)}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              </>
            )}
            <div className='photo-gallery mt-4' ref={photoGalleryRef}>
              <img src={potty1} alt='potty1' />
              <img src={potty2} alt='potty2' />
              <img src={potty3} alt='potty3' />
              <img src={potty4} alt='potty4' />
              <img src={potty5} alt='potty5' />
            </div>
            <Button
              variant='primary'
              className='mt-2'
              disabled={!selectedRestroom}
            >
              Upload Image
            </Button>
            <Button
              variant='primary'
              className='mt-2'
              onClick={() => setShowReviewModal(true)}
              disabled={!selectedRestroom}
            >
              Upload Review
            </Button>
          </div>
        </Col>
      </Row>
      {selectedRestroom && restroomObjectToPost && (
        <AddReviewModal
          show={showReviewModal}
          handleClose={() => setShowReviewModal(false)}
          handleAddReview={handleAddReview}
          restroom={restroomObjectToPost}
        />
      )}
      {selectedRestroom && restroomObjectToPost && reviewIdToEdit && (
        <EditReviewModal
          show={showEditReviewModal}
          handleClose={() => setShowEditReviewModal(false)}
          handleEditReview={handleEditReview}
          restroom={restroomObjectToPost}
          review_id={reviewIdToEdit}
          existingComment={
            reviews.find((review) => review.id === reviewIdToEdit)?.comment ||
            ''
          }
          existingRating={
            reviews.find((review) => review.id === reviewIdToEdit)?.rating || 0
          }
        />
      )}
    </Container>
  );
};

export default MainPage;
