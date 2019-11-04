// Model
var budgetModel = (function () {
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
        sum: {
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
            var newItemObj, ID;

            // Getting ID
            if (data.allItems[type].length === 0){
                ID = 0;
            } else {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }

            // Create new Item Obj
            if (type === 'exp'){
                newItemObj = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItemObj = new Income(ID, des, val);
            }

            // Add into the Data Structure
            data.allItems[type].push(newItemObj);
            return newItemObj;
        },
        testing: function() {
            console.log(data);
        }
    }
})();

// View
var UIView = (function () {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
    }
    return {
        getDOMStr: function() {
            return DOMStrings;
        },
        getInputObj: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },
        render: function(itemObj, type) {
            var htmlTemplate, html, container;

            if (type === 'inc'){
                htmlTemplate = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

                container = document.querySelector(DOMStrings.incomeContainer);
            } else if (type === 'exp'){
                htmlTemplate = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

                container = document.querySelector(DOMStrings.expenseContainer);
            }

            html = htmlTemplate.replace('%id%', itemObj.id);
            html = html.replace('%description%', itemObj.description);
            html = html.replace('%value%', itemObj.value);

            container.insertAdjacentHTML('beforeend', html);
        }
    }
})();

// Control
var controller = (function (bdtModel, uiViw) {
    
    var addItem = function () {
        var userInput = uiViw.getInputObj();
        var newItemObj = bdtModel.addItem(userInput.type, userInput.description, userInput.value);
        uiViw.render(newItemObj, userInput.type);
    }

    var setupEventListeners = function(){
        var domStr = uiViw.getDOMStr();
        
        document.querySelector(domStr.inputButton).addEventListener('click', addItem);
    
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        });
    }

    return {
        init: function(){
            console.log('Application started');
            setupEventListeners();
        }
    };
})(budgetModel, UIView);


controller.init();