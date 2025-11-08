import { gql } from '@apollo/client';

// Simplified fragment - don't use fragments, inline everything
export const ProductCardFields = gql`
  fragment ProductCardFields on SimpleProduct {
    id
    slug
    name
    price
    regularPrice
    salePrice
    description
    featuredImage {
      node {
        sourceUrl
      }
    }
    galleryImages {
      nodes {
        sourceUrl
      }
    }
  }
`;

// Legacy support - keep this for backward compatibility
export const ProductPriceFields = ProductCardFields;
