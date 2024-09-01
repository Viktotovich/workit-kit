/*
There should be an Object that has all the tasks, regardless of cats, based on their dates.

Today: whatever date === today;
Soon: whatever date up to 1 week from today;
Overdue: any date < today;
Anytime: View all projects basically
*/

/* I don't really know what I need or why I am using the library apart from the fact it's reccomended: need to learn more about the date object.

Why I might need date-fns:
1 - it formats dates nicely, i.e: dd MMMM
2- Can it quantify distances in dates? - 17th sept from today - it will help with the sorting.
3 - add a default: task is due today / in a week / end of month - in the task-master obj defaults (when the user ignores prompt to enter task due date)

Bonus (if I feel like it's worth the scope creep):
4 - Sort tasks by dates ascending / descending (compareAsc)

Why normal date object wouldn't do:
1 - It's a nightmare to work with, especially without time zone offsets. UTC and local time get mixed up on date and date and time formats. 
2 - After hefty research, normal date object work.. but it wont cover many edge cases, and is harder to implement. Date-fns just makes it easier to work with, but has weirder documentation

Note: toJson() calls toIsoString()

Sidenote: Adding date-fns corrupted my whole git HEAD
*/

//pnce implemented, go back to task-editor and add the date as well
const { endOfMonth, format } = require("date-fns");

const getDateInformation = {
    getEndOfMonth: function(){
        return format(endOfMonth(new Date()), 'MMMdd');
    },
};

const defaultDue = getDateInformation.getEndOfMonth();

export {getDateInformation, defaultDue};