export default function TermsPage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing and using MEDISTORE, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.',
    },
    {
      title: 'Use of Service',
      content: 'You must be at least 18 years old to use our service. You agree to use our platform only for lawful purposes and in a way that does not infringe the rights of others.',
    },
    {
      title: 'Product Information',
      content: 'We strive to provide accurate product information. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free. Consult a healthcare professional before using any medication.',
    },
    {
      title: 'Orders & Payment',
      content: 'By placing an order, you agree to pay the specified price. We reserve the right to cancel orders in case of pricing errors or stock unavailability. Payments are processed securely.',
    },
    {
      title: 'Prescription Medicines',
      content: 'Certain medicines require a valid prescription. By ordering prescription medicines, you confirm that you have a valid prescription. We reserve the right to verify prescriptions.',
    },
    {
      title: 'Returns & Refunds',
      content: 'Due to the nature of pharmaceutical products, returns are only accepted for damaged or incorrect items. Refund requests must be submitted within 48 hours of delivery.',
    },
    {
      title: 'Limitation of Liability',
      content: 'MEDISTORE shall not be liable for any indirect, incidental, or consequential damages arising from the use of our service. Our liability is limited to the amount paid for the specific order.',
    },
    {
      title: 'Changes to Terms',
      content: 'We reserve the right to modify these terms at any time. Continued use of our service after changes constitutes acceptance of the new terms.',
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
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-white/80 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </section>

      {/* Content */}
      <section className="container max-w-3xl mx-auto px-4 py-16">
        <div className="flex flex-col gap-6">
          {sections.map(({ title, content }, i) => (
            <div key={title} className="relative bg-white rounded-2xl border-2 border-pink-100 shadow-lg shadow-pink-50 p-8 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-pink-600 to-indigo-600 rounded-t-2xl" />
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-pink-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{content}</p>
            </div>
          ))}
        </div>

        {/* Contact Box */}
        <div className="mt-8 relative overflow-hidden rounded-2xl bg-linear-to-r from-pink-600 to-indigo-700 p-8 text-center text-white">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
          <h3 className="font-bold text-xl mb-2">Questions about our Terms?</h3>
          <p className="text-white/70 text-sm mb-4">Our team is happy to help clarify anything.</p>
          <a href="/contact" className="inline-block bg-white text-pink-700 font-bold text-sm px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
}