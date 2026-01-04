'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    Layout,
    Menu,
    Avatar,
    Dropdown,
    Typography,
    Spin,
} from 'antd';
import {
    DashboardOutlined,
    TeamOutlined,
    CarOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    SettingOutlined,
    LogoutOutlined,
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: 'Дашборд' },
    { key: '/admin/orders', icon: <CarOutlined />, label: 'Заявки' },
    { key: '/admin/users', icon: <TeamOutlined />, label: 'Пользователи' },
    { key: '/admin/locations', icon: <EnvironmentOutlined />, label: 'Адреса' },
    { key: '/admin/documents', icon: <FileTextOutlined />, label: 'Документы' },
    { key: '/admin/settings', icon: <SettingOutlined />, label: 'Настройки' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            await checkAuth();
            setLoading(false);
        };
        init();
    }, [checkAuth]);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    const userMenu = (
        <Menu
            items={[
                { key: 'profile', icon: <UserOutlined />, label: 'Профиль' },
                { type: 'divider' },
                { key: 'logout', icon: <LogoutOutlined />, label: 'Выйти', onClick: handleLogout },
            ]}
        />
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="light"
                style={{
                    boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 100,
                }}
            >
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid #f0f0f0',
                }}>
                    <Text strong style={{ fontSize: collapsed ? 20 : 24, color: '#1677ff' }}>
                        {collapsed ? '🚛' : '🚛 LogComp'}
                    </Text>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[pathname]}
                    items={menuItems}
                    onClick={({ key }) => router.push(key)}
                    style={{ borderRight: 0 }}
                />
            </Sider>

            <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
                <Header style={{
                    padding: '0 24px',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 99,
                }}>
                    <div
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: 18, cursor: 'pointer' }}
                    >
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </div>

                    <Dropdown overlay={userMenu} placement="bottomRight">
                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Avatar icon={<UserOutlined />} />
                            <Text>{user?.firstName} {user?.lastName}</Text>
                        </div>
                    </Dropdown>
                </Header>

                <Content style={{
                    margin: 24,
                    padding: 24,
                    background: '#fff',
                    borderRadius: 8,
                    minHeight: 'calc(100vh - 64px - 48px)',
                }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
