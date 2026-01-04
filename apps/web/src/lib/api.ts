import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Интерцептор для обработки ошибок авторизации
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Токен невалидный — очищаем
            if (typeof window !== 'undefined') {
                localStorage.removeItem('logcomp-auth');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Типы для API
export interface Location {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    contactName?: string;
    contactPhone?: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    status: string;
    cargoDescription: string;
    cargoWeight?: number;
    cargoVolume?: number;
    pickupLocation: Location;
    customer: { firstName: string; lastName: string };
    driver?: { firstName: string; lastName: string; phone: string };
    createdAt: string;
    price?: number;
}

export interface User {
    id: string;
    email?: string;
    phone: string;
    firstName: string;
    lastName: string;
    role: string;
    vehiclePlate?: string;
    vehicleModel?: string;
    isActive: boolean;
}
