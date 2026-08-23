import React, { useState, Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RotatingLines } from "react-loader-spinner";
import {
  fetchProductsByFiltersAsync,
  selectAllProducts,
  selectStatus,
  selectTotalItems,
  resetProductError,
} from "../productSlice";
import { fetchBrandsAsync, selectBrands } from "../../brands/brandSlice";
import {
  fetchCategoriesAsync,
  selectCategories,
} from "../../category/categorySlice";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import Pagination from "../../common/components/Pagination";

const sortOptions = [
  { name: "Best Rating", sort: "rating", order: "desc", current: false },
  { name: "Price: Low to High", sort: "price", order: "asc", current: false },
  { name: "Price: High to Low", sort: "price", order: "desc", current: false },
];

const megaDeals = [
  {
    id: 1,
    searchKey: "iphone",
    badge: "TODAY'S MEGA DEAL • 10% OFF",
    title: "iPhone 15 Pro Max 256GB",
    subtitle: "Aerospace-grade titanium design with A17 Pro chip and 48MP main camera system.",
    price: "₹ 1,25,910",
    originalPrice: "₹ 1,39,900",
    discount: "SAVE ₹13,990",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    searchKey: "samsung",
    badge: "LIGHTNING DEAL • 12% OFF",
    title: "Samsung Galaxy S24 Ultra 5G",
    subtitle: "Mobile AI with built-in S-Pen, Titanium Frame & 200MP Quad Tele camera.",
    price: "₹ 1,14,399",
    originalPrice: "₹ 1,29,999",
    discount: "SAVE ₹15,600",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    searchKey: "macbook",
    badge: "FLAGSHIP OFFER • 8% OFF",
    title: "MacBook Pro 16-inch M3 Max",
    subtitle: "M3 Max 16-core CPU, 40-core GPU and Liquid Retina XDR display.",
    price: "₹ 3,21,908",
    originalPrice: "₹ 3,49,900",
    discount: "SAVE ₹27,992",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    searchKey: "sony",
    badge: "BESTSELLER DEAL • 15% OFF",
    title: "Sony WH-1000XM5 Headphones",
    subtitle: "Industry-leading noise canceling with Auto NC Optimizer and 30h battery.",
    price: "₹ 29,741",
    originalPrice: "₹ 34,990",
    discount: "SAVE ₹5,249",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductList() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const totalItems = useSelector(selectTotalItems);
  const [searchParams] = useSearchParams();
  const filters = [
    {
      id: "category",
      name: "Category",
      options: categories,
    },
    {
      id: "brand",
      name: "Brands",
      options: brands,
    },
  ];
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const status = useSelector(selectStatus);

  useEffect(() => {
    dispatch(resetProductError());
  }, [dispatch]);

  // URL Query Params Listener for Header Navigation
  useEffect(() => {
    const catParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");
    const dealsParam = searchParams.get("deals");
    const sortParam = searchParams.get("sort");
    const searchQuery = searchParams.get("search");

    const newFilter = {};
    if (catParam) newFilter.category = [catParam];
    if (brandParam) newFilter.brand = [brandParam];

    setFilter(newFilter);

    if (sortParam === "newest") {
      setSort({ _sort: "id", _order: "desc" });
    }

    if (catParam || brandParam || dealsParam || sortParam || searchQuery) {
      setTimeout(() => {
        document.getElementById("products-grid-section")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, [searchParams]);

  // Auto Slider Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % megaDeals.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleFilter = (e, section, option) => {
    const newFilter = { ...filter };
    const isChecked = e?.target?.checked !== undefined ? e.target.checked : true;

    if (isChecked) {
      if (newFilter[section.id]) {
        if (!newFilter[section.id].includes(option.value)) {
          newFilter[section.id].push(option.value);
        }
      } else {
        newFilter[section.id] = [option.value];
      }
    } else {
      if (Array.isArray(newFilter[section.id])) {
        let index = newFilter[section.id].findIndex((el) => el === option.value);
        if (index > -1) {
          newFilter[section.id].splice(index, 1);
        }
      }
    }

    setFilter(newFilter);
  };

  const handleCategoryClick = (catValue) => {
    setFilter((prev) => ({ ...prev, category: [catValue] }));
    document.getElementById('products-grid-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSort = (option) => {
    const sort = { _sort: option.sort, _order: option.order };
    setSort(sort);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    const pagination = { _page: page, _per_page: ITEMS_PER_PAGE };
    dispatch(
      fetchProductsByFiltersAsync({ filter, sort, pagination, role: "user" })
    );
  }, [dispatch, filter, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [totalItems, sort]);

  useEffect(() => {
    dispatch(fetchBrandsAsync());
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  return (
    <div className="bg-white">
      <div>
        <MobileFilter
          handleFilter={handleFilter}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          filters={filters}
        ></MobileFilter>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-slate-200 pb-3 pt-2 relative z-40">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              All Products
            </h1>

            <div className="flex items-center relative z-50">
              <Menu as="div" className="relative inline-block text-left z-50">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-blue-600"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl bg-white p-1.5 shadow-2xl ring-1 ring-slate-900/10 focus:outline-none border border-slate-100">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <p
                              onClick={() => handleSort(option)}
                              className={classNames(
                                option.current
                                  ? "font-bold text-blue-600 bg-blue-50"
                                  : "text-slate-700 hover:bg-slate-50",
                                active ? "bg-slate-100" : "",
                                "block px-3.5 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                              )}
                            >
                              {option.name}
                            </p>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              ></button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Active Sliding Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-[#060c1e] text-white p-6 sm:p-10 shadow-2xl border border-slate-800/80 my-4 group">
            
            {/* Background Glow */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none" />

            {/* Prev & Next Arrow Controls */}
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? megaDeals.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white border border-slate-700/80 backdrop-blur-md transition-all shadow-lg opacity-80 group-hover:opacity-100 cursor-pointer"
              title="Previous Slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % megaDeals.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white border border-slate-700/80 backdrop-blur-md transition-all shadow-lg opacity-80 group-hover:opacity-100 cursor-pointer"
              title="Next Slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Content Flex Layout */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 px-4 sm:px-6">
              
              {/* Left Column: Headline & Action CTA */}
              <div className="max-w-xl flex-1 text-left">
                <span className="inline-flex items-center rounded-full bg-blue-500/20 px-3.5 py-1 text-[11px] font-extrabold text-blue-400 border border-blue-500/30 tracking-wider uppercase mb-3">
                  {megaDeals[currentSlide].badge}
                </span>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                  {megaDeals[currentSlide].title}
                </h1>

                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md line-clamp-2">
                  {megaDeals[currentSlide].subtitle}
                </p>

                {/* Price Tag */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {megaDeals[currentSlide].price}
                  </span>
                  <span className="text-sm sm:text-base line-through font-semibold text-slate-400">
                    {megaDeals[currentSlide].originalPrice}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-md border border-emerald-500/30">
                    {megaDeals[currentSlide].discount}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3.5">
                  <Link
                    to={`/product-detail/${
                      products.data?.find((p) =>
                        p.title.toLowerCase().includes(megaDeals[currentSlide].searchKey)
                      )?.id || products.data?.[currentSlide % (products.data?.length || 1)]?.id
                    }`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Shop Now</span>
                    <span>➔</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById('products-grid-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm px-6 py-2.5 rounded-lg transition-all cursor-pointer"
                  >
                    Explore Deals
                  </button>
                </div>
              </div>

              {/* Right Column: Featured Image Showcase */}
              <Link
                to={`/product-detail/${
                  products.data?.find((p) =>
                    p.title.toLowerCase().includes(megaDeals[currentSlide].searchKey)
                  )?.id || products.data?.[currentSlide % (products.data?.length || 1)]?.id
                }`}
                className="relative w-full lg:w-72 h-56 sm:h-64 flex items-center justify-center bg-slate-900/60 rounded-xl border border-slate-800 p-3 shadow-lg group-hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <img
                  src={megaDeals[currentSlide].image}
                  alt={megaDeals[currentSlide].title}
                  className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

            </div>

            {/* Carousel Indicator Dots */}
            <div className="flex items-center justify-center gap-2 mt-6 relative z-10">
              {megaDeals.map((deal, idx) => (
                <button
                  key={deal.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentSlide
                      ? "w-8 bg-blue-500"
                      : "w-2.5 bg-slate-700 hover:bg-slate-500"
                  }`}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

          {/* 4-Column Overlapping Trust Bar (TechNova Exact) */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-md grid grid-cols-2 md:grid-cols-4 gap-4 my-6 text-slate-800 relative z-20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Free Shipping</p>
                <p className="text-[11px] text-slate-500">On orders over $50</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Secure Payment</p>
                <p className="text-[11px] text-slate-500">100% secure checkout</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">30-Day Returns</p>
                <p className="text-[11px] text-slate-500">Hassle-free returns</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">24/7 Support</p>
                <p className="text-[11px] text-slate-500">We're here to help</p>
              </div>
            </div>
          </div>

          {/* Shop By Category Visual Bar (TechNova 6-Column Grid) */}
          <div className="my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Shop by Category
              </h3>
              <span
                onClick={() => {
                  setFilter({});
                  document.getElementById('products-grid-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                View All Categories ➔
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
              {[
                { name: "Smartphones", value: "smartphones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80" },
                { name: "Laptops", value: "laptops", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&auto=format&fit=crop&q=80" },
                { name: "Headphones", value: "audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80" },
                { name: "Smartwatches", value: "smartwatches", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&auto=format&fit=crop&q=80" },
                { name: "Footwear", value: "footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80" },
                { name: "Apparel", value: "apparel", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&auto=format&fit=crop&q=80" },
              ].map((cat) => (
                <div
                  key={cat.value}
                  onClick={() => handleCategoryClick(cat.value)}
                  className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-500 cursor-pointer transition-all duration-200 text-center flex flex-col items-center gap-2 group"
                >
                  <div className="w-full h-24 overflow-hidden rounded-lg bg-slate-50 flex items-center justify-center p-1">
                    <img src={cat.image} alt={cat.name} className="h-full w-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <section id="products-grid-section" aria-labelledby="products-heading" className="pb-24 pt-2">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-4">
              <DesktopFilter
                handleFilter={handleFilter}
                filters={filters}
              ></DesktopFilter>
              {/* Product grid */}
              <div className="lg:col-span-3">
                <ProductGrid products={products} status={status}></ProductGrid>
              </div>
              {/* Product grid end */}
            </div>
          </section>

          {/* section of product and filters ends */}
          <Pagination
            page={page}
            setPage={setPage}
            handlePage={handlePage}
            totalItems={totalItems}
          ></Pagination>
        </main>
      </div>
    </div>
  );
}

function MobileFilter({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  handleFilter,
  filters,
}) {
  return (
    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40 lg:hidden"
        onClose={setMobileFiltersOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-6">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  onChange={(e) =>
                                    handleFilter(e, section, option)
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                  className="ml-3 min-w-0 flex-1 text-gray-500"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function DesktopFilter({ handleFilter, filters }) {
  return (
    <div className="hidden lg:block space-y-6">
      <form>
        {filters.map((section) => (
          <Disclosure
            as="div"
            key={section.id}
            className="border-b border-gray-200 py-6"
          >
            {({ open }) => (
              <>
                <h3 className="-my-3 flow-root">
                  <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                    <span className="font-medium text-gray-900">
                      {section.name}
                    </span>
                    <span className="ml-6 flex items-center">
                      {open ? (
                        <MinusIcon className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <PlusIcon className="h-5 w-5" aria-hidden="true" />
                      )}
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel className="pt-6">
                  <div className="space-y-4">
                    {section.options.map((option, optionIdx) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={`filter-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          defaultValue={option.value}
                          type="checkbox"
                          defaultChecked={option.checked}
                          onChange={(e) => handleFilter(e, section, option)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`filter-${section.id}-${optionIdx}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </form>

      {/* Left Sidebar Widgets (TechNova Light Theme) */}
      <div className="space-y-4 pt-2">
        {/* Need Help Card */}
        <div className="bg-white text-slate-800 p-4 rounded-xl shadow-sm border border-slate-200/80">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            Need Help Buying?
          </span>
          <h4 className="text-xs font-bold text-slate-900 mt-2">Speak to a Specialist</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Compare models, specs & warranties with our support team.
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-mono text-blue-600 font-bold">1800-SHOPKART</span>
            <span className="text-[10px] text-slate-400">Mon-Sat</span>
          </div>
        </div>

        {/* Weekly Promo Card */}
        <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl shadow-sm">
          <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded uppercase tracking-wider">
            LIMITED PROMO
          </span>
          <h4 className="text-xs font-bold text-slate-900 mt-2">Flat 15% OFF Laptops</h4>
          <p className="text-xs text-blue-600 mt-1 font-mono font-bold">Code: TECH15</p>
          <div className="mt-1 text-[10px] text-slate-500">
            Valid on Apple & Samsung models.
          </div>
        </div>

        {/* Why Shop With Us Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-2.5 text-xs text-slate-700">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            ShopKart Guarantee
          </h4>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span>100% Brand Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span>Free Delivery over ₹999</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              <span>7-Day Replacement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductGrid({ products, status }) {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const displayedProducts = products.data?.filter((product) => {
    if (!searchQuery) return true;
    return (
      product.title.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery) ||
      product.brand?.toLowerCase().includes(searchQuery) ||
      product.category?.toLowerCase().includes(searchQuery)
    );
  });

  return (
    <div>
      <div className="mx-auto max-w-2xl px-0 py-0 lg:max-w-7xl">
        {searchQuery && (
          <div className="mb-4 text-xs font-semibold text-slate-600 bg-blue-50/70 border border-blue-100 p-2.5 rounded-lg flex items-center justify-between">
            <span>Showing search results for: "<strong className="text-blue-600">{searchQuery}</strong>"</span>
            <span className="text-[11px] text-slate-500 font-normal">({displayedProducts?.length || 0} products found)</span>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {status === "loading" ? (
            <div className="col-span-full flex justify-center py-12">
              <RotatingLines
                visible={true}
                height="96"
                width="96"
                color="#2563eb"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
            </div>
          ) : null}
          {displayedProducts?.map((product) => (
            <Link to={`/product-detail/${product.id}`} key={product.id} className="group flex flex-col">
              <div className="relative flex flex-col justify-between h-full bg-white rounded-xl border border-slate-200/90 p-3 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
                
                {/* Image Showcase */}
                <div className="relative h-44 w-full overflow-hidden rounded-lg bg-slate-50 flex items-center justify-center p-2">
                  {/* Red Discount Badge */}
                  {product.discountPercentage ? (
                    <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      -{Math.round(product.discountPercentage)}%
                    </span>
                  ) : null}

                  {/* Brand Tag */}
                  {product.brand && (
                    <span className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-md text-slate-700 border border-slate-200 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      {product.brand}
                    </span>
                  )}

                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-contain object-center group-hover:scale-105 transition-transform duration-300 ease-out"
                  />
                </div>

                {/* Card Content */}
                <div className="mt-2.5 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {product.description}
                    </p>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    <div className="flex items-center text-amber-400">
                      {[0, 1, 2, 3, 4].map((star) => (
                        <StarIcon
                          key={star}
                          className={`w-3 h-3 ${
                            (product.rating || 4.5) > star ? "text-amber-400" : "text-slate-200"
                          }`}
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">
                      ({product.rating || 4.8})
                    </span>
                  </div>

                  {/* Price & Action Button */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                    <div>
                      <div className="text-sm sm:text-base font-extrabold text-slate-900">
                        ₹ {product.discountedPrice}
                      </div>
                      {product.price && (
                        <div className="text-[11px] font-medium text-slate-400 line-through">
                          ₹ {product.price}
                        </div>
                      )}
                    </div>

                    {/* Blue Shopping Cart Square Button */}
                    <div className="bg-blue-600 group-hover:bg-blue-700 text-white p-1.5 rounded-lg transition-colors shadow-xs flex items-center justify-center">
                      <ShoppingCartIcon className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
