export default function AboutPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-pink-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-r from-indigo-600 to-pink-700 py-20 px-4">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative container max-w-3xl mx-auto text-center text-white">
          <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-white/20 border border-white/30 mb-4">
            About Us
          </span>
          <h1 className="text-4xl font-bold mb-4">We Care About Your Health</h1>
          <p className="text-white/80 text-sm leading-relaxed max-w-xl mx-auto">
            MEDISTORE is your trusted online pharmacy — licensed, genuine, and dedicated to delivering quality medicines right to your doorstep.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'Our Mission',
              desc: 'To make quality healthcare accessible to everyone by providing genuine medicines, expert advice, and fast delivery — all in one place.',
              bg: 'bg-linear-to-br from-indigo-600 to-violet-600',
              border: 'border-indigo-200',
              shadow: 'shadow-indigo-100',
            },
            {
              title: 'Our Vision',
              desc: 'To become the most trusted digital pharmacy in the country, bridging the gap between patients and quality healthcare products.',
              bg: 'bg-linear-to-br from-pink-500 to-rose-600',
              border: 'border-pink-200',
              shadow: 'shadow-pink-100',
            },
          ].map(({ title, desc, bg, border, shadow }) => (
            <div key={title} className={`relative bg-white rounded-2xl border-2 ${border} shadow-lg ${shadow} p-8 overflow-hidden`}>
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${bg} rounded-t-2xl`} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-t border-b border-gray-100 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '10,000+', label: 'Happy Customers' },
              { value: '500+',    label: 'Products' },
              { value: '50+',     label: 'Expert Pharmacists' },
              { value: '24/7',    label: 'Support Available' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <p className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">{value}</p>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-indigo-600 text-white mb-4">Our Values</span>
          <h2 className="text-2xl font-bold text-gray-900">What We Stand For</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { emoji: '🛡️', title: 'Trust',       desc: 'Every product is verified and sourced from licensed manufacturers.' },
            { emoji: '💊', title: 'Quality',     desc: 'We never compromise on the quality of medicines we deliver.' },
            { emoji: '🚀', title: 'Speed',       desc: 'Fast, reliable delivery so you get your medicines when you need them.' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border-2 border-indigo-100 shadow-lg shadow-indigo-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-indigo-600 to-pink-600 rounded-t-2xl" />
              <span className="text-4xl mb-4">{emoji}</span>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}