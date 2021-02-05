import gql from 'graphql-tag';
export const CREATE_MEETING_PARTICIPATION = gql`
  mutation($meetingId: Int!, $userId: String!) {
    createMeetingParticipation(meetingId: $meetingId, userId: $userId) {
      meeting {
        id
      }
      user {
        id
      }
    }
  }
`;
