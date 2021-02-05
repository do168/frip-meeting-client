import gql from 'graphql-tag';

export const UPDATE_MEETING = gql`
  mutation($id: ID!, $input: MeetingPostParam!) {
    updateMeeting(id: $id, input: $input) {
      id
    }
  }
`;
