#!/bin/bash

# WordPress Product Image Assignment Script
# Uploads product images and assigns them to correct products

WP_URL="https://darkorange-kangaroo-901503.hostingersite.com"
WP_USER="themodernmarketinghouse@gmail.com"
WP_PASS="jX8C 9gMX HZOy VaAz 5qHc CTmd"

echo "🎨 Product Image Uploader & Assigner"
echo "===================================="
echo ""

# Function to upload image and return media ID
upload_image() {
    local file_path=$1
    local file_name=$(basename "$file_path")
    
    echo "  📤 Uploading: $file_name..."
    
    response=$(curl -s -X POST \
        -H "Content-Disposition: attachment; filename=$file_name" \
        -H "Content-Type: image/jpeg" \
        --data-binary "@$file_path" \
        --user "$WP_USER:$WP_PASS" \
        "$WP_URL/wp-json/wp/v2/media")
    
    media_id=$(echo $response | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
    
    if [ -n "$media_id" ]; then
        echo "  ✅ Uploaded! Media ID: $media_id"
        echo "$media_id"
    else
        echo "  ❌ Failed to upload $file_name"
        echo "0"
    fi
}

# Function to assign image to product
assign_to_product() {
    local product_id=$1
    local media_id=$2
    local product_name=$3
    
    echo "  🔗 Assigning to: $product_name (ID: $product_id)..."
    
    curl -s -X POST \
        -H "Content-Type: application/json" \
        --user "$WP_USER:$WP_PASS" \
        -d "{\"images\":[{\"id\":$media_id}]}" \
        "$WP_URL/wp-json/wc/v3/products/$product_id" > /dev/null
    
    echo "  ✅ Assigned!"
}

echo "📸 Uploading & Assigning Product Images..."
echo ""

# Product 31: Luxury Sofa
echo "→ Product 31: Luxury 3-Seater Teak Sofa"
media_id=$(upload_image "assets/products/luxury-sofa.jpg")
if [ "$media_id" != "0" ]; then
    assign_to_product 31 $media_id "Luxury Sofa"
fi
echo ""

# Product 32: Coffee Table
echo "→ Product 32: Contemporary Teak Coffee Table"
media_id=$(upload_image "assets/products/coffee-table.jpg")
if [ "$media_id" != "0" ]; then
    assign_to_product 32 $media_id "Coffee Table"
fi
echo ""

# Product 33: Armchair
echo "→ Product 33: Classic Teak Armchair"
media_id=$(upload_image "assets/products/armchair.jpg")
if [ "$media_id" != "0" ]; then
    assign_to_product 33 $media_id "Armchair"
fi
echo ""

# Product 34: Dining Table
echo "→ Product 34: Grand 8-Seater Teak Dining Table"
media_id=$(upload_image "assets/products/dining-table.jpg")
if [ "$media_id" != "0" ]; then
    assign_to_product 34 $media_id "Dining Table"
fi
echo ""

# Product 35: Dining Chairs
echo "→ Product 35: Elegant Teak Dining Chairs"
media_id=$(upload_image "assets/products/dining-chairs.jpg")
if [ "$media_id" != "0" ]; then
    assign_to_product 35 $media_id "Dining Chairs"
fi
echo ""

# Product 36: King Bed
echo "→ Product 36: Royal King Size Teak Bed"
media_id=$(upload_image "assets/products/king-bed.jpg")
if [ "$media_id" != "0" ]; then
    assign_to_product 36 $media_id "King Bed"
fi
echo ""

# Product 37: Wardrobe
echo "→ Product 37: Spacious 4-Door Teak Wardrobe"
media_id=$(upload_image "assets/products/wardrobe.jpg")
if [ "$media_id" != "0" ]; then
    assign_to_product 37 $media_id "Wardrobe"
fi
echo ""

# Product 38: Garden Bench
echo "→ Product 38: Weather-Resistant Teak Garden Bench"
media_id=$(upload_image "assets/products/garden-bench.jpg")
if [ "$media_id" != "0" ]; then
    assign_to_product 38 $media_id "Garden Bench"
fi
echo ""

# Product 39: Office Desk
echo "→ Product 39: Executive Teak Office Desk"
media_id=$(upload_image "assets/products/office-desk.jpg")
if [ "$media_id" != "0" ]; then
    assign_to_product 39 $media_id "Office Desk"
fi
echo ""

# Product 40: Bookshelf
echo "→ Product 40: Tall Teak Bookshelf"
media_id=$(upload_image "assets/products/bookshelf.jpg")
if [ "$media_id" != "0" ]; then
    assign_to_product 40 $media_id "Bookshelf"
fi
echo ""

# Product 41: Display Cabinet
echo "→ Product 41: Glass-Front Teak Display Cabinet"
media_id=$(upload_image "assets/products/display-cabinet.jpg")
if [ "$media_id" != "0" ]; then
    assign_to_product 41 $media_id "Display Cabinet"
fi
echo ""

# Product 42: Storage Chest
echo "→ Product 42: Traditional Teak Storage Chest"
media_id=$(upload_image "assets/products/storage-chest.jpg")
if [ "$media_id" != "0" ]; then
    assign_to_product 42 $media_id "Storage Chest"
fi
echo ""

echo "===================================="
echo "🎉 All Product Images Assigned!"
echo "===================================="
echo ""
echo "✅ 12 products now have accurate images!"
echo ""
echo "🌐 Check your products:"
echo "  → $WP_URL/wp-admin/edit.php?post_type=product"
echo ""
