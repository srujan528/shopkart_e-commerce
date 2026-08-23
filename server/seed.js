import dns from "dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Brand from "./models/Brand.Model.js";
import Category from "./models/Category.Model.js";
import Product from "./models/Product.Model.js";

dotenv.config();

// Configure Node.js c-ares DNS resolver for Windows
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const categoriesData = [
  { label: "Smartphones", value: "smartphones" },
  { label: "Laptops", value: "laptops" },
  { label: "Audio & Headphones", value: "audio" },
  { label: "Footwear", value: "footwear" },
  { label: "Apparel", value: "apparel" },
];

const brandsData = [
  { label: "Apple", value: "apple" },
  { label: "Samsung", value: "samsung" },
  { label: "Sony", value: "sony" },
  { label: "Nike", value: "nike" },
  { label: "Adidas", value: "adidas" },
];

const productsData = [
  {
    title: "iPhone 15 Pro Max 256GB Titanium",
    description:
      "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
    price: 139900,
    discountPercentage: 10,
    rating: 4.8,
    stock: 25,
    brand: "apple",
    category: "smartphones",
    thumbnail:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
    images: [
      // Color 0: Natural Titanium (#4E5052)
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
      // Color 1: Blue Titanium (#1E293B)
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
      // Color 2: Black Titanium (#111827)
      "https://images.unsplash.com/photo-1530319067432-f2a729c03db5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&auto=format&fit=crop&q=80",
    ],
    colors: ["#4E5052", "#1E293B", "#111827"],
    sizes: ["128GB", "256GB", "512GB"],
    highlights: [
      "A17 Pro chip with 6-core GPU",
      "Titanium design with textured matte glass back",
      "48MP Main camera with multiple focal lengths",
      "USB-C connector with USB 3 speeds",
    ],
    deleted: false,
  },
  {
    title: "Samsung Galaxy S24 Ultra 5G",
    description:
      "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.",
    price: 129999,
    discountPercentage: 12,
    rating: 4.7,
    stock: 18,
    brand: "samsung",
    category: "smartphones",
    thumbnail:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
    images: [
      // Color 0: Titanium Gray (#64748B)
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800&auto=format&fit=crop&q=80",
      // Color 1: Titanium Black (#1E1E1E)
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=800&auto=format&fit=crop&q=80",
      // Color 2: Titanium Violet (#581C87)
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    ],
    colors: ["#64748B", "#1E1E1E", "#581C87"],
    sizes: ["256GB", "512GB"],
    highlights: [
      "Galaxy AI with Circle to Search & Live Translate",
      "200MP Main Camera with ProVisual Engine",
      "Built-in S Pen included",
      "Snapdragon 8 Gen 3 for Galaxy",
    ],
    deleted: false,
  },
  {
    title: "MacBook Pro 16-inch M3 Max",
    description:
      "MacBook Pro blasts forward with M3 Max, a monstrously advanced chip that brings massive performance and capability for the most demanding workflows.",
    price: 349900,
    discountPercentage: 8,
    rating: 4.9,
    stock: 12,
    brand: "apple",
    category: "laptops",
    thumbnail:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    images: [
      // Color 0: Space Black (#1F2937)
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
      // Color 1: Silver (#9CA3AF)
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
    ],
    colors: ["#1F2937", "#9CA3AF"],
    sizes: ["36GB RAM / 1TB SSD", "48GB RAM / 1TB SSD"],
    highlights: [
      "Apple M3 Max chip with 16-core CPU and 40-core GPU",
      "16.2-inch Liquid Retina XDR display with ProMotion",
      "Up to 22 hours of battery life",
      "Three Thunderbolt 4 ports, HDMI port, SDXC card slot",
    ],
    deleted: false,
  },
  {
    title: "Sony WH-1000XM5 Wireless Headphones",
    description:
      "Industry-leading noise cancellation with two processors and eight microphones for unprecedented sound quality and crystal-clear hands-free calling.",
    price: 29990,
    discountPercentage: 15,
    rating: 4.8,
    stock: 40,
    brand: "sony",
    category: "audio",
    thumbnail:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    images: [
      // Color 0: Silver (#94A3B8)
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&auto=format&fit=crop&q=80",
      // Color 1: Black (#0F172A)
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
      // Color 2: Midnight Blue (#1E3A8A)
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    ],
    colors: ["#94A3B8", "#0F172A", "#1E3A8A"],
    sizes: ["Standard"],
    highlights: [
      "Industry-leading noise cancelling with Auto NC Optimizer",
      "Up to 30-hour battery life with quick charging",
      "Ultra-comfortable lightweight design with soft fit leather",
      "Multipoint connection lets you quickly switch between devices",
    ],
    deleted: false,
  },
  {
    title: "Nike Air Force 1 '07 Sneakers",
    description:
      "The radiance lives on in the Nike Air Force 1 '07, the basketball icon that puts a fresh spin on what you know best: crisp leather, bold colors and flash.",
    price: 9695,
    discountPercentage: 5,
    rating: 4.6,
    stock: 50,
    brand: "nike",
    category: "footwear",
    thumbnail:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
    images: [
      // Color 0: White (#FFFFFF)
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&auto=format&fit=crop&q=80",
      // Color 1: Black (#000000)
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80",
    ],
    colors: ["#FFFFFF", "#000000"],
    sizes: ["US 8", "US 9", "US 10", "US 11"],
    highlights: [
      "Stitched leather overlays on upper add heritage style and durability",
      "Nike Air cushioning for lightweight, all-day comfort",
      "Low-cut silhouette for a clean, streamlined look",
      "Perforations on toe for breathability",
    ],
    deleted: false,
  },
  {
    title: "Adidas Ultraboost Light Running Shoes",
    description:
      "Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever. The magic lies in the Light BOOST midsole, a new generation of adidas BOOST.",
    price: 18999,
    discountPercentage: 20,
    rating: 4.7,
    stock: 30,
    brand: "adidas",
    category: "footwear",
    thumbnail:
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
    images: [
      // Color 0: Core Black (#111827)
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80",
      // Color 1: Cloud White (#F8FAFC)
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
      // Color 2: Solar Red (#EF4444)
      "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&auto=format&fit=crop&q=80",
    ],
    colors: ["#111827", "#F8FAFC", "#EF4444"],
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
    highlights: [
      "Regular fit with lace closure",
      "adidas PRIMEKNIT+ textile upper",
      "Light BOOST cushioning system",
      "Continental™ Better Rubber outsole",
    ],
    deleted: false,
  },
  {
    title: "Nike Sportswear Tech Fleece Hoodie",
    description:
      "Combining 2 iconic looks, this full-zip hoodie draws design inspiration from our timeless Windrunner jacket as well as our Tech Fleece jacket.",
    price: 7995,
    discountPercentage: 10,
    rating: 4.5,
    stock: 35,
    brand: "nike",
    category: "apparel",
    thumbnail:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    images: [
      // Color 0: Dark Grey (#4B5563)
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80",
      // Color 1: Black (#111827)
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
      // Color 2: Midnight Navy (#1E3A8A)
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80",
    ],
    colors: ["#4B5563", "#111827", "#1E3A8A"],
    sizes: ["S", "M", "L", "XL"],
    highlights: [
      "Premium, lightweight fleece is smooth both inside and out",
      "Zippered sleeve pocket provides secure storage",
      "4-panel hood offers comfortable coverage",
      "Transparent taping highlights heritage design lines",
    ],
    deleted: false,
  },
  {
    title: "Sony WF-1000XM5 True Wireless Earbuds",
    description:
      "The WF-1000XM5 feature cutting-edge technology to deliver premium sound quality and the best noise-cancelling performance on the market.",
    price: 24990,
    discountPercentage: 14,
    rating: 4.6,
    stock: 22,
    brand: "sony",
    category: "audio",
    thumbnail:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    images: [
      // Color 0: Black (#111827)
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80",
      // Color 1: Silver (#CBD5E1)
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80",
    ],
    colors: ["#111827", "#CBD5E1"],
    sizes: ["Standard"],
    highlights: [
      "Best noise cancelling with Integrated Processor V2",
      "Astonishing sound quality with Dynamic Driver X",
      "Sony's best ever call quality with bone conduction sensors",
      "Small, light and beautifully designed",
    ],
    deleted: false,
  },
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    const PRIMARY_ATLAS_URI = "mongodb+srv://srujanhiremath519_db_user:srujan%40123@placementportal.rkhdyck.mongodb.net/shopkart?appName=PlacementPortal";
    const mongoUri = process.env.MONGO_URL && process.env.MONGO_URL.startsWith("mongodb") ? process.env.MONGO_URL : PRIMARY_ATLAS_URI;
    await mongoose.connect(mongoUri, { dbName: "shopkart" });
    console.log("Connected successfully to MongoDB Atlas.");

    // Seed Categories
    console.log("Seeding Categories...");
    for (const cat of categoriesData) {
      await Category.updateOne({ value: cat.value }, cat, { upsert: true });
    }
    console.log(`Successfully seeded ${categoriesData.length} categories.`);

    // Seed Brands
    console.log("Seeding Brands...");
    for (const brand of brandsData) {
      await Brand.updateOne({ value: brand.value }, brand, { upsert: true });
    }
    console.log(`Successfully seeded ${brandsData.length} brands.`);

    // Seed Products
    console.log("Seeding Products...");
    for (const prod of productsData) {
      const discountedPrice =
        Math.round(
          (prod.price - (prod.price * prod.discountPercentage) / 100) * 100
        ) / 100;
      await Product.updateOne(
        { title: prod.title },
        { ...prod, discountedPrice },
        { upsert: true }
      );
    }
    console.log(`Successfully seeded ${productsData.length} products.`);

    console.log("\nDatabase seeding completed successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
