-- ====================================================================
-- PREMIUM MOBILE STORE - SEED 20 FLAGSHIP SMARTPHONES
-- Migration: 20260929000001_seed_20_mobiles.sql
-- Description: Inserts 20 authentic smartphones with images, specifications,
--              prices, and stock status. Uses ON CONFLICT DO NOTHING.
-- ====================================================================

INSERT INTO public.mobiles (id, name, brand, description, price, ram, storage, images, stock_status, is_hidden, created_at, updated_at)
VALUES
  (
    '11111111-1111-4111-8111-111111111101',
    'Apple iPhone 16 Pro Max',
    'Apple',
    'The ultimate iPhone featuring a Grade 5 Titanium design with thinner borders and a 6.9-inch Super Retina XDR OLED display. Powered by the groundbreaking Apple A18 Pro chip with 6-core GPU, next-gen 48MP Fusion camera with 5x optical telephoto, dedicated Camera Control button, and 4K 120fps Dolby Vision video recording.',
    144900,
    '8GB',
    '256GB',
    ARRAY[
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 10:00:00+00',
    '2026-09-29 10:00:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111102',
    'Apple iPhone 16 Pro',
    'Apple',
    'Pro performance in a compact 6.3-inch form factor. Equipped with the A18 Pro silicon, Grade 5 Titanium enclosure, 48MP Ultra Wide sensor with macro capability, 5x telephoto camera, and studio-quality 4-mic array with Audio Mix.',
    119900,
    '8GB',
    '128GB',
    ARRAY[
      'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 09:50:00+00',
    '2026-09-29 09:50:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111103',
    'Apple iPhone 16',
    'Apple',
    'Vibrant aerospace-grade aluminum with color-infused back glass. Features the powerful A18 processor, Action button, innovative Camera Control, and 48MP 2-in-1 Fusion camera for stunning high-res photos and 2x optical-quality zoom.',
    79900,
    '8GB',
    '128GB',
    ARRAY[
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 09:40:00+00',
    '2026-09-29 09:40:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111104',
    'Samsung Galaxy S25 Ultra',
    'Samsung',
    'Samsung flagship pinnacle built with lightweight titanium chassis and flat 6.8-inch Dynamic AMOLED 2X 120Hz display with Gorilla Armor glass. Features Snapdragon 8 Elite for Galaxy, built-in S Pen, 200MP Quad Telephoto optical zoom, and Galaxy AI.',
    129999,
    '12GB',
    '512GB',
    ARRAY[
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 09:30:00+00',
    '2026-09-29 09:30:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111105',
    'Samsung Galaxy S25+',
    'Samsung',
    'Harmonious flagship performance with 6.7-inch QHD+ 120Hz Dynamic AMOLED display, Armor Aluminum frame, 4900mAh battery with 45W super fast charging, 50MP triple camera system, and integrated on-device AI capabilities.',
    99999,
    '12GB',
    '256GB',
    ARRAY[
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 09:20:00+00',
    '2026-09-29 09:20:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111106',
    'Samsung Galaxy Z Fold 6',
    'Samsung',
    'Next-generation foldable phone combining a 6.3-inch cover screen and an expansive 7.6-inch Dynamic AMOLED 2X 120Hz inner tablet display. Boasts dual-rail FlexHinge, Snapdragon 8 Gen 3 for Galaxy, S Pen fold edition support, and IP48 water resistance.',
    164999,
    '12GB',
    '512GB',
    ARRAY[
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80'
    ],
    'Limited Stock',
    false,
    '2026-09-29 09:10:00+00',
    '2026-09-29 09:10:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111107',
    'Samsung Galaxy Z Flip 6',
    'Samsung',
    'The trendsetting pocket foldable with 3.4-inch Super AMOLED Flex Window and 6.7-inch Dynamic AMOLED 2X main screen. Features a flagship 50MP wide camera with FlexCam auto zoom, 4000mAh long-lasting battery, and vapor chamber cooling.',
    109999,
    '12GB',
    '256GB',
    ARRAY[
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 09:00:00+00',
    '2026-09-29 09:00:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111108',
    'Google Pixel 9 Pro XL',
    'Google',
    'Engineered with Google Tensor G4 and 16GB RAM for advanced on-device Gemini AI. Features a 6.8-inch Super Actua LTPO OLED screen, 50MP triple pro camera with 30x Super Res Zoom, 42MP selfie camera, and 7 years of OS upgrades.',
    124999,
    '16GB',
    '256GB',
    ARRAY[
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 08:50:00+00',
    '2026-09-29 08:50:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111109',
    'Google Pixel 9 Pro',
    'Google',
    'All the Pro power in a compact 6.3-inch Super Actua display. Boasts Google Tensor G4 chip, 16GB RAM, matte glass back with polished metal frame, pro triple camera system with 5x telephoto, and cutting-edge Magic Editor features.',
    109999,
    '16GB',
    '128GB',
    ARRAY[
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 08:40:00+00',
    '2026-09-29 08:40:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111110',
    'Google Pixel 9',
    'Google',
    'Featuring an elevated design with satin finish and iconic camera bar. Comes with 6.3-inch Actua display, 50MP main sensor with 48MP ultrawide with macro focus, Tensor G4 processor, and 24-hour battery life with Extreme Battery Saver.',
    79999,
    '12GB',
    '128GB',
    ARRAY[
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 08:30:00+00',
    '2026-09-29 08:30:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    'OnePlus 13',
    'OnePlus',
    'Flagship performance powerhouse with Snapdragon 8 Elite, massive 6000mAh Glacier battery, 100W wired and 50W wireless SUPERVOOC charging, 2K 120Hz Oriental LTPO display, and 50MP Hasselblad Master camera system with Sony LYT-808.',
    69999,
    '16GB',
    '512GB',
    ARRAY[
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 08:20:00+00',
    '2026-09-29 08:20:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111112',
    'OnePlus 12',
    'OnePlus',
    'Mastery in performance with Snapdragon 8 Gen 3, 5400mAh dual-cell battery, 100W SUPERVOOC charging, 4th Gen Hasselblad camera with 64MP periscope telephoto, and ultra-bright 4500-nit ProXDR display.',
    64999,
    '16GB',
    '256GB',
    ARRAY[
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 08:10:00+00',
    '2026-09-29 08:10:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111113',
    'OnePlus Open',
    'OnePlus',
    'Featherweight foldable crafted with carbon fiber and titanium. Features dual 120Hz ProXDR displays, Hasselblad camera trio, Snapdragon 8 Gen 2, and revolutionary Open Canvas multitasking.',
    139999,
    '16GB',
    '512GB',
    ARRAY[
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&auto=format&fit=crop&q=80'
    ],
    'Limited Stock',
    false,
    '2026-09-29 08:00:00+00',
    '2026-09-29 08:00:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111114',
    'Xiaomi 15 Pro',
    'Xiaomi',
    'Co-engineered with Leica featuring Summilux optical lenses across three 50MP cameras. Powered by Snapdragon 8 Elite, massive 6100mAh silicon-carbon anode battery, and a micro-curved 2K 120Hz OLED screen.',
    74999,
    '16GB',
    '512GB',
    ARRAY[
      'https://images.unsplash.com/photo-1533228896884-5a00bcdd7fb4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 07:50:00+00',
    '2026-09-29 07:50:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111115',
    'Xiaomi 14 Ultra',
    'Xiaomi',
    'The ultimate mobile imaging flagship equipped with 1-inch Sony LYT-900 sensor and stepless variable aperture (f/1.63-f/4.0), Leica Quad 50MP cameras with dual periscope telephotos, 90W HyperCharge, and titanium edition body.',
    99999,
    '16GB',
    '512GB',
    ARRAY[
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533228896884-5a00bcdd7fb4?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 07:40:00+00',
    '2026-09-29 07:40:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111116',
    'Vivo X200 Pro',
    'Vivo',
    'Revolutionary portrait and telephoto flagship with 200MP ZEISS APO periscope camera and Vivo V3+ imaging chip. Powered by MediaTek Dimensity 9400, 6000mAh BlueVolt battery with 90W FlashCharge, and 6.78-inch eye-comfort AMOLED display.',
    94999,
    '16GB',
    '512GB',
    ARRAY[
      'https://images.unsplash.com/photo-1575695342320-d2d2d2f9b73f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 07:30:00+00',
    '2026-09-29 07:30:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111117',
    'Vivo V40 Pro',
    'Vivo',
    'Ultra-slim portrait specialist with ZEISS Multifocal portrait trio (50MP main, 50MP telephoto, 50MP ultrawide). Features MediaTek Dimensity 9200+ processor, 5500mAh battery with 80W charging, and IP68/IP69 dust and water resistance.',
    49999,
    '12GB',
    '256GB',
    ARRAY[
      'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1575695342320-d2d2d2f9b73f?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 07:20:00+00',
    '2026-09-29 07:20:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111118',
    'iQOO 13',
    'iQOO',
    'Flagship gaming beast powered by Snapdragon 8 Elite and proprietary Q2 supercomputing chip. Features a 2K 144Hz OLED screen, futuristic monster halo RGB camera ring, 6150mAh battery, and 120W FlashCharge.',
    54999,
    '16GB',
    '512GB',
    ARRAY[
      'https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 07:10:00+00',
    '2026-09-29 07:10:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111119',
    'Nothing Phone (2)',
    'Nothing',
    'Distinctive transparent engineering with customizable Glyph Interface LED lighting. Powered by Snapdragon 8+ Gen 1, 6.7-inch flexible LTPO OLED with 120Hz adaptive refresh rate, dual 50MP Sony camera system, and Nothing OS 2.6.',
    36999,
    '12GB',
    '256GB',
    ARRAY[
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 07:00:00+00',
    '2026-09-29 07:00:00+00'
  ),
  (
    '11111111-1111-4111-8111-111111111120',
    'Motorola Edge 50 Ultra',
    'Motorola',
    'Artisanal flagship crafted with authentic Nordic wood and vegan leather finishes with IP68 protection. Featuring Snapdragon 8s Gen 3, Pantone Validated 50MP triple camera with 100x Super Zoom, 144Hz pOLED display, and 125W TurboPower.',
    59999,
    '12GB',
    '512GB',
    ARRAY[
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&auto=format&fit=crop&q=80'
    ],
    'In Stock',
    false,
    '2026-09-29 06:50:00+00',
    '2026-09-29 06:50:00+00'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  ram = EXCLUDED.ram,
  storage = EXCLUDED.storage,
  images = EXCLUDED.images,
  stock_status = EXCLUDED.stock_status,
  is_hidden = EXCLUDED.is_hidden,
  updated_at = timezone('utc'::text, now());
