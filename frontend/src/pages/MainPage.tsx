import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import MapComponent from '../components/MapComponent';
import RestroomList from '../components/RestroomList';
import RestroomDetail from '../components/RestroomDetail';
import PlacesAutocomplete from '../components/PlacesAutoComplete';
import AddReviewModal from '../components/AddReviewModal';
import { useUser } from '../contexts/UserContext';
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
const MainPage: React.FC = () => {
  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [selectedRestroomId, setSelectedRestroomId] = useState<number | null>(
    null
  );
  const [restroomObjectToPost, setRestroomObjectToPost] =
    useState<RestroomToPost | null>(null); // Initialize as null
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [showGenderNeutral, setShowGenderNeutral] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewIdToEdit, setReviewIdToEdit] = useState<number | null>(null);
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const { user } = useUser(); // Get the user from context
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
      fetchNearbyRestrooms(latitude, longitude)
        .then((data) => setRestrooms(data))
        .catch((error) => console.error('Error fetching restrooms', error));
    }
  }, [latitude, longitude]);
  useEffect(() => {
    if (showGenderNeutral) {
      fetchGenderNeutralRestrooms()
        .then((data) => setRestrooms(data))
        .catch((error) =>
          console.error('Error fetching gender-neutral restrooms', error)
        );
    } else if (latitude !== null && longitude !== null) {
      fetchNearbyRestrooms(latitude, longitude)
        .then((data) => setRestrooms(data))
        .catch((error) => console.error('Error fetching restrooms', error));
    }
  }, [showGenderNeutral, latitude, longitude]);
  // handles creating the restroom object that will be used in review post commands
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
      console.log('here is data ', restroomToPost);
      submitRestroom(restroomToPost).catch((error) => {
        console.error('Error submitting restroom:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Status code:', error.response.status);
          console.error('Headers:', error.response.headers);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error in setting up request:', error.message);
        }
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
  // handle delete request for crud operation, currently doesnt reset reviews on page
  const handleDelete = (id: number) => {
    try {
      deleteReview(id);
      console.log('Delete review at index:', id);
    } catch (error) {
      console.error('Error deleting review', error);
    }
  };
  const averageRating = reviews.length
    ? (
        reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      ).toFixed(1)
    : null;
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
      const newReview = await editReview(review, reviewIdToEdit);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };
  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <MapComponent restrooms={restrooms} />
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
                <RestroomDetail restroom={selectedRestroom} />
                <div className='reviews'>
                  <h4>Recent Reviews</h4>
                  {averageRating && <p>Average Rating: {averageRating}</p>}
                  {reviews.length ? (
                    <ul>
                      {reviews.map((review, index) => (
                        <li key={index}>
                          <strong>{review.user.username}:</strong>{' '}
                          {review.comment}
                          <button onClick={() => setShowEditReviewModal(true)}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(review.id)}>
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              </>
            )}
            <div className='photo-gallery mt-4'>
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
      {selectedRestroom && reviewIdToEdit && (
        <EditReviewModal
          show={showEditReviewModal}
          handleClose={() => setShowEditReviewModal(false)}
          handleAddReview={handleAddReview}
          restroom={restroomObjectToPost}
        />
      )}
    </Container>
  );
};
export default MainPage;
