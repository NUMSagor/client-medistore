export default function PrivacyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, such as your name, email address, phone number, shipping address, and payment information when you create an account or place an order.',
    },
    {
      title: 'How We Use Your Information',
      content: 'We use the information we collect to process orders, send order confirmations, provide customer support, send promotional communications (with your consent), and improve our services.',
    },
    {
      title: 'Information Sharing',
      content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business.',
    },
    {
      title: 'Data Security',
      content: 'We implement industry-standard security measures to protect your personal information. All transactions are encrypted using SSL technology.',
    },
    {
      title: 'Cookies',
      content: 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can choose to disable cookies through your browser settings.',
    },
    {
      title: 'Your Rights',
      content: 'You have the right to access, update, or delete your personal information at any time. Contact us at support@medistore.com to exercise these rights.',
    },
    {
      title: 'Changes to This Policy',
      content: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated date.',
    },
  ];

  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-pink-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-r from-indigo-600 to-pink-700 py-20 px-4">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative container max-w-3xl mx-auto text-center text-white">
          <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-white/20 border border-white/30 mb-4">
            Legal
          </span>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-white/80 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </section>

      {/* Content */}
      <section className="container max-w-3xl mx-auto px-4 py-16">
        <div className="flex flex-col gap-6">
          {sections.map(({ title, content }, i) => (
            <div key={title} className="relative bg-white rounded-2xl border-2 border-indigo-100 shadow-lg shadow-indigo-50 p-8 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-indigo-600 to-pink-600 rounded-t-2xl" />
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{content}</p>
            </div>
          ))}
        </div>

        {/* Contact Box */}
        <div className="mt-8 relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-600 to-pink-700 p-8 text-center text-white">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
          <h3 className="font-bold text-xl mb-2">Questions about our Privacy Policy?</h3>
          <p className="text-white/70 text-sm mb-4">We're happy to help clarify anything.</p>
          <a href="/contact" className="inline-block bg-white text-indigo-700 font-bold text-sm px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
}