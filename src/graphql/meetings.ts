import gql from 'graphql-tag';

export const GET_MEETINGS = gql`
  query GetMeetings($hostId: String, $page: Page!) {
    meetings(hostId: $hostId, page: $page) {
      edges {
        node {
          id
          title
          startAt
          maxParticipant
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;
