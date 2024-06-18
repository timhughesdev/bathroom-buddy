import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import MapComponent from './MapComponent';
import RestroomList from './RestroomList';
import RestroomDetail from './RestroomDetail';
import PlacesAutocomplete from './PlacesAutoComplete';
import {
  fetchNearbyRestrooms,
  fetchGenderNeutralRestrooms,
} from '../services/api';
import '../App.css';

// Define the Restroom type
type Restroom = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  photos: { url: string }[];
  reviews: { user: string; comment: string }[];
};

const MainPage: React.FC = () => {
  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [selectedRestroomId, setSelectedRestroomId] = useState<number | null>(
    null
  );
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [showGenderNeutral, setShowGenderNeutral] = useState(false);

  useEffect(() => {
    // Fetch user's location
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
      // Fetch restrooms near user's location
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

  const handleSelectRestroom = (id: number) => {
    setSelectedRestroomId(id);
  };

  const handleToggleGenderNeutral = () => {
    setShowGenderNeutral(!showGenderNeutral);
  };

  const selectedRestroom = restrooms.find(
    (restroom) => restroom.id === selectedRestroomId
  );

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

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <MapComponent restrooms={restrooms} />
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <div className='location-input'>
            <h4>Enter Your Location</h4>
            <PlacesAutocomplete onPlaceSelected={handlePlaceSelected} />
            <Button variant='primary' className='mt-2'>
              Submit
            </Button>
          </div>
          <RestroomList
            restrooms={restrooms}
            onSelectRestroom={handleSelectRestroom}
            onToggleGenderNeutral={handleToggleGenderNeutral}
            showGenderNeutral={showGenderNeutral}
          />
        </Col>
        <Col md={6}>
          <div className='photos-reviews'>
            <h4>Nearby Restrooms</h4>
            {selectedRestroom && (
              <>
                <RestroomDetail restroom={selectedRestroom} />
                <Button variant='primary' className='mt-2'>
                  Upload Image
                </Button>
              </>
            )}
            <h4 className='mt-4'>Recent Reviews</h4>
            <ul>
              {selectedRestroom?.reviews.map((review, index) => (
                <li key={index}>{review.comment}</li>
              ))}
            </ul>
            <Button variant='primary' className='mt-2'>
              Upload Review
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
