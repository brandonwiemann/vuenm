/**
 * Date or valid string argument of Date.constructor
 */

export type DateString = `${number}${number}${number}${number}-${number}${number}-${number}`
export type DateTime = Date | DateTimeString
export type DateTimeString = string
export type TimeString = `${number}${number}:${number}${number}:${number}${number}`
export type DateRange = [DateString | null, DateString | null];

export type NameOfDay =
    'Sunday' |
    'Monday' |
    'Tuesday' |
    'Wednesday' |
    'Thursday' |
    'Friday' |
    'Saturday'

export type NameOfMonth =
    'January' |
    'February' |
    'March' |
    'April' |
    'May' |
    'June' |
    'July' |
    'August' |
    'September' |
    'October' |
    'November' |
    'December'
