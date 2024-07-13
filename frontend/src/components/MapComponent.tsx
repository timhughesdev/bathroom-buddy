import React, { useEffect, useRef } from 'react';
import { GoogleMap } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '500px',
  width: '100%',
};

type Restroom = {
  latitude: number;
  longitude: number;
};

interface MapComponentProps {
  restrooms: Restroom[];
  center: {
    lat: number;
    lng: number;
  };
}

const MapComponent: React.FC<MapComponentProps> = ({ restrooms, center }) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      restrooms.forEach((restroom) => {
        new google.maps.Marker({
          position: { lat: restroom.latitude, lng: restroom.longitude },
          map: mapRef.current!,
        });
      });
    }
  }, [restrooms]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    />
  );
};

export default MapComponent;
