/*
There should be an Object that has all the tasks, regardless of cats, based on their dates.

Today: whatever date === today;
Soon: whatever date up to 1 week from today;
Overdue: any date < today;
Anytime: View all projects basically
*/

/*
To Do (These were the benefits listed out before, but I changed them to things we can implement):
1 - Format dates i.e: dd MMMM (DONE)
2- Quantify distances in date - 17th sept from today - it will help with the sorting (sorting in a sense: what belongs to today, soon, tommorow, etc).
3 - add a default: task is due endOfMonth - in the task-master obj defaults (when the user ignores prompt to enter task due date)

Bonus (if I feel like it's worth the scope creep):
4 - Sort tasks by dates ascending / descending (compareAsc)

And Most Importantly: Leave dom-master for now alone.

Note: toJson() calls toIsoString()
*/

//Once implemented, go back to task-editor and add the date as well
const { endOfMonth, format } = require("date-fns");

const getDateInformation = {
    getEndOfMonth: function(){
        return format(endOfMonth(new Date()), 'MMMdd');
    },
    //FIXED
    formatDueDate: function(dueDate){
        const dateObj = new Date(Date.parse(dueDate));
        return format(dateObj, 'MMM/dd');
    }
};

const defaultDue = getDateInformation.getEndOfMonth();

export {getDateInformation, defaultDue};