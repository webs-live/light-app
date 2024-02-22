/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export function formatToDateTime(date?: dayjs.ConfigType, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format);
}

export function formatToDate(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}

export const dateUtil = dayjs;

export function formatTime(time: number) {
  var hours = Math.floor(time / 3600);
  var minutes = Math.floor(Math.floor(time % 3600) / 60);
  var seconds = Math.floor(time % 60);
  var h = hours.toString().length === 1 ? `0${hours}` : hours;
  var m = minutes.toString().length === 1 ? `0${minutes}` : minutes;
  var s = seconds.toString().length === 1 ? `0${seconds}` : seconds;
  return `${h}:${m}:${s}`;
}

export function formatWeek(index: number) {
  let week = '';
  switch (index) {
    case 0:
      week = '星期日';
      break;
    case 1:
      week = '星期一';
      break;
    case 2:
      week = '星期二';
      break;
    case 3:
      week = '星期三';
      break;
    case 4:
      week = '星期四';
      break;
    case 5:
      week = '星期五';
      break;
    case 6:
      week = '星期六';
      break;
    default:
      week = '';
      break;
  }

  return week;
}
