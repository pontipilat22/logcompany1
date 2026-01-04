import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { useStore } from '@/store';

export default function MapScreen() {
    const { currentOrder } = useStore();
    const [region, setRegion] = useState({
        latitude: 43.238949,
        longitude: 76.945780,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    });

    useEffect(() => {
        if (currentOrder?.pickupLocation) {
            setRegion({
                latitude: currentOrder.pickupLocation.latitude,
                longitude: currentOrder.pickupLocation.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            });
        }
    }, [currentOrder]);

    if (!currentOrder) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Нет активного рейса</Text>
            </View>
        );
    }

    const points = [
        currentOrder.pickupLocation,
        ...(currentOrder.deliveryPoints?.map(p => p.location) || []),
    ];

    const coordinates = points.map(p => ({
        latitude: p.latitude,
        longitude: p.longitude,
    }));

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={Platform.OS === 'android' ? PROVIDER_DEFAULT : undefined}
                region={region}
                showsUserLocation
                showsMyLocationButton
            >
                {/* Pickup marker */}
                <Marker
                    coordinate={{
                        latitude: currentOrder.pickupLocation.latitude,
                        longitude: currentOrder.pickupLocation.longitude,
                    }}
                    title="Погрузка"
                    description={currentOrder.pickupLocation.name}
                    pinColor="green"
                />

                {/* Delivery markers */}
                {currentOrder.deliveryPoints?.map((point, index) => (
                    <Marker
                        key={point.id}
                        coordinate={{
                            latitude: point.location.latitude,
                            longitude: point.location.longitude,
                        }}
                        title={`Выгрузка ${index + 1}`}
                        description={point.location.name}
                        pinColor="red"
                    />
                ))}

                {/* Route line */}
                {coordinates.length > 1 && (
                    <Polyline
                        coordinates={coordinates}
                        strokeColor="#1677ff"
                        strokeWidth={3}
                    />
                )}
            </MapView>

            {/* Bottom info card */}
            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>{currentOrder.orderNumber}</Text>
                <Text style={styles.infoText}>
                    {currentOrder.pickupLocation.name} → {currentOrder.deliveryPoints?.[0]?.location.name || '...'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    infoCard: {
        position: 'absolute',
        bottom: 24,
        left: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});
