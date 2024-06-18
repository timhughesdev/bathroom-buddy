import React from 'react';
import { LoadScript } from '@react-google-maps/api';

const libraries: 'places'[] = ['places'];

const LoadGoogleMaps: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <LoadScript
      googleMapsApiKey='AIzaSyBKFUK0Rrwjl7g6sMI3XOdKhimFT0vXCE4'
      libraries={libraries}
    >
      {children}
    </LoadScript>
  );
};

export default LoadGoogleMaps;
