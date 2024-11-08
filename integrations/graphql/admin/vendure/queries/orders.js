const gql = require("graphql-tag");

const GET_ORDERS_QUERY = gql`
  query Orders {
    orders {
      totalItems
      items {
        id
        customer {
          id
          title
          firstName
          lastName
        }
      }
    }
  }
`;

const GET_ORDER_BY_ID_QUERY = gql`
  query Order($orderId: ID!) {
    order(id: $orderId) {
      aggregateOrder {
        aggregateOrderId
        orderPlacedAt
        code
        lines {
          productVariant {
            name
          }
        }
      }
    }
  }
`;

const adminOrdersQuery = {
  GET_ORDERS_QUERY,
  GET_ORDER_BY_ID_QUERY,
};

module.exports = adminOrdersQuery;
