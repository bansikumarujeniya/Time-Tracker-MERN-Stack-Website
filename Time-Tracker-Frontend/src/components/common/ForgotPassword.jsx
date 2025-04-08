import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post('/users/forgotpassword', { email: data.email });
      toast.success('Password reset link sent to your email');
    } catch (err) {
      toast.error('Failed to send reset link. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <label>Forgot Password</label>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Enter your email"
            {...register('email', { required: true })}
            disabled={loading}
          />
          {errors.email && <p className="error">Email is required</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>

      <ToastContainer position="top-center" />

      {/* Internal CSS */}
      <style>{`
        .forgot-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
          background: linear-gradient(to bottom, #AAB99A);
          position: absolute;
          top: 0;
          left: 0;
          padding: 20px;
          overflow: hidden;
        }

        .forgot-box {
          width: 400px;
          max-width: 90%;
          padding: 30px;
          background-color: #D0DDD0;
          border-radius: 50px 50px 10px 10px;
          box-shadow: 5px 20px 50px rgba(0, 0, 0, 0.3);
          text-align: center;
        }

        .forgot-box label {
          font-size: 1.8em;
          font-weight: bold;
          color: white;
          margin-bottom: 20px;
          display: block;
        }

        .forgot-box input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 30px;
          font-size: 1em;
          margin: 10px 0;
        }

        .forgot-box input:disabled {
          background-color: #f0f0f0;
        }

        .forgot-box button {
          width: 100%;
          padding: 12px;
          background: #AAB99A;
          color: #fff;
          border: solid 1px #AAB99A;
          border-radius: 30px;
          font-size: 1em;
          cursor: pointer;
          margin-top: 10px;
        }

        .forgot-box button:hover {
          background: #5A6E58;
        }

        .forgot-box button:disabled {
          background-color: #999;
          cursor: not-allowed;
        }

        .error {
          color: red;
          font-size: 12px;
          margin-top: 5px;
        }

        @media screen and (max-width: 480px) {
          .forgot-box {
            padding: 20px;
            border-radius: 30px;
          }

          .forgot-box label {
            font-size: 1.5em;
          }

          .forgot-box input {
            padding: 10px;
            font-size: 0.9em;
          }

          .forgot-box button {
            font-size: 0.9em;
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};
