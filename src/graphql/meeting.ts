import gql from 'graphql-tag';

export const GET_MEETING = gql`
  query GetMeeting($id: ID!) {
    meeting(id: $id) {
      id
      title
      content
      startAt
      endAt
      deadline
      updatedAt
      place
      maxParticipant
      cntCurrentParticipant
      host {
        id
        nickname
      }
      participatesUsers {
        id
      }
    }
  }
`;
