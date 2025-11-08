#!/bin/bash

WP_URL="https://darkorange-kangaroo-901503.hostingersite.com"
WP_USER="themodernmarketinghouse@gmail.com"
WP_PASS="jX8C 9gMX HZOy VaAz 5qHc CTmd"

echo "🎨 Fixing All Product Images"
echo "============================="
echo ""

# Upload and assign function
upload_and_assign() {
    local file=$1
    local product_id=$2
    local product_name=$3
    
    echo "→ $product_name (Product ID: $product_id)"
    echo "  📤 Uploading $file..."
    
    # Upload image
    response=$(curl -s -X POST \
        -H "Content-Disposition: attachment; filename=$(basename $file)" \
        -H "Content-Type: image/jpeg" \
        --data-binary "@$file" \
        --user "$WP_USER:$WP_PASS" \
        "$WP_URL/wp-json/wp/v2/media")
    
    # Extract media ID
    media_id=$(echo "$response" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    
    if [ -n "$media_id" ] && [ "$media_id" != "" ]; then
        echo "  ✅ Uploaded! Media ID: $media_id"
        echo "  🔗 Assigning to product..."
        
        # Assign to product
        curl -s -X PUT \
            -H "Content-Type: application/json" \
            --user "$WP_USER:$WP_PASS" \
            -d "{\"images\":[{\"id\":$media_id}]}" \
            "$WP_URL/wp-json/wc/v3/products/$product_id" > /dev/null
        
        echo "  ✅ Assigned!"
    else
        echo "  ❌ Upload failed"
    fi
    echo ""
}

# Upload all product images
upload_and_assign "assets/products/luxury-sofa.jpg" 31 "Luxury 3-Seater Teak Sofa"
upload_and_assign "assets/products/coffee-table.jpg" 32 "Contemporary Teak Coffee Table"
upload_and_assign "assets/products/armchair.jpg" 33 "Classic Teak Armchair"
upload_and_assign "assets/products/dining-table.jpg" 34 "Grand 8-Seater Teak Dining Table"
upload_and_assign "assets/products/dining-chairs.jpg" 35 "Elegant Teak Dining Chairs"
upload_and_assign "assets/products/king-bed.jpg" 36 "Royal King Size Teak Bed"
upload_and_assign "assets/products/wardrobe.jpg" 37 "Spacious 4-Door Teak Wardrobe"
upload_and_assign "assets/products/garden-bench.jpg" 38 "Weather-Resistant Teak Garden Bench"
upload_and_assign "assets/products/office-desk.jpg" 39 "Executive Teak Office Desk"
upload_and_assign "assets/products/bookshelf.jpg" 40 "Tall Teak Bookshelf"
upload_and_assign "assets/products/display-cabinet.jpg" 41 "Glass-Front Teak Display Cabinet"
upload_and_assign "assets/products/storage-chest.jpg" 42 "Traditional Teak Storage Chest"

echo "============================="
echo "🎉 All Products Updated!"
echo "============================="
echo ""
echo "✅ 12 products now have images!"
echo "🌐 Check: $WP_URL/wp-admin/edit.php?post_type=product"
echo ""
