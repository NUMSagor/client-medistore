'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  LayoutDashboard, 
  LogOut 
} from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/app/provider/CartProvider';
import { useAuth } from '@/app/provider/AuthProvider';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false); 
  const [accountOpen, setAccountOpen] = useState(false); 
  
  const { cart } = useCart();
  const cartCount = cart.reduce(
  (total, item) => total + item.quantity,
  0
 );



  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Offers', href: '/offers' },
    { name: 'Shop', href: '/shop' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      {/* Top Bar */}
      <div className="bg-linear-to-r from-indigo-600 to-pink-700 py-2 text-center text-xs font-medium text-white">
        Free shipping on all orders over $50!
      </div>

      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter text-black">
          <Image src="/drugs.png" alt="Logo" width="40" height="40" />
          <p>MEDISTORE</p>
        </Link>


        {/* Desktop Navigation */}
        <nav className="hidden space-x-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium hover:text-gray-600">
              {link.name}
            </Link>
          ))}
        </nav>


        {/* Icons & Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-full">
            <Search className="h-5 w-5" />
          </button>

          {/* --- ACCOUNT DROPDOWN --- */}

          <div className="relative">
            <button 
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex items-center gap-1 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <User className="h-5 w-5" />
              <ChevronDown className={`h-3 w-3 transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
            </button>

            {accountOpen && (

              <>
                {/* Invisible backdrop to close dropdown on outside click */}


                <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white py-1 shadow-lg z-20">
                  {/* {!user ? (
                    <>
                      <Link href="/login" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</Link>
                      <Link href="/register" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-indigo-600 hover:bg-gray-100 font-bold">Register</Link>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-xs text-gray-500 border-b">
                        Signed in as <span className="font-bold text-black capitalize">{user.role}</span>
                      </div>
                      <Link href="/dashboard" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                        <LayoutDashboard size={16}/> Dashboard
                      </Link>
                      <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        <LogOut size={16}/> Logout
                      </button>
                    </>
                  )} */}

                  {!user ? (
                    <>
                      <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</Link>
                      <Link href="/register" className="block px-4 py-2 text-sm text-indigo-600 hover:bg-gray-100 font-bold">Register</Link>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-xs text-gray-500 border-b">
                        Signed in as <span className="font-bold">{user.role}</span>
                      </div>
                      <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">Dashboard</Link>
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut /> Logout
                      </button>
                    </>
                  )}

                </div>
              </>
            )}
          </div>


          {/* Cart Icon */}
          <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white">
                {cartCount}
              </span>
            )}

          </Link>
          
          {/* Mobile Menu Button */}

          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-md" 
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu*/}

      <div 
        className={`fixed inset-0 bg-black/40 z-60 transition-opacity md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsOpen(false)}
      />

      <div className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-70 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2 font-bold">
            <img src="drugs.png" alt="Logo" className="w-8" />
            <span>MEDISTORE</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col p-6 gap-6">
          <div className="relative">
             <input type="text" placeholder="Search medicines..." className="w-full border rounded-lg py-2 pl-10 text-sm outline-none focus:border-indigo-600" />
             <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          <hr />
          
          {!user ? (
            <div className="flex flex-col gap-4">
              <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-700">Login</Link>
              <Link href="/register" onClick={() => setIsOpen(false)} className="text-lg font-bold text-indigo-600">Create Account</Link>
            </div>
          ) : (
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
