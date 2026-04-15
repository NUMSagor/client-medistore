'use client';
import { useState } from 'react';
import { useAuth } from '../provider/AuthProvider';


export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    await forgotPassword(email);
    setSent(true);
  };

  if (sent) return <p>✅ Check your email for the OTP/reset link!</p>;

  return (
    <div>
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit}>Send Reset Email</button>
    </div>
  );
}