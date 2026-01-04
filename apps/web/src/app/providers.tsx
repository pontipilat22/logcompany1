'use client';

import { ConfigProvider, theme, App as AntdApp } from 'antd';
import ruRU from 'antd/locale/ru_RU';

export function AntdProvider({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            locale={ruRU}
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#1677ff',
                    borderRadius: 8,
                },
            }}
        >
            <AntdApp>{children}</AntdApp>
        </ConfigProvider>
    );
}
