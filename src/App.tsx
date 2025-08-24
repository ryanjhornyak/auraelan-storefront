import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Star,
  X,
  Plus,
  Minus,
  ChevronDown,
  Tag,
  Truck,
  Shield,
  CreditCard,
  Sparkles,
  Filter,
  Check,
  Mail,
} from "lucide-react";

/**
 * AuraÉlan – Single‑File React Storefront
 * Beauty‑niche dropshipping storefront with product grid, cart, signup modal, legal pages, and multi-item Stripe checkout.
 */

const STRIPE_PAYMENT_LINK = "";
const API_CHECKOUT_ENDPOINT = "/api/create-checkout-session";
const GOOGLE_ANALYTICS_ID = "";
const META_PIXEL_ID = "";

const CATEGORIES = ["All", "Skincare", "Hair", "Beauty Tools", "Makeup"] as const;
type Category = typeof CATEGORIES[number];

type Product = {
  id: string;
  title: string;
  price: number;
  compareAt?: number;
  image: string;
  category: Category;
  rating: number;
  reviews: number;
  badge?: string;
  shippingNote?: string;
  description: string;
};

const PRODUCTS: Product[] = [
  {
    id: "b1",
    title: "Ionic Facial Steamer Pro",
    price: 39.99,
    compareAt: 69.99,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
    category: "Skincare",
    rating: 4.6,
    reviews: 1291,
    badge: "Bestseller",
    shippingNote: "Free shipping over $50",
    description: "Nano‑ionic steam for deep pore prep and hydration. 30s heat‑up, auto‑off, includes blackhead tool set.",
  },
  {
    id: "b2",
    title: "LED Light Therapy Mask (7‑Color)",
    price: 79.0,
    compareAt: 129.0,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=1200&auto=format&fit=crop",
    category: "Skincare",
    rating: 4.4,
    reviews: 742,
    badge: "Trending",
    shippingNote: "Ships in 24–48h",
    description: "Multi‑spectrum LED for at‑home sessions. Adjustable intensity, 15‑min timer. Use 3–4× weekly.",
  },
  {
    id: "b3",
    title: "Quartz Facial Roller + Gua Sha Set",
    price: 21.99,
    compareAt: 34.99,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1200&auto=format&fit=crop",
    category: "Beauty Tools",
    rating: 4.5,
    reviews: 3132,
    badge: "Self‑Care",
    shippingNote: "Buy 2, save 10%",
    description: "100% quartz roller and gua sha for soothing facial massage and product absorption.",
  },
  {
    id: "b4",
    title: "Cordless Auto Hair Curler",
    price: 49.99,
    compareAt: 89.99,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop",
    category: "Hair",
    rating: 4.3,
    reviews: 981,
    badge: "New",
    shippingNote: "USB‑C fast charge",
    description: "Tangle‑free auto curler with adjustable temp and timer. Compact travel design.",
  },
  {
    id: "b5",
    title: "Satin Heatless Curling Set",
    price: 18.99,
    compareAt: 29.99,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    category: "Hair",
    rating: 4.2,
    reviews: 2110,
    badge: "Overnight Curls",
    shippingNote: "No heat damage",
    description: "Achieve soft waves overnight with satin wrap rod + scrunchies for crease‑free curls.",
  },
  {
    id: "b6",
    title: "Ultrasonic Skin Scrubber",
    price: 27.5,
    compareAt: 44.0,
    image: "https://images.unsplash.com/photo-1616394584738-c59bda3a8335?q=80&w=1200&auto=format&fit=crop",
    category: "Skincare",
    rating: 4.1,
    reviews: 568,
    badge: "Pore‑Care",
    shippingNote: "USB rechargeable",
    description: "Gentle ultrasonic exfoliation to lift impurities and improve serum absorption.",
  },
  {
    id: "b7",
    title: "Makeup Brush Set (12 pcs)",
    price: 24.99,
    compareAt: 39.99,
    image: "https://images.unsplash.com/photo-1601379329544-4624d8c77ab0?q=80&w=1200&auto=format&fit=crop",
    category: "Makeup",
    rating: 4.4,
    reviews: 1744,
    badge: "Pro Kit",
    shippingNote: "Vegan bristles",
    description: "Complete face + eye set with soft vegan bristles and travel case.",
  },
  {
    id: "b8",
    title: "Mini Travel Hair Straightener",
    price: 22.0,
    compareAt: 34.0,
    image: "https://images.unsplash.com/photo-1512499617640-c2f999098c69?q=80&w=1200&auto=format&fit=crop",
    category: "Hair",
    rating: 4.0,
    reviews: 623,
    badge: "Travel",
    shippingNote: "Dual voltage",
    description: "Compact ceramic plates for quick touch‑ups and bangs on the go.",
  },
  {
    id: "b9",
    title: "Rechargeable Makeup Mirror (LED)",
    price: 29.5,
    compareAt: 49.0,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
    category: "Beauty Tools",
    rating: 4.3,
    reviews: 989,
    badge: "Studio Glow",
    shippingNote: "3 light modes",
    description: "Tri‑tone LED lighting with brightness control. Slim folding design for vanities or travel.",
  },
  {
    id: "b10",
    title: "Silicone Face Cleansing Brush",
    price: 19.99,
    compareAt: 29.99,
    image: "https://images.unsplash.com/photo-1585238341303-fd1b7f0804b8?q=80&w=1200&auto=format&fit=crop",
    category: "Skincare",
    rating: 4.2,
    reviews: 1331,
    badge: "Waterproof",
    shippingNote: "Gentle on skin",
    description: "Soft silicone bristles + sonic vibration for daily cleansing and massage.",
  },
  {
    id: "b11",
    title: "Makeup Organizer Spinning Rack",
    price: 28.99,
    compareAt: 46.99,
    image: "https://images.unsplash.com/photo-1512204369336-2b44c7f2f3a0?q=80&w=1200&auto=format&fit=crop",
    category: "Beauty Tools",
    rating: 4.4,
    reviews: 887,
    badge: "Tidy Up",
    shippingNote: "Easy assemble",
    description: "360° rotating vanity organizer with adjustable tiers for bottles, jars, and brushes.",
  },
  {
    id: "b12",
    title: "Velvet Lip Stain (Matte, 3‑Pack)",
    price: 17.5,
    compareAt: 27.0,
    image: "https://images.unsplash.com/photo-1585386959984-a415522316a1?q=80&w=1200&auto=format&fit=crop",
    category: "Makeup",
    rating: 4.1,
    reviews: 502,
    badge: "New Shades",
    shippingNote: "Long‑wear",
    description: "Lightweight matte lip stain trio with smooth blurring finish and non‑drying formula.",
  },
];

type CartLine = { product: Product; qty: number };

const COUPONS: Record<string, number> = {
  WELCOME10: 0.1,
  GLAM15: 0.15,
};

const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);

function calcTotals(lines: CartLine[], coupon?: string) {
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const rate = coupon && COUPONS[coupon.toUpperCase()] ? COUPONS[coupon.toUpperCase()] : 0;
  const discount = +(subtotal * rate).toFixed(2);
  const after = subtotal - discount;
  const shipping = after >= 50 || after === 0 ? 0 : 6.99;
  const total = +(after + shipping).toFixed(2);
  return { subtotal, discount, shipping, total, discountRate: rate };
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-rose-600/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 ring-1 ring-inset ring-rose-600/20">
      {children}
    </span>
  );
}

function Rating({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={
        i < full
          ? "h-4 w-4 fill-yellow-400 text-yellow-400"
          : half && i === full
          ? "h-4 w-4 fill-yellow-400/70 text-yellow-400/70"
          : "h-4 w-4 text-gray-300"
      }
    />
  ));
  return <div className="flex items-center gap-1">{stars}</div>;
}

function useAnalytics() {
  useEffect(() => {
    if (GOOGLE_ANALYTICS_ID) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
      document.head.appendChild(s);
      const inline = document.createElement("script");
      inline.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${GOOGLE_ANALYTICS_ID}');`;
      document.head.appendChild(inline);
    }
    if (META_PIXEL_ID) {
      const px = document.createElement("script");
      px.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`;
      document.head.appendChild(px);
    }
  }, []);
}

export default function AuraElan() {
  useAnalytics();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [sort, setSort] = useState("featured");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [coupon, setCoupon] = useState("");
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [legalPage, setLegalPage] = useState<null | "refund" | "privacy" | "terms">(null);
  const [signupOpen, setSignupOpen] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");

  useEffect(() => {
    const seen = localStorage.getItem("ae_signup");
    if (!seen) {
      const t = setTimeout(() => setSignupOpen(true), 6000);
      return () => clearTimeout(t);
    }
  }, []);

  const products = useMemo(() => {
    let list = PRODUCTS.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (query.trim() === "" || p.title.toLowerCase().includes(query.toLowerCase()))
    );
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "reviews") list.sort((a, b) => b.reviews - a.reviews);
    else list.sort((a, b) => b.reviews * b.rating - a.reviews * a.rating);
    return list;
  }, [category, query, sort]);

  const lines = useMemo(() => Object.values(cart), [cart]);
  const totals = useMemo(() => calcTotals(lines, coupon), [lines, coupon]);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  function addToCart(product: Product, qty = 1) {
    setCart((prev) => {
      const existing = prev[product.id];
      const nextQty = (existing?.qty || 0) + qty;
      return { ...prev, [product.id]: { product, qty: nextQty } };
    });
  }

  function updateQty(id: string, qty: number) {
    setCart((prev) => {
      const line = prev[id];
      if (!line) return prev;
      const next = Math.max(1, qty);
      return { ...prev, [id]: { ...line, qty: next } };
    });
  }

  function removeLine(id: string) {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  function clearCart() {
    setCart({});
    setCoupon("");
  }

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (!code) return alert("Enter a code");
    if (!COUPONS[code]) return alert("Invalid code");
    alert(`Coupon ${code} applied!`);
  }

  async function beginCheckout() {
    if (lines.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    try {
      const res = await fetch(API_CHECKOUT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ name: l.product.title, unit_amount: Math.round(l.product.price * 100), quantity: l.qty })),
          discount_code: coupon || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      }
    } catch (e) {
      console.warn("Checkout API failed", e);
    }
    if (STRIPE_PAYMENT_LINK) {
      window.location.href = STRIPE_PAYMENT_LINK;
      return;
    }
    setCheckoutMode(true);
  }

  function placeOrderMock() {
    if (lines.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    alert("Success! This is a mock checkout. To accept real payments, set STRIPE_PAYMENT_LINK or deploy the API.");
    clearCart();
    setCheckoutMode(false);
    setCartOpen(false);
  }

  function completeSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(signupEmail)) {
      alert("Please enter a valid email.");
      return;
    }
    localStorage.setItem("ae_signup", signupEmail);
    setSignupOpen(false);
    setCoupon("WELCOME10");
    alert("Thanks! 10% off code WELCOME10 applied to your cart.");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50 text-gray-900">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-rose-600" />
            <span className="text-xl font-bold tracking-tight">AuraÉlan</span>
          </div>
          <div className="ml-4 hidden md:flex items-center gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  category === c ? "bg-rose-600 text-white shadow" : "hover:bg-rose-50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="ml-auto flex-1 max-w-lg">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search beauty products…"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pl-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="ml-3 flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="relative inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-black"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              {count > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-[10px] font-bold text-white shadow">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Glow with <span className="text-rose-600">AuraÉlan</span>
            </h1>
            <p className="mt-3 text-gray-600 max-w-xl">
              High‑margin beauty products with fast fulfillment. No inventory, no hassle—just profit. Explore our curated bestsellers.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a href="#catalog" className="rounded-xl bg-rose-600 px-4 py-2.5 text-white font-semibold shadow hover:bg-rose-700">
                Shop Bestsellers
              </a>
              <button onClick={() => setSignupOpen(true)} className="rounded-xl border border-gray-300 px-4 py-2.5 font-semibold hover:bg-rose-50">
                Get 10% Off
              </button>
            </div>
            <div className="mt-5 flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" /> Fast Shipping
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> 30‑Day Guarantee
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Secure Checkout
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 to-fuchsia-500 p-1 shadow-xl"
          >
            <div className="rounded-3xl bg-white p-6">
              <img
                src="https://images.unsplash.com/photo-1512499617640-c2f999098c69?q=80&w=1200&auto=format&fit=crop"
                alt="Beauty collage"
                className="h-64 w-full object-cover rounded-2xl"
              />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Featured</div>
                  <div className="text-lg font-semibold">Top beauty picks</div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-rose-600" /> Up to 40% off
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>
              Showing <strong>{products.length}</strong> product{products.length !== 1 ? "s" : ""}
              {category !== "All" && (
                <>
                  {" "}
                  in <strong>{category}</strong>
                </>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2 pr-8 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2 pr-8 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="reviews">Most Reviewed</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md"
            >
              <div className="relative">
                <img src={p.image} alt={p.title} className="h-56 w-full object-cover" />
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  {p.badge && <Badge>{p.badge}</Badge>}
                  {p.compareAt && (
                    <span className="rounded-full bg-rose-600/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 ring-1 ring-inset ring-rose-600/20">
                      Save {Math.round(((p.compareAt - p.price) / p.compareAt) * 100)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold">{p.title}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                      <Rating value={p.rating} />
                      <span>({p.reviews.toLocaleString()})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatUSD(p.price)}</div>
                    {p.compareAt && <div className="text-xs text-gray-400 line-through">{formatUSD(p.compareAt)}</div>}
                  </div>
                </div>
                {p.shippingNote && (
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                    <Truck className="h-4 w-4" /> {p.shippingNote}
                  </div>
                )}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => addToCart(p)}
                    className="flex-1 rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-black"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="benefits" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Supplier‑Verified",
              desc: "Audited partners for consistent QC and tracking.",
              icon: <Shield className="h-6 w-6 text-rose-600" />,
            },
            {
              title: "Fast Fulfillment",
              desc: "3–7 business day delivery in core regions.",
              icon: <Truck className="h-6 w-6 text-rose-600" />,
            },
            {
              title: "Secure Payments",
              desc: "Paste your Stripe Payment Link to go live.",
              icon: <CreditCard className="h-6 w-6 text-rose-600" />,
            },
          ].map((b) => (
            <div key={b.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                {b.icon}
                <h3 className="text-lg font-semibold">{b.title}</h3>
              </div>
              <p className="mt-2 text-gray-600">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-gray-600">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div>© {new Date().getFullYear()} AuraÉlan. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <button onClick={() => setLegalPage("refund")} className="hover:underline">
                Refund Policy
              </button>
              <button onClick={() => setLegalPage("privacy")} className="hover:underline">
                Privacy Policy
              </button>
              <button onClick={() => setLegalPage("terms")} className="hover:underline">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {cartOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-gray-100 flex flex-col"
            role="dialog"
            aria-modal
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2 font-semibold">
                <ShoppingCart className="h-5 w-5" /> Your Cart
              </div>
              <button onClick={() => setCartOpen(false)} className="rounded-lg p-2 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {lines.length === 0 ? (
                <div className="h-full grid place-items-center text-gray-500">Your cart is empty.</div>
              ) : (
                <div className="space-y-4">
                  {lines.map((l) => (
                    <div key={l.product.id} className="flex gap-3 rounded-xl border border-gray-100 p-3">
                      <img src={l.product.image} alt={l.product.title} className="h-20 w-20 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="truncate font-semibold">{l.product.title}</div>
                          <div className="text-sm font-bold">{formatUSD(l.product.price * l.qty)}</div>
                        </div>
                        <div className="mt-0.5 text-xs text-gray-500">{formatUSD(l.product.price)} each</div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="inline-flex items-center rounded-lg border border-gray-200">
                            <button onClick={() => updateQty(l.product.id, l.qty - 1)} className="p-1.5 hover:bg-gray-50">
                              <Minus className="h-4 w-4" />
                            </button>
                            <div className="w-8 text-center text-sm font-semibold">{l.qty}</div>
                            <button onClick={() => updateQty(l.product.id, l.qty + 1)} className="p-1.5 hover:bg-gray-50">
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button onClick={() => removeLine(l.product.id)} className="text-sm text-rose-600 hover:underline">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-gray-100 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code (e.g., WELCOME10)"
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button onClick={applyCoupon} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold hover:bg-rose-50">
                  Apply
                </button>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatUSD(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({Math.round(totals.discountRate * 100)}%)</span>
                    <span>-{formatUSD(totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{totals.shipping === 0 ? "FREE" : formatUSD(totals.shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatUSD(totals.total)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={beginCheckout}
                  className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-white font-semibold shadow hover:bg-rose-700"
                  disabled={lines.length === 0}
                >
                  Checkout
                </button>
                <button onClick={clearCart} className="rounded-xl border border-gray-300 px-4 py-2.5 font-semibold hover:bg-rose-50">
                  Clear
                </button>
              </div>
              <div className="text-[11px] text-gray-500 flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> 30‑day money‑back guarantee
              </div>
            </div>
            <AnimatePresence>
              {checkoutMode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur p-4"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="font-semibold">Secure Checkout (Demo)</div>
                    <button onClick={() => setCheckoutMode(false)} className="rounded-lg p-2 hover:bg-gray-100">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4">
                    <input placeholder="Full name" className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                    <input placeholder="Email" type="email" className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                    <input placeholder="Shipping address" className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                    <div className="grid grid-cols-2 gap-3">
                      <input placeholder="City" className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                      <input placeholder="Postal code" className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-rose-50 p-3 text-sm">
                      <div className="flex justify-between">
                        <span>Items ({count})</span>
                        <span>{formatUSD(totals.subtotal)}</span>
                      </div>
                      {totals.discount > 0 && (
                        <div className="flex justify-between text-emerald-700">
                          <span>Discount</span>
                          <span>-{formatUSD(totals.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{totals.shipping === 0 ? "FREE" : formatUSD(totals.shipping)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Order total</span>
                        <span>{formatUSD(totals.total)}</span>
                      </div>
                    </div>
                    <button onClick={placeOrderMock} className="rounded-xl bg-gray-900 px-4 py-2.5 text-white font-semibold shadow hover:bg-black">
                      Place order
                    </button>
                    <div className="text-[11px] text-gray-500">
                      To accept real payments, set <strong>STRIPE_PAYMENT_LINK</strong> or deploy the API.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {signupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
            onClick={() => setSignupOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 text-rose-600 font-semibold">
                <Mail className="h-5 w-5" /> Get 10% Off
              </div>
              <h3 className="mt-1 text-xl font-bold">Join the Beauty Club</h3>
              <p className="mt-1 text-sm text-gray-600">
                Sign up for exclusive offers. We’ll auto‑apply <strong>WELCOME10</strong> to your cart.
              </p>
              <form className="mt-4 space-y-3" onSubmit={completeSignup}>
                <input
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-white font-semibold shadow hover:bg-rose-700">
                    Get my 10%
                  </button>
                  <button type="button" onClick={() => setSignupOpen(false)} className="rounded-xl border border-gray-300 px-4 py-2.5 font-semibold hover:bg-rose-50">
                    No thanks
                  </button>
                </div>
                <div className="text-[11px] text-gray-500">
                  By subscribing you agree to our{' '}
                  <button type="button" onClick={() => setLegalPage('privacy')} className="underline">
                    Privacy Policy
                  </button>
                  .
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {legalPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
            onClick={() => setLegalPage(null)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl prose prose-sm max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">
                  {legalPage === 'refund' && 'Refund Policy'}
                  {legalPage === 'privacy' && 'Privacy Policy'}
                  {legalPage === 'terms' && 'Terms of Service'}
                </h3>
                <button onClick={() => setLegalPage(null)} className="rounded-lg p-2 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {legalPage === 'refund' && (
                <div>
                  <p>
                    <strong>30‑Day Money‑Back Guarantee.</strong> If you’re not satisfied, contact us within 30 days of delivery for a refund. Items must be in
                    original condition with all accessories.
                  </p>
                  <ul>
                    <li>To start a return, email support@auraelan.com with your order #.</li>
                    <li>Return shipping costs are non‑refundable unless item is defective.</li>
                    <li>Excluded: gift cards, downloadable items, final‑sale items.</li>
                  </ul>
                </div>
              )}
              {legalPage === 'privacy' && (
                <div>
                  <p>We collect the information you provide (e.g., email for discounts and order updates). We use cookies/analytics to improve the site.</p>
                  <ul>
                    <li>Data controller: AuraÉlan.</li>
                    <li>Opt‑out anytime by unsubscribing. For deletion requests, email privacy@auraelan.com.</li>
                    <li>We don’t sell personal information. Third‑party processors: payments (Stripe), analytics (Google, Meta).</li>
                  </ul>
                </div>
              )}
              {legalPage === 'terms' && (
                <div>
                  <p>Use of this site constitutes acceptance of these Terms. All prices in USD. We reserve the right to update listings and policies.</p>
                  <ul>
                    <li>Orders are processed on business days. Delivery estimates exclude carrier delays.</li>
                    <li>Warranty: 30‑day limited return policy as described in Refund Policy.</li>
                    <li>Disclaimers: Cosmetic products only. Patch test recommended; discontinue use if irritation occurs.</li>
                  </ul>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
