import moment from 'moment';

export const isSameMonth = (month: number): boolean => {
  const currentDate = moment();
  const targetDate = moment().month(month - 1);
  return currentDate.isSame(targetDate, 'month');
};

export default {
  isSameMonth
};
