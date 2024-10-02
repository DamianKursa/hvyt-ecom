import { gql } from '@apollo/client';

export const GET_SINGLE_PRODUCT = gql`
query ProductBySlug($slug: String!) {
  products(where: { slugIn: [$slug] }) {
    nodes {
      id
      name
      slug
      description
      image {
        sourceUrl
      }
      averageRating
      onSale
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        stockQuantity
        galleryImages {
          edges {
            node {
              id
              sourceUrl
            }
          }
        }
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
        variations {
          nodes {
            id
            stockStatus
            stockQuantity
            price
            regularPrice
            salePrice
            image {
              sourceUrl
            }
          }
        }
        attributes {
          nodes {
            name
            options
            # Fetch color hex values if available in the custom fields
            customFields {
              colorHex
            }
          }
        }
      }
    }
  }
}

`;

/**
 * Fetch first 4 products from a specific category
 */

export const FETCH_FIRST_PRODUCTS_FROM_HOODIES_QUERY = `
 query MyQuery {
  products(first: 4, where: {category: "Hoodies"}) {
    nodes {
      productId
      name
      onSale
      slug
      image {
        sourceUrl
      }
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
      }
    }
  }
}
 `;

/**
 * Fetch first 200 Woocommerce products from GraphQL
 */
export const FETCH_ALL_PRODUCTS_QUERY = gql`
  query MyQuery {
    products(first: 50) {
      nodes {
        databaseId
        name
        onSale
        slug
        image {
          sourceUrl
        }
        ... on SimpleProduct {
          databaseId
          price
          regularPrice
          salePrice
        }
        ... on VariableProduct {
          databaseId
          price
          regularPrice
          salePrice
          variations {
            nodes {
              price
              regularPrice
              salePrice
            }
          }
        }
      }
    }
  }
`;



export const FETCH_PRODUCTS_WITH_PRICE_AND_IMAGE = gql`
  query GetProducts {
    products(first: 50) {
      nodes {
        name
        slug
        image {
          sourceUrl
        }
        ... on SimpleProduct {
          price
        }
        ... on VariableProduct {
          variations(first: 1) {
            nodes {
              price
            }
          }
        }
      }
    }
  }
`;
/**
 * Fetch first 20 categories from GraphQL
 */
export const FETCH_ALL_CATEGORIES_QUERY = gql`
  query Categories {
    productCategories(first: 20) {
      nodes {
        id
        name
        slug
      }
    }
  }
`;

export const GET_PRODUCTS_FROM_CATEGORY = gql`
  query ProductsFromCategory($id: ID!) {
    productCategory(id: $id, idType: SLUG) {
      id
      name
      products(first: 50) {
        nodes {
          id
          name
          slug
          description
          image {
            sourceUrl
          }
          galleryImages {
            nodes {
              sourceUrl
            }
          }
          onSale
          ... on SimpleProduct {
            price
            regularPrice
            salePrice
          }
          ... on VariableProduct {
            price
            regularPrice
            salePrice
            variations {
              nodes {
                price
                regularPrice
                salePrice
              }
            }
          }
        }
      }
    }
  }
`;


export const GET_CART = gql`
  query GET_CART {
    cart {
      contents {
        nodes {
          key
          product {
            node {
              id
              databaseId
              name
              description
              type
              onSale
              slug
              averageRating
              reviewCount
              image {
                id
                sourceUrl
                srcSet
                altText
                title
              }
              galleryImages {
                nodes {
                  id
                  sourceUrl
                  srcSet
                  altText
                  title
                }
              }
            }
          }
          variation {
            node {
              id
              databaseId
              name
              description
              type
              onSale
              price
              regularPrice
              salePrice
              image {
                id
                sourceUrl
                srcSet
                altText
                title
              }
              attributes {
                nodes {
                  id
                  name
                  value
                }
              }
            }
          }
          quantity
          total
          subtotal
          subtotalTax
        }
      }

      subtotal
      subtotalTax
      shippingTax
      shippingTotal
      total
      totalTax
      feeTax
      feeTotal
      discountTax
      discountTotal
    }
  }
`;
