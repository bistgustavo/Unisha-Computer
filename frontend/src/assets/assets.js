import logo from "./logo.png";
import search_icon from "./search_icon.svg";
import remove_icon from "./remove_icon.svg";
import arrow_right_icon_colored from "./arrow_right_icon_colored.svg";
import star_icon from "./star_icon.svg";
import star_dull_icon from "./star_dull_icon.svg";
import cart_icon from "./cart_icon.svg";
import nav_cart_icon from "./nav_cart_icon.svg";
import add_icon from "./add_icon.svg";
import refresh_icon from "./refresh_icon.svg";
import product_list_icon from "./product_list_icon.svg";
import order_icon from "./order_icon.svg";
import upload_area from "./upload_area.png";
import profile_icon from "./profile_icon.png";
import menu_icon from "./menu_icon.svg";
import delivery_truck_icon from "./delivery_truck_icon.svg";
import leaf_icon from "./leaf_icon.svg";
import coin_icon from "./coin_icon.svg";
import box_icon from "./box_icon.png";
import trust_icon from "./trust_icon.svg";
import black_arrow_icon from "./black_arrow_icon.svg";
import white_arrow_icon from "./white_arrow_icon.svg";
import main_banner_bg from "./main_banner_bg.png";
import main_banner_bg_sm from "./main_banner_bg_sm.png";
import bottom_banner_image from "./bottom_banner_image.png";
import bottom_banner_image_sm from "./bottom_banner_image_sm.png";
import add_address_iamge from "./add_address_image.svg";
import pc_hardware_components from "./pc_hardware_components.png";
import peripherals from "./peripherals.avif";
import networking_devices from "./networking_devices.avif";
import cables from "./cables.png";
import laptops from "./laptops.png";
import printers from "./printer.png";
import softwares from "./software.png";
import banner2 from "./banner2.png";
import banner3 from "./banner3.png";
import banner4 from "./banner4.jpg";
import payment_icon from "./payment_icon.png";


export const assets = {
  logo,
  banner2,
  banner3,
  banner4,
  search_icon,
  remove_icon,
  arrow_right_icon_colored,
  star_icon,
  star_dull_icon,
  cart_icon,
  nav_cart_icon,
  add_icon,
  refresh_icon,
  product_list_icon,
  order_icon,
  upload_area,
  profile_icon,
  menu_icon,
  delivery_truck_icon,
  leaf_icon,
  coin_icon,
  trust_icon,
  black_arrow_icon,
  white_arrow_icon,
  main_banner_bg,
  main_banner_bg_sm,
  bottom_banner_image,
  bottom_banner_image_sm,
  add_address_iamge,
  box_icon,
  payment_icon,
};

export const categories = [
  {
    text: "Hardware Components",
    path: "hardwares",
    image: pc_hardware_components,
    bgColor: "#FEF6DA",
  },
  {
    text: "Peripherals",
    path: "peripherals",
    image: peripherals,
    bgColor: "#FEE0E0",
  },
  {
    text: "Networking",
    path: "networking",
    image: networking_devices,
    bgColor: "#F0F5DE",
  },
  {
    text: "Cables",
    path: "cables",
    image: cables,
    bgColor: "#E1F5EC",
  },
  {
    text: "Laptops",
    path: "laptops",
    image: laptops,
    bgColor: "#FEE6CD",
  },
  {
    text: "Printers",
    path: "printers",
    image: printers,
    bgColor: "#E0F6FE",
  },
  {
    text: "Softwares",
    path: "softwares",
    image: softwares,
    bgColor: "#F1E3F9",
  },
];

export const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { text: "Home", url: "#" },
      { text: "Best Sellers", url: "#" },
      { text: "Offers & Deals", url: "#" },
      { text: "Contact Us", url: "#" },
      { text: "FAQs", url: "#" },
    ],
  },
  {
    title: "Need help?",
    links: [
      { text: "Delivery Information", url: "#" },
      { text: "Return & Refund Policy", url: "#" },
      { text: "Payment Methods", url: "#" },
      { text: "Track your Order", url: "#" },
      { text: "Contact Us", url: "#" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { text: "Instagram", url: "#" },
      { text: "Twitter", url: "#" },
      { text: "Facebook", url: "#" },
      { text: "YouTube", url: "#" },
    ],
  },
];

export const features = [
  {
    icon: delivery_truck_icon,
    title: "Fastest Delivery",
    description: "Groceries delivered in under 30 minutes.",
  },
  {
    icon: leaf_icon,
    title: "Freshness Guaranteed",
    description: "Fresh produce straight from the source.",
  },
  {
    icon: coin_icon,
    title: "Affordable Prices",
    description: "Quality groceries at unbeatable prices.",
  },
  {
    icon: trust_icon,
    title: "Trusted by Thousands",
    description: "Loved by 10,000+ happy customers.",
  },
];

export const dummyProducts = [
  // Hardware Components
  {
    _id: "hc001",
    name: "Intel Core i7 12700K",
    category: "hardwares",
    price: 450,
    offerPrice: 420,
    image: [pc_hardware_components],
    description: [
      "12th Gen Intel Core processor",
      "High performance for gaming and productivity",
      "LGA 1700 socket support",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "hc002",
    name: "Corsair Vengeance 16GB DDR5",
    category: "hardwares",
    price: 120,
    offerPrice: 110,
    image: [pc_hardware_components],
    description: [
      "3200MHz DDR5 RAM",
      "Low-latency performance",
      "Ideal for gaming builds",
    ],
    createdAt: "2025-03-21T07:12:46.018Z",
    updatedAt: "2025-03-21T07:13:13.103Z",
    inStock: true,
  },
  {
    _id: "hc003",
    name: "Samsung 980 Pro 1TB NVMe SSD",
    category: "hardwares",
    price: 160,
    offerPrice: 150,
    image: [pc_hardware_components],
    description: [
      "High-speed PCIe Gen4",
      "Read speeds up to 7000MB/s",
      "Reliable and durable",
    ],
    createdAt: "2025-03-18T07:17:46.018Z",
    updatedAt: "2025-03-18T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "hc004",
    name: "ASUS ROG STRIX B650-E Motherboard",
    category: "hardwares",
    price: 280,
    offerPrice: 265,
    image: [pc_hardware_components],
    description: [
      "Supports AMD Ryzen processors",
      "PCIe 5.0 slots and DDR5 RAM",
      "Aura Sync RGB",
    ],
    createdAt: "2025-03-19T07:17:46.018Z",
    updatedAt: "2025-03-19T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "hc005",
    name: "Cooler Master Hyper 212 RGB",
    category: "hardwares",
    price: 55,
    offerPrice: 50,
    image: [pc_hardware_components],
    description: [
      "Air CPU cooler with RGB fan",
      "Universal socket compatibility",
      "Quiet operation",
    ],
    createdAt: "2025-03-20T07:17:46.018Z",
    updatedAt: "2025-03-20T07:18:13.103Z",
    inStock: true,
  },
];

export const dummyAddress = [
  {
    _id: "67b5b9e54ea97f71bbc196a0",
    userId: "67b5880e4d09769c5ca61644",
    firstName: "Great",
    lastName: "Stack",
    email: "user.greatstack@gmail.com",
    street: "Street 123",
    city: "Main City",
    state: "New State",
    zipcode: 123456,
    country: "IN",
    phone: "1234567890",
  },
];

export const dummyOrders = [
  {
    _id: "67e2589a8f87e63366786400",
    userId: "67b5880e4d09769c5ca61644",
    items: [
      {
        product: dummyProducts[3],
        quantity: 2,
        _id: "67e2589a8f87e63366786401",
      },
    ],
    amount: 1200,
    address: dummyAddress[0],
    status: "Order Placed",
    paymentType: "Online",
    isPaid: true,
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
  },
  {
    _id: "67e258798f87e633667863f2",
    userId: "67b5880e4d09769c5ca61644",
    items: [
      {
        product: dummyProducts[0],
        quantity: 1,
        _id: "67e258798f87e633667863f3",
      },
      {
        product: dummyProducts[1],
        quantity: 1,
        _id: "67e258798f87e633667863f4",
      },
    ],
    amount: 700,
    address: dummyAddress[0],
    status: "Order Placed",
    paymentType: "COD",
    isPaid: false,
    createdAt: "2025-03-25T07:17:13.068Z",
    updatedAt: "2025-03-25T07:17:13.068Z",
  },
];


export const dummyPayment = [
  {
    payment_id: "67b5b9e54ea97f71bbc196a1",
    order_id: "ORD001",
    user_id: "67b5880e4d09769c5ca61644",
    amount: "125.75",
    method: "cash_on_delivery",
    status: "pending",
    transaction_id: null,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z"
  },
  {
    payment_id: "67b5b9e54ea97f71bbc196a2",
    order_id: "ORD002",
    user_id: "67b5880e4d09769c5ca61644",
    amount: "89.99",
    method: "credit_card",
    status: "completed",
    transaction_id: "TXN_CC_789456123",
    createdAt: "2024-01-15T11:45:00.000Z",
    updatedAt: "2024-01-15T11:47:30.000Z"
  },
  {
    payment_id: "67b5b9e54ea97f71bbc196a3",
    order_id: "ORD003",
    user_id: "67b5880e4d09769c5ca61644",
    amount: "215.50",
    method: "paypal",
    status: "completed",
    transaction_id: "PP-1234567890",
    createdAt: "2024-01-15T14:20:00.000Z",
    updatedAt: "2024-01-15T14:22:15.000Z"
  },
  {
    payment_id: "67b5b9e54ea97f71bbc196a4",
    order_id: "ORD004",
    user_id: "67b5880e4d09769c5ca61644",
    amount: "42.25",
    method: "cash_on_delivery",
    status: "pending",
    transaction_id: null,
    createdAt: "2024-01-16T09:15:00.000Z",
    updatedAt: "2024-01-16T09:15:00.000Z"
  },
  {
    payment_id: "67b5b9e54ea97f71bbc196a5",
    order_id: "ORD005",
    user_id: "67b5880e4d09769c5ca61644",
    amount: "156.80",
    method: "bank_transfer",
    status: "failed",
    transaction_id: "BT_987654321",
    createdAt: "2024-01-16T13:40:00.000Z",
    updatedAt: "2024-01-16T13:45:00.000Z"
  }
]