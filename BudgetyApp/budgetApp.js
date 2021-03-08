//var budgetController = (function(){
//    
//    var x= 23;
//    
//    var add = function(a){
//        return x + a;
//    }
//    
//    return {
//        publicTest:function(b){
//        return add(b);
//        }
//    }
//    
//})();
//
//
//
//var UIController = (function(){
//    
//    
//    
//})();
//
//
//
//
//
//var controller = (function(budgetCtrl, UICtrl){
//    
//    var z = budgetCtrl.publicTest(5);
//    
//    return {
//        anotherPublic:function(){
//        
//            console.log(z);
//        }
//    }
//    
//})(budgetController, UIController);

//var preLoader = document.getElementById('center_div');
////var main = document.querySelectorAll('.top'+','+'.bottomm');
////var main = document.querySelector('.container');
//
//function loader(){
////    preLoader.style.display='none';
//}
//window.onload = function(){
//    
//}

// BUdget Controller
var budgetController = (function(){
    
//funtion constructor
    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.Percentage = -1;
};
    Expense.prototype.calcPercentage = function(totalIncome){
        
        if(totalIncome > 0){
        this.Percentage =Math.round((this.value / totalIncome) *100);   
        }
        else{
            this.Percentage = -1;
        }
        
    };
    Expense.prototype.getPercentage = function(){
      return this.Percentage;  
    };
    
      var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
};
    
    var calculateTotal = function(type){
      var sum = 0;
        data.allItems[type].forEach(function(curr){
           sum += curr.value;
            data.totals[type] = sum;
        });
    };
    
    var data ={
        allItems :{
         exp : [],
         inc : []
    },
        totals:{
            exp : 0,
            inc : 0
        }, 
         budget: 0,
        percentage: -1
    };
    

    
    return {
        
        addItem : function(type , des, val){
            var newItem, Id;
            // [1,2,3,4,5] next Id = 6
            //[1,2,4,6,8] next Id = 9
            // we want Id = lsatId + 1
//(  Last ID     which is 8 and in upper case which is 5)  + 1 
// create New ID
            if(data.allItems[type].length >0){
Id = data.allItems[type][data.allItems[type].length - 1].id + 1;
                }
            else{
                Id = 0;
            }
            // create newItem based on 'inc' or 'exp'
            if(type === 'exp'){
                newItem = new Expense(Id, des, val);
            } else if( type === 'inc'){
                newItem = new Income(Id, des, val);
            }
          // push it in to data structure   
            data.allItems[type].push(newItem);
            // return the new element
            return newItem;
            
        },
        
        deleteItem : function(type, id){
            var ids, index, ind;
            // id = 6
            //data.allItems[type][id];
            //ids = [1 2 4 6 8]
            //index = 3
         //diff b/w for each and map is map will return the brand new array   
           ids = data.allItems[type].map(function(current){
               return (current.id );
           });
            
           index = ids.indexOf(id);
            
            if(index !==  -1) {
                data.allItems[type].splice(index,1);
            }
            
        },
        
        calculateBudget:function(){
          
            // calculate the total income and expanses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // calculate the budget income - expense
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income that we spent
            if(data.totals.inc > 0){
     data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                }
            
            else{
                data.percentage = -1;
                alert ('Enter Income first ');
            }
            
        },
        
        calculatePercentage: function(){
            /*
            a=10
            b=20
            c=30
            income =100
            a = 10/100 *100 = 10%
            b = 20/100 *100 = 20%
            */
            data.allItems.exp.forEach(function(curr){
                curr.calcPercentage(data.totals.inc);
            });
        },
        
        getPercentages: function(){
            var allPer = data.allItems.exp.map(function(curr){
               return curr.getPercentage(); 
            });   
            return allPer;
        },
        
        
        
         getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                per: data.percentage
            };
        },
      
        testing : function(){
            console.log(data);
        },
       
    };
    
})();


// UI Controller
var UIController = (function(){
    
    var DOMstrings ={
        inputType:'.add__type',
        inputtDes:'.add__description',
        inputValue:'.add__value',
        tickBtn:'.add__btn',
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list',
        budgetInput:'.budget__value',
        incomeField:'.budget__income--value',
        exnpenseField:'.budget__expenses--value',
        percen:'.budget__expenses--percentage',
        container:'.container',
        ExpensesPercLabel:'.item__percentage',
        dateLabe: '.budget__title--month'
    };
    
     var formatNumber = function(num, type){
          var numSplit, int, dec,type;
            /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands
            
            2310.4567 -> 2,310.46
            2000 -> 2,000.00
            */
            
            num = Math.abs(num);
            num = num.toFixed(2);// put exactly 2 decimal numbers
            
            numSplit = num.split('.');
            
            int = numSplit[0];
            if(int.length > 3){
  int = int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length); //return 2 from 2310 input 2310 output 2,310
                
            }
            
            dec = numSplit[1];
            
            
            
     return (type ==='exp' ? '-' : '+') +' ' + int +'.'+ dec;
        };
    
    var nodeListForEach = function(list, callback){
                for(var i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
                
            };
    
    return {
        getInput: function(){
            return{
            type:document.querySelector(DOMstrings.inputType).value,
            
             description: document.querySelector(DOMstrings.inputtDes).value,
            
            value:parseFloat( document.querySelector(DOMstrings.inputValue).value)
            };
            
        },
        
        addListItem: function(obj, type){
            var html, newHtml, element;
            // create html strings with placeholder text
           if(type === 'inc'){
               element = DOMstrings.incomeContainer;
               html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>';
           } 
            else if(type === 'exp'){
                element = DOMstrings.expenseContainer;
                html =  '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace the placholder text with some actual data 
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%',formatNumber( obj.value,type));
            
            // Insert the HTML into the DOM
            
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
        },
        
        deleteListItem: function(selectorID){
           
        var el = document.getElementById(selectorID);  el.parentNode.removeChild(el);
        },
        
        clearFields: function(){
            var fields, fieldsArr;
        fields = document.querySelectorAll(DOMstrings.inputtDes +',' + DOMstrings.inputValue);
        fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });
            fieldsArr[0].focus();
    },
        displayBudget: function(obj){
           var type;
           obj.budget > 0 ? type ='inc': type ='exp';
            document.querySelector(DOMstrings.budgetInput).textContent=formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeField).textContent=formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.exnpenseField).textContent=formatNumber(obj.totalExp,'exp');
 document.querySelector(DOMstrings.percen).textContent=obj.per;
            
            if(obj.per > 0){
    document.querySelector(DOMstrings.percen).textContent=obj.per +'%';  
            }
            else{
                document.querySelector(DOMstrings.percen).textContent='---';
            }
        },
        
        displayPercentages: function(percentage){
          
            var fields = document.querySelectorAll(DOMstrings.ExpensesPercLabel);
             
                
                nodeListForEach(fields, function(current, index){
                   
                    // do stuff
                    if(percentage[index] > 0){
                    current.textContent = percentage[index] + '%';
                    }
                    else{
                       current.textContent = '---';
                    }
                    
                });
            
        },
        
        displayMonth: function(){
            var now, year,month,months;
            now = new Date();
            // var christmas = new Data(2016, 11, 25);
           months =['January','February','March','April','May','June','July','Agust','September','October','November','December'];
           // months stored in array thats why we crateed this array to show tha value behind that index bc getmonth() return current month index.
            month = now.getMonth();
            
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabe).textContent = months[month]+' '+year;
            
        },
        
        changeType: function(){
            
            var fields = document.querySelectorAll(
            DOMstrings.inputType +',' +
            DOMstrings.inputtDes +',' +
            DOMstrings.inputValue);
            
            nodeListForEach(fields, function(curr){
               
                curr.classList.toggle('red-focus');
            });
            
document.querySelector(DOMstrings.tickBtn).classList.toggle('red');
        },
        
        getDOMstring: function(){
            return DOMstrings;
        }
    };
    
})();




// Global APP Controller
var controller = (function(budgetCtrl, UICtrl){
    
   var setUpEventListener = function(){
       
       var DOM = UICtrl.getDOMstring();
       
 document.querySelector(DOM.tickBtn).addEventListener('click',ctrlAddItem);
    
    
    document.addEventListener('keypress',function(event){
        if(event.keyCode=== 13){
            ctrlAddItem();
        }
        
    });
       
       document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
       
       document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changeType);
        
   };
    
    
    var updateBudget = function(){
        //1. calculate the budget 
        
        budgetCtrl.calculateBudget();
        //2. Return the budget
        var budget = budgetCtrl.getBudget();
        
        //3. Display the budet on the UI
        UICtrl.displayBudget(budget);
    };
    
    var updatePercentages = function(){
      
        //1. calculate percentages
        budgetCtrl.calculatePercentage();
        
        //2. Read percentages from budget controller
        var percentages = budgetCtrl.getPercentages();
        
        //3. Update the UI with new percentages
       UICtrl.displayPercentages(percentages);
        console.log(percentages);
        
    };
    
    
    var ctrlAddItem = function(){
        var input, newItem;
        
        //1. Get the filled input data 
        
        input = UICtrl.getInput();
        
        if(input.description !=="" && !isNaN(input.value) && input.value > 0){
     //2. Add the item to the budget controller
        
newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        //3. Add the item to the user interface UI
        UICtrl.addListItem(newItem, input.type);
        
        //4. Clear the fields
        UICtrl.clearFields();
        
        
        //5. Calculate and update budget
        updateBudget();
            
        //6. calculate and update percentages
            updatePercentages();
        }
          
        
    };
    
    var ctrlDeleteItem = function(event){
      var itemId, splitId, type, Id;
//       console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
       itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemId){
            
            //inc-1
            splitId = itemId.split('-');
            type =splitId[0];
            Id = parseInt(splitId[1]);
            
        //1. Delete the item from the data structure
           budgetCtrl.deleteItem(type, Id);
            
        //2. Delete the item from the user interface
            UICtrl.deleteListItem(itemId);
            
        //3.update and show the new budget
            updateBudget();
            
            //4. calculate and update percentages
            updatePercentages();
        
        }
        
    };
    
     
    return {
        init: function(){
            UICtrl.displayMonth();
            console.log('Application has started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc:0,
                totalExp: 0,
                per: -1
            });
            setUpEventListener();
        }
        
    };
    
    
})(budgetController, UIController);



controller.init();






























