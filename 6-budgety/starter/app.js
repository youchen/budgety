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

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            // Getting ID
            if (data.allItems[type].length === 0){
                ID = 0;
            } else {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }

            // Create new Item Obj
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            // Add into the Data Structure
            data.allItems[type].push(newItem);
            return newItem;
        },
        testing: function() {
            console.log(data);
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
        getDOMStr: function() {
            return DOMStrings;
        },
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
        }
    }
})();

var controller = (function (budgetCtrl, UICtrl) {
    
    var ctrlAddItem = function () {
        var userInput = UICtrl.getInput();
        budgetCtrl.addItem(userInput.type, userInput.description, userInput.value);
    }

    var setupEventListeners = function(){
        var domStr = UICtrl.getDOMStr();
        
        document.querySelector(domStr.inputButton).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    }

    return {
        init: function(){
            console.log('Application started');
            setupEventListeners();
        }
    };
})(budgetController, UIController);


controller.init();