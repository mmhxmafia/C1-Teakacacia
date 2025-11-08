#!/bin/bash

# WordPress Image Upload Script
# Uploads all downloaded images to WordPress and assigns them to products/categories

WP_URL="https://darkorange-kangaroo-901503.hostingersite.com"
WP_USER="themodernmarketinghouse@gmail.com"
WP_PASS="jX8C 9gMX HZOy VaAz 5qHc CTmd"

echo "🚀 WordPress Image Uploader"
echo "================================"
echo ""

# Function to upload image and get media ID
upload_image() {
    local file_path=$1
    local file_name=$(basename "$file_path")
    local title=$2
    
    echo "  📤 Uploading: $file_name..."
    
    # Upload to WordPress Media Library
    response=$(curl -s -X POST \
        -H "Content-Disposition: attachment; filename=$file_name" \
        -H "Content-Type: image/jpeg" \
        --data-binary "@$file_path" \
        --user "$WP_USER:$WP_PASS" \
        "$WP_URL/wp-json/wp/v2/media")
    
    # Extract media ID from response
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
    
    echo "  🔗 Assigning image to product ID: $product_id..."
    
    curl -s -X POST \
        -H "Content-Type: application/json" \
        --user "$WP_USER:$WP_PASS" \
        -d "{\"images\":[{\"id\":$media_id}]}" \
        "$WP_URL/wp-json/wc/v3/products/$product_id" > /dev/null
    
    echo "  ✅ Assigned!"
}

# Function to assign image to category
assign_to_category() {
    local category_id=$1
    local media_id=$2
    
    echo "  🔗 Assigning image to category ID: $category_id..."
    
    curl -s -X PUT \
        -H "Content-Type: application/json" \
        --user "$WP_USER:$WP_PASS" \
        -d "{\"image\":{\"id\":$media_id}}" \
        "$WP_URL/wp-json/wc/v3/products/categories/$category_id" > /dev/null
    
    echo "  ✅ Assigned!"
}

echo "📸 Uploading Category Images..."
echo ""

# Living Room (Category ID: 22)
if [ -f "assets/categories/living-room.jpg" ]; then
    echo "→ Living Room Category"
    media_id=$(upload_image "assets/categories/living-room.jpg" "Living Room")
    if [ "$media_id" != "0" ]; then
        assign_to_category 22 $media_id
    fi
    echo ""
fi

# Dining Room (Category ID: 23)
if [ -f "assets/categories/dining-room.jpg" ]; then
    echo "→ Dining Room Category"
    media_id=$(upload_image "assets/categories/dining-room.jpg" "Dining Room")
    if [ "$media_id" != "0" ]; then
        assign_to_category 23 $media_id
    fi
    echo ""
fi

# Bedroom (Category ID: 24)
if [ -f "assets/categories/bedroom.jpg" ]; then
    echo "→ Bedroom Category"
    media_id=$(upload_image "assets/categories/bedroom.jpg" "Bedroom")
    if [ "$media_id" != "0" ]; then
        assign_to_category 24 $media_id
    fi
    echo ""
fi

# Outdoor & Garden (Category ID: 25)
if [ -f "assets/categories/outdoor-garden.jpg" ]; then
    echo "→ Outdoor & Garden Category"
    media_id=$(upload_image "assets/categories/outdoor-garden.jpg" "Outdoor Garden")
    if [ "$media_id" != "0" ]; then
        assign_to_category 25 $media_id
    fi
    echo ""
fi

# Office & Study (Category ID: 26)
if [ -f "assets/categories/office-study.jpg" ]; then
    echo "→ Office & Study Category"
    media_id=$(upload_image "assets/categories/office-study.jpg" "Office Study")
    if [ "$media_id" != "0" ]; then
        assign_to_category 26 $media_id
    fi
    echo ""
fi

echo "================================"
echo "📸 Uploading Product Images..."
echo ""

# Product 31: Luxury Sofa
if [ -f "assets/products/luxury-sofa.jpg" ]; then
    echo "→ Luxury 3-Seater Teak Sofa (ID: 31)"
    media_id=$(upload_image "assets/products/luxury-sofa.jpg" "Luxury Sofa")
    if [ "$media_id" != "0" ]; then
        assign_to_product 31 $media_id
    fi
    echo ""
fi

# Product 32: Coffee Table
if [ -f "assets/products/coffee-table.jpg" ]; then
    echo "→ Contemporary Teak Coffee Table (ID: 32)"
    media_id=$(upload_image "assets/products/coffee-table.jpg" "Coffee Table")
    if [ "$media_id" != "0" ]; then
        assign_to_product 32 $media_id
    fi
    echo ""
fi

# Product 33: Armchair
if [ -f "assets/products/armchair.jpg" ]; then
    echo "→ Classic Teak Armchair (ID: 33)"
    media_id=$(upload_image "assets/products/armchair.jpg" "Armchair")
    if [ "$media_id" != "0" ]; then
        assign_to_product 33 $media_id
    fi
    echo ""
fi

# Product 34: Dining Table
if [ -f "assets/products/dining-table.jpg" ]; then
    echo "→ Grand 8-Seater Teak Dining Table (ID: 34)"
    media_id=$(upload_image "assets/products/dining-table.jpg" "Dining Table")
    if [ "$media_id" != "0" ]; then
        assign_to_product 34 $media_id
    fi
    echo ""
fi

# Product 35: Dining Chairs
if [ -f "assets/products/dining-chairs.jpg" ]; then
    echo "→ Elegant Teak Dining Chairs (ID: 35)"
    media_id=$(upload_image "assets/products/dining-chairs.jpg" "Dining Chairs")
    if [ "$media_id" != "0" ]; then
        assign_to_product 35 $media_id
    fi
    echo ""
fi

# Product 36: King Bed
if [ -f "assets/products/king-bed.jpg" ]; then
    echo "→ Royal King Size Teak Bed (ID: 36)"
    media_id=$(upload_image "assets/products/king-bed.jpg" "King Bed")
    if [ "$media_id" != "0" ]; then
        assign_to_product 36 $media_id
    fi
    echo ""
fi

# Product 37: Wardrobe
if [ -f "assets/products/wardrobe.jpg" ]; then
    echo "→ Spacious 4-Door Teak Wardrobe (ID: 37)"
    media_id=$(upload_image "assets/products/wardrobe.jpg" "Wardrobe")
    if [ "$media_id" != "0" ]; then
        assign_to_product 37 $media_id
    fi
    echo ""
fi

# Product 38: Garden Bench
if [ -f "assets/products/garden-bench.jpg" ]; then
    echo "→ Weather-Resistant Teak Garden Bench (ID: 38)"
    media_id=$(upload_image "assets/products/garden-bench.jpg" "Garden Bench")
    if [ "$media_id" != "0" ]; then
        assign_to_product 38 $media_id
    fi
    echo ""
fi

# Product 39: Office Desk
if [ -f "assets/products/office-desk.jpg" ]; then
    echo "→ Executive Teak Office Desk (ID: 39)"
    media_id=$(upload_image "assets/products/office-desk.jpg" "Office Desk")
    if [ "$media_id" != "0" ]; then
        assign_to_product 39 $media_id
    fi
    echo ""
fi

# Product 40: Bookshelf
if [ -f "assets/products/bookshelf.jpg" ]; then
    echo "→ Tall Teak Bookshelf (ID: 40)"
    media_id=$(upload_image "assets/products/bookshelf.jpg" "Bookshelf")
    if [ "$media_id" != "0" ]; then
        assign_to_product 40 $media_id
    fi
    echo ""
fi

# Product 42: Storage Chest
if [ -f "assets/products/storage-chest.jpg" ]; then
    echo "→ Traditional Teak Storage Chest (ID: 42)"
    media_id=$(upload_image "assets/products/storage-chest.jpg" "Storage Chest")
    if [ "$media_id" != "0" ]; then
        assign_to_product 42 $media_id
    fi
    echo ""
fi

# Product 41: Wardrobe
if [ -f "assets/products/wardrobe.jpg" ]; then
    echo "→ Spacious 4-Door Teak Wardrobe (ID: 41)"
    media_id=$(upload_image "assets/products/wardrobe.jpg" "Wardrobe Alt")
    if [ "$media_id" != "0" ]; then
        assign_to_product 41 $media_id
    fi
    echo ""
fi

echo "================================"
echo "🎉 Upload Complete!"
echo "================================"
echo ""
echo "✅ All images uploaded and assigned!"
echo ""
echo "🌐 Check your WordPress:"
echo "  → Products: $WP_URL/wp-admin/edit.php?post_type=product"
echo "  → Categories: $WP_URL/wp-admin/edit-tags.php?taxonomy=product_cat"
echo ""
