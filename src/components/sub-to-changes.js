//pub/sub - this is listening to any time cats are rendered/re-rendered

//But Why?

// 1 - Cleaner code, 2 - pubsub is a standard, 3 - no mess and less bugs when communicating between dom-master and date-hanger, 4 - much less lines since dom-master is overflowing at this point

const changeListener = {
    pubChangesToDates: function(catObj){
        console.log("Works")
    }
}

export { changeListener }