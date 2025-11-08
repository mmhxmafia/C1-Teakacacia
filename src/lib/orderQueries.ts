import { gql } from '@apollo/client';

// Get customer orders
export const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders {
    customer {
      id
      email
      firstName
      lastName
      orders {
        nodes {
          id
          databaseId
          orderNumber
          date
          status
          total
          subtotal
          totalTax
          shippingTotal
          paymentMethodTitle
          lineItems {
            nodes {
              product {
                node {
                  id
                  name
                  image {
                    sourceUrl
                  }
                }
              }
              quantity
              total
            }
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
        }
      }
    }
  }
`;

// Get single order details
export const GET_ORDER_DETAILS = gql`
  query GetOrderDetails($id: ID!) {
    order(id: $id, idType: DATABASE_ID) {
      id
      databaseId
      orderNumber
      date
      status
      total
      subtotal
      totalTax
      shippingTotal
      paymentMethodTitle
      customerNote
      lineItems {
        nodes {
          product {
            node {
              id
              name
              slug
              image {
                sourceUrl
              }
            }
          }
          quantity
          total
          subtotal
        }
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
    }
  }
`;

// Get current customer info
export const GET_CUSTOMER_INFO = gql`
  query GetCustomerInfo {
    customer {
      id
      databaseId
      email
      username
      firstName
      lastName
      billing {
        firstName
        lastName
        company
        address1
        address2
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
        company
        address1
        address2
        city
        state
        postcode
        country
      }
    }
  }
`;
