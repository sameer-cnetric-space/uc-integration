const gql = require("graphql-tag");

const GET_CUSTOMERS_QUERY = gql`
  query Query {
    customers {
      totalItems
      items {
        id
        title
        firstName
        lastName
        emailAddress
      }
    }
  }
`;

const adminCustomersQuery = {
  GET_CUSTOMERS_QUERY,
};

module.exports = adminCustomersQuery;
