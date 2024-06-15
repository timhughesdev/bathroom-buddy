// 3 api's one of them is in MapComponent.tsx

import axios from 'axios';

const API_URL =
  'https://zylalabs.com/api/2086/available+public+bathrooms+api/1869/get+public+bathrooms';
const AUTH_TOKEN = 'Bearer 4701|NmzxbLgSnfJ9M9xlK23AyfuZbMROClefU0OqZh6v';

export const fetchNearbyRestrooms = async (
  latitude: number,
  longitude: number,
  page = 1,
  perPage = 10,
  offset = 0
) => {
  const config = {
    method: 'GET',
    url: `${API_URL}?lat=${latitude}&lng=${longitude}&page=${page}&per_page=${perPage}&offset=${offset}`,
    headers: {
      Authorization: AUTH_TOKEN,
    },
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby restrooms', error);
    throw error;
  }
};

export const fetchGenderNeutralRestrooms = async () => {
  try {
    const response = await axios.get(
      'https://www.refugerestrooms.org/api/v1/restrooms/by_location.json',
      {
        params: {
          //   lat: latitude,
          //   lng: longitude,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching gender-neutral restrooms', error);
    throw error;
  }
};
