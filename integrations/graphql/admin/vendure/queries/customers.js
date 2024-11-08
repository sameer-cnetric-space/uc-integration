const gql = require("graphql-tag");

const GET_CUSTOMERS_QUERY = gql`
  query Query {
    customers {
      totalItems
      items {
        id
        firstName
        lastName
        emailAddress
        phoneNumber
      }
    }
  }
`;

const adminCustomersQuery = {
  GET_CUSTOMERS_QUERY,
};

module.exports = adminCustomersQuery;
