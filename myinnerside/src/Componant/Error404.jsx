import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-code">404</div>
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-message">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="error-actions">
          <button 
            className="error-btn primary" 
            onClick={() => navigate('/')}
          >
            Return Home
          </button>
          <button 
            className="error-btn secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
      <style jsx>{`
        /* Custom CSS for Error Component */
        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f8f9fa;
          background-image: radial-gradient(circle at 10% 20%, 
            rgba(234, 249, 251, 0.8) 0%, 
            rgba(239, 249, 251, 0.8) 90%);
          padding: 2rem;
        }
        
        .error-content {
          text-align: center;
          max-width: 600px;
          padding: 2rem;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          animation: fadeIn 0.6s ease-out;
        }
        
        .error-code {
          font-size: 6rem;
          font-weight: 900;
          color: #4f46e5;
          margin-bottom: 1rem;
          line-height: 1;
          position: relative;
          display: inline-block;
        }
        
        .error-code::after {
          content: '';
          position: absolute;
          width: 80%;
          height: 4px;
          bottom: 10px;
          left: 10%;
          background: linear-gradient(90deg, #4f46e5, #10b981);
          border-radius: 4px;
          opacity: 0.7;
        }
        
        .error-title {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #1e293b;
        }
        
        .error-message {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          color: #64748b;
          line-height: 1.6;
        }
        
        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .error-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-size: 1rem;
        }
        
        .error-btn.primary {
          background-color: #4f46e5;
          color: white;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);
        }
        
        .error-btn.primary:hover {
          background-color: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
        }
        
        .error-btn.secondary {
          background-color: white;
          color: #4f46e5;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        
        .error-btn.secondary:hover {
          background-color: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .error-code {
            font-size: 4rem;
          }
          
          .error-title {
            font-size: 1.5rem;
          }
          
          .error-message {
            font-size: 1rem;
          }
          
          .error-btn {
            padding: 0.6rem 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Error404;