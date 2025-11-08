#!/bin/bash

# Teakacacia Store - Automated Image Downloader
# Downloads all product and category images from Unsplash

echo "🎨 Teakacacia Image Downloader"
echo "================================"
echo ""

# Create assets directory structure
echo "📁 Creating folder structure..."
mkdir -p assets/products
mkdir -p assets/categories

echo "✅ Folders created!"
echo ""

# Download Category Images
echo "📸 Downloading Category Images..."
echo ""

echo "  → Living Room category..."
curl -L "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80" -o "assets/categories/living-room.jpg"

echo "  → Dining Room category..."
curl -L "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80" -o "assets/categories/dining-room.jpg"

echo "  → Bedroom category..."
curl -L "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80" -o "assets/categories/bedroom.jpg"

echo "  → Outdoor & Garden category..."
curl -L "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80" -o "assets/categories/outdoor-garden.jpg"

echo "  → Office & Study category..."
curl -L "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80" -o "assets/categories/office-study.jpg"

echo "  → Storage & Cabinets category..."
curl -L "https://images.unsplash.com/photo-1595428773637-d1f7a0c1e2d8?w=800&q=80" -o "assets/categories/storage-cabinets.jpg"

echo ""
echo "✅ Category images downloaded!"
echo ""

# Download Product Images
echo "📸 Downloading Product Images..."
echo ""

echo "  → Luxury 3-Seater Teak Sofa..."
curl -L "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80" -o "assets/products/luxury-sofa.jpg"

echo "  → Contemporary Teak Coffee Table..."
curl -L "https://images.unsplash.com/photo-1565191999001-551c187427bb?w=800&q=80" -o "assets/products/coffee-table.jpg"

echo "  → Classic Teak Armchair..."
curl -L "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80" -o "assets/products/armchair.jpg"

echo "  → Grand 8-Seater Teak Dining Table..."
curl -L "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80" -o "assets/products/dining-table.jpg"

echo "  → Elegant Teak Dining Chairs..."
curl -L "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80" -o "assets/products/dining-chairs.jpg"

echo "  → Royal King Size Teak Bed..."
curl -L "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80" -o "assets/products/king-bed.jpg"

echo "  → Spacious 4-Door Teak Wardrobe..."
curl -L "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" -o "assets/products/wardrobe.jpg"

echo "  → Weather-Resistant Teak Garden Bench..."
curl -L "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80" -o "assets/products/garden-bench.jpg"

echo "  → Executive Teak Office Desk..."
curl -L "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80" -o "assets/products/office-desk.jpg"

echo "  → Tall Teak Bookshelf..."
curl -L "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80" -o "assets/products/bookshelf.jpg"

echo "  → Glass-Front Teak Display Cabinet..."
curl -L "https://images.unsplash.com/photo-1595428773637-d1f7a0c1e2d8?w=800&q=80" -o "assets/products/display-cabinet.jpg"

echo "  → Traditional Teak Storage Chest..."
curl -L "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80" -o "assets/products/storage-chest.jpg"

echo ""
echo "✅ Product images downloaded!"
echo ""

# Summary
echo "================================"
echo "🎉 Download Complete!"
echo "================================"
echo ""
echo "📊 Summary:"
echo "  • Category Images: 6"
echo "  • Product Images: 12"
echo "  • Total Images: 18"
echo ""
echo "📁 Location:"
echo "  • assets/categories/ (6 images)"
echo "  • assets/products/ (12 images)"
echo ""
echo "🚀 Next Step:"
echo "  Tell me 'upload images' and I'll upload everything to WordPress!"
echo ""
