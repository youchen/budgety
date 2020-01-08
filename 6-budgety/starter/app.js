// Model
var budgetModel = (function () {
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calculatePercentage = function(totalIncome){
        if (totalIncome > 0){
            this.percentage = Math.round(this.value / totalIncome * 100);
        } else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function() {
        return this.percentage;
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
        allItemsObj: {
            exp: [],
            inc: []
        }, 
        budget: 0,
        percentage: -1
    }

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItemsObj[type].forEach(function(cur){
            sum += cur.value;
        });
        data.sum[type] = sum;
    }

    return {
        addItem: function(type, des, val) {
            var newItemObj, ID;

            // Getting ID
            if (data.allItemsObj[type].length === 0){
                ID = 0;
            } else {
                ID = data.allItemsObj[type][data.allItemsObj[type].length - 1].id + 1;
            }

            // Create new Item Obj
            if (type === 'exp'){
                newItemObj = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItemObj = new Income(ID, des, val);
            }

            // Add into the Data Structure
            data.allItemsObj[type].push(newItemObj);
            return newItemObj;
        },

        calculateBudget: function() {
            calculateTotal('inc');
            calculateTotal('exp');

            data.budget = data.sum.inc - data.sum.exp;

            if (data.sum.inc !== 0){
                data.percentage = Math.round(data.sum.exp / data.sum.inc * 100);
            }
        },

        calculateExpensePercentages: function (){
            data.allItemsObj.exp.forEach(function(cur){
                cur.calculatePercentage(data.sum.inc);
            })
        },

        getExpensePercentages: function (){
            var allPercentages = data.allItemsObj.exp.map(function(cur){
                return cur.getPercentage();
            })
            return allPercentages;
        },

        getBudget: function (){
            return {
                budget: data.budget,
                totalInc: data.sum.inc,
                totalExp: data.sum.exp,
                percentage: data.percentage
            }
        },

        deleteItem: function (type, id) {
            var ids, IndexOfItemToDelete;
    
            // [inc49f, inc39c, inc39a, incff1]
            // [1,      4,      7,      10]     id
            // [0,      1,      2,      3]      index
            ids = data.allItemsObj[type].map(function(cur){
                return cur.id;
            });
    
            IndexOfItemToDelete = ids.indexOf(id);
    
            if (IndexOfItemToDelete !== -1){
                var valueOfItemToDelete = data.allItemsObj[type][IndexOfItemToDelete].value;
                data.allItemsObj[type].splice(IndexOfItemToDelete, 1);

                data.sum[type] -= valueOfItemToDelete;
                data.budget = data.sum.inc - data.sum.exp;

                // percentage = exp / inc
                if (data.sum.inc >= 0) {
                    data.percentage = data.sum.exp / data.sum.inc;
                }
            }
        },

        //TODO: delete this line. 
        testing: function() { 
            console.log(data);
        }
    }
})();

// View
var UIView = (function () {
    var inputElementClasses = {
        dashboardMonth: '.budget__title--month',
        dashboardBudget: '.budget__value',
        dashboardIncome: '.budget__income--value',
        dashboardExpense: '.budget__expenses--value',
        dashboardPercentage: '.budget__expenses--percentage',

        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',

        container: '.container',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',

        expensePercentageLable: '.item__percentage'
    };

    var formatNumber = function (num, type) {
        var unsignedRoundedNum, int, dec, numFormatted = '';

        unsignedRoundedNum = Math.abs(num).toFixed(2);

        int = unsignedRoundedNum.split('.')[0];
        dec = unsignedRoundedNum.split('.')[1];

        while (int.length >= 4) {
            // 45765134234 
            numFormatted = ',' + int.substr(int.length - 3, int.length - 1) + numFormatted;
            int = int.substring(0, int.length - 3);
        }
        numFormatted = int + numFormatted;

        return (type === 'exp' ? '-' : '+') + ' ' + numFormatted + '.' + dec;
    };

    return {
        displayDate: function() {
            var months, now, curMonth, curYear;
            months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            now = new Date();

            curMonth = months[now.getMonth()];
            curYear = now.getFullYear();

            document.querySelector(inputElementClasses.dashboardMonth).textContent = curMonth + ' ' + curYear;
        },

        displayExpensePercentages: function(allExpensePercentages) {
            // 1. get list of percentages from modal

            // 2. get list of expense elements 
            var expPercentagesNodes = document.querySelectorAll(inputElementClasses.expensePercentageLable);

            // 3. assign number to Expense elements list. 
            var nodeListForEach = function(list, callback) {
                for (let i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(expPercentagesNodes, function(currentNode, index) {
                if (allExpensePercentages[index] > 0) {
                    currentNode.textContent = allExpensePercentages[index] + ' %';
                } else {
                    currentNode.textContent = '-- %';
                }
            });
        },

        getInputElementClasses: function() {
            return inputElementClasses;
        },
        getInputObj: function() {
            return {
                type: document.querySelector(inputElementClasses.inputType).value,
                description: document.querySelector(inputElementClasses.inputDescription).value,
                value: parseFloat(document.querySelector(inputElementClasses.inputValue).value)
            }
        },
        clearFields: function() {
            var inputFieldsList, inputFieldsArr;
            
            inputFieldsList = document.querySelectorAll(inputElementClasses.inputDescription + ', ' + inputElementClasses.inputValue);
            inputFieldsArr = Array.prototype.slice.call(inputFieldsList);
            
            inputFieldsArr.forEach(function(cur, index, arr) {
                cur.value = "";
            })

            inputFieldsArr[0].focus();
        },
        updateDashBoard: function(budget){
            document.querySelector(inputElementClasses.dashboardBudget).textContent = formatNumber(budget.budget, budget.budget < 0 ? 'exp' : 'inc');
            document.querySelector(inputElementClasses.dashboardIncome).textContent = formatNumber(budget.totalInc, 'inc');
            document.querySelector(inputElementClasses.dashboardExpense).textContent = formatNumber(budget.totalExp, 'exp');
            
            var percentage = budget.percentage;
            if (percentage <= 0) {
                percentage = '---'
            } else {
                percentage += '%'
            }
            document.querySelector(inputElementClasses.dashboardPercentage).textContent = percentage; // formatNumber(percentage, percentage < 0 ? 'exp' : 'inc');;
        },
        deleteItem: function(type, id) {
            var elementToDelete = document.getElementById(id);
            elementToDelete.parentNode.removeChild(elementToDelete);
        },
        render: function(itemObj, type) {
            var htmlTemplate, html, container;

            if (type === 'inc'){
                htmlTemplate = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

                container = document.querySelector(inputElementClasses.incomeContainer);
            } else if (type === 'exp'){
                htmlTemplate = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

                container = document.querySelector(inputElementClasses.expenseContainer);
            }

            html = htmlTemplate.replace('%id%', itemObj.id);
            html = html.replace('%description%', itemObj.description);
            html = html.replace('%value%', formatNumber(itemObj.value, type));

            container.insertAdjacentHTML('beforeend', html);
        }
    } 
})();

// Control
var controller = (function (bgtModel, uiViw) {
    var updateBudget = function(){
        bgtModel.calculateBudget();
        var budget = bgtModel.getBudget();
        
        uiViw.updateDashBoard(budget);

        //TODO: delete this line. 
        console.log(budget); 
    }

    var updateExpensePercentages = function (){
        bgtModel.calculateExpensePercentages();
        var allExpensePercentages = bgtModel.getExpensePercentages();

        uiViw.displayExpensePercentages(allExpensePercentages);

        //TODO: debug lines, remove.
        console.log(allExpensePercentages);
    }

    var addItem = function () {
        var userInput, newItemObj;

        userInput = uiViw.getInputObj();
        if (userInput.description === '' || isNaN(userInput.value) || userInput.value <= 0) {
            return;
        }
        newItemObj = bgtModel.addItem(userInput.type, userInput.description, userInput.value);

        uiViw.render(newItemObj, userInput.type);
        uiViw.clearFields();

        updateBudget();
        updateExpensePercentages();
    }
    
    var setupEventListeners = function(){
        var domStr = uiViw.getInputElementClasses();
        
        document.querySelector(domStr.inputButton).addEventListener('click', addItem);
    
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        });

        document.querySelector(domStr.container).addEventListener('click', deleteItem)
    }

    var deleteItem = function (event) {
        var itemID, type, id;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;        
        if (!itemID) {
            return;
        }

        type = itemID.split('-')[0];
        id = parseInt(itemID.split('-')[1]);

        bgtModel.deleteItem(type, id);
        uiViw.deleteItem(type, itemID);

        //TODO: delete debugging line
        console.log(itemID);
        console.log(type + ' ' + id);

        updateBudget();
    }

    return {
        init: function(){
            //TODO: delete debugging line
            console.log('Application started');

            uiViw.displayDate();
            setupEventListeners();
            updateBudget();
        }
    };
})(budgetModel, UIView);


controller.init();