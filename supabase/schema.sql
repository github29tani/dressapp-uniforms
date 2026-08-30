-- ============================================================
-- DressApp Uniforms — Full Database Schema
-- Run in Supabase SQL Editor
-- ============================================================


-- ─── ENUMS ──────────────────────────────────────────────────

CREATE TYPE gender_type AS ENUM ('boys', 'girls', 'unisex');

CREATE TYPE user_role AS ENUM ('customer', 'school_admin', 'admin', 'superadmin');

CREATE TYPE order_status AS ENUM (
  'placed', 'confirmed', 'packed', 'shipped',
  'out_for_delivery', 'delivered', 'cancelled',
  'return_requested', 'returned'
);

CREATE TYPE payment_status AS ENUM (
  'pending', 'paid', 'failed', 'refunded', 'partially_refunded'
);

CREATE TYPE payment_method AS ENUM (
  'upi', 'card', 'net_banking', 'wallet', 'cod', 'razorpay'
);

CREATE TYPE return_reason AS ENUM (
  'wrong_size', 'damaged_product', 'wrong_product', 'quality_issue', 'other'
);

CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'whatsapp', 'in_app');


-- ─── PROFILES ───────────────────────────────────────────────
-- One row per Supabase auth user, auto-created on signup

CREATE TABLE profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  phone       TEXT,
  role        user_role   NOT NULL DEFAULT 'customer',
  avatar_url  TEXT,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile row when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ─── SCHOOLS ────────────────────────────────────────────────

CREATE TABLE schools (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  school_code     TEXT        UNIQUE,
  board           TEXT,
  logo_url        TEXT,
  address         TEXT,
  city            TEXT,
  state           TEXT,
  pincode         TEXT,
  country         TEXT        NOT NULL DEFAULT 'India',
  phone           TEXT,
  email           TEXT,
  website         TEXT,
  principal_name  TEXT,
  classes_from    INT,
  classes_to      INT,
  description     TEXT,
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── STUDENTS ───────────────────────────────────────────────
-- Child profiles saved under a parent/guardian account

CREATE TABLE students (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id   UUID        REFERENCES schools(id) ON DELETE SET NULL,
  name        TEXT        NOT NULL,
  class       TEXT,
  section     TEXT,
  gender      gender_type,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── CATEGORIES ─────────────────────────────────────────────

CREATE TABLE categories (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  slug        TEXT        NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  sort_order  INT         NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── PRODUCTS ───────────────────────────────────────────────

CREATE TABLE products (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  description     TEXT,
  category_id     UUID        REFERENCES categories(id) ON DELETE SET NULL,
  gender          gender_type NOT NULL DEFAULT 'unisex',
  price           INT         NOT NULL,   -- stored in paise (₹ × 100)
  discount_price  INT,
  rating          NUMERIC(3,2),
  review_count    INT         NOT NULL DEFAULT 0,
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── PRODUCT VARIANTS ───────────────────────────────────────
-- One row per size option of a product

CREATE TABLE product_variants (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size        TEXT        NOT NULL,
  sku         TEXT        UNIQUE,
  price       INT,                        -- NULL = use product price
  stock       INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── PRODUCT IMAGES ─────────────────────────────────────────

CREATE TABLE product_images (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT        NOT NULL,
  alt_text    TEXT,
  sort_order  INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── SCHOOL PRODUCTS ────────────────────────────────────────
-- Maps which products are available for which school

CREATE TABLE school_products (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID    NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  product_id    UUID    NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  school_price  INT,                      -- school-specific price override
  is_mandatory  BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (school_id, product_id)
);


-- ─── UNIFORM KITS ───────────────────────────────────────────
-- A named uniform kit per school + class + gender

CREATE TABLE uniform_kits (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  class       TEXT,
  gender      gender_type,
  season      TEXT        CHECK (season IN ('summer', 'winter', 'sports', 'all')),
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── UNIFORM KIT ITEMS ──────────────────────────────────────

CREATE TABLE uniform_kit_items (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id      UUID    NOT NULL REFERENCES uniform_kits(id) ON DELETE CASCADE,
  product_id  UUID    NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  is_required BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INT     NOT NULL DEFAULT 0,
  UNIQUE (kit_id, product_id)
);


-- ─── INVENTORY ──────────────────────────────────────────────

CREATE TABLE inventory (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id       UUID        NOT NULL UNIQUE REFERENCES product_variants(id) ON DELETE CASCADE,
  stock            INT         NOT NULL DEFAULT 0,
  low_stock_alert  INT         NOT NULL DEFAULT 5,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── ADDRESSES ──────────────────────────────────────────────

CREATE TABLE addresses (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label       TEXT,
  full_name   TEXT        NOT NULL,
  phone       TEXT        NOT NULL,
  line1       TEXT        NOT NULL,
  line2       TEXT,
  city        TEXT        NOT NULL,
  state       TEXT        NOT NULL,
  pincode     TEXT        NOT NULL,
  country     TEXT        NOT NULL DEFAULT 'India',
  is_default  BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── CARTS ──────────────────────────────────────────────────

CREATE TABLE carts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_items (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id     UUID        NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id  UUID        NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity    INT         NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cart_id, variant_id)
);


-- ─── COUPONS ────────────────────────────────────────────────

CREATE TABLE coupons (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  code              TEXT        NOT NULL UNIQUE,
  description       TEXT,
  discount_type     TEXT        NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value    INT         NOT NULL,
  min_order_amount  INT,
  max_discount      INT,
  school_id         UUID        REFERENCES schools(id) ON DELETE SET NULL,
  category_id       UUID        REFERENCES categories(id) ON DELETE SET NULL,
  usage_limit       INT,
  usage_count       INT         NOT NULL DEFAULT 0,
  valid_from        TIMESTAMPTZ,
  valid_until       TIMESTAMPTZ,
  is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE coupon_usage (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id   UUID        NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id    UUID,
  used_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (coupon_id, user_id)
);


-- ─── ORDERS ─────────────────────────────────────────────────

CREATE TABLE orders (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number      TEXT         NOT NULL UNIQUE DEFAULT 'DA-' || to_char(NOW(), 'YYYYMMDD') || '-' || upper(substr(gen_random_uuid()::text, 1, 6)),
  user_id           UUID         NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  address_id        UUID         REFERENCES addresses(id) ON DELETE SET NULL,
  status            order_status NOT NULL DEFAULT 'placed',
  subtotal          INT          NOT NULL,
  discount          INT          NOT NULL DEFAULT 0,
  delivery_fee      INT          NOT NULL DEFAULT 0,
  total             INT          NOT NULL,
  coupon_id         UUID         REFERENCES coupons(id) ON DELETE SET NULL,
  notes             TEXT,
  estimated_delivery DATE,
  delivered_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id   UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
  quantity     INT  NOT NULL,
  unit_price   INT  NOT NULL,
  total_price  INT  NOT NULL
);

ALTER TABLE coupon_usage
  ADD CONSTRAINT fk_coupon_usage_order
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;


-- ─── PAYMENTS ───────────────────────────────────────────────

CREATE TABLE payments (
  id                    UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              UUID           NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  razorpay_order_id     TEXT,
  razorpay_payment_id   TEXT,
  razorpay_signature    TEXT,
  method                payment_method,
  amount                INT            NOT NULL,
  status                payment_status NOT NULL DEFAULT 'pending',
  paid_at               TIMESTAMPTZ,
  created_at            TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);


-- ─── WISHLISTS ──────────────────────────────────────────────

CREATE TABLE wishlists (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);


-- ─── REVIEWS ────────────────────────────────────────────────

CREATE TABLE reviews (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id    UUID        REFERENCES orders(id) ON DELETE SET NULL,
  rating      INT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       TEXT,
  body        TEXT,
  size_fit    TEXT        CHECK (size_fit IN ('too_small', 'true_to_size', 'too_large')),
  image_urls  TEXT[],
  is_approved BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, user_id, order_id)
);

-- Keep product rating updated automatically
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE products SET
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM reviews
      WHERE product_id = NEW.product_id AND is_approved = TRUE
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE product_id = NEW.product_id AND is_approved = TRUE
    )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();


-- ─── RETURNS & EXCHANGES ────────────────────────────────────

CREATE TABLE returns (
  id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID          NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  order_item_id  UUID          NOT NULL REFERENCES order_items(id) ON DELETE RESTRICT,
  user_id        UUID          NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  type           TEXT          NOT NULL CHECK (type IN ('return', 'exchange')),
  reason         return_reason NOT NULL,
  description    TEXT,
  exchange_size  TEXT,
  status         TEXT          NOT NULL DEFAULT 'requested'
                               CHECK (status IN ('requested', 'approved', 'rejected', 'completed')),
  refund_amount  INT,
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- ─── NOTIFICATIONS ──────────────────────────────────────────

CREATE TABLE notifications (
  id          UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID                 NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  channel     notification_channel NOT NULL DEFAULT 'in_app',
  title       TEXT                 NOT NULL,
  body        TEXT                 NOT NULL,
  data        JSONB,
  is_read     BOOLEAN              NOT NULL DEFAULT FALSE,
  sent_at     TIMESTAMPTZ          NOT NULL DEFAULT NOW()
);


-- ─── BULK ORDERS ────────────────────────────────────────────

CREATE TABLE bulk_orders (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name     TEXT        NOT NULL,
  contact_person  TEXT        NOT NULL,
  phone           TEXT        NOT NULL,
  email           TEXT        NOT NULL,
  requirements    TEXT,
  estimated_qty   INT,
  required_date   DATE,
  status          TEXT        NOT NULL DEFAULT 'new'
                              CHECK (status IN ('new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled')),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── INDEXES ────────────────────────────────────────────────

CREATE INDEX idx_products_category     ON products(category_id);
CREATE INDEX idx_products_gender       ON products(gender);
CREATE INDEX idx_products_active       ON products(is_active);
CREATE INDEX idx_variants_product      ON product_variants(product_id);
CREATE INDEX idx_images_product        ON product_images(product_id);
CREATE INDEX idx_school_products_sch   ON school_products(school_id);
CREATE INDEX idx_school_products_prd   ON school_products(product_id);
CREATE INDEX idx_kits_school           ON uniform_kits(school_id);
CREATE INDEX idx_kit_items_kit         ON uniform_kit_items(kit_id);
CREATE INDEX idx_students_user         ON students(user_id);
CREATE INDEX idx_addresses_user        ON addresses(user_id);
CREATE INDEX idx_cart_items_cart       ON cart_items(cart_id);
CREATE INDEX idx_orders_user           ON orders(user_id);
CREATE INDEX idx_orders_status         ON orders(status);
CREATE INDEX idx_order_items_order     ON order_items(order_id);
CREATE INDEX idx_wishlists_user        ON wishlists(user_id);
CREATE INDEX idx_reviews_product       ON reviews(product_id);
CREATE INDEX idx_notifications_user    ON notifications(user_id);
CREATE INDEX idx_schools_slug          ON schools(slug);
CREATE INDEX idx_products_slug         ON products(slug);


-- ─── ROW LEVEL SECURITY ─────────────────────────────────────

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE students          ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists         ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews           ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns           ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage      ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools           ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants  ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images    ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE uniform_kits      ENABLE ROW LEVEL SECURITY;
ALTER TABLE uniform_kit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory         ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons           ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_orders       ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles: own read"    ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles: own update"  ON profiles FOR UPDATE USING (auth.uid() = id);

-- students
CREATE POLICY "students: own"         ON students FOR ALL USING (auth.uid() = user_id);

-- addresses
CREATE POLICY "addresses: own"        ON addresses FOR ALL USING (auth.uid() = user_id);

-- carts
CREATE POLICY "carts: own"            ON carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "cart_items: own"       ON cart_items FOR ALL
  USING (cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid()));

-- orders
CREATE POLICY "orders: own read"      ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders: own insert"    ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "order_items: own"      ON order_items FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- payments
CREATE POLICY "payments: own"         ON payments FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- wishlists
CREATE POLICY "wishlists: own"        ON wishlists FOR ALL USING (auth.uid() = user_id);

-- reviews
CREATE POLICY "reviews: public read"  ON reviews FOR SELECT USING (is_approved = TRUE OR auth.uid() = user_id);
CREATE POLICY "reviews: own write"    ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- returns
CREATE POLICY "returns: own"          ON returns FOR ALL USING (auth.uid() = user_id);

-- notifications
CREATE POLICY "notifications: own"    ON notifications FOR ALL USING (auth.uid() = user_id);

-- coupon_usage
CREATE POLICY "coupon_usage: own"     ON coupon_usage FOR ALL USING (auth.uid() = user_id);

-- bulk_orders — anyone can submit, no read-back for anon
CREATE POLICY "bulk_orders: insert"   ON bulk_orders FOR INSERT WITH CHECK (TRUE);

-- Public catalogue — anyone can read
CREATE POLICY "schools: public"       ON schools          FOR SELECT USING (is_active = TRUE);
CREATE POLICY "categories: public"    ON categories       FOR SELECT USING (is_active = TRUE);
CREATE POLICY "products: public"      ON products         FOR SELECT USING (is_active = TRUE);
CREATE POLICY "variants: public"      ON product_variants FOR SELECT USING (TRUE);
CREATE POLICY "images: public"        ON product_images   FOR SELECT USING (TRUE);
CREATE POLICY "school_products: pub"  ON school_products  FOR SELECT USING (TRUE);
CREATE POLICY "kits: public"          ON uniform_kits     FOR SELECT USING (is_active = TRUE);
CREATE POLICY "kit_items: public"     ON uniform_kit_items FOR SELECT USING (TRUE);
CREATE POLICY "inventory: public"     ON inventory        FOR SELECT USING (TRUE);
CREATE POLICY "coupons: public"       ON coupons          FOR SELECT USING (is_active = TRUE);


-- ─── SEED DATA ──────────────────────────────────────────────

INSERT INTO categories (name, slug, sort_order) VALUES
  ('Uniform',      'uniform',     1),
  ('Accessories',  'accessories', 2),
  ('Footwear',     'footwear',    3),
  ('Bags',         'bags',        4),
  ('Winter Wear',  'winter-wear', 5),
  ('Gifts',        'gifts',       6);

INSERT INTO schools (name, slug, school_code, board, city, state, pincode, classes_from, classes_to) VALUES
  ('Delhi Public School',          'delhi-public-school',          'DPS001', 'CBSE', 'New Delhi', 'Delhi',         '110001', 1, 12),
  ('Ryan International School',    'ryan-international-school',    'RIS001', 'CBSE', 'Noida',     'Uttar Pradesh', '201301', 1, 12),
  ('Kendriya Vidyalaya',           'kendriya-vidyalaya',           'KV001',  'CBSE', 'New Delhi', 'Delhi',         '110002', 1, 12),
  ('St. Columba''s School',        'st-columbas-school',           'SCS001', 'CBSE', 'New Delhi', 'Delhi',         '110001', 1, 12),
  ('Amity International School',   'amity-international-school',   'AIS001', 'CBSE', 'Noida',     'Uttar Pradesh', '201303', 1, 12),
  ('The Mother''s International',  'mothers-international-school', 'MIS001', 'CBSE', 'New Delhi', 'Delhi',         '110016', 1, 12);


-- ─── VERIFY ─────────────────────────────────────────────────

SELECT table_name, 'table' AS type
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;
