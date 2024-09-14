# workit-kit
A toolkit meant to be a re-invention of the to-do list. The goal for the product is to be user friendly, and contain all the feautures a standard to-do list has with it's own spin. Code-wise this project is testing OO principes, modular way of creating objects and classes, and a senior dev way of organizing code

29AUG2024, 03:08 AM: The best cure is prevention. 600+ lines of code (albeit modular) is quite hectic to go through. It is making me dizzy but addicted in a weird way.

However, if this code were modularized even further: a separate error-handler under /component, a separate obj in another file, 100 lines of code cut here and there would have been nicer to look at it.

The increasing complexity of working with code is not debted to the difficulty of the project itself, but rather the way of organizing the code. It makes me appreciate OOP and SOLID principles more and more, especially when new feautures are added.

Working with DOM is awesome, but using DOM for interactivity, and tracking positions in arrays and subarrays (arrays within arrays) feels wrong. There must be a better way.

Additionally, at the point of time that I am writing this, this project has no UI apart from 3 or 4 lines of CSS. This project is built on confidence.

05SEP2024 06:33 AM: Cyclical dependecy problem is a giant problem for this codebase at the moment that has to be solved for the date-obj idea to work

08SEP2024 20:27: Having to admit that the Task Delete option for date objects has to go hurts so god damn bad, I feel like I failed but at the same time I know I didnt. 

11SEP2024 15:10: Using the HMR or whatever it is that allows me to just refresh and see updates quick as opposed to always npm run build(ing) really supercharged my development. I am definetely seeing more results now that I don't see webpack as a roadblack with feautures.

However, not being able to interact with items/objects through the console IS a hinderance I still haven't got used to.

13SEP2024 17:02: it took a month to get to this point of the project - I have now successfully implemented the local storage, and 95% of things I wanted to do.

There are still things left to work on, notably: 
        
    5 - Visual UI/UX - 90% done, 10% left are boring modals with small changes only

    8 - CAT remover last, doesn't make sense to leave users on a blank screen if they can delete from main; instead the only options users should have is to delete from the sidebar from the settings icon - nothing else. 

    9 - Reset local storage option: add a way to clear stored data

    It works also as an insurance, to prevent "oops I didnt know if I delete the category, I delete everything in the category"

    New Categories MUST HAVE cat remove button or something. Work Tasks are immune to prevent empty displays

    Along the cat remove, give like a general reset option 

14SEP2024 17:43: Last night I went to festival city and actually used this framework to store data for marketing and make tasks for us. There were bugs, and just some odities: I didn't like the fact how the background img loops, but it works. 

Additionally, the tiny clear button that clears local storage is awesome. 