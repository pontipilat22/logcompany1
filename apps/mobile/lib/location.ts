import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { api } from '@/lib/api';

const LOCATION_TASK_NAME = 'background-location-task';

// Определяем фоновую задачу
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error('Background location error:', error);
        return;
    }

    if (data) {
        const { locations } = data as { locations: Location.LocationObject[] };

        if (locations.length > 0) {
            const location = locations[0];

            try {
                await api.post('/tracking/gps', {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    accuracy: location.coords.accuracy,
                    speed: location.coords.speed,
                    heading: location.coords.heading,
                    recordedAt: new Date(location.timestamp).toISOString(),
                });
                console.log('GPS sent:', location.coords.latitude, location.coords.longitude);
            } catch (error) {
                console.error('Failed to send GPS:', error);
            }
        }
    }
});

export const startBackgroundTracking = async (): Promise<boolean> => {
    // Проверяем разрешения
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') {
        console.warn('Foreground location permission not granted');
        return false;
    }

    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
        console.warn('Background location permission not granted');
        return false;
    }

    // Проверяем, не запущена ли уже задача
    const isStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (isStarted) {
        console.log('Background tracking already started');
        return true;
    }

    // Запускаем фоновое отслеживание
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        distanceInterval: 50, // Обновлять каждые 50 метров
        timeInterval: 30000, // Или каждые 30 секунд
        foregroundService: {
            notificationTitle: 'LogComp - Рейс активен',
            notificationBody: 'Отслеживание местоположения',
            notificationColor: '#1677ff',
        },
        pausesUpdatesAutomatically: false,
        showsBackgroundLocationIndicator: true,
    });

    console.log('Background tracking started');
    return true;
};

export const stopBackgroundTracking = async (): Promise<void> => {
    const isStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (isStarted) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        console.log('Background tracking stopped');
    }
};

export const isTrackingActive = async (): Promise<boolean> => {
    return await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
};

// Получить текущую позицию (однократно)
export const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        return null;
    }

    return await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
    });
};
