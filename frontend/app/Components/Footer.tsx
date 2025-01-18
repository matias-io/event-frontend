const Footer = () => (
    <footer
      className="pt-12 pb-10 bg-gray-800 text-white text-center py-4 mt-12"
      style={{ marginTop: 'auto' }} // Keeps it at the bottom of the page
    >
      <p>Futuristic Stocks &copy; {new Date().getFullYear()}</p>
      <p>
        Built with ❤️ using{' '}
        <a
          href="https://solace.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#00d8ff', textDecoration: 'none' }}
        >
          Solace
        </a>{' '}
        For UOttaHack 7
      </p>
    </footer>
);

export default Footer;
