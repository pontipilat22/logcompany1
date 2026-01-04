'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, App, Tabs } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';

const { Title, Text } = Typography;

export default function LoginPage() {
    const router = useRouter();
    const { message } = App.useApp();
    const { login, setUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [smsStep, setSmsStep] = useState<'phone' | 'code'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');

    // Device ID для Single Session Policy
    const getDeviceId = () => {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = uuidv4();
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    };

    // Email Login (Admin, Customer, etc.)
    const handleEmailLogin = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            await login(values.email, values.password, getDeviceId());
            message.success('Вход выполнен успешно');
            router.push('/');
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    // SMS Login Step 1 - Request Code
    const handleRequestSms = async (values: { phone: string }) => {
        setLoading(true);
        try {
            await api.post('/auth/sms/request', { phone: values.phone });
            setPhoneNumber(values.phone);
            setSmsStep('code');
            message.success('Код отправлен на указанный номер');
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Ошибка отправки SMS');
        } finally {
            setLoading(false);
        }
    };

    // SMS Login Step 2 - Verify Code
    const handleVerifySms = async (values: { code: string }) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/sms/verify', {
                phone: phoneNumber,
                code: values.code,
                deviceId: getDeviceId(),
            });
            setUser(response.data.user, response.data.accessToken);
            message.success('Вход выполнен успешно');
            router.push('/');
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Неверный код');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: 20,
        }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: 16,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Title level={2} style={{ margin: 0, color: '#1677ff' }}>
                        🚛 LogComp
                    </Title>
                    <Text type="secondary">Система управления логистикой</Text>
                </div>

                <Tabs
                    defaultActiveKey="email"
                    centered
                    items={[
                        {
                            key: 'email',
                            label: 'Email',
                            children: (
                                <Form layout="vertical" onFinish={handleEmailLogin}>
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Введите email' },
                                            { type: 'email', message: 'Некорректный email' },
                                        ]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Email"
                                            size="large"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        rules={[{ required: true, message: 'Введите пароль' }]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined />}
                                            placeholder="Пароль"
                                            size="large"
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            block
                                            loading={loading}
                                        >
                                            Войти
                                        </Button>
                                    </Form.Item>
                                </Form>
                            ),
                        },
                        {
                            key: 'sms',
                            label: 'SMS (Водители)',
                            children: smsStep === 'phone' ? (
                                <Form layout="vertical" onFinish={handleRequestSms}>
                                    <Form.Item
                                        name="phone"
                                        rules={[{ required: true, message: 'Введите номер телефона' }]}
                                    >
                                        <Input
                                            prefix={<PhoneOutlined />}
                                            placeholder="+7 (___) ___-__-__"
                                            size="large"
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            block
                                            loading={loading}
                                        >
                                            Получить код
                                        </Button>
                                    </Form.Item>
                                </Form>
                            ) : (
                                <Form layout="vertical" onFinish={handleVerifySms}>
                                    <Text style={{ display: 'block', marginBottom: 16, textAlign: 'center' }}>
                                        Код отправлен на {phoneNumber}
                                    </Text>
                                    <Form.Item
                                        name="code"
                                        rules={[{ required: true, message: 'Введите код из SMS' }]}
                                    >
                                        <Input
                                            placeholder="Код из SMS"
                                            size="large"
                                            maxLength={4}
                                            style={{ textAlign: 'center', letterSpacing: 8, fontSize: 24 }}
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            block
                                            loading={loading}
                                        >
                                            Подтвердить
                                        </Button>
                                    </Form.Item>
                                    <Button type="link" block onClick={() => setSmsStep('phone')}>
                                        Изменить номер
                                    </Button>
                                </Form>
                            ),
                        },
                    ]}
                />
            </Card>
        </div>
    );
}
