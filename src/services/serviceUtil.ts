import moment from 'moment-timezone';

export function convertTimezone(item: string): string {
  const e = moment(item);
  return e.tz('Asia/Seoul').format('YYYY-MM-DD HH:MM:SS');
}

export function mergeDateTime(at: any, sd: string, st: string, ed: string, et: string, dd: string, dt: string) {
  at.startAt = sd + ' ' + st;
  at.endAt = ed + ' ' + et;
  at.deadline = dd + ' ' + dt;
}

export default { convertTimezone, mergeDateTime };
