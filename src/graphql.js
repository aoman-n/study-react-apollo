import gql from 'graphql-tag'

export const ADD_STAR = gql`
  mutation ($input: AddStarInput!) {
    addStar(input: $input) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`

export const REMOVE_STAR = gql`
  mutation ($input: RemoveStarInput!) {
    removeStar(input: $input) {
        starrable {
          id
          viewerHasStarred
        }
    }
  }
`

export const ME = gql`
  query me {
    user(login: "laster18") {
      name
      avatarUrl
    }
  }
`

export const SEARCH_REPOSITORIES = gql`
  query searchRepositories(
    $first: Int,
    $after: String,
    $last: Int,
    $before: String,
    $query: String!
  ) {
    search(
      first: $first,
      after: $after,
      last: $last,
      before: $before,
      query: $query,
      type: REPOSITORY
    ) {
      repositoryCount,
      pageInfo {
        endCursor,
        hasNextPage,
        hasPreviousPage
        startCursor
      }
      edges {
        node {
          ... on Repository {
            id,
            name,
            url
            stargazers {
              totalCount
            }
            viewerHasStarred
          }
        }
      }
    }
  }
`
