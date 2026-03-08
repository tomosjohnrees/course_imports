export default function Sidebar() {
  return (
    <nav
      style={{
        width: '260px',
        flexShrink: 0,
        borderRight: '1px solid #e0e0e0',
        padding: '16px',
        overflow: 'auto',
      }}
    >
      <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>
        Topics
      </h2>
    </nav>
  )
}
