import { gql } from '@apollo/client';

// Create WooCommerce Order
export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      order {
        id
        databaseId
        orderNumber
        status
        total
        subtotal
        totalTax
        shippingTotal
        customer {
          email
          firstName
          lastName
        }
        billing {
          firstName
          lastName
          address1
          city
          state
          postcode
          country
          email
          phone
        }
        shipping {
          firstName
          lastName
          address1
          city
          state
          postcode
          country
        }
        lineItems {
          nodes {
            productId
            quantity
            total
          }
        }
      }
    }
  }
`;
