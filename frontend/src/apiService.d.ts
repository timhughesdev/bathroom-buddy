declare module 'apiService' {
    export type Restroom = {
        id: number;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        photos: { url: string }[];
        reviews: { user: string; comment: string }[];
    };

    export const getRestrooms: () => Promise<Restroom[]>;
}