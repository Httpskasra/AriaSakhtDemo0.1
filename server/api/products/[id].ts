import { defineEventHandler } from "h3";
import type { Product } from "~/types/product";

// شبیه‌سازی داده‌های محصولات
const products: Product[] = [
  {
    id: "1",
    name: "Laptop X1",
    price: 1500,
    companiesId: ["company1", "company2"],
    categories: ["Electronics", "Computers"],
    description: `درخواست عودت کالا و یا مرجوع کردن کالاها به دلیل انصراف از خرید تنها در
      صورت پلمپ بودن کالا (کالا نباید باز شده باشد ) امکانپذیر است امکان برگشت
      کالا در گروه موبایل با دلیل "انصراف از خرید" تنها در صورتی مورد قبول است
      که پلمب کالا باز نشده باشد. تمام گوشی‌های دیجی‌کالا ضمانت رجیستری دارند.
      در صورت وجود مشکل رجیستری، می‌توانید بعد از مهلت قانونی ۳۰ روزه، گوشی
      خریداری‌شده را مرجوع کنید. درخواست عودت کالا و یا مرجوع کردن کالاها به
      دلیل انصراف از خرید تنها در صورت پلمپ بودن کالا (کالا نباید باز شده باشد )
      امکانپذیر است امکان برگشت کالا در گروه موبایل با دلیل "انصراف از خرید"
      تنها در صورتی مورد قبول است که پلمب کالا باز نشده باشد. تمام گوشی‌های
      دیجی‌کالا ضمانت رجیستری دارند. در صورت وجود مشکل رجیستری، می‌توانید بعد از
      مهلت قانونی ۳۰ روزه، گوشی خریداری‌شده را مرجوع کنید. درخواست عودت کالا و
      یا مرجوع کردن کالاها به دلیل انصراف از خرید تنها در صورت پلمپ بودن کالا
      (کالا نباید باز شده باشد ) امکانپذیر است امکان برگشت کالا در گروه موبایل
      با دلیل "انصراف از خرید" تنها در صورتی مورد قبول است که پلمب کالا باز نشده
      باشد. تمام گوشی‌های دیجی‌کالا ضمانت رجیستری دارند. در صورت وجود مشکل
      رجیستری، می‌توانید بعد از مهلت قانونی ۳۰ روزه، گوشی خریداری‌شده را مرجوع
      کنید. درخواست عودت کالا و یا مرجوع کردن کالاها به دلیل انصراف از خرید تنها
      در صورت پلمپ بودن کالا (کالا نباید باز شده باشد ) امکانپذیر است امکان
      برگشت کالا در گروه موبایل با دلیل "انصراف از خرید" تنها در صورتی مورد قبول
      است که پلمب کالا باز نشده باشد. تمام گوشی‌های دیجی‌کالا ضمانت رجیستری
      دارند. در صورت وجود مشکل رجیستری، می‌توانید بعد از مهلت قانونی ۳۰ روزه،
      گوشی خریداری‌شده را مرجوع کنید. درخواست عودت کالا و یا مرجوع کردن کالاها
      به دلیل انصراف از خرید تنها در صورت پلمپ بودن کالا (کالا نباید باز شده
      باشد ) امکانپذیر است امکان برگشت کالا در گروه موبایل با دلیل "انصراف از
      خرید" تنها در صورتی مورد قبول است که پلمب کالا باز نشده باشد. تمام
      گوشی‌های دیجی‌کالا ضمانت رجیستری دارند. در صورت وجود مشکل رجیستری،
      می‌توانید بعد از مهلت قانونی ۳۰ روزه، گوشی خریداری‌شده را مرجوع کنید.
      درخواست عودت کالا و یا مرجوع کردن کالاها به دلیل انصراف از خرید تنها در
      صورت پلمپ بودن کالا (کالا نباید باز شده باشد ) امکانپذیر است امکان برگشت
      کالا در گروه موبایل با دلیل "انصراف از خرید" تنها در صورتی مورد قبول است
      که پلمب کالا باز نشده باشد. تمام گوشی‌های دیجی‌کالا ضمانت رجیستری دارند.
      در صورت وجود مشکل رجیستری، می‌توانید بعد از مهلت قانونی ۳۰ روزه، گوشی
      خریداری‌شده را مرجوع کنید.`,
    image:
      "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
    subcategory: "Laptops",
    comments: [
      { sender: "علی", comment: "محصول عالی!" },
      { sender: "مریم", comment: "توصیه می‌شود." },
    ],
    rating: 4.5,
  },
  {
    id: "2",
    name: "Smartphone Z5",
    price: 800,
    companiesId: ["company3"],
    categories: ["Electronics", "Mobile Phones"],
    description: "A sleek and powerful smartphone.",
    image: "https://example.com/images/smartphone-z5.jpg",
    subcategory: "Smartphones",
    comments: [
      { sender: "رضا", comment: "دوربین فوق‌العاده!" },
      { sender: "سارا", comment: "عمر باتری می‌توانست بهتر باشد." },
    ],
    rating: 4.2,
  },
  {
    id: "3",
    name: "Wireless Headphones Pro",
    price: 200,
    companiesId: ["company4"],
    categories: ["Electronics", "Audio"],
    description: "Noise-cancelling wireless headphones.",
    image: "https://example.com/images/headphones-pro.jpg",
    subcategory: "Headphones",
    comments: [
      { sender: "محمد", comment: "کیفیت صدای عالی." },
      { sender: "زهرا", comment: "بسیار راحت." },
    ],
    rating: 4.8,
  },
  {
    id: "4",
    name: "Gaming Mouse G7",
    price: 50,
    companiesId: ["company5"],
    categories: ["Electronics", "Gaming"],
    description: "A high-precision gaming mouse.",
    image: "https://example.com/images/gaming-mouse-g7.jpg",
    subcategory: "Accessories",
    comments: [
      { sender: "امیر", comment: "عالی برای بازی." },
      { sender: "نرگس", comment: "قیمت مناسب." },
    ],
    rating: 4.6,
  },
  {
    id: "5",
    name: "4K Monitor Ultra",
    price: 400,
    companiesId: ["company6"],
    categories: ["Electronics", "Monitors"],
    description: "A stunning 4K monitor with vibrant colors.",
    image: "https://example.com/images/4k-monitor-ultra.jpg",
    subcategory: "Monitors",
    comments: [
      { sender: "حسین", comment: "عالی برای ویرایش ویدیو." },
      { sender: "الهام", comment: "نمایشگر با جزئیات بالا." },
    ],
    rating: 4.7,
  },
];

export default defineEventHandler((event) => {
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "شناسه محصول الزامی است",
    });
  }

  const product = products.find((p) => p.id === id);

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: "محصول یافت نشد",
    });
  }

  return product;
});
