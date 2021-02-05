import gql from 'graphql-tag';

export const DELETE_MEETING = gql`
  mutation($id: ID!) {
    deleteMeeting(id: $id)
  }
`;
