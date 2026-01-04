'use client';

import { useEffect, useState } from 'react';
import {
    Table, Card, Button, Tag, Space, Modal, Form,
    Input, Select, DatePicker, Typography, App, InputNumber
} from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { api, Order, Location } from '@/lib/api';

const { Title } = Typography;
const { Option } = Select;

const statusLabels: Record<string, string> = {
    DRAFT: 'Черновик',
    PENDING: 'Ожидает',
    ASSIGNED: 'Назначен',
    EN_ROUTE_PICKUP: 'Едет на погрузку',
    AT_PICKUP: 'На погрузке',
    LOADING: 'Загружается',
    IN_TRANSIT: 'В пути',
    AT_DELIVERY: 'На выгрузке',
    UNLOADING: 'Разгружается',
    COMPLETED: 'Завершён',
    CANCELLED: 'Отменён',
    PROBLEM: 'Проблема',
};

const statusColors: Record<string, string> = {
    DRAFT: 'default',
    PENDING: 'orange',
    ASSIGNED: 'blue',
    EN_ROUTE_PICKUP: 'processing',
    AT_PICKUP: 'processing',
    LOADING: 'processing',
    IN_TRANSIT: 'cyan',
    AT_DELIVERY: 'processing',
    UNLOADING: 'processing',
    COMPLETED: 'green',
    CANCELLED: 'default',
    PROBLEM: 'red',
};

export default function OrdersPage() {
    const { message } = App.useApp();
    const [orders, setOrders] = useState<Order[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [ordersRes, locationsRes] = await Promise.all([
                api.get('/orders'),
                api.get('/locations'),
            ]);
            setOrders(ordersRes.data);
            setLocations(locationsRes.data);
        } catch (error) {
            message.error('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (values: any) => {
        try {
            await api.post('/orders', values);
            message.success('Заявка создана');
            setModalOpen(false);
            form.resetFields();
            fetchData();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Ошибка создания');
        }
    };

    const columns = [
        {
            title: '№ Заявки',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            render: (text: string) => <strong>{text}</strong>,
        },
        {
            title: 'Груз',
            dataIndex: 'cargoDescription',
            key: 'cargoDescription',
            ellipsis: true,
            width: 200,
        },
        {
            title: 'Вес, кг',
            dataIndex: 'cargoWeight',
            key: 'cargoWeight',
            render: (w: number) => w ? w.toLocaleString() : '—',
        },
        {
            title: 'Откуда',
            dataIndex: ['pickupLocation', 'name'],
            key: 'pickupLocation',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={statusColors[status] || 'default'}>
                    {statusLabels[status] || status}
                </Tag>
            ),
        },
        {
            title: 'Водитель',
            dataIndex: 'driver',
            key: 'driver',
            render: (driver: any) =>
                driver ? `${driver.firstName} ${driver.lastName}` : <Tag>Не назначен</Tag>,
        },
        {
            title: 'Цена, ₸',
            dataIndex: 'price',
            key: 'price',
            render: (p: number) => p ? p.toLocaleString() : '—',
        },
        {
            title: 'Создана',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString('ru-RU'),
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_: any, record: Order) => (
                <Space>
                    <Button type="text" icon={<EyeOutlined />} />
                    <Button type="text" icon={<EditOutlined />} />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>Заявки на перевозку</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
                    Новая заявка
                </Button>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 15 }}
                />
            </Card>

            <Modal
                title="Новая заявка"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={() => form.submit()}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Form.Item
                        name="pickupLocationId"
                        label="Точка погрузки"
                        rules={[{ required: true, message: 'Выберите точку' }]}
                    >
                        <Select placeholder="Выберите точку погрузки">
                            {locations.map((loc) => (
                                <Option key={loc.id} value={loc.id}>
                                    {loc.name} — {loc.address}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="cargoDescription"
                        label="Описание груза"
                        rules={[{ required: true, message: 'Введите описание' }]}
                    >
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Space style={{ width: '100%' }}>
                        <Form.Item name="cargoWeight" label="Вес, кг">
                            <InputNumber min={0} style={{ width: 150 }} />
                        </Form.Item>
                        <Form.Item name="cargoVolume" label="Объём, м³">
                            <InputNumber min={0} style={{ width: 150 }} />
                        </Form.Item>
                        <Form.Item name="price" label="Цена, ₸">
                            <InputNumber min={0} style={{ width: 150 }} />
                        </Form.Item>
                    </Space>
                    <Form.Item name="requirements" label="Особые требования">
                        <Input.TextArea rows={2} placeholder="Тент, аккуратная погрузка и т.д." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
