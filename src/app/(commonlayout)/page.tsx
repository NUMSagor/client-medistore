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
import Image from "next/image";

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
  { icon: ShieldCheck, label: '100% Genuine', sub: 'Licensed & verified products' },
  { icon: Truck, label: 'Fast Delivery', sub: 'Orders ship within 24h' },
  { icon: Clock, label: '24/7 Support', sub: "We're always here for you" },
];

const whyItems = [
  {
    icon: BadgeCheck,
    title: 'Licensed Pharmacy',
    desc: 'Every product is sourced from certified manufacturers and verified for authenticity.',
    bg: 'bg-linear-to-br from-indigo-600 to-violet-600',
    border: 'border-indigo-200',
    shadow: 'shadow-indigo-100',
  },
  {
    icon: Truck,
    title: 'Fast Doorstep Delivery',
    desc: 'Same-day or next-day delivery available. Your medicines reach you when you need them.',
    bg: 'bg-linear-to-br from-pink-500 to-rose-600',
    border: 'border-pink-200',
    shadow: 'shadow-pink-100',
  },
  {
    icon: HeartPulse,
    title: 'Expert Health Advice',
    desc: 'Our pharmacists are available to guide you on medications, dosage, and wellness.',
    bg: 'bg-linear-to-br from-emerald-500 to-teal-600',
    border: 'border-emerald-200',
    shadow: 'shadow-emerald-100',
  },
  {
    icon: Headphones,
    title: '24/7 Customer Support',
    desc: 'Round-the-clock support via phone, email, or chat. We are always here for you.',
    bg: 'bg-linear-to-br from-orange-500 to-amber-500',
    border: 'border-orange-200',
    shadow: 'shadow-orange-100',
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
      { name: 'About Us', href: '/about' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  },
];

const specialists = [
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
    image: 'https://randomuser.me/api/portraits/men/41.jpg',
    name: 'Kamarul Hassan',
    role: 'Ortho Specialist · 9 yrs',
    tags: ['D-Ortho', 'Sports Medicine'],
    gradient: 'from-indigo-600 to-pink-700',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/56.jpg',
    name: 'Akhter Khan',
    role: 'Genetics Advisor · 7 yrs',
    tags: ['Genetics', 'Reproduction'],
    gradient: 'from-pink-700 to-violet-700',
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
          <Link href={`/shop/${product.id}`} className="flex-1 text-center text-sm font-semibold bg-linear-to-r from-indigo-600 to-pink-700 text-white py-2 rounded-lg hover:opacity-90 transition-opacity">
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
      .catch(() => { });

    api.get('/seller/medicines')
      .then((res) => {
        const all: Product[] = Array.isArray(res.data) ? res.data : [];
        setFeatured(all.slice(0, 8));
        setDeals(all.filter((p) => (p.discountPercent ?? 0) > 0).slice(0, 4));
      })
      .catch(() => { })
      .finally(() => setLoadingProducts(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero + Sidebar ── */}
      <section className="container max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 items-stretch">

          {/* Category Sidebar */}
          <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b bg-linear-to-r from-indigo-600 to-pink-700">
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

          {/* Hero Banner */}
          <div className="flex-1 flex flex-col gap-4">
            <div className={`relative overflow-hidden rounded-xl bg-linear-to-br ${slide.bg} text-white min-h-80 flex items-center px-10 py-10`}>
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

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4">
              {trustItems.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
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

      {/* ── Mobile Categories ── */}
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

      {/* ── Featured Medicines ── */}
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

      {/* ── Special Offers ── */}
      {!loadingProducts && deals.length > 0 && (
        <section className="container max-w-7xl mx-auto px-4 pb-10">
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-600 to-pink-700 p-8 mb-6">
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


      {/* ── Expert Support ── */}

      <section className="py-20 bg-linear-to-br from-indigo-50 via-white to-pink-50 border-t border-b border-indigo-100 relative overflow-hidden">

        {/* Animated floating pills & capsules */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-5 animate-float-slow opacity-20 text-4xl">💊</div>
          <div className="absolute bottom-32 right-10 animate-float-medium opacity-20 text-5xl">💊</div>
          <div className="absolute top-1/2 left-1/4 animate-float-fast opacity-10 text-3xl">💊</div>
          <div className="absolute bottom-20 left-1/3 animate-float-slow opacity-15 text-4xl">💊</div>
          <div className="absolute top-40 right-20 animate-float-medium opacity-10 text-5xl">💊</div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 relative z-10">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-5 py-2 rounded-full border border-indigo-200 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-indigo-700">Live Specialist Support</span>
              <span className="w-px h-4 bg-indigo-200 mx-1"></span>
              <span className="text-sm text-gray-500">Included with every order</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Pharmacy Team
              <div className="h-1 w-20 bg-linear-to-r from-indigo-500 to-pink-500 mx-auto mt-3 rounded-full"></div>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Not just a delivery — you get real pharmacists reviewing your meds before they ship
            </p>
          </div>

          {/* MAIN WIDE BANNER - Doctor Consultation Support */}
          <div className="relative mb-16 group">
            {/* Animated gradient border */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-600 via-pink-600 to-indigo-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500 animate-gradient-x"></div>

            {/* Main banner content */}
            <div className="relative bg-linear-to-br from-indigo-600 via-indigo-700 to-pink-700 rounded-2xl overflow-hidden shadow-2xl">

              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 15 L45 15 L38 23 L41 33 L30 27 L19 33 L22 23 L15 15 L25 15 Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px'
              }} />

              {/* Floating elements */}
              <div className="absolute top-10 right-10 text-6xl opacity-10 animate-float-slow">👩‍⚕️</div>
              <div className="absolute bottom-10 left-10 text-7xl opacity-10 animate-float-medium">💊</div>
              <div className="absolute top-1/2 right-1/4 text-5xl opacity-5 animate-float-fast">⭐</div>

              <div className="relative p-8 md:p-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

                  {/* Left side - Text Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6">
                      <span className="text-yellow-300 text-sm">🏆</span>
                      <span className="text-white text-xs font-bold tracking-wide">EXPERT CONSULTATION</span>
                      <span className="w-1 h-1 rounded-full bg-white/40"></span>
                      <span className="text-white/80 text-xs">24/7 Available</span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      Talk to a Doctor
                      <span className="block text-transparent bg-clip-text bg-linear-to-r from-yellow-200 to-pink-200">
                        From Your Pharmacy
                      </span>
                    </h3>

                    <p className="text-white/80 text-base md:text-lg mb-6 max-w-lg mx-auto lg:mx-0">
                      Get professional medical advice, prescription reviews, and health guidance — all without leaving your home.
                    </p>

                    {/* Features grid */}
                    <div className="grid grid-cols-2 gap-3 mb-8 max-w-md mx-auto lg:mx-0">
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                        <span>Free consultation</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                        <span>No insurance needed</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                        <span>Licensed doctors</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                        <span>Prescription support</span>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                      <button className="group px-8 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2">
                        <span>📞</span>
                        Call Now: +1 (800) 123-4567
                      </button>
                      <button className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                        <span>💬</span>
                        Start Live Chat
                      </button>
                    </div>

                    <p className="text-white/50 text-xs mt-4">Free for first-time patients • No commitment required</p>
                  </div>

                  {/* Right side - Visual/Image Area */}
                  <div className="flex-1 flex justify-center lg:justify-end">
                    <div className="relative">
                      {/* Glowing circle behind */}
                      <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl"></div>

                      {/* Doctor avatar stack with animation */}
                      <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="text-center mb-4">
                          <div className="flex -space-x-3 justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-300 to-indigo-400 border-3 border-white flex items-center justify-center text-3xl shadow-lg animate-bounce-slow">
                              👩‍⚕️
                            </div>
                            <div className="w-16 h-16 rounded-full bg-linear-to-br from-pink-300 to-pink-400 border-3 border-white flex items-center justify-center text-3xl shadow-lg animate-bounce-slow delay-150">
                              👨‍⚕️
                            </div>
                            <div className="w-16 h-16 rounded-full bg-linear-to-br from-purple-300 to-purple-400 border-3 border-white flex items-center justify-center text-3xl shadow-lg animate-bounce-slow delay-300">
                              👩‍🔬
                            </div>
                          </div>

                          <div className="text-white font-bold text-lg">12+ Specialists Online</div>
                          <div className="flex items-center justify-center gap-1 mt-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-white/70 text-xs">Average wait time: &lt; 30 seconds</span>
                          </div>

                          <div className="mt-4 pt-4 border-t border-white/20">
                            <div className="flex justify-center gap-4 text-xs text-white/60">
                              <div className="text-center">
                                <div className="font-bold text-white text-lg">98%</div>
                                <div>Satisfaction</div>
                              </div>
                              <div className="w-px bg-white/20"></div>
                              <div className="text-center">
                                <div className="font-bold text-white text-lg">24/7</div>
                                <div>Availability</div>
                              </div>
                              <div className="w-px bg-white/20"></div>
                              <div className="text-center">
                                <div className="font-bold text-white text-lg">50k+</div>
                                <div>Patients helped</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom accent bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white/50 to-transparent"></div>
            </div>
          </div>

          {/* Prescription Journey Timeline */}
          <div className="relative mb-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-indigo-100 shadow-xl p-8 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-indigo-100/30 blur-2xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-pink-100/30 blur-2xl" />

              <div className="relative text-center mb-8">
                <span className="text-3xl mb-2 inline-block">🛡️</span>
                <h3 className="text-2xl font-bold text-gray-900">Your Prescription Journey</h3>
                <p className="text-gray-500 text-sm">Every order gets specialist attention at 4 key stages</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Connecting line */}
                <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-linear-to-r from-indigo-200 via-pink-200 to-indigo-200" />

                {[
                  { step: '01', title: 'Order Placed', icon: '📦', desc: 'Automated safety check', color: 'indigo' },
                  { step: '02', title: 'Pharmacist Review', icon: '🔍', desc: 'Interaction screening', color: 'pink' },
                  { step: '03', title: 'Doctor Consult', icon: '👨‍⚕️', desc: 'If medication needed', color: 'purple' },
                  { step: '04', title: 'Quality Seal', icon: '✅', desc: 'Ready to ship', color: 'emerald' },
                ].map((item, idx) => (
                  <div key={idx} className="relative bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm hover:shadow-md transition group">
                    <div className={`w-10 h-10 rounded-full bg-${item.color}-100 flex items-center justify-center mx-auto mb-3 text-${item.color}-600 font-bold text-sm border-2 border-${item.color}-200 group-hover:scale-110 transition`}>
                      {item.step}
                    </div>
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom CTA - Free Medicine Guide */}
          <div className="relative">
            <div className="bg-linear-to-r from-indigo-600 via-indigo-500 to-pink-600 rounded-2xl p-0.5 shadow-2xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-5xl">🎓</div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">Free Medication Guide</p>
                    <p className="text-white font-bold text-lg">Download "Ask Your Pharmacist" PDF</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-2.5 bg-white text-indigo-700 font-bold rounded-xl shadow-md hover:shadow-xl transition text-sm">
                    Download Free
                  </button>
                  <button className="px-6 py-2.5 bg-white/10 border border-white/30 text-white font-medium rounded-xl hover:bg-white/20 transition text-sm">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <style jsx>{`
    @keyframes float-slow {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(10deg); }
    }
    @keyframes float-medium {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(-8deg); }
    }
    @keyframes float-fast {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(5deg); }
    }
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    @keyframes gradient-x {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
    .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
    .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
    .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
    .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 3s ease infinite; }
    .delay-150 { animation-delay: 0.15s; }
    .delay-300 { animation-delay: 0.3s; }
  `}</style>
      </section>


      {/* ── Why Choose Us ── */}

      <section className="py-16 bg-linear-to-br from-pink-50 via-white to-indigo-50 border-t border-b border-pink-100">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-pink-600 text-white mb-4 shadow-sm">
              Why Choose Us
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose MEDISTORE?</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Trusted by thousands of customers across the country
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyItems.map(({ icon: Icon, title, desc, bg, border, shadow }) => (
              <div key={title} className={`relative flex flex-col items-center text-center p-8 rounded-2xl bg-white border-2 ${border} shadow-lg ${shadow} hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden`}>
                {/* top accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${bg} rounded-t-2xl`} />
                <div className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center mb-5 shadow-md`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative overflow-hidden bg-linear-to-br from-indigo-900 via-indigo-800 to-pink-900 text-indigo-200">
        {/* Background blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-10 right-1/3 w-48 h-48 rounded-full bg-pink-500/10 pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-56 h-56 rounded-full bg-indigo-500/10 pointer-events-none" />

        <div className="relative container max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-white mb-4">
                <span className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                  <Image src="/drugs.png" alt="Logo" width={32} height={32} className="object-contain" />
                </span>
                MEDISTORE
              </Link>
              <p className="text-sm leading-relaxed mb-5 max-w-xs text-indigo-200/80">
                Your trusted online pharmacy. Licensed, genuine, and delivered with care to your doorstep.
              </p>
              <div className="flex flex-col gap-2">
                <a href="tel:+18001234567" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                  <Phone className="h-4 w-4 text-pink-400" /> +1 (800) 123-4567
                </a>
                <a href="mailto:support@medistore.com" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                  <Mail className="h-4 w-4 text-pink-400" /> support@medistore.com
                </a>
              </div>
            </div>

            {footerLinks.map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">{col.title}</h4>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-indigo-200/70 hover:text-white transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative border-t border-white/10">
          <div className="container max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-indigo-300/60">© {new Date().getFullYear()} MEDISTORE. All rights reserved.</p>

            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <Icon className="h-4 w-4 text-white" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs bg-white/10 px-3 py-1.5 rounded-full text-indigo-200">
                <ShieldCheck className="h-3.5 w-3.5 text-pink-400" /> SSL Secured
              </span>
              <span className="flex items-center gap-1 text-xs bg-white/10 px-3 py-1.5 rounded-full text-indigo-200">
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