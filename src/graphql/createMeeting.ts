import gql from 'graphql-tag';

export const CREATE_MEETING = gql`
  mutation($input: MeetingPostParam!) {
    createMeeting(input: $input) {
      id
      title
    }
  }
`;
