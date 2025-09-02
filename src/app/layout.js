import React from 'react';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Простий Sidebar */}
          <aside
            style={{
              width: '250px',
              backgroundColor: '#1f2937',
              color: 'white',
              padding: '20px',
            }}
          >
            <h2 style={{ color: '#fbbf24', margin: '0 0 20px 0' }}>InHarmony</h2>
            <nav>
              <a
                href="/collections"
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  color: '#d1d5db',
                  textDecoration: 'none',
                  marginBottom: '4px',
                }}
              >
                📊 Збори
              </a>
              <a
                href="#"
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  color: '#d1d5db',
                  textDecoration: 'none',
                  marginBottom: '4px',
                }}
              >
                📈 Звіти
              </a>
              <a
                href="#"
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  color: '#d1d5db',
                  textDecoration: 'none',
                  marginBottom: '4px',
                }}
              >
                👥 Користувачі
              </a>
            </nav>
          </aside>

          {/* Основний контент */}
          <div style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            {/* Header */}
            <header
              style={{
                padding: '16px 24px',
                backgroundColor: 'white',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Панель управління</h1>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>Адміністратор</div>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>
                  Admin
                </div>
              </div>
            </header>

            {/* Контент */}
            <main style={{ padding: '24px' }}>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
