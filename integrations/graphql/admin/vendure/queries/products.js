const gql = require("graphql-tag");

const GET_PRODUCTS_QUERY = gql`
  query Products {
    products {
      items {
        id
        name
        slug
        enabled
        featuredAsset {
          preview
        }
        variantList {
          totalItems
        }
      }
    }
  }
`;

const GET_PRODUCT_BY_ID_QUERY = gql`
  query Product($productId: ID) {
    product(id: $productId) {
      id
      name
      updatedAt
      slug
      description
      collections {
        name
      }
      variantList {
        totalItems
        items {
          sku
          prices {
            price
            currencyCode
          }
          stockLevel
          featuredAsset {
            preview
          }
        }
      }
      featuredAsset {
        preview
      }
      variants {
        options {
          id
          name
        }
      }
    }
  }
`;

const adminProductsQuery = {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_ID_QUERY,
};

module.exports = adminProductsQuery;
