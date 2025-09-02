export default function CollectionsPage() {
  // Прості мок дані
  const collections = [
    {
      id: 1,
      title: 'Збір коштів на гуманітарну допомогу',
      description: 'Допомога мешканцям територій, що постраждали від війни в Україні',
      goal: 100000,
      raised: 75000,
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      title: 'Підтримка дітей-сиріт',
      description: 'Збір коштів на освіту та життєзабезпечення дітей-сиріт',
      goal: 50000,
      raised: 50000,
      status: 'completed',
      createdAt: '2024-01-10',
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>Збори коштів</h1>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Створити новий збір
        </button>
      </div>

      {/* Таблиця зборів */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                Назва
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                Ціль
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                Зібрано
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                Статус
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                Дії
              </th>
            </tr>
          </thead>
          <tbody>
            {collections.map(collection => (
              <tr key={collection.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>
                      {collection.title}
                    </strong>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      {collection.description}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {collection.goal.toLocaleString('uk-UA')} ₴
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {collection.raised.toLocaleString('uk-UA')} ₴
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      backgroundColor: collection.status === 'active' ? '#d1fae5' : '#dbeafe',
                      color: collection.status === 'active' ? '#065f46' : '#1e40af',
                    }}
                  >
                    {collection.status === 'active' ? 'Активний' : 'Завершено'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'transparent',
                        color: '#007bff',
                        border: '1px solid #007bff',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Переглянути
                    </button>
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Редагувати
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
