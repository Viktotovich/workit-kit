const domManager = {
    findDom: function(){
        const addCategoryButton = document.querySelector(".add-cat");

        addCategoryButton.addEventListener("click", this.categoryPopup)
    },
    bindAttributes: function (target, pointer){
        Object.keys(pointer).forEach(attr => {
            target.setAttribute(attr, pointer[attr]);
        })
    },
    attributes: {
        catTitle: {
            name: 'cat-title',
            type: 'text',
            id: 'cat-title',
            required: '',
        },
        catTitleLabel: {
            for: 'cat-title'
        },
        catDescription: {
            name: 'cat-description',
            type: 'text',
            id: 'cat-description',
            required: '',
            maxlength: '45'
        },
        catDescriptionLabel: {
            for: 'cat-description'
        }
    },
    categoryPopup: function(){
        const modalSpace = document.querySelector(".modal-space");
        const popup = document.createElement("dialog");
        const form = document.createElement("form");
        const formDescription = document.createElement("p");
        const catTitleContainer = document.createElement("div")
        const catTitleLabel = document.createElement('label');
        const catTitle = document.createElement('input')
        const catDescriptionContainer = document.createElement("div");
        const catDescriptionLabel = document.createElement("label");
        const catDescription = document.createElement("textarea");
        const catSubmitButton = document.createElement("button");
        const closeModalButton = document.createElement('span');


        //The way to prevent multiple modals from being created
        modalSpace.innerHTML = ''

        modalSpace.appendChild(popup)
        popup.appendChild(form);
        form.appendChild(closeModalButton)
        form.appendChild(formDescription);
        form.appendChild(catTitleContainer);
        catTitleContainer.appendChild(catTitleLabel);
        catTitleContainer.appendChild(catTitle);
        form.appendChild(catDescriptionContainer);
        catDescriptionContainer.appendChild(catDescriptionLabel)
        catDescriptionContainer.appendChild(catDescription);
        form.appendChild(catSubmitButton);


        domManager.bindAttributes(catTitle, domManager.attributes.catTitle);

        domManager.bindAttributes(catDescription, domManager.attributes.catDescription);

        domManager.bindAttributes(catDescriptionLabel, domManager.attributes.catDescriptionLabel)

        domManager.bindAttributes(catTitleLabel, domManager.attributes.catTitleLabel)

        formDescription.textContent = "Please fill in the categories and text";
        catTitleLabel.textContent = "Enter the Category title:";
        catDescriptionLabel.textContent = "Please describe the Task Category:";
        closeModalButton.textContent = 'x';
        catSubmitButton.textContent = 'Submit'

        popup.showModal();

        closeModalButton.addEventListener("click", domManager.clearModal)
    },
    clearModal: function(){
        // closing the modal would be fine, but this is better
        const modalSpace = document.querySelector(".modal-space");
        modalSpace.innerHTML = '';
    }
};

export { domManager };