'use client';


import { Suspense } from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ChevronRight, ArrowRight, ShieldCheck, Truck, Clock,
  Star, Zap, HeartPulse, BadgeCheck, Headphones,
  ShoppingCart, Mail, Phone, Facebook, Twitter, Instagram, Youtube,
} from 'lucide-react';
import api from '@/lib/api';
import { useCart } from '@/app/provider/CartProvider';
import { Product } from '@/types/products';

interface Category {
  id: string;
  name: string;
}

const slides = [
  {
    id: 1,
    tag: 'Flash Sale — Today Only',
    title: 'Up to 40% off\nVitamins & Supplements',
    subtitle: 'Boost your immunity with our curated wellness range. Genuine brands, fast delivery.',
    cta: 'Shop Now',
    href: '/shop',
    bg: 'from-indigo-600 to-pink-700',
  },
  {
    id: 2,
    tag: 'New Arrivals',
    title: 'Advanced Diabetes\nCare Range',
    subtitle: 'Glucometers, test strips, insulin pens and more — all in one place.',
    cta: 'Explore Range',
    href: '/shop',
    bg: 'from-pink-600 to-indigo-700',
  },
  {
    id: 3,
    tag: 'Free Delivery',
    title: 'Order over $50\nShip for Free',
    subtitle: 'Fast, discreet doorstep delivery. Licensed pharmacy, 100% genuine products.',
    cta: 'Start Shopping',
    href: '/shop',
    bg: 'from-indigo-700 to-violet-700',
  },
];

const trustItems = [
  { icon: ShieldCheck, label: '100% Genuine',  sub: 'Licensed & verified products' },
  { icon: Truck,       label: 'Fast Delivery',  sub: 'Orders ship within 24h' },
  { icon: Clock,       label: '24/7 Support',   sub: "We're always here for you" },
];

const whyItems = [
  {
    icon: BadgeCheck,
    title: 'Licensed Pharmacy',
    desc: 'Every product is sourced from certified manufacturers and verified for authenticity.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: Truck,
    title: 'Fast Doorstep Delivery',
    desc: 'Same-day or next-day delivery available. Your medicines reach you when you need them.',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    icon: HeartPulse,
    title: 'Expert Health Advice',
    desc: 'Our pharmacists are available to guide you on medications, dosage, and wellness.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: Headphones,
    title: '24/7 Customer Support',
    desc: 'Round-the-clock support via phone, email, or chat. We are always here for you.',
    color: 'bg-emerald-50 text-emerald-600',
  },
];

const footerLinks = [
  {
    title: 'Shop',
    links: [
      { name: 'All Products', href: '/shop' },
      { name: 'Offers & Deals', href: '/offers' },
      { name: 'New Arrivals', href: '/shop' },
      { name: 'Best Sellers', href: '/shop' },
    ],
  },
  {
    title: 'Account',
    links: [
      { name: 'Login', href: '/login' },
      { name: 'Register', href: '/register' },
      { name: 'My Orders', href: '/dashboard' },
      { name: 'Profile', href: '/profile' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'About Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/contact' },
      { name: 'Terms of Service', href: '/contact' },
    ],
  },
];

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const discount = product.discountPercent ?? 0;
  const finalPrice = product.price - (product.price * discount) / 100;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <Link href={`/shop/${product.id}`} className="block relative h-44 bg-gray-50 overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl select-none">💊</div>
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500 border border-gray-300 px-3 py-1 rounded-full bg-white">Out of Stock</span>
          </div>
        )}
      </Link>
      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide mb-1">{product.category?.name}</p>
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-0.5 hover:text-indigo-600 transition-colors line-clamp-2">{product.name}</h3>
        </Link>
        <p className="text-xs text-gray-400 mb-3">{product.genericName}</p>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold text-indigo-600">${finalPrice.toFixed(2)}</span>
          {discount > 0 && <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>}
        </div>
        <div className="mt-auto flex gap-2">
          <Link href={`/shop/${product.id}`} className="flex-1 text-center text-sm font-semibold bg-gradient-to-r from-indigo-600 to-pink-700 text-white py-2 rounded-lg hover:opacity-90 transition-opacity">
            Details
          </Link>
          <button
            disabled={product.stock === 0}
            onClick={() => addToCart(product)}
            className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
          <div className="h-44 bg-gray-100" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
            <div className="h-8 bg-gray-100 rounded mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function HomeContent() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const slide = slides[activeSlide];

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});

    api.get('/seller/medicines')
      .then((res) => {
        const all: Product[] = Array.isArray(res.data) ? res.data : [];
        setFeatured(all.slice(0, 8));
        setDeals(all.filter((p) => (p.discountPercent ?? 0) > 0).slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="container max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 items-stretch">
          <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b bg-gradient-to-r from-indigo-600 to-pink-700">
              <p className="text-xs font-bold text-white tracking-widest uppercase">Categories</p>
            </div>
            <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto">
              {categories.length === 0
                ? Array.from({ length: 8 }).map((_, i) => (
                    <li key={i} className="px-4 py-3"><div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" /></li>
                  ))
                : categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/shop?category=${cat.id}`}
                        onMouseEnter={() => setHoveredCategory(cat.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-150
                          ${hoveredCategory === cat.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <span>{cat.name}</span>
                        <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-150 ${hoveredCategory === cat.id ? 'translate-x-0.5 text-indigo-500' : 'text-gray-300'}`} />
                      </Link>
                    </li>
                  ))
              }
            </ul>
            <div className="px-4 py-3 border-t">
              <Link href="/shop" className="flex items-center justify-center gap-1 w-full text-xs font-semibold text-indigo-600 hover:text-pink-600 transition-colors">
                View all products <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </aside>

          <div className="flex-1 flex flex-col gap-4">
            <div className={`relative overflow-hidden rounded-xl bg-linear-to-br ${slide.bg} text-white min-h-[320px] flex items-center px-10 py-10`}>
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute -bottom-10 right-24 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 max-w-lg">
                <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold rounded-full bg-white/20 border border-white/30 tracking-wide">{slide.tag}</span>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3 whitespace-pre-line tracking-tight">{slide.title}</h1>
                <p className="text-sm text-white/80 leading-relaxed mb-6 max-w-sm">{slide.subtitle}</p>
                <Link href={slide.href} className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold text-sm px-6 py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  {slide.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="absolute bottom-5 right-6 flex gap-2">
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setActiveSlide(i)}
                    className={`rounded-full transition-all duration-300 ${i === activeSlide ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {trustItems.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="md:hidden px-4 pb-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Categories</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.id}`}
              className="shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="container max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Featured Medicines</h2>
            <p className="text-sm text-gray-500 mt-0.5">Top picks from our pharmacy</p>
          </div>
          <Link href="/shop" className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-pink-600 transition-colors">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loadingProducts ? <ProductSkeleton /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>

      {!loadingProducts && deals.length > 0 && (
        <section className="container max-w-7xl mx-auto px-4 pb-10">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-700 p-8 mb-6">
            <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5" />
                  <span className="text-xs font-bold tracking-widest uppercase opacity-80">Special Offers</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">Save big on top medicines</h2>
                <p className="text-sm text-white/80">Limited time discounts on best-selling products</p>
              </div>
              <Link href="/offers" className="shrink-0 inline-flex items-center gap-2 bg-white text-indigo-700 font-bold text-sm px-6 py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                See All Offers <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {deals.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}


      {/* ── Expert Support ───── */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="container max-w-7xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-2">Expert Support</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Talk to a specialist, anytime</h2>
            <p className="text-sm text-gray-500">Our licensed pharmacists and health advisors are here to help you make informed decisions.</p>
          </div>

          {/* Specialist Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {[
              {
                image: 'https://randomuser.me/api/portraits/men/32.jpg',
                name: 'Dr. Rafiq Patel',
                role: 'Clinical Pharmacist · 12 yrs',
                tags: ['Drug interactions', 'Dosage', 'Chronic care'],
                gradient: 'from-indigo-600 to-violet-600',
              },
              {
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                name: 'Sara Jahan',
                role: 'Health Advisor · 8 yrs',
                tags: ['Vitamins', 'Supplements', 'Wellness'],
                gradient: 'from-pink-600 to-indigo-600',
              },
              {
                image: 'https://randomuser.me/api/portraits/women/68.jpg',
                name: 'Dr. Mina Karim',
                role: 'Diabetes Specialist · 10 yrs',
                tags: ['Diabetes', 'Insulin', 'Diet'],
                gradient: 'from-indigo-700 to-pink-700',
              },
              {
                image: 'https://randomuser.me/api/portraits/men/75.jpg',
                name: 'Tanvir Hossain',
                role: 'Pediatric Advisor · 6 yrs',
                tags: ['Child health', 'Vaccines', 'Nutrition'],
                gradient: 'from-violet-600 to-pink-600',
              },
              {
                image: 'https://randomuser.me/api/portraits/men/75.jpg',
                name: 'Tanvir Hossain',
                role: 'Pediatric Advisor · 6 yrs',
                tags: ['Child health', 'Vaccines', 'Nutrition'],
                gradient: 'from-violet-600 to-pink-600',
              },
              
            ].map((s) => (
              <div key={s.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
                {/* Gradient top bar + image */}
                <div className={`relative h-32 bg-gradient-to-br ${s.gradient} flex items-end justify-center`}>
                  <div className="absolute -bottom-8 w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-sm">
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 pt-10 pb-5 px-4 items-center text-center">
                  <p className="font-semibold text-gray-900 text-sm mb-0.5">{s.name}</p>
                  <p className="text-xs text-gray-500 mb-3">{s.role}</p>
                  <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                    {s.tags.map((tag) => (
                      <span key={tag} className="text-[11px] px-2 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="mt-auto w-full text-sm font-semibold bg-gradient-to-r from-indigo-600 to-pink-700 text-white rounded-lg py-2 hover:opacity-90 transition-opacity">
                    Consult now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Hotline Bar */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-pink-700 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-6 left-1/3 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/70 mb-0.5">24/7 pharmacist hotline</p>
                <p className="text-base font-semibold text-white">+1 (800) 123-4567</p>
              </div>
            </div>
            <div className="relative flex gap-3">
              <button className="text-sm font-semibold border border-white/40 text-white rounded-lg px-5 py-2 hover:bg-white/10 transition-colors">
                Live chat
              </button>
              <button className="text-sm font-semibold bg-white text-indigo-700 rounded-lg px-5 py-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                Call now
              </button>
            </div>
          </div>

        </div>
      </section>



      <section className="bg-white border-t border-gray-100 py-14">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Why Choose MEDISTORE?</h2>
            <p className="text-sm text-gray-500 mt-2">Trusted by thousands of customers across the country</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyItems.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-4`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-white mb-4">
                <span className="w-8 h-8 rounded-lg bg-lonear-to-br from-indigo-500 to-pink-600 flex items-center justify-center text-white text-sm font-black">M</span>
                MEDISTORE
              </Link>
              <p className="text-sm leading-relaxed mb-5 max-w-xs">
                Your trusted online pharmacy. Licensed, genuine, and delivered with care to your doorstep.
              </p>
              <div className="flex flex-col gap-2">
                <a href="tel:+18001234567" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                  <Phone className="h-4 w-4 text-indigo-400" /> +1 (800) 123-4567
                </a>
                <a href="mailto:support@medistore.com" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                  <Mail className="h-4 w-4 text-indigo-400" /> support@medistore.com
                </a>
              </div>
            </div>
            {footerLinks.map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">{col.title}</h4>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-800">
          <div className="container max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">© {new Date().getFullYear()} MEDISTORE. All rights reserved.</p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs bg-gray-800 px-3 py-1.5 rounded-full">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" /> SSL Secured
              </span>
              <span className="flex items-center gap-1 text-xs bg-gray-800 px-3 py-1.5 rounded-full">
                <Star className="h-3.5 w-3.5 text-yellow-400" /> Licensed Pharmacy
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}