var budgetController = (function () {
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income =  function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        total: {
            exp: 0,
            inc: 0
        },
        allItems: {
            exp: [],
            inc: []
        }
    }
})();

var UIController = (function () {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn' 
    }
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },
        getDOMStr: function() {
            return DOMStrings;
        }
    }
})();

var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function(){
        var domStr = UIController.getDOMStr();
        
        document.querySelector(domStr.inputButton).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    }

    var ctrlAddItem = function () {
        console.log(UIController.getInput());
    }

    return {
        init: function(){
            console.log('Application started');
            setupEventListeners();
        }
    };
})(budgetController, UIController);


controller.init();