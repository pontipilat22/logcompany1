'use client';

import { useEffect, useState } from 'react';
import {
    Table, Card, Button, Space, Modal, Form,
    Input, Typography, App, InputNumber
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { api, Location } from '@/lib/api';

const { Title } = Typography;

export default function LocationsPage() {
    const { message } = App.useApp();
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await api.get('/locations');
            setLocations(response.data);
        } catch (error) {
            message.error('Ошибка загрузки адресов');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (values: any) => {
        try {
            await api.post('/locations', values);
            message.success('Адрес добавлен');
            setModalOpen(false);
            form.resetFields();
            fetchLocations();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Ошибка создания');
        }
    };

    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: 'Удалить адрес?',
            okText: 'Удалить',
            cancelText: 'Отмена',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    await api.delete(`/locations/${id}`);
                    message.success('Адрес удалён');
                    fetchLocations();
                } catch {
                    message.error('Ошибка удаления');
                }
            },
        });
    };

    const columns = [
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => (
                <Space>
                    <EnvironmentOutlined style={{ color: '#1677ff' }} />
                    <strong>{text}</strong>
                </Space>
            ),
        },
        {
            title: 'Адрес',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true,
        },
        {
            title: 'Контакт',
            dataIndex: 'contactName',
            key: 'contactName',
            render: (name: string, record: Location) =>
                name ? `${name} (${record.contactPhone})` : '—',
        },
        {
            title: 'Координаты',
            key: 'coords',
            render: (_: any, record: Location) => (
                <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                    {record.latitude.toFixed(4)}, {record.longitude.toFixed(4)}
                </span>
            ),
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_: any, record: Location) => (
                <Space>
                    <Button type="text" icon={<EditOutlined />} />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>Адресная книга</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
                    Добавить адрес
                </Button>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={locations}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 15 }}
                />
            </Card>

            <Modal
                title="Новый адрес"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={() => form.submit()}
                width={500}
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Form.Item
                        name="name"
                        label="Название"
                        rules={[{ required: true, message: 'Введите название' }]}
                    >
                        <Input placeholder="Склад №1" />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Адрес"
                        rules={[{ required: true, message: 'Введите адрес' }]}
                    >
                        <Input placeholder="г. Алматы, ул. Примерная, 123" />
                    </Form.Item>
                    <Space style={{ width: '100%' }}>
                        <Form.Item
                            name="latitude"
                            label="Широта"
                            rules={[{ required: true }]}
                        >
                            <InputNumber style={{ width: 150 }} step={0.0001} placeholder="43.2389" />
                        </Form.Item>
                        <Form.Item
                            name="longitude"
                            label="Долгота"
                            rules={[{ required: true }]}
                        >
                            <InputNumber style={{ width: 150 }} step={0.0001} placeholder="76.9457" />
                        </Form.Item>
                    </Space>
                    <Form.Item name="contactName" label="Контактное лицо">
                        <Input placeholder="Иван Иванов" />
                    </Form.Item>
                    <Form.Item name="contactPhone" label="Телефон контакта">
                        <Input placeholder="+7..." />
                    </Form.Item>
                    <Form.Item name="notes" label="Примечания">
                        <Input.TextArea rows={2} placeholder="Заезд со двора" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
