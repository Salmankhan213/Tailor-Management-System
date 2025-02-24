import React from 'react'
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={styles.container}>
    <h1 style={styles.header}>404 - Page Not Found</h1>
    <p style={styles.text}>
      Oops! The page you're looking for doesn't exist.
    </p>
    <Link to="/" style={styles.link}>
      Go back to Home
    </Link>
  </div>
);
};

const styles = {
container: {
  textAlign: 'center',
  marginTop: '100px',
},
header: {
  fontSize: '3rem',
  color: '#333',
},
text: {
  fontSize: '1.5rem',
  marginBottom: '20px',
},
link: {
  fontSize: '1.2rem',
  color: '#0047AB',
  textDecoration: 'none',
  fontWeight: 'bold',
}
};


export default NotFoundPage
