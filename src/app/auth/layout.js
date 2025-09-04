export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        backgroundColor: '#f3f4f6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <main
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '32px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        {children}
      </main>
    </div>
  );
}
