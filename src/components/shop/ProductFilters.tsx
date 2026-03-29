// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, useSearchParams, usePathname } from 'next/navigation';
// import { Search, SlidersHorizontal, X } from 'lucide-react';
// import api from '@/lib/api';

// interface Category {
//   id: string;
//   name: string;
// }

// export default function ProductFilters() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [search, setSearch] = useState(searchParams.get('search') || '');
//   const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
//   const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
//   const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
//   const [sort, setSort] = useState(searchParams.get('sort') || '');

//   // Fetch categories from backend
//   useEffect(() => {
//     api.get('/categories').then((res) => {
//       const data = Array.isArray(res.data) ? res.data : [];
//       setCategories(data);
//     }).catch(() => {});
//   }, []);

//   // Push updated query params to URL
//   const applyFilters = (overrides: Record<string, string> = {}) => {
//     const params = new URLSearchParams();
//     const s     = overrides.search      ?? search;
//     const cat   = overrides.category    ?? selectedCategory;
//     const min   = overrides.minPrice    ?? minPrice;
//     const max   = overrides.maxPrice    ?? maxPrice;
//     const srt   = overrides.sort        ?? sort;

//     if (s)   params.set('search', s);
//     if (cat) params.set('category', cat);
//     if (min) params.set('minPrice', min);
//     if (max) params.set('maxPrice', max);
//     if (srt) params.set('sort', srt);

//     router.push(`${pathname}?${params.toString()}`);
//   };

//   const clearAll = () => {
//     setSearch('');
//     setSelectedCategory('');
//     setMinPrice('');
//     setMaxPrice('');
//     setSort('');
//     router.push(pathname);
//   };

//   const hasFilters = search || selectedCategory || minPrice || maxPrice || sort;

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
//       {/* Header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-indigo-600 to-pink-700">
//         <div className="flex items-center gap-2 text-white">
//           <SlidersHorizontal className="h-4 w-4" />
//           <span className="text-xs font-bold tracking-widest uppercase">Filters</span>
//         </div>
//         {hasFilters && (
//           <button
//             onClick={clearAll}
//             className="flex items-center gap-1 text-white/80 hover:text-white text-xs transition-colors"
//           >
//             <X className="h-3 w-3" /> Clear
//           </button>
//         )}
//       </div>

//       <div className="p-4 flex flex-col gap-5">

//         {/* Search */}
//         <div>
//           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Search</p>
//           <div className="relative">
//             <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Medicine name..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search })}
//               className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors"
//             />
//           </div>
//         </div>

//         {/* Category */}
//         {categories.length > 0 && (
//           <div>
//             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</p>
//             <ul className="flex flex-col gap-1">
//               <li>
//                 <button
//                   onClick={() => { setSelectedCategory(''); applyFilters({ category: '' }); }}
//                   className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
//                     !selectedCategory
//                       ? 'bg-indigo-50 text-indigo-700 font-semibold'
//                       : 'text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   All Categories
//                 </button>
//               </li>
//               {categories.map((cat) => (
//                 <li key={cat.id}>
//                   <button
//                     onClick={() => { setSelectedCategory(cat.id); applyFilters({ category: cat.id }); }}
//                     className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
//                       selectedCategory === cat.id
//                         ? 'bg-indigo-50 text-indigo-700 font-semibold'
//                         : 'text-gray-700 hover:bg-gray-50'
//                     }`}
//                   >
//                     {cat.name}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Price Range */}
//         <div>
//           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Price Range</p>
//           <div className="flex items-center gap-2">
//             <input
//               type="number"
//               placeholder="Min"
//               value={minPrice}
//               min={0}
//               onChange={(e) => setMinPrice(e.target.value)}
//               className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors"
//             />
//             <span className="text-gray-400 text-sm">–</span>
//             <input
//               type="number"
//               placeholder="Max"
//               value={maxPrice}
//               min={0}
//               onChange={(e) => setMaxPrice(e.target.value)}
//               className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors"
//             />
//           </div>
//         </div>

//         {/* Sort */}
//         <div>
//           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sort By</p>
//           <select
//             value={sort}
//             onChange={(e) => { setSort(e.target.value); applyFilters({ sort: e.target.value }); }}
//             className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors bg-white"
//           >
//             <option value="">Default</option>
//             <option value="price_asc">Price: Low to High</option>
//             <option value="price_desc">Price: High to Low</option>
//             <option value="newest">Newest First</option>
//             <option value="name_asc">Name: A–Z</option>
//           </select>
//         </div>

//         {/* Apply Button */}
//         <button
//           onClick={() => applyFilters()}
//           className="w-full bg-gradient-to-r from-indigo-600 to-pink-700 text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity"
//         >
//           Apply Filters
//         </button>

//       </div>
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import api from '@/lib/api';

interface Category {
  id: string;
  name: string;
}

export default function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  // Fetch categories from backend
  useEffect(() => {
    api.get('/categories').then((res) => {
      const data = Array.isArray(res.data) ? res.data : [];
      setCategories(data);
    }).catch(() => {});
  }, []);

  // Push updated query params to URL
  const applyFilters = (overrides: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    const s     = overrides.search      ?? search;
    const cat   = overrides.category    ?? selectedCategory;
    const min   = overrides.minPrice    ?? minPrice;
    const max   = overrides.maxPrice    ?? maxPrice;
    const srt   = overrides.sort        ?? sort;

    if (s)   params.set('search', s);
    if (cat) params.set('category', cat);
    if (min) params.set('minPrice', min);
    if (max) params.set('maxPrice', max);
    if (srt) params.set('sort', srt);

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    setSearch('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('');
    router.push(pathname);
  };

  const hasFilters = search || selectedCategory || minPrice || maxPrice || sort;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-linear-to-r from-indigo-600 to-pink-700">
        <div className="flex items-center gap-2 text-white">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-xs font-bold tracking-widest uppercase">Filters</span>
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-white/80 hover:text-white text-xs transition-colors"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      <div className="p-4 flex flex-col gap-5">

        {/* Search */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Search</p>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Medicine name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search })}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Category */}
        {categories.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</p>
            <ul className="flex flex-col gap-1">
              <li>
                <button
                  onClick={() => { setSelectedCategory(''); applyFilters({ category: '' }); }}
                  className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    !selectedCategory
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => { setSelectedCategory(cat.id); applyFilters({ category: cat.id }); }}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Price Range */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Price Range</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              min={0}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors"
            />
            <span className="text-gray-400 text-sm">–</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              min={0}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Sort */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sort By</p>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); applyFilters({ sort: e.target.value }); }}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors bg-white"
          >
            <option value="">Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="name_asc">Name: A–Z</option>
          </select>
        </div>

        {/* Apply Button */}
        <button
          onClick={() => applyFilters()}
          className="w-full bg-linear-to-r from-indigo-600 to-pink-700 text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          Apply Filters
        </button>

      </div>
    </div>
  );
}