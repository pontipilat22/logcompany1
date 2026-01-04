'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { useAuthStore } from '@/store/auth';

export default function HomePage() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated && user) {
            // Редирект на соответствующий дашборд по роли
            switch (user.role) {
                case 'ADMIN':
                    router.push('/admin');
                    break;
                case 'CUSTOMER':
                    router.push('/customer');
                    break;
                case 'WAREHOUSE':
                    router.push('/warehouse');
                    break;
                case 'RECIPIENT':
                    router.push('/recipient');
                    break;
                default:
                    router.push('/admin');
            }
        } else {
            router.push('/login');
        }
    }, [isAuthenticated, user, router]);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Spin size="large" tip="Загрузка..." />
        </div>
    );
}
