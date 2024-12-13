import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p>&copy; {new Date().getFullYear()} Blasti. All rights reserved.</p>
        <div style={styles.links}>
          <a href="/" style={styles.link}>contactBlasti@gmail.com</a>
          <a href="/" style={styles.link}>+216 55 555 555</a>
          <a href="/" style={styles.link}>Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: '20px 0',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  links: {
    marginTop: '10px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    margin: '0 10px',
  },
};

export default Footer;
