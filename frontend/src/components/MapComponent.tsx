import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '500px',
  width: '100%',
};

const center = {
  lat: 38.44251862646228,
  lng: -122.71319136913861,
};

type Restroom = {
  latitude: number;
  longitude: number;
};

interface MapComponentProps {
  restrooms: Restroom[];
}

const MapComponent: React.FC<MapComponentProps> = ({ restrooms }) => {
  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={13}>
      {restrooms.map((restroom, index) => (
        <Marker
          key={index}
          position={{ lat: restroom.latitude, lng: restroom.longitude }}
        />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
