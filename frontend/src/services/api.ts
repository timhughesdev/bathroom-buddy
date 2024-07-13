// 3 api's one of them is in MapComponent.tsx
import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';

// Base URL for the Zyla Labs API
const ZYLA_API_URL =
  'https://zylalabs.com/api/2086/available+public+bathrooms+api/1869/get+public+bathrooms';
const ZYLA_AUTH_TOKEN = 'Bearer 4701|NmzxbLgSnfJ9M9xlK23AyfuZbMROClefU0OqZh6v';

// Base URL for the Refuge Restrooms API
const REFUGE_API_URL = 'https://www.refugerestrooms.org/api/v1';

// Create an axios instance for the backend API with baseURL from environment
export const backEndApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby restrooms', error);
    throw error;
  }
};

// Fetch gender-neutral restrooms using the Refuge Restrooms API
export const fetchGenderNeutralRestrooms = async () => {
  try {
    const response = await axios.get(
      `${REFUGE_API_URL}/restrooms/by_location.json`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching gender-neutral restrooms', error);
    throw error;
  }
};

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
  id: number;
  user: User;
  rating: number;
  comment: string;
  time_created: string;
  restroom: RestroomToPost;
};

// Post restrooms to the data base 

export const submitRestroom = async (restroom: {api_restroom_key: number, name: string, address: string, latitude:number, longitude: number}): Promise<RestroomToPost> => {
  try {
    console.log('here is data', restroom)
    const response = await backEndApi.post(`api/restrooms/`, restroom);
    return response.data;
  } catch (error) {
    console.error('Error submitting restroom:', error);
    throw error;
  }
};

// Fetch reviews for a specific restroom from the backend API
export const getReviewsForRestroom = async (restroomId: number): Promise<Review[]> => {
  try {
    const response = await backEndApi.get(`api/reviews/restroom/${restroomId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// Function to post a review for a specific restroom
export const submitReview = async (review: { user: User; comment: string; rating: number; restroom: RestroomToPost }): Promise<Review> => {
  try {
    const response = await backEndApi.post('api/reviews/all/', review);
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

export const editReview = async (review: { user: User; comment: string; rating: number; restroom: RestroomToPost }, id: number): Promise<Review> => {
  try {
    const response = await backEndApi.put(`api/reviews/review/${id}/`, review);
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

export const deleteReview = async (id: number): Promise<Review> => {
  try {
    const response = await backEndApi.delete(`api/reviews/review/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};




