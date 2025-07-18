import React, { useState } from 'react';
import axios from 'axios';
import './home.css';

const contactPageStyles = `
  body, .contact-bg {
    background: linear-gradient(120deg, #ffeaea 0%, #fff6f6 100%);
    min-height: 100vh;
  }
  .contact-section {
    max-width: 420px;
    margin: 0 auto 2.5rem auto;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .contact-card {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 6px 32px rgba(255,90,95,0.10), 0 1.5px 6px rgba(0,0,0,0.04);
    padding: 2.2rem 2rem 2rem 2rem;
    width: 100%;
    animation: fadeIn 0.7s;
  }
  .contact-title {
    color: #FF5A5F;
    font-size: 2rem;
    font-weight: bold;
    letter-spacing: 1px;
    font-family: 'Playfair Display', serif;
    margin-bottom: 0.5rem;
    text-align: left;
  }
  .contact-desc {
    color: #888;
    font-size: 1.05rem;
    margin-bottom: 1.5rem;
    text-align: left;
  }
  .contact-form {
    width: 100%;
  }
  .form-group {
    margin-bottom: 1.3rem;
    position: relative;
  }
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #FF5A5F;
  }
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 0.85rem 2.5rem 0.85rem 1rem;
    border: 1.5px solid #ffeaea;
    border-radius: 8px;
    font-size: 1rem;
    background: #f8f8f8;
    transition: border 0.2s;
    color: #333;
    box-shadow: 0 1px 4px rgba(255,90,95,0.04);
  }
  .form-group input:focus,
  .form-group textarea:focus {
    border: 1.5px solid #FF5A5F;
    outline: none;
  }
  .form-group textarea {
    min-height: 120px;
    resize: vertical;
  }
  .input-icon {
    position: absolute;
    right: 1rem;
    top: 62%;
    transform: translateY(-50%);
    font-size: 1.2rem;
    color: #FF5A5F;
    pointer-events: none;
  }
  .submit-btn {
   background: linear-gradient(90deg, #ff5a5f 60%, #ff8086 100%);
    color: #ffffff;
    padding: 0.85rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(255,90,95,0.08);
    transition: background 0.2s, color 0.2s, transform 0.2s;
    width: 100%;
    margin-top: 0.5rem;
  }
  // .submit-btn:hover {
  //    background: linear-gradient(90deg, #ff5a5f 60%, #ff8086 100%);
  //   color: #FF5A5F;
  //   transform: translateY(-2px) scale(1.03);
  // }
  .success-message, .error-message {
    background: #e0ffe6;
    color: #2e7d32;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-weight: 500;
    text-align: center;
    border: 1.5px solid #b2f2c7;
  }
  .error-message {
    background: #fff0f0;
    color: #e53935;
    border: 1.5px solid #ffcdd2;
  }
  @media (max-width: 600px) {
    .contact-section {
      max-width: 98vw;
      margin-top: 4.5rem;
    }
    .contact-card {
      padding: 1.2rem 0.7rem 1.2rem 0.7rem;
    }
    .contact-title {
      font-size: 1.3rem;
    }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;


const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the formData to your backend API
    console.log('Contact form submitted:', formData);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8081/api/contact/submit', null, {
        params: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        setSuccessMessage(response.data.message);
        setFormData({
          name: '',
          email: '',
          message: ''
        });

        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setErrorMessage('Server error. Please try again later.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };


  return (
    <div className="contact-bg">
      <style>{contactPageStyles}</style>
      <section className="contact-section">
        <div className="contact-card">
          <div className="contact-title">Contact Us</div>
          <div className="contact-desc">Have a question, feedback, or need help? Fill out the form below and our team will get back to you soon.</div>
          {successMessage && (
            <div className="success-message">
              <p>{successMessage}</p>
            </div>
          )}
          {errorMessage && (
            <div className="error-message">
              <p>{errorMessage}</p>
            </div>
          )}
          <form className="contact-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
              <span className="input-icon" role="img" aria-label="user">👤</span>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
              <span className="input-icon" role="img" aria-label="email">📧</span>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Type your message here..."
              ></textarea>
              <span className="input-icon" role="img" aria-label="message">💬</span>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;