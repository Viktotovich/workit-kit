function domManager(){
    function domFinder(){
        const addCategoryButton = document.querySelector(".add-cat");
        const main = document.querySelector(".main");

        addCategoryButton.addEventListener("click", functionContainer.addCategory)
    };

    //initializer
    domFinder();
};

const functionContainer = {
    addCategory: function(){
        const sidebarOptions = document.querySelector(".sidebar-options");
        //create a dynamic modal here
    },

}

export { domManager };