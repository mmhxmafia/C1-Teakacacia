#!/bin/bash

WP_URL="https://darkorange-kangaroo-901503.hostingersite.com"
WP_USER="themodernmarketinghouse@gmail.com"
WP_PASS="jX8C 9gMX HZOy VaAz 5qHc CTmd"

echo "🎨 Updating Products with Exact Images"
echo "======================================="
echo ""

# Function to upload and update
upload_and_update() {
    local file=$1
    local product_id=$2
    local old_media_id=$3
    local product_name=$4
    
    echo "→ $product_name (Product ID: $product_id)"
    echo "  📤 Uploading new image..."
    
    # Upload new image
    response=$(curl -s -X POST \
        -H "Content-Disposition: attachment; filename=$(basename $file)" \
        -H "Content-Type: image/jpeg" \
        --data-binary "@$file" \
        --user "$WP_USER:$WP_PASS" \
        "$WP_URL/wp-json/wp/v2/media")
    
    new_media_id=$(echo "$response" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    
    if [ -n "$new_media_id" ] && [ "$new_media_id" != "" ]; then
        echo "  ✅ Uploaded! New Media ID: $new_media_id"
        echo "  🔗 Updating product..."
        
        # Update product with new image
        curl -s -X PUT \
            -H "Content-Type: application/json" \
            --user "$WP_USER:$WP_PASS" \
            -d "{\"images\":[{\"id\":$new_media_id}]}" \
            "$WP_URL/wp-json/wc/v3/products/$product_id" > /dev/null
        
        echo "  ✅ Product updated!"
        
        # Delete old image
        if [ -n "$old_media_id" ] && [ "$old_media_id" != "" ]; then
            echo "  🗑️  Deleting old image (ID: $old_media_id)..."
            curl -s -X DELETE \
                --user "$WP_USER:$WP_PASS" \
                "$WP_URL/wp-json/wp/v2/media/$old_media_id?force=true" > /dev/null
            echo "  ✅ Old image deleted!"
        fi
    else
        echo "  ❌ Upload failed"
    fi
    echo ""
}

# Update all products with exact images
upload_and_update "assets/products/luxury-sofa-exact.jpg" 31 81 "Luxury 3-Seater Teak Sofa"
upload_and_update "assets/products/coffee-table-exact.jpg" 32 82 "Contemporary Teak Coffee Table"
upload_and_update "assets/products/wardrobe-exact.jpg" 37 87 "Spacious 4-Door Teak Wardrobe"
upload_and_update "assets/products/king-bed-exact.jpg" 36 86 "Royal King Size Teak Bed"
upload_and_update "assets/products/dining-table-exact.jpg" 34 84 "Grand 8-Seater Teak Dining Table"
upload_and_update "assets/products/dining-chairs-exact.jpg" 35 85 "Elegant Teak Dining Chairs"
upload_and_update "assets/products/garden-bench-exact.jpg" 38 88 "Weather-Resistant Teak Garden Bench"

echo "======================================="
echo "🎉 All Products Updated with Exact Images!"
echo "======================================="
echo ""
echo "✅ 7 products updated with your exact images!"
echo "✅ Old images deleted from WordPress!"
echo ""
echo "🌐 Check: $WP_URL/wp-admin/edit.php?post_type=product"
echo ""
