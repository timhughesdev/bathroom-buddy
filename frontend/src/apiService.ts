 // API preface http://localhost:8000/api/v1/

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export type Restroom = {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    photos: { url: string }[];
    reviews: { user: string; comment: string }[];
};

export const getRestrooms = async (): Promise<Restroom[]> => {
    try {
        const response = await axios.get(`${API_URL}/restrooms/`);  // Fixed template string issue
        return response.data;
    } catch (error) {
        console.error('Error fetching restrooms:', error);
        throw error;
    }
};

export const createRestroom = async (restroom: Restroom): Promise<Restroom> => {
    try {
        const response = await axios.post(`${API_URL}/restrooms/`, restroom);
        return response.data;
    } catch (error) {
        console.error('Error creating restroom:', error);
        throw error;
    }
};

export const updateRestroom = async (id: number, restroom: Partial<Restroom>): Promise<Restroom> => {
    try {
        const response = await axios.put(`${API_URL}/restrooms/${id}/`, restroom);
        return response.data;
    } catch (error) {
        console.error('Error updating restroom:', error);
        throw error;
    }
};

export const deleteRestroom = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/restrooms/${id}/`);
    } catch (error) {
        console.error('Error deleting restroom:', error);
        throw error;
    }
};


