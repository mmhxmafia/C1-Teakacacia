# 🪵 Edakkattu Furniture - E-Commerce Website

**Custom Furniture Made Your Way**  
Premier furniture wholesaler and manufacturer in Kerala & Bangalore, India

---

## 🎯 Project Overview 

Modern e-commerce website for Edakkattu Furniture (Teakacacia LLP), featuring:
- Custom furniture catalog with variations
- Shopping cart & checkout
- User authentication & order history
- WhatsApp integration
- Dynamic SEO & social media optimization
- Comprehensive error handling

**Status:** ✅ Production Ready  
**Version:** 1.0.0

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ & npm
- WordPress/WooCommerce backend (GraphQL API)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd teakacacia

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🛠️ Tech Stack 

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite 5.4.19
- **Language:** TypeScript 5.8.3
- **Routing:** React Router 6.30.1
- **UI Library:** shadcn/ui (Radix UI)
- **Styling:** TailwindCSS 3.4.17
- **Icons:** Lucide React 0.462.0

### Data & State
- **API:** GraphQL with Apollo Client 4.0.9
- **State Management:** React Context API
- **Forms:** React Hook Form 7.61.1
- **Validation:** Zod 3.25.76

### Features
- **SEO:** React Helmet Async 2.0.5
- **Notifications:** Sonner 1.7.4
- **Carousel:** Embla Carousel 8.6.0

---

## 📚 Documentation

### Essential Guides
1. **[PRODUCTION_AUDIT_REPORT.md](./PRODUCTION_AUDIT_REPORT.md)** - Complete production audit & deployment guide
2. **[SEO_COMPLETE_GUIDE.md](./SEO_COMPLETE_GUIDE.md)** - SEO implementation & social media
3. **[ERROR_HANDLING_GUIDE.md](./ERROR_HANDLING_GUIDE.md)** - Error handling system
4. **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Documentation overview

---

## 🌐 WordPress Integration

### GraphQL API
- **Endpoint:** `https://admin.teakacacia.com/graphql`
- **Features:** Products, categories, orders, users
- **Plugin:** WPGraphQL + WooGraphQL

### Configuration
Update API endpoint in `/src/lib/apolloClient.ts`

---

## 📦 Project Structure

```
teakacacia/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── context/        # React Context providers
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities & config
│   ├── utils/          # Helper functions
│   └── assets/         # Images & static files
├── public/             # Public assets
└── dist/              # Production build
```

---

## 🎨 Key Features

### E-Commerce
- ✅ Product browsing with search & filters
- ✅ Product variations (size, color, etc.)
- ✅ Shopping cart with auto-open
- ✅ Checkout process
- ✅ Order confirmation & history

### User Experience
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Modern UI with smooth animations
- ✅ Loading & error states
- ✅ WhatsApp integration
- ✅ EMI availability badge

### SEO & Social
- ✅ Dynamic SEO for all pages
- ✅ Social media preview images
- ✅ Structured data (Schema.org)
- ✅ Facebook & Instagram links
- ✅ Open Graph & Twitter cards

### Error Handling
- ✅ ErrorBoundary for crashes
- ✅ Customer-friendly error messages
- ✅ Data validation & fallbacks
- ✅ Network error handling

---

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy
1. Upload `dist/` folder to hosting
2. Configure server for SPA routing
3. Set up SSL certificate
4. Update environment variables

See [PRODUCTION_AUDIT_REPORT.md](./PRODUCTION_AUDIT_REPORT.md) for complete deployment guide.

---

## 📞 Contact & Support

- **Website:** https://teakacacia.com
- **Admin:** https://admin.teakacacia.com
- **WhatsApp:** +91 8590774213
- **Facebook:** https://www.facebook.com/edwood.furnitures.5/
- **Instagram:** https://www.instagram.com/edakkattufurniture/

---

## 📄 License

© 2025 Edakkattu Furniture | Teakacacia LLP. All Rights Reserved.

---

**Built with ❤️ for custom furniture excellence**
