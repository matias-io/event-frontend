const Footer = () => (
    <footer
      className="pt-12 pb-10 bg-gray-900 text-white text-center py-4 mt-12"
      style={{ marginTop: 'auto' }} // Keeps it at the bottom of the page
    >
      <p>Focusify &copy; {new Date().getFullYear()}</p>
      <p>
        Built with ❤️ using{' '}
        <a
          href="https://www.starknet.io/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#00d8ff', textDecoration: 'none' }}
        >
          Starknet Technologies
        </a>{' '}
        for UOttaHack 7
      </p>
    </footer>
);

export default Footer;
