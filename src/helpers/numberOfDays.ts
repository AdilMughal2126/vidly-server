export const numberOfDays = (dateReturned: number, dateOut: number) => {
  const day = 24 * 60 * 60 * 1000;
  const daysDiff = +dateReturned - +dateOut;
  /**
   * @ref https://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates
   */
  return Math.round(daysDiff / day);
};
