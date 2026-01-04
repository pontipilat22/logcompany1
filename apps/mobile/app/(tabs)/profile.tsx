import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useStore } from '@/store';

export default function ProfileScreen() {
    const { user, logout } = useStore();

    const handleLogout = () => {
        Alert.alert(
            'Выход',
            'Вы уверены, что хотите выйти?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Выйти',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/login');
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={48} color="#1677ff" />
                </View>
                <Text style={styles.name}>
                    {user?.lastName} {user?.firstName}
                </Text>
                <Text style={styles.phone}>{user?.phone}</Text>
            </View>

            {/* Vehicle Info */}
            {user?.vehiclePlate && (
                <View style={styles.card}>
                    <View style={styles.cardRow}>
                        <Ionicons name="car" size={24} color="#1677ff" />
                        <View style={styles.cardContent}>
                            <Text style={styles.cardLabel}>Транспорт</Text>
                            <Text style={styles.cardValue}>
                                {user.vehicleModel} • {user.vehiclePlate}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Menu Items */}
            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="document-text-outline" size={24} color="#333" />
                    <Text style={styles.menuText}>История рейсов</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="notifications-outline" size={24} color="#333" />
                    <Text style={styles.menuText}>Уведомления</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="help-circle-outline" size={24} color="#333" />
                    <Text style={styles.menuText}>Помощь</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#f5222d" />
                <Text style={styles.logoutText}>Выйти</Text>
            </TouchableOpacity>

            {/* Version */}
            <Text style={styles.version}>Версия 1.0.0</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    avatarContainer: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8',
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#e6f4ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    phone: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 16,
        borderRadius: 12,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cardContent: {
        flex: 1,
    },
    cardLabel: {
        fontSize: 12,
        color: '#666',
    },
    cardValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 2,
    },
    menu: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        margin: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f5222d',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f5222d',
    },
    version: {
        textAlign: 'center',
        color: '#999',
        fontSize: 12,
        marginTop: 8,
    },
});
