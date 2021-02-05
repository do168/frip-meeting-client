import { Host } from '@/model/Host';
import { User } from '@/model/User';

export interface Meeting {
  id: number;
  title: string;
  content: string;
  startAt: string;
  endAt: string;
  deadline: string;
  place: string;
  maxParticipant: number;
  updatedAt: string;
  host: Host;
  cntCurrentParticipant: number | 0;
  participatesUsers: User[];
}
