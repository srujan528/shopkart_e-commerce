import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectItems } from "../cart/cartSlice";
import { selectUserInfo } from "../user/userSlice";

const navigation = [
  { name: "Home", link: "/" },
  { name: "Shop", link: "/" },
  { name: "Deals", link: "/?deals=true" },
  { name: "New Arrivals", link: "/?sort=newest" },
];

const userNavigation = [
  { name: "My Profile", link: "/profile" },
  { name: "My Orders", link: "/orders" },
  { name: "Sign out", link: "/logout" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function NavBar({ children }) {
  const items = useSelector(selectItems);
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      {userInfo && (
        <>
          {/* Top Guarantee Bar (TechNova Exact) */}
          <div className="bg-[#0a1128] text-slate-300 text-[11px] font-medium py-1.5 px-4 border-b border-slate-800">
            <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Free Shipping on Orders Over $50
                </span>
                <span className="hidden md:flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Secure Payment
                </span>
                <span className="hidden lg:flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  30-Day Returns
                </span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <span>Support: (123) 456-7890</span>
              </div>
            </div>
          </div>

          {/* ShopKart White Header */}
          <Disclosure as="nav" className="bg-white sticky z-30 top-0 border-b border-slate-200 shadow-xs">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex h-16 items-center justify-between gap-6">
                    {/* Brand Logo & Subtitle */}
                    <Link
                      to="/"
                      onClick={() => navigate("/")}
                      className="flex flex-col justify-center"
                    >
                      <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0a1128] leading-none">
                        Shop<span className="text-blue-600">Kart</span>
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 tracking-wider">
                        Upgrade Your World
                      </span>
                    </Link>

                    {/* Navigation Links with Interactive Routing */}
                    <div className="hidden lg:flex items-center space-x-6">
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="text-xs font-bold text-blue-600 border-b-2 border-blue-600 pb-0.5 transition-colors cursor-pointer"
                      >
                        Home
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigate("/");
                          setTimeout(() => {
                            document.getElementById("products-grid-section")?.scrollIntoView({ behavior: "smooth" });
                          }, 100);
                        }}
                        className="text-xs font-medium text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        Shop
                      </button>

                      {/* Categories Dropdown */}
                      <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="text-xs font-medium text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer">
                          <span>Categories</span>
                          <span className="text-[10px]">▾</span>
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute left-0 z-50 mt-2 w-48 origin-top-left rounded-xl bg-white p-1.5 shadow-2xl ring-1 ring-slate-900/10 focus:outline-none border border-slate-100">
                            {[
                              { label: "Smartphones", value: "smartphones" },
                              { label: "Laptops", value: "laptops" },
                              { label: "Audio & Headphones", value: "audio" },
                              { label: "Footwear", value: "footwear" },
                              { label: "Apparel", value: "apparel" },
                            ].map((cat) => (
                              <Menu.Item key={cat.value}>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    onClick={() => navigate(`/?category=${cat.value}`)}
                                    className={classNames(
                                      active ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-700",
                                      "w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer"
                                    )}
                                  >
                                    {cat.label}
                                  </button>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>

                      <button
                        type="button"
                        onClick={() => navigate("/?deals=true")}
                        className="text-xs font-medium text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        Deals
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate("/?sort=newest")}
                        className="text-xs font-medium text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        New Arrivals
                      </button>

                      {/* Brands Dropdown */}
                      <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="text-xs font-medium text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer">
                          <span>Brands</span>
                          <span className="text-[10px]">▾</span>
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute left-0 z-50 mt-2 w-44 origin-top-left rounded-xl bg-white p-1.5 shadow-2xl ring-1 ring-slate-900/10 focus:outline-none border border-slate-100">
                            {["apple", "samsung", "sony", "nike", "adidas"].map((brand) => (
                              <Menu.Item key={brand}>
                                {({ active }) => (
                                  <button
                                    type="button"
                                    onClick={() => navigate(`/?brand=${brand}`)}
                                    className={classNames(
                                      active ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-700",
                                      "w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer capitalize"
                                    )}
                                  >
                                    {brand}
                                  </button>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>

                      {/* Admin Links if admin */}
                      {userInfo?.role === "admin" && (
                        <Link
                          to="/admin"
                          className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 hover:bg-rose-100 transition-colors"
                        >
                          Admin Panel
                        </Link>
                      )}
                    </div>

                    {/* Right Controls: Search, User, Wishlist, Cart */}
                    <div className="flex items-center gap-3">
                      {/* Search Form */}
                      <form onSubmit={handleSearchSubmit} className="relative hidden md:flex items-center w-48 lg:w-56">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search products..."
                          className="w-full bg-slate-50 text-slate-900 text-xs rounded-lg pl-3 pr-8 py-1.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button type="submit" className="absolute right-2 text-slate-400 hover:text-blue-600 cursor-pointer">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </button>
                      </form>

                      {/* Wishlist Icon */}
                      <button className="p-1.5 text-slate-600 hover:text-blue-600 transition-colors hidden sm:block">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>

                      {/* Cart Icon */}
                      <Link to="/cart" className="relative p-1.5 text-slate-700 hover:text-blue-600 transition-colors">
                        <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
                        {items.length > 0 && (
                          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                            {items.length}
                          </span>
                        )}
                      </Link>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-1">
                          <div>
                            <Menu.Button className="flex items-center gap-2 rounded-full bg-slate-100 p-0.5 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <span className="sr-only">Open user menu</span>
                              <img
                                className="h-8 w-8 rounded-full object-cover"
                                src={userInfo.imageUrl || "../../../user.png"}
                                alt=""
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
                            <Menu.Items className="absolute right-0 z-20 mt-2 w-52 origin-top-right rounded-xl bg-white py-1.5 shadow-2xl ring-1 ring-black/10 focus:outline-none divide-y divide-gray-100">
                              <div className="px-4 py-2.5">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Signed in as</p>
                                <p className="text-sm font-bold text-gray-900 truncate mt-0.5">{userInfo.name || userInfo.email}</p>
                              </div>
                              <div className="py-1">
                                {userNavigation.map((item) => (
                                  <Menu.Item key={item.name}>
                                    {({ active }) => (
                                      <Link
                                        to={item.link}
                                        className={classNames(
                                          active ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-700",
                                          "block px-4 py-2 text-sm transition-colors"
                                        )}
                                      >
                                        {item.name}
                                      </Link>
                                    )}
                                  </Menu.Item>
                                ))}
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    <div className="-mr-2 flex md:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="inline-flex items-center justify-center rounded-xl bg-slate-800 p-2.5 text-slate-300 hover:bg-slate-700 hover:text-white focus:outline-none">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="md:hidden border-t border-slate-800 bg-slate-900">
                  <div className="space-y-1 px-3 pb-3 pt-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.link}
                        className="block rounded-lg px-3.5 py-2 text-base font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-slate-800 pb-3 pt-4">
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full border border-slate-700 object-cover"
                          src={userInfo.imageUrl || "../../../user.png"}
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-bold leading-none text-white">
                          {userInfo.name || "User"}
                        </div>
                        <div className="text-sm font-medium leading-none text-slate-400 mt-1">
                          {userInfo.email}
                        </div>
                      </div>
                      <Link to="/cart" className="ml-auto relative">
                        <button
                          type="button"
                          className="ml-auto flex-shrink-0 rounded-xl bg-slate-800 p-2 text-slate-300 hover:text-white"
                        >
                          <ShoppingCartIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                        </button>
                        {items.length > 0 && (
                          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold bg-rose-500 text-white">
                            {items.length}
                          </span>
                        )}
                      </Link>
                    </div>
                    <div className="mt-3 space-y-1 px-3">
                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.link}
                          className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <main className="min-h-screen">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-2 pb-6">
              {children}
            </div>
          </main>
        </>
      )}
    </>
  );
}

export default NavBar;
