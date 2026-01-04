import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useStore } from '@/store';
import { initializeApi } from '@/lib/api';

export default function RootLayout() {
    const checkAuth = useStore((state) => state.checkAuth);

    useEffect(() => {
        const init = async () => {
            await initializeApi();
            await checkAuth();
        };
        init();
    }, []);

    return (
        <>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: '#1677ff' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                />
            </Stack>
        </>
    );
}
