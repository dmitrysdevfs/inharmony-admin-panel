export default function DashboardHome() {
  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '16px' }}>
        InHarmony Admin Panel
      </h1>
      <p style={{ fontSize: '16px', color: '#374151' }}>
        Перейдіть на{' '}
        <a href="/dashboard/collections" style={{ color: '#2563eb', textDecoration: 'underline' }}>
          Збори коштів
        </a>
      </p>
    </div>
  );
}
