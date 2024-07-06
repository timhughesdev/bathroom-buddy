import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';

// Base URL for the Zyla Labs API
const ZYLA_API_URL = 'https://zylalabs.com/api/2086/available+public+bathrooms+api/1869/get+public+bathrooms';
const ZYLA_AUTH_TOKEN = 'Bearer 4701|NmzxbLgSnfJ9M9xlK23AyfuZbMROClefU0OqZh6v';

// Base URL for the Refuge Restrooms API
const REFUGE_API_URL = 'https://www.refugerestrooms.org/api/v1';

// Create an axios instance for the backend API with baseURL from environment
export const backEndApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Ensure cookies are sent with requests
});

// Add authorization header in all requests to the backend API
backEndApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fetch nearby restrooms using the Zyla Labs API
export const fetchNearbyRestrooms = async (
  latitude: number,
  longitude: number,
  page = 1,
  perPage = 10,
  offset = 0
) => {
  const config = {
    method: 'GET',
    url: `${ZYLA_API_URL}?lat=${latitude}&lng=${longitude}&page=${page}&per_page=${perPage}&offset=${offset}`,
    headers: {
      Authorization: ZYLA_AUTH_TOKEN,
    },
  };

  try {
    console.log('Sending request to ZYLA API with config:', config);  // Debugging log
    const response = await axios(config);
    console.log('Received response from ZYLA API:', response.data);  // Debugging log
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Error fetching nearby restrooms:', error.response.data);
        console.error('Status code:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error in setting up request:', error.message);
      }
    } else {
      // Handle non-Axios errors
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};


// Fetch gender-neutral restrooms using the Refuge Restrooms API
// export const fetchGenderNeutralRestrooms = async () => {
//   try {
//     const response = await axios.get(
//       `${REFUGE_API_URL}/restrooms/by_location.json`
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching gender-neutral restrooms', error);
//     throw error;
//   }
// };

// Define types for Restroom and Review
export type Restroom = {
  id: number;
  api_restroom_key: number;
  name: string;
  street: string;
  address: string;
  latitude: number;
  longitude: number;
  photos: { url: string }[];
  reviews: { user: string; comment: string; rating: number; restroomId: number }[];
};

export type RestroomToPost = {
  api_restroom_key: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export type User = {
  username: string
}

export type Review = {
  user: User;
  rating: number;
  comment: string;
  time_created: string;
  restroom: RestroomToPost;
};

// Fetch reviews for a specific restroom from the backend API
export const getReviewsForRestroom = async (restroomId: number): Promise<Review[]> => {
  console.log(`Fetching reviews for restroom ID: ${restroomId}`);
  try {
    const response = await backEndApi.get(`/reviews/restroom/${restroomId}/`);
    console.log("Received response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        // Request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something else happened in setting up the request
        console.error('Error message:', error.message);
      }
    } else {
      // Handle non-Axios errors
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};


// Function to post a review for a specific restroom
export const submitReview = async (review: { user: User; comment: string; rating: number; restroom: RestroomToPost }): Promise<Review> => {
  try {
    const response = await backEndApi.post('/reviews/', review);
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};






