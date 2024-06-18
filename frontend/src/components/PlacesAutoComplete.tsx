import React, { useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';

interface PlacesAutocompleteProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  onPlaceSelected,
}) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      onPlaceSelected(place);
    }
  };

  return (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={handlePlaceChanged}
    >
      <input
        type='text'
        placeholder='Enter your location'
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          backgroundColor: '#fff',
          color: '#000',
        }}
      />
    </Autocomplete>
  );
};

export default PlacesAutocomplete;
