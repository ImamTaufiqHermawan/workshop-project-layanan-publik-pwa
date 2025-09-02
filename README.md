# Layanan Publik PWA

Sistem Layanan Publik Berbasis Progressive Web App (PWA) dengan fitur pengajuan layanan, tracking status, dan notifikasi WhatsApp/Email.

## 🚀 Fitur

- **PWA (Progressive Web App)** - Dapat diinstall di mobile/desktop
- **Pengajuan Layanan** - Form pengajuan dengan validasi
- **Tracking Status** - Cek status dengan kode tracking + NIK
- **Admin Dashboard** - Kelola pengajuan dengan Ant Design
- **Notifikasi** - WhatsApp via Twilio + Email via Resend
- **Responsive Design** - Mobile-first dengan TailwindCSS
- **Database** - PostgreSQL dengan Sequelize ORM

## 📱 PWA Features

### PWA Installation Button

- **Button Install PWA** yang muncul otomatis saat user belum install PWA
- **Auto-hide** setelah PWA berhasil diinstall
- **Re-appear** jika user uninstall PWA
- **Design Codashop-style** dengan card putih dan icon ungu

### Cara Kerja PWA
1. **Detection**: Menggunakan `beforeinstallprompt` event untuk mendeteksi kapan PWA bisa diinstall
2. **State Management**: Menggunakan React state untuk mengontrol visibility button
3. **Installation**: Menangani proses install dan update state sesuai hasil
4. **Auto-hide**: Button otomatis hilang setelah install berhasil

### PWA Components
- **`PWAInstallButton.jsx`** - Komponen reusable untuk PWA install
- **Service Worker**: Offline functionality and caching
- **Manifest**: App-like experience with icons
- **Icons**: 192x192 and 512x512 for mobile devices

### Event Handling PWA
- `beforeinstallprompt`: Menyimpan prompt dan show button
- `appinstalled`: Hide button setelah install berhasil
- `display-mode: standalone`: Check apakah PWA sudah running

### Install PWA
1. Buka aplikasi di Chrome/Edge mobile
2. Tap menu (⋮) → "Add to Home Screen"
3. PWA akan terinstall seperti aplikasi native

### Offline Support
- Service worker menyimpan cache untuk offline access
- Form pengajuan dapat diisi offline
- Data akan sync saat online kembali

## 📞 Format Nomor Telepon +62

### Fitur Utama
- **Auto-convert** semua format ke +62xxx
- **Frontend validation** dengan input field yang user-friendly
- **Backend normalization** untuk memastikan konsistensi database
- **Support multiple formats**: +62, 08xxx, 8xxx, dll

### Format yang Didukung
- `+62812345678` → `+62812345678` (sudah benar)
- `0812345678` → `+62812345678` (auto-convert)
- `812345678` → `+62812345678` (auto-convert)
- `62812345678` → `+62812345678` (auto-convert)

### Implementasi

#### Frontend (PhoneInput Component)
```jsx
<PhoneInput
  value={formData.no_wa}
  onChange={(value) => setFormData(prev => ({ ...prev, no_wa: value }))}
  required
  label="Nomor WhatsApp"
/>
```

#### Backend (API Route)
```javascript
import { ensurePlus62Format, isValidIndonesianMobile } from "@/lib/phone";

// Normalize and validate phone number
const normalizedPhone = ensurePlus62Format(no_wa);

if (!normalizedPhone || !isValidIndonesianMobile(normalizedPhone)) {
  return NextResponse.json(
    { message: "Format nomor telepon tidak valid. Gunakan format +62 atau 08xxx" },
    { status: 400 }
  );
}
```

#### Utility Functions (lib/phone.js)
- `normalizePhoneNumber()`: Convert semua format ke +62
- `ensurePlus62Format()`: Double-check dan force +62 format
- `isValidIndonesianMobile()`: Validasi format nomor Indonesia
- `formatPhoneForDisplay()`: Format untuk tampilan
- `formatPhoneForInput()`: Format untuk input field

### Keamanan
- **Input sanitization**: Remove semua karakter non-digit
- **Length validation**: Maksimal 15 digit (termasuk +62)
- **Format enforcement**: Selalu mulai dengan +62
- **Backend validation**: Double-check di API level

## 📋 Prerequisites

Sebelum memulai, pastikan Anda telah menginstall:

- **Node.js** (v18 atau lebih baru)
- **Git**
- **Cursor** (atau VS Code)
- **PostgreSQL** (untuk development lokal) atau akun **Render**

## 🛠️ Setup Step-by-Step

### 1. Clone Repository

```bash
git clone <repository-url>
cd Workshop-Disko
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database (Render PostgreSQL)

1. Buka [Render Dashboard](https://dashboard.render.com)
2. Klik "New" → "PostgreSQL"
3. Isi form:
   - **Name**: `layanan-publik-db`
   - **Database**: `layanan_publik`
   - **User**: `layanan_user`
   - **Region**: Pilih yang terdekat
4. Klik "Create Database"
5. Copy **External Database URL** untuk digunakan di `.env`

### 4. Setup Twilio WhatsApp Sandbox

1. Buka [Twilio Console](https://console.twilio.com)
2. Daftar/login ke akun Twilio
3. Buka **Messaging** → **Try it out** → **Send a WhatsApp message**
4. Scan QR code dengan WhatsApp Anda
5. Kirim pesan `join <kode-join>` ke nomor Twilio
6. Copy **Account SID** dan **Auth Token** dari dashboard

### 5. Setup Resend Email

1. Buka [Resend Dashboard](https://resend.com)
2. Daftar/login ke akun Resend
3. Verifikasi domain email Anda
4. Copy **API Key** dari dashboard

### 6. Environment Variables

1. Copy `env.example` ke `.env`:

```bash
cp env.example .env
```

2. Edit `.env` dengan konfigurasi Anda:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name

# Application Configuration
APP_BASE_URL=http://localhost:3000

# Twilio Configuration (WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Resend Configuration (Email)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com

# Optional: Node Environment
NODE_ENV=development
```

### 7. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🧪 Testing

### Test PWA Installation
1. Buka website di Chrome/Edge mobile
2. Button install akan muncul otomatis
3. Click "Tambahkan sekarang"
4. Confirm installation
5. Button akan hilang
6. Uninstall dari home screen
7. Button akan muncul lagi

### Test Phone Number Format
1. Input `0812345678` → Auto-convert ke `+62812345678`
2. Input `812345678` → Auto-convert ke `+62812345678`
3. Input `+62812345678` → Tetap `+62812345678`
4. Submit form → Check database, harus `+62812345678`

### Test Public Flow

1. **Buat Pengajuan**:

   - Buka `/public`
   - Pilih tab "Pengajuan Baru"
   - Isi form dengan data valid
   - Submit dan catat kode tracking

2. **Cek Status**:
   - Pilih tab "Cek Status"
   - Masukkan kode tracking + 4 digit terakhir NIK
   - Verifikasi data yang ditampilkan

### Test Admin Flow

1. **Login Admin**:

   - Buka `/admin/login`
   - Username: `admin`, Password: `admin123`

2. **Kelola Pengajuan**:
   - Lihat daftar pengajuan
   - Ubah status via dropdown
   - Verifikasi notifikasi terkirim

### Available Scripts

```bash
# Database initialization
npm run init-db

# Test notifications
npm run test-twilio    # Test WhatsApp via Twilio
npm run test-email     # Test email via Resend
```

## 🚀 Deployment ke Vercel

### 1. Push ke GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy di Vercel

1. Buka [Vercel Dashboard](https://vercel.com)
2. Klik "New Project"
3. Import repository dari GitHub
4. Konfigurasi environment variables:
   - `DATABASE_URL`
   - `APP_BASE_URL` (URL Vercel)
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_FROM`
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
5. Klik "Deploy"

### 3. Build Settings

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. Update APP_BASE_URL

Setelah deploy, update `APP_BASE_URL` di Vercel environment variables dengan URL production.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.jsx         # Root layout with PWA setup
│   ├── page.jsx           # Home page
│   ├── globals.css        # Global styles with Tailwind
│   ├── admin/             # Admin dashboard
│   │   ├── page.jsx       # Admin dashboard with charts
│   │   └── login/
│   │       └── page.jsx   # Admin login page
│   ├── public/            # Public services
│   │   ├── page.jsx       # Public submission form
│   │   ├── success/
│   │   │   └── page.jsx   # Success page after submission
│   │   └── components/
│   │       ├── NewSubmission.jsx # Submission form component
│   │       └── StatusCheck.jsx   # Status check component
│   └── api/               # API routes
│       ├── admin/
│       │   └── submissions/
│       │       ├── route.js      # GET all submissions
│       │       └── [id]/
│       │           └── status/
│       │               └── route.js # PATCH update status
│       └── submissions/
│           ├── route.js          # POST new submission
│           └── [tracking_code]/
│               └── route.js      # GET submission by tracking code
├── lib/                   # Utilities
│   ├── sequelize.js       # Database setup
│   ├── phone.js           # Phone utilities
│   ├── notify/
│   │   ├── email.js       # Email notification service
│   │   └── twilio.js      # WhatsApp notification service
│   ├── pg-wrapper.js      # PostgreSQL wrapper
│   └── vercel-db.js       # Vercel database utilities
├── public/                # Static files
│   ├── manifest.json      # PWA manifest
│   ├── service-worker.js  # Service worker
│   ├── icon-192.png       # PWA icon 192x192
│   └── icon-512.png       # PWA icon 512x512
├── scripts/               # Essential scripts only
│   ├── init-db.js         # Database initialization
│   ├── test-twilio.js     # Test Twilio functionality
│   └── test-email.js      # Test email functionality
└── styles/                # CSS files
```

## 🔧 Key Files & Features

### Frontend Pages

- **`app/page.jsx`**: Home page with navigation
- **`app/admin/page.jsx`**: Admin dashboard with charts and table
- **`app/admin/login/page.jsx`**: Admin login form
- **`app/public/page.jsx`**: Public submission form
- **`app/public/success/page.jsx`**: Success page

### API Routes

- **`app/api/submissions/route.js`**: Create new submission
- **`app/api/submissions/[tracking_code]/route.js`**: Get submission by tracking code
- **`app/api/admin/submissions/route.js`**: Get all submissions for admin
- **`app/api/admin/submissions/[id]/status/route.js`**: Update submission status

### Configuration Files

- **`next.config.js`**: Next.js configuration with Tailwind CSS transpilation
- **`tailwind.config.js`**: Tailwind CSS configuration
- **`postcss.config.js`**: PostCSS configuration
- **`vercel.json`**: Vercel deployment configuration

## 🎯 Admin Dashboard Features

- ✅ Real-time stats cards with loading states
- ✅ Interactive pie chart for status distribution
- ✅ Data table with pagination and status updates
- ✅ Comprehensive loading states throughout
- ✅ Error handling with user feedback
- ✅ Simple localStorage-based authentication
- ✅ Responsive design with Ant Design components

## 🔄 Deployment Status

- ✅ Vercel deployment working
- ✅ All pages accessible
- ✅ API routes functional
- ✅ Database connected
- ✅ PWA features enabled
- ✅ Email notifications working
- ✅ WhatsApp notifications working

## 🔍 Troubleshooting

### Database Connection Error

```bash
# Cek koneksi database
npm run dev
# Lihat error di console
```

**Solusi**:

- Pastikan `DATABASE_URL` benar
- Cek firewall/network
- Verifikasi SSL settings

### Twilio WhatsApp Error

**Error**: "The 'From' phone number is not verified"

**Solusi**:

- Pastikan sudah join Twilio sandbox
- Gunakan format `whatsapp:+14155238886`
- Cek Account SID dan Auth Token

### Resend Email Error

**Error**: "Domain not verified"

**Solusi**:

- Verifikasi domain di Resend dashboard
- Gunakan domain yang sudah diverifikasi
- Cek API key

### Vercel Build Issues

**Error**: "Cannot find module 'tailwindcss'"

**Solusi**:

- Pastikan `tailwindcss`, `autoprefixer`, `postcss` ada di `dependencies`
- Clear Vercel cache jika diperlukan
- Cek build logs untuk error spesifik

## 🚨 Important Notes

1. **Database**: Gunakan Render PostgreSQL (bukan SQLite) untuk production
2. **Environment**: Set `NODE_ENV=production` di Vercel
3. **Build**: Pastikan semua dependencies ada di `dependencies`
4. **Cache**: Clear Vercel cache jika diperlukan
5. **Scripts**: Hanya gunakan script yang tersedia: `init-db`, `test-twilio`, `test-email`

## 🎯 Success Checklist

- [ ] Code pushed ke GitHub
- [ ] Repository connected ke Vercel
- [ ] Environment variables set
- [ ] Build successful
- [ ] App accessible via Vercel URL
- [ ] PWA features working
- [ ] Database connection working
- [ ] Email notifications working
- [ ] WhatsApp notifications working
- [ ] Admin dashboard functional
- [ ] Public forms working

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Untuk pertanyaan atau bantuan:

- Email: support@example.com
- WhatsApp: +62xxx-xxxx-xxxx
- GitHub Issues: [Create Issue](https://github.com/username/repo/issues)

---

**Workshop-Friendly System** - Dibuat untuk memudahkan pembelajaran dan workshop development dengan struktur yang bersih dan dokumentasi yang lengkap.
