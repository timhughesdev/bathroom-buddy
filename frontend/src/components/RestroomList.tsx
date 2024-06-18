import React from 'react';
import { ListGroup, Form } from 'react-bootstrap';

type Restroom = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  photos: { url: string }[];
  reviews: { user: string; comment: string }[];
};

interface RestroomListProps {
  restrooms: Restroom[];
  onSelectRestroom: (id: number) => void;
  onToggleGenderNeutral: () => void;
  showGenderNeutral: boolean;
}

const RestroomList: React.FC<RestroomListProps> = ({
  restrooms,
  onSelectRestroom,
  onToggleGenderNeutral,
  showGenderNeutral,
}) => {
  return (
    <ListGroup>
      <ListGroup.Item>
        <h4>Nearby Restrooms</h4>
        <Form.Check
          type='switch'
          id='gender-neutral-switch'
          label='Show Gender-Neutral Restrooms'
          checked={showGenderNeutral}
          onChange={onToggleGenderNeutral}
        />
      </ListGroup.Item>
      {restrooms.map((restroom) => (
        <ListGroup.Item
          key={restroom.id}
          onClick={() => onSelectRestroom(restroom.id)}
        >
          {restroom.name} - {restroom.address}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default RestroomList;
