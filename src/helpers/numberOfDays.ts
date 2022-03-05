/**
 * @description This function calculates the number between two days
 * @param {Date} days: returned date and the rent date
 * @returns {Number} the number of days
 * @see {@link https://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates}
 */

export const numberOfDays = (returnedDate: Date, rentDate: Date) => {
	const day = 24 * 60 * 60 * 1000;
	const daysDiff = +returnedDate - +rentDate;
	return Math.ceil(daysDiff / day);
};
