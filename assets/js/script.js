const uploadExcursions = function(e) {
    const uploadedFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(readerEvent) {
        const uploadedCsv = readerEvent.target.result;
        addExcursions(uploadedCsv);
    }
    reader.readAsText(uploadedFile, 'UTF-8');
}

const addExcursions = function (csvFile) {
    const splitedCsvByRow = splitTxtByRow(csvFile);
    splitedCsvByRow.forEach(function(splitedCsvByRow) {
        const splitedCsvByEl = splitTxtByEl(splitedCsvByRow);
        const newExcursion = createExcursionEl(splitedCsvByEl[2], splitedCsvByEl[3], splitedCsvByEl[4], splitedCsvByEl[5]);
        addNewExcursionEl(newExcursion);
    });
}

const splitTxtByRow = function(txt) {
    const splitedTxt = txt.split(/[\r\n]+/gm);
    return splitedTxt;
}

const splitTxtByEl = function(txt) {
    const splitedTxt = txt.split(/"?,?"/ig);
    return splitedTxt;
}

const createExcursionEl = function(title, description, adultPrice, childPrice) {
    const prototypeExcursionEl = document.querySelector('.excursions__item--prototype');
    const ExcursionEl = prototypeExcursionEl.cloneNode(true);
    ExcursionEl.classList.remove('excursions__item--prototype');
    const ExcursionElTitle = ExcursionEl.querySelector('.excursions__title');
    ExcursionElTitle.innerText = title;
    const ExcursionElDescription = ExcursionEl.querySelector('.excursions__description');
    ExcursionElDescription.innerText = description;
    const ExcursionElAdultInput = ExcursionEl.querySelector('[name="adults"]');
    const ExcursionElAdultPrice = ExcursionElAdultInput.previousElementSibling;
    ExcursionElAdultPrice.innerText = adultPrice;
    const ExcursionElChildInput = ExcursionEl.querySelector('[name="children"]');
    const ExcursionElChildPrice = ExcursionElChildInput.previousElementSibling;
    ExcursionElChildPrice.innerText = childPrice;

    return ExcursionEl;
}

const addNewExcursionEl = function(excursion) {
    const panelEl = document.querySelector('.panel__excursions');
    panelEl.appendChild(excursion);
}

const updateBasket = function(e) {
    if(e.target.className.includes('excursions__field-input--submit')) {
        e.preventDefault();
        const basketObj = createExcursionBasketObj(e.target);

        if(basketObj) {
            basketArr.push(basketObj);
            basketArr.forEach(function(el) {
                creeatBasketEl(el);
            })
        }
    }
}

const createExcursionBasketObj = function(el) {
    const excursion = el.parentElement.parentElement.parentElement;
    const excursionTitleEl = excursion.querySelector('.excursions__title');
    const excursionPriceElList = excursion.querySelectorAll('.excursions__price');
    const excursionAdultInptuEl = excursion.querySelectorAll('.excursions__field-input');
    const errorField = excursion.querySelector('.error__field');
    errorField.innerHTML = '';
    const inputPattern = /^[1-9]{1}[0-9]?$/;
    
    if((inputPattern.test(excursionAdultInptuEl[0].value) && inputPattern.test(excursionAdultInptuEl[1].value)) || (inputPattern.test(excursionAdultInptuEl[0].value) && !excursionAdultInptuEl[1].value) || 
    (inputPattern.test(excursionAdultInptuEl[1].value) && !excursionAdultInptuEl[0].value)) {
        const basketObj = {
            title: excursionTitleEl.innerText,
            adultPrice: excursionPriceElList[0].innerText,
            adultAmount: excursionAdultInptuEl[0].value,
            childPrice: excursionPriceElList[1].innerText,
            childAmount: excursionAdultInptuEl[1].value,
        }
        
        const panel = document.querySelector('.panel__order');
        panel.classList.add('panel__order--active');

        clearInputs(excursionAdultInptuEl);
        changeBorderColor(excursionAdultInptuEl[0], 'none')
        changeBorderColor(excursionAdultInptuEl[1], 'none')
       
        return basketObj

    } else if ((excursionAdultInptuEl[0].value && !inputPattern.test(excursionAdultInptuEl[0].value ) && (excursionAdultInptuEl[1].value && !inputPattern.test(excursionAdultInptuEl[1].value)))) {
        changeBorderColor(excursionAdultInptuEl[0], 'solid rgb(229 15 15)');
        changeBorderColor(excursionAdultInptuEl[1], 'solid rgb(229 15 15)');
        addErrorField(errorField, 'Provide the correct value (1-99)');
        
    } else if (excursionAdultInptuEl[0].value && !inputPattern.test(excursionAdultInptuEl[0].value)) {
        changeBorderColor(excursionAdultInptuEl[0], 'solid rgb(229 15 15)');
        changeBorderColor(excursionAdultInptuEl[1], 'none')
        addErrorField(errorField, 'Provide the correct value (1-99)');

    } else if (excursionAdultInptuEl[1].value && !inputPattern.test(excursionAdultInptuEl[1].value)){
        changeBorderColor(excursionAdultInptuEl[1], 'solid rgb(229 15 15)')
        changeBorderColor(excursionAdultInptuEl[0], 'none')
        addErrorField(errorField, 'Provide the correct value (1-99)');
    }
}


const changeBorderColor = function(el, value) {
    el.style.border = value;
}

const clearInputs = function(inputList) {
    inputList[0].value = "";
    inputList[1].value = "";
}

const calculateExcursionPrice = function (amount, price) {
    const sum = amount * price;
    return sum;
}

const countTotal = function (elList) {
    let sum = 0;
    elList.forEach(function(el) {
        if(el.innerText) {
            sum += parseInt(el.innerText);
        }
    })
    return sum;
}

const createBasketListElAdult = function(el) {
    const basketElAdult = document.createElement('li');
    basketElAdult.classList.add('adultPrice');
    basketElAdult.innerText = 'dorosli: ' + el.adultAmount + ' x ' + el.adultPrice + ' PLN';

    return basketElAdult;
}

const createBasketListElChild = function(el) {
    const basketElchild = document.createElement('li');
        basketElchild.classList.add('childPrice');
        basketElchild.innerText = 'dzieci: ' + el.childAmount + ' x ' + el.childPrice + ' PLN';

    return basketElchild;
}

const creeatBasketEl = function(el) {
    const summaryItemPrototype = document.querySelector('.summary__item--prototype'); 
    const newSummaryItem = summaryItemPrototype.cloneNode(true); 
    newSummaryItem.classList.remove('summary__item--prototype');
    const newSummaryElTitle = newSummaryItem.querySelector('.summary__name');
    newSummaryElTitle.innerText = el.title;
    const newSumaryItemPrices = newSummaryItem.querySelector('.summary__prices');

    if(el.adultAmount && el.adultAmount) {
        const basketElAdult = createBasketListElAdult(el);
        newSumaryItemPrices.appendChild(basketElAdult);
    }

    if(el.childAmount && el.childAmount) {
        const basketElChild = createBasketListElChild(el);
        newSumaryItemPrices.appendChild(basketElChild);
    }

    const adultTotalPrice = calculateExcursionPrice(el.adultAmount, el.adultPrice ); 
    const childTotalPrice = calculateExcursionPrice(el.childAmount, el.childPrice );
    const summaryTotalPrice = newSummaryItem.querySelector('.summary__total-price');
    summaryTotalPrice.innerText = adultTotalPrice + childTotalPrice + ' PLN';
    const summaryPanel = document.querySelector('.summary');
    summaryPanel.appendChild(newSummaryItem);
    updateTotalPrice();
    basketArr = [];
}

function removeSummaryItem(e) {
    let summaryItemParent = panelForm.querySelector('.panel__summary')
    summaryItemParent = panelForm.querySelector('.panel__summary');

    if(e.target.className === 'summary__btn-remove') {
        e.preventDefault();
        summaryItemParent.removeChild(e.target.parentElement.parentElement);
        updateTotalPrice();
        
        if(summaryItemParent.lastElementChild.className.includes('summary__item--prototype')){
            clearPanelErrors();
            changePanelOrderVisibility();
        }
    }
}

const changePanelOrderVisibility = function() {
    const panel = document.querySelector('.panel__order');
    panel.classList.toggle('panel__order--active');
}

const submitValidation = function(e) {
    if(e.target.value === 'zamawiam') {
        e.preventDefault();
        const panel = document.querySelector('.panel__order');
        clearPanelErrors();
        const errorField = document.querySelector('.error__field-panel');
        
        const namePattern = /^[a-z]{2,}\s{1}[a-z]{2,}$/i;
        const emailPattern = /^\w{1}[\w_-]*\w{1}[\w_-]*\w{1}@{1}\w{1}[\w_-]*\w{1}\.{1}\w+$/i;
        

        if(!namePattern.test(panel.elements.name.value)) {
            addErrorField(errorField, 'Provide the correct name');
        }

        if(!emailPattern.test(panel.elements.email.value)) {
            addErrorField(errorField, 'Provide the correct email');
        }

        if(namePattern.test(panel.elements.name.value) && emailPattern.test(panel.elements.email.value)) {
            clearPanelErrors();
            const excursionsTotalPricesValueEl = document.querySelector('.order__total-price-value');
            const providedEmail = document.querySelector('[name="email"]');

            alert('Dziękujemy za złożenie zamówienia o wartości '+ excursionsTotalPricesValueEl.innerText + '. Szczegóły zamówienia zostały wysłane na adres e-mail: '+ providedEmail.value + '.');

            const summaryItemParent = panelForm.querySelector('.panel__summary');
            while(!summaryItemParent.lastElementChild.className.includes('summary__item--prototype')) {
                summaryItemParent.removeChild(summaryItemParent.lastElementChild);
            }
 
            updateTotalPrice();
            const inputsList = panel.querySelectorAll('.order__field-input');
            clearInputs(inputsList);
            changePanelOrderVisibility()
            const excursionPanel = document.querySelector('.panel__excursions');
            while(!excursionPanel.lastElementChild.className.includes('excursions__item--prototype')) {
                excursionPanel.removeChild(excursionPanel.lastElementChild);
            }

            const uploadButton = document.querySelector('.uploader__input');
            uploadButton.value=null; 
        }
    }
}

const clearPanelErrors = function() {
    const errorField = document.querySelector('.error__field-panel');
    errorField.innerHTML = '';
}

const addErrorField = function(parrent, innerText) {
    const nameError = document.createElement('p');
    nameError.innerText = innerText;
    nameError.classList.add('wrong_value_text');
    parrent.appendChild(nameError);
}

const updateTotalPrice = function() {
    const excursionsTotalPrices = document.querySelectorAll('.summary__total-price');
    const total = countTotal(excursionsTotalPrices);
    const elementTotal = document.querySelector('.order__total-price-value');
    elementTotal.innerText = total + ' PLN';
}

const uploadButton = document.querySelector('.uploader__input');
uploadButton.addEventListener('change', uploadExcursions);

const panelForm = document.querySelector('.panel__form'); 
panelForm.addEventListener('click', removeSummaryItem, true);
panelForm.addEventListener('click', submitValidation, true);

const excursionsList = document.querySelector('.excursions');
excursionsList.addEventListener('click', updateBasket, true);
let basketArr = [];