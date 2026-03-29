'use client';

import { useState } from 'react';
import { Mail, Phone, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Replace with your real contact API endpoint if available
      await new Promise((res) => setTimeout(res, 1200));
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email Us',
      value: 'support@medistore.com',
      sub: 'We reply within 24 hours',
    },
    {
      icon: Phone,
      label: 'Call Us',
      value: '+1 (800) 123-4567',
      sub: 'Mon–Sat, 9am to 6pm',
    },
    {
      icon: Clock,
      label: 'Working Hours',
      value: 'Mon – Sat: 9am – 6pm',
      sub: 'Sunday: Closed',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container max-w-5xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Have a question or need help? We're here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ── Contact Form ──────────────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Send a Message</h2>

            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="text-gray-800 font-semibold text-lg">Message Sent!</p>
                <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 text-sm font-semibold text-indigo-600 hover:text-pink-600 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-600 to-pink-700 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* ── Contact Info ──────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {contactInfo.map(({ icon: Icon, label, value, sub }) => (
              <div
                key={label}
                className="bg-white border border-gray-200 rounded-xl px-6 py-5 flex items-start gap-4 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}

            {/* Extra note */}
            <div className="bg-linear-to-r from-indigo-600 to-pink-700 rounded-xl px-6 py-5 text-white">
              <p className="font-bold text-sm mb-1">Need urgent help?</p>
              <p className="text-xs text-white/80 leading-relaxed">
                For prescription queries or urgent medicine availability, call us directly and our pharmacist will assist you immediately.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}