const gql = require("graphql-tag");

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!, $rememberMe: Boolean) {
    login(username: $username, password: $password, rememberMe: $rememberMe) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on InvalidCredentialsError {
        message
        errorCode
      }
      ... on NativeAuthStrategyError {
        message
        errorCode
      }
    }
  }
`;

const adminAuth = {
  LOGIN_MUTATION,
};

module.exports = adminAuth;
