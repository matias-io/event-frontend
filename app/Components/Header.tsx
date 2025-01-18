const Header = () => (
  <header
    style={{
      color: '#ffffff',
      textAlign: 'center',
      padding: '20px 10px',
      fontSize: '1.5rem',
      position: 'sticky',
      top: 0,
      width: '100%',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
    }}
    className="bg-gray-800"
  >
    <h1>Futuristic Stocks</h1>
  </header>
);

export default Header;
