const { endOfMonth, format, isBefore } = require("date-fns");

// Years must be displayed
const getDateInformation = {
    getEndOfMonth: function(){
        return format(endOfMonth(new Date()), 'MMM/dd/yyyy');
    },
    formatDueDate: function(dueDate){
        const dateObj = new Date(Date.parse(dueDate));
        return format(dateObj, 'MMM/dd/yyyy');
    },
    isToday: function(dateStr){
        const todayObj = new Date();
        const today = this.formatDueDate(todayObj);
        if (dateStr === today){
            return true;
        } else {
            return false;
        }
    },
    getToday: function(){
        const todayObj = new Date();
        const today = this.formatDueDate(todayObj);
        return today 
    }
};

const defaultDue = getDateInformation.getEndOfMonth();

export const dateSorter = {
    sortAll: function(catObj){
        this.sortAnytime(catObj);
        this.sortToday(catObj);
        this.sortOverdue(catObj);
        },
    todayArray: [],
    // up to week from now
    soonArray: [],
    //all before today / less than today
    overdueArray: [],
    anytimeArray: [],
    sortToday: function(catObj){
        const tasksArr = catObj.tasks;
        tasksArr.forEach(element => {
            let dateCheck = getDateInformation.isToday(element.due);
            if (dateCheck === true){
                //works flawlessly
                this.todayArray.push(element);
            };
        });
    },
    sortOverdue: function(catObj){
        const tasksArr = catObj.tasks;
        const today = getDateInformation.getToday();

        tasksArr.forEach(element => {
            let dateCheck = isBefore(element.due, today);
            if (dateCheck === true){
                this.overdueArray.push(element);
            }
        });
    },
    sortAnytime: function(catObj){
        const tasksArr = catObj.tasks;

        tasksArr.forEach(element => {
            this.anytimeArray.push(element);
        });
    },
    sortSoon: function(catObj){
        //today +1 week, but not overdue: probs .map
    },
}

//whatever date object styles I go to, addEventListeners to today, anytime, etc sidebar, and throw the object into defaultLoad(dateObj)

/* DO NOT MAKE THE MISTAKE OF ASKING USERS TO SELECT DATE IN THE MODAL FOR TODAY OBJECT.

The task will belong to no cats, or in other words: it will be catless. (jokes aside: it will be under the date cat)
 */

export {getDateInformation, defaultDue};

/*
There should be an Object that has all the tasks, regardless of cats, based on their dates.

Today: whatever date === today;
Soon: whatever date up to 1 week from today;
Overdue: any date < today;
Anytime: View all projects basically
*/

/*
To Do:

3 - Finish the sortSoon sorter.

4 - Implement pub sub to translate MMM/dd/yyyy format into MMM/DD and display it into the DOM

Bonus (if I feel like it's worth the scope creep):
5 - Sort tasks by dates ascending / descending (compareAsc)

And Most Importantly: Leave dom-master for now alone.

Note: 
(1) toJson() calls toIsoString()
(2) To get default to get called into getEndOfMonth in taskMaster, call a Task constructor with '', undefined, or NaN => putting undefined helps bandaid edge case errors to do with dates. ezpz

*/
