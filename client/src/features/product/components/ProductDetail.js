import { useState, useEffect, useMemo } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductByIdAsync,
  selectProductById,
  selectStatus,
  selectError,
  resetProductError,
} from "../productSlice";
import { useParams } from "react-router-dom";
import { addToCartAsync, selectItems } from "../../cart/cartSlice";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";

<ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
/>;

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetail() {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector(selectProductById);
  const items = useSelector(selectItems);
  const error = useSelector(selectError);
  const status = useSelector(selectStatus);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(-1);
  const [selectedImage, setSelectedImage] = useState(null);

  // Zoom Lightbox & Hover Magnifier State
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [modalZoomLevel, setModalZoomLevel] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsZoomModalOpen(false);
      }
    };
    if (isZoomModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isZoomModalOpen]);

  // Compute active photo set for the currently selected color (Amazon / Flipkart style)
  const activeImages = useMemo(() => {
    if (!product || !product.images || product.images.length === 0) {
      return product?.thumbnail ? [product.thumbnail] : [];
    }
    const colorIdx = selectedColor >= 0 ? selectedColor : 0;
    const chunkSize = 3;
    const start = colorIdx * chunkSize;
    const colorChunk = product.images.slice(start, start + chunkSize);
    if (colorChunk.length > 0) {
      return colorChunk;
    }
    return product.images;
  }, [product, selectedColor]);

  useEffect(() => {
    if (activeImages.length > 0) {
      setSelectedImage(activeImages[0]);
    }
  }, [activeImages]);

  const handleColorSelect = (index) => {
    setSelectedColor(index);
  };

  const handleImageSelect = (imgUrl) => {
    setSelectedImage(imgUrl);
  };

  const handleCart = (e) => {
    e.preventDefault();

    if (product.stock < 1) {
      toast.error(`${product.title} is out of stock`);
      return;
    }

    if (selectedColor < 0) {
      toast.error("Please select a color");
      return;
    }

    if (selectedSize < 0) {
      toast.error("Please select a size");
      return;
    }

    let productExistsInCart = false;

    items.forEach((item, i) => {
      if (
        item.product.id === product.id &&
        !(
          item.color !== product.colors[selectedColor] ||
          item.size !== product.sizes[selectedSize]
        )
      ) {
        productExistsInCart = true;
      }
    });

    if (!productExistsInCart) {
      const newItem = {
        product: product.id,
        quantity: 1,
        color: product.colors[selectedColor],
        size: parseInt(product.sizes[selectedSize]),
      };

      dispatch(addToCartAsync(newItem));
      toast.success(`${product.title} added to cart`);
    } else {
      toast.error("Product already in cart");
    }
  };

  useEffect(() => {
    dispatch(fetchProductByIdAsync(params.id));
  }, [dispatch, params.id]);

  useEffect(() => {
    if (error) {
      navigate("/404", { replace: true });
    }
    return () => {
      dispatch(resetProductError());
    };
  }, [error, navigate, dispatch]);

  return (
    <div className="bg-white min-h-screen">
      {status === "loading" ? (
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="#4fa94d"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      ) : null}
      {product && (
        <div className="pt-4 pb-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="hover:text-gray-900 font-medium">
                  Products
                </Link>
              </li>
              <li>
                <svg
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  className="h-4 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </li>
              <li className="font-semibold text-gray-900 truncate">
                {product.title}
              </li>
            </ol>
          </nav>

          {/* Amazon / Flipkart Side-by-Side Product Container */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:items-start">
              
              {/* LEFT COLUMN: Gallery & Showcase (5 cols on Desktop) */}
              <div className="lg:col-span-5 flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                {/* Vertical Thumbnail Strip (Desktop / Tablet) */}
                <div className="hidden sm:flex flex-col gap-3 w-20 flex-shrink-0">
                  {activeImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleImageSelect(img)}
                      className={`aspect-square w-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-150 ${
                        selectedImage === img
                          ? "border-indigo-600 ring-2 ring-indigo-600 ring-offset-1 scale-105"
                          : "border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        onError={(e) => {
                          if (product?.thumbnail && e.target.src !== product.thumbnail) {
                            e.target.src = product.thumbnail;
                          }
                        }}
                        alt={`${product.title} view ${idx + 1}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  ))}
                </div>

                {/* Main Showcase Image Area with Hover Zoom Lens & Click Lightbox */}
                <div
                  className="relative flex-1 w-full flex justify-center items-center bg-gray-50 rounded-2xl border border-gray-200 p-4 h-[380px] sm:h-[400px] max-h-[400px] overflow-hidden shadow-sm cursor-zoom-in group"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onMouseMove={handleMouseMove}
                  onClick={() => {
                    setIsZoomModalOpen(true);
                    setModalZoomLevel(1);
                  }}
                >
                  <img
                    src={selectedImage || activeImages[0] || product.thumbnail}
                    onError={(e) => {
                      if (product?.thumbnail && e.target.src !== product.thumbnail) {
                        e.target.src = product.thumbnail;
                      }
                    }}
                    alt={product.title}
                    style={
                      isHovering
                        ? {
                            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                            transform: "scale(2)",
                          }
                        : { transform: "scale(1)" }
                    }
                    className="max-h-full max-w-full object-contain transition-transform duration-150 ease-out"
                  />

                  {/* Hover / Click Overlay Hint Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                    <span>Click to Zoom</span>
                  </div>
                </div>

                {/* Horizontal Thumbnail Strip (Mobile only) */}
                <div className="flex sm:hidden gap-3 mt-2 overflow-x-auto pb-2 w-full justify-center">
                  {activeImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleImageSelect(img)}
                      className={`aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 cursor-pointer transition-all ${
                        selectedImage === img
                          ? "border-indigo-600 ring-2 ring-indigo-600"
                          : "border-gray-200 opacity-75"
                      }`}
                    >
                      <img
                        src={img}
                        onError={(e) => {
                          if (product?.thumbnail && e.target.src !== product.thumbnail) {
                            e.target.src = product.thumbnail;
                          }
                        }}
                        alt={`${product.title} view ${idx + 1}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: Product Information & Buy Box (7 cols on Desktop) */}
              <div className="mt-8 lg:mt-0 lg:col-span-7 flex flex-col justify-start bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-md">
                    {product.brand || "Flagship Series"}
                  </span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> In Stock • Ready to ship
                  </span>
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {product.title}
                </h1>

                {/* Price & Discount */}
                <div className="mt-4 flex items-baseline gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-3xl font-extrabold tracking-tight text-slate-900">
                    ₹ {product.discountedPrice}
                  </p>
                  <p className="text-lg line-through font-medium text-slate-400">
                    ₹ {product.price}
                  </p>
                  <span className="ml-auto text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200/60">
                    {product.discountPercentage}% OFF
                  </span>
                </div>

                {/* Reviews */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex items-center bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
                    <StarIcon className="h-4 w-4 text-amber-500" fill="currentColor" />
                    <span className="ml-1 text-xs font-bold text-amber-800">
                      {product.rating} / 5.0
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    (Customer Rating)
                  </span>
                </div>

                {/* Color & Size Selection Form */}
                <form className="mt-6">
                  {/* Colors */}
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Select Color</h3>
                    </div>
                    <RadioGroup
                      value={selectedColor}
                      onChange={handleColorSelect}
                      className="mt-3"
                    >
                      <RadioGroup.Label className="sr-only">
                        Choose a color
                      </RadioGroup.Label>
                      <div className="flex items-center space-x-3">
                        {product.colors.map((color, index) => (
                          <RadioGroup.Option
                            key={color}
                            value={index}
                            onClick={() => handleColorSelect(index)}
                            className={`aspect-square h-9 w-9 rounded-full border border-black/10 relative flex cursor-pointer items-center justify-center p-0.5 focus:outline-none transition-all shadow-sm ${
                              index === selectedColor
                                ? "ring-2 ring-indigo-600 ring-offset-2 scale-105 border-indigo-600"
                                : "hover:border-slate-400"
                            }`}
                            style={{ backgroundColor: color }}
                          >
                            <RadioGroup.Label as="span" className="sr-only">
                              {color}
                            </RadioGroup.Label>
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Sizes */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Select Size / Storage</h3>
                    </div>
                    <RadioGroup
                      value={selectedSize}
                      onChange={setSelectedSize}
                      className="mt-3"
                    >
                      <RadioGroup.Label className="sr-only">
                        Choose a size
                      </RadioGroup.Label>
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-4">
                        {product.sizes.map((size, index) => (
                          <RadioGroup.Option
                            key={size}
                            value={size}
                            onClick={() => setSelectedSize(index)}
                            className={`group relative flex items-center justify-center rounded-lg border py-2.5 px-3 text-xs font-bold uppercase focus:outline-none cursor-pointer transition-all ${
                              index === selectedSize
                                ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600"
                                : "border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <RadioGroup.Label as="span">{size}</RadioGroup.Label>
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleCart}
                    type="submit"
                    className="mt-8 flex w-full items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:shadow transition-colors"
                  >
                    Add to Cart
                  </button>
                </form>

                {/* Description, Specs & Highlights */}
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Product Overview</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
                    {product.description}
                  </p>

                  <h3 className="mt-6 text-xs font-bold text-slate-900 uppercase tracking-wider">Key Highlights</h3>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.highlights.map((highlight) => (
                      <div key={highlight} className="bg-slate-50 p-3 rounded-lg border border-slate-200/60 flex items-start gap-2 text-xs font-medium text-slate-700">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technical Specifications Table */}
                  <h3 className="mt-6 text-xs font-bold text-slate-900 uppercase tracking-wider">Technical Specifications</h3>
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
                      <tbody className="divide-y divide-slate-100 bg-white">
                        <tr className="bg-slate-50/50">
                          <td className="py-2.5 px-4 font-semibold text-slate-900 w-1/3">Brand</td>
                          <td className="py-2.5 px-4 text-slate-600">{product.brand || "Authentic"}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-900">Category</td>
                          <td className="py-2.5 px-4 text-slate-600 capitalize">{product.category}</td>
                        </tr>
                        <tr className="bg-slate-50/50">
                          <td className="py-2.5 px-4 font-semibold text-slate-900">Stock Availability</td>
                          <td className="py-2.5 px-4 text-slate-600">In Stock ({product.stock || 50} units available)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-slate-900">Manufacturer Warranty</td>
                          <td className="py-2.5 px-4 text-slate-600">1-Year Official Brand Guarantee</td>
                        </tr>
                        <tr className="bg-slate-50/50">
                          <td className="py-2.5 px-4 font-semibold text-slate-900">Return / Exchange</td>
                          <td className="py-2.5 px-4 text-slate-600">7 Days Return / Easy Replacement</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Interactive Lightbox Zoom Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 transition-all duration-200">
          {/* Header Controls */}
          <div className="flex items-center justify-between text-white border-b border-gray-800 pb-4">
            <h2 className="text-lg font-medium truncate max-w-md">
              {product.title}
            </h2>

            {/* Toolbar */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-800 rounded-lg p-1 border border-gray-700">
                <button
                  onClick={() => setModalZoomLevel((prev) => Math.max(1, prev - 0.5))}
                  className="p-1.5 hover:bg-gray-700 rounded-md transition text-white disabled:opacity-40"
                  disabled={modalZoomLevel <= 1}
                  title="Zoom Out"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-xs font-mono px-3 text-gray-300">
                  {Math.round(modalZoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setModalZoomLevel((prev) => Math.min(3, prev + 0.5))}
                  className="p-1.5 hover:bg-gray-700 rounded-md transition text-white disabled:opacity-40"
                  disabled={modalZoomLevel >= 3}
                  title="Zoom In"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <button
                onClick={() => setModalZoomLevel(1)}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs font-semibold rounded-lg text-gray-300 transition"
              >
                Reset
              </button>

              <button
                onClick={() => setIsZoomModalOpen(false)}
                className="p-2 bg-gray-800 hover:bg-red-600 rounded-full border border-gray-700 text-white transition-colors"
                title="Close (Esc)"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Center Image Viewer */}
          <div className="flex-1 flex items-center justify-center overflow-auto p-4 my-2">
            <div className="relative overflow-hidden flex items-center justify-center max-w-4xl max-h-[75vh]">
              <img
                src={selectedImage || activeImages[0] || product.thumbnail}
                onError={(e) => {
                  if (product?.thumbnail && e.target.src !== product.thumbnail) {
                    e.target.src = product.thumbnail;
                  }
                }}
                alt={product.title}
                style={{
                  transform: `scale(${modalZoomLevel})`,
                }}
                onClick={() => setModalZoomLevel((prev) => (prev >= 2 ? 1 : 2))}
                className="max-h-[70vh] max-w-full object-contain cursor-zoom-in transition-transform duration-200 ease-out"
              />
            </div>
          </div>

          {/* Bottom Thumbnail Strip */}
          <div className="flex justify-center gap-3 pt-4 border-t border-gray-800 overflow-x-auto">
            {activeImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => {
                  handleImageSelect(img);
                  setModalZoomLevel(1);
                }}
                className={`aspect-square h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  selectedImage === img
                    ? "border-indigo-500 ring-2 ring-indigo-500 scale-105"
                    : "border-gray-700 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  onError={(e) => {
                    if (product?.thumbnail && e.target.src !== product.thumbnail) {
                      e.target.src = product.thumbnail;
                    }
                  }}
                  alt={`Thumb ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
