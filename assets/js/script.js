const uploadButton = document.querySelector('.uploader__input');
uploadButton.addEventListener('change', uploadCsvFile);

const excursionsList = document.querySelector('.excursions');
excursionsList.addEventListener('click', excursionItemInputsValidation, true);

const panelForm = document.querySelector('.panel__form'); 
panelForm.addEventListener('click', removeSummaryItem, true);
panelForm.addEventListener('click', submitDetailsValidation, true);

function uploadCsvFile(e) {
    const uploadedFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(readerEvent) {
        const uploadedCsv = readerEvent.target.result;
        splitCsv(uploadedCsv);
    }
    reader.readAsText(uploadedFile, 'UTF-8');
}

function splitCsv(csvFile) {
    const csvSplitedByRow = splitTxtByRow(csvFile);
    csvSplitedByRow.forEach(function(csvSplitedByRow) {
        const splitedCsvByEl = splitTxtByEl(csvSplitedByRow);
        createExcursionItem(splitedCsvByEl[2], splitedCsvByEl[3], splitedCsvByEl[4], splitedCsvByEl[5]);
    });
}

function splitTxtByRow(txt) {
    const splitedTxt = txt.split(/[\r\n]+/gm);
    return splitedTxt;
}

function splitTxtByEl(txt) {
    const splitedTxt = txt.split(/"?,?"/ig);
    return splitedTxt;
}
      
function createExcursionItem(title, description, adultPrice, childPrice) {
    const prototypeExcursionItem = document.querySelector('.excursions__item--prototype');
    const newExcursionItem = prototypeExcursionItem.cloneNode(true);
    newExcursionItem.classList.remove('excursions__item--prototype');
    const newExcursionItemTitle = newExcursionItem.querySelector('.excursions__title');
    newExcursionItemTitle.innerText = title;
    const newExcursionItemDescription = newExcursionItem.querySelector('.excursions__description');
    newExcursionItemDescription.innerText = description;
    const newExcursionItemAdultInput = newExcursionItem.querySelector('[name="adults"]');
    const newExcursionItemAdultPrice = newExcursionItemAdultInput.previousElementSibling;
    newExcursionItemAdultPrice.innerText = adultPrice;
    const newExcursionItemChildInput = newExcursionItem.querySelector('[name="children"]');
    const newExcursionItemChildPrice = newExcursionItemChildInput.previousElementSibling;
    newExcursionItemChildPrice.innerText = childPrice;

    addNewExcursionItem(newExcursionItem);
}

function addNewExcursionItem(excursionItem) {
    const panelEl = document.querySelector('.panel__excursions');
    panelEl.appendChild(excursionItem);
}

function excursionItemInputsValidation(e) {
    if(e.target.className.includes('excursions__field-input--submit')) {
        e.preventDefault();
        const excursionItem = e.target.parentElement.parentElement.parentElement;
        const excursionItemInputsList = excursionItem.querySelectorAll('.excursions__field-input');
        const excursionItemErrorField = excursionItem.querySelector('.error__field');
        clearExcursionItemErrorField(excursionItemErrorField);
        
        if(bothInputsCorrect(excursionItemInputsList)) {
            removeErrorBorderColor(excursionItemInputsList[0]);
            removeErrorBorderColor(excursionItemInputsList[1]);
            createExcursionObj(excursionItem);
            clearInputs(excursionItemInputsList);
                
        } else if (bothInputsIncorrect(excursionItemInputsList)) {
            addErrorBorderColor(excursionItemInputsList[0]);
            addErrorBorderColor(excursionItemInputsList[1]);
            addErrorField(excursionItemErrorField, 'Provide correct value (1-99)');
            
        } else if (firstInputIncorrect(excursionItemInputsList)) {
            addErrorBorderColor(excursionItemInputsList[0]);
            removeErrorBorderColor(excursionItemInputsList[1]);
            addErrorField(excursionItemErrorField, 'Provide correct value (1-99)');
    
        } else if (secondInputIncorrect(excursionItemInputsList)) {
            addErrorBorderColor(excursionItemInputsList[1]);
            removeErrorBorderColor(excursionItemInputsList[0]);
            addErrorField(excursionItemErrorField, 'Provide correct value (1-99)');
        } 
    }
}

function clearExcursionItemErrorField(errorFieldItem) {
    errorFieldItem.innerHTML = '';
}

const inputPattern = /^[1-9]{1}[0-9]?$/;

function bothInputsCorrect(excursionItemInputsList) {
    if((inputPattern.test(excursionItemInputsList[0].value) && inputPattern.test(excursionItemInputsList[1].value)) || (inputPattern.test(excursionItemInputsList[0].value) && !excursionItemInputsList[1].value) || (inputPattern.test(excursionItemInputsList[1].value) && !excursionItemInputsList[0].value)) {
        return true;
    }
}

function bothInputsIncorrect(excursionItemInputsList) {
    if ((excursionItemInputsList[0].value && !inputPattern.test(excursionItemInputsList[0].value ) && (excursionItemInputsList[1].value && !inputPattern.test(excursionItemInputsList[1].value)))) {
        return true;
    }
}

function firstInputIncorrect(excursionItemInputsList) {
    if (excursionItemInputsList[0].value && !inputPattern.test(excursionItemInputsList[0].value)) {
        return true;
    }
}

function secondInputIncorrect(excursionItemInputsList) {
    if (excursionItemInputsList[1].value && !inputPattern.test(excursionItemInputsList[1].value)) {
        return true;
    }
}

function removeErrorBorderColor(excursionItemInput) {
    excursionItemInput.classList.remove('error_border_color');
}

function addErrorBorderColor(excursionItemInput) {
    excursionItemInput.classList.add('error_border_color');
}

function clearInputs(excursionItemInputsList) {
    excursionItemInputsList[0].value = "";
    excursionItemInputsList[1].value = "";
}

let basketArr = [];

function createExcursionObj(excursionItem) {
        const excursionItemTitle = excursionItem.querySelector('.excursions__title');
        const excursionItemPriceList = excursionItem.querySelectorAll('.excursions__price');
        const excursionItemInputsList = excursionItem.querySelectorAll('.excursions__field-input');
        const excursionObj = {
            title: excursionItemTitle.innerText,
            adultPrice: excursionItemPriceList[0].innerText,
            adultAmount: excursionItemInputsList[0].value,
            childPrice: excursionItemPriceList[1].innerText,
            childAmount: excursionItemInputsList[1].value,
        }
            
        addExcursionObjToBasketArr(excursionObj);
        showOrderPanel();
        createSummaryItems();
}

function addExcursionObjToBasketArr(obj) {
    basketArr.push(obj);
}

function showOrderPanel() {
    const orderPanel = document.querySelector('.panel__order');
    orderPanel.classList.add('panel__order--active');
}

function createSummaryItems() {
    basketArr.forEach(function(excursionObj) {
        createSummaryItem(excursionObj);
    });
}

function createSummaryItem(excursionObj) {
    const summaryItemPrototype = document.querySelector('.summary__item--prototype'); 
    const newSummaryItem = summaryItemPrototype.cloneNode(true); 
    newSummaryItem.classList.remove('summary__item--prototype');
    const newSummaryItemTitle = newSummaryItem.querySelector('.summary__name');
    newSummaryItemTitle.innerText = excursionObj.title;
    const newsummaryItemPrices = newSummaryItem.querySelector('.summary__prices');
    
    if(excursionObj.adultAmount) {
        const summaryItemPriceAdult = createSummaryItemPriceAdult(excursionObj);
        newsummaryItemPrices.appendChild(summaryItemPriceAdult);
    }

    if(excursionObj.childAmount) {
        const summaryItemPriceChild = createSummaryItemPriceChild(excursionObj);
        newsummaryItemPrices.appendChild(summaryItemPriceChild);
    }

    const adultPrice = calculateItemParticipantPrice(excursionObj.adultAmount, excursionObj.adultPrice ); 
    const childPrice = calculateItemParticipantPrice(excursionObj.childAmount, excursionObj.childPrice );

    const summaryItemTotalPrice = newSummaryItem.querySelector('.summary__total-price');
    summaryItemTotalPrice.innerText = adultPrice + childPrice;

    addSummaryItem(newSummaryItem);
}

function createSummaryItemPriceAdult(excursionObj) {
    const summaryItemPriceAdult = document.createElement('li');
    summaryItemPriceAdult.classList.add('adultPrice');
    summaryItemPriceAdult.innerText = 'adults: ' + excursionObj.adultAmount + ' x £' + excursionObj.adultPrice;

    return summaryItemPriceAdult;
}

function createSummaryItemPriceChild(excursionObj) {
    const summaryItemPriceChild = document.createElement('li');
        summaryItemPriceChild.classList.add('childPrice');
        summaryItemPriceChild.innerText = 'children: ' + excursionObj.childAmount + ' x £' + excursionObj.childPrice;

    return summaryItemPriceChild;
}

function calculateItemParticipantPrice(amount, price) {
    const sum = amount * price;
    return sum;
}

function addSummaryItem(summaryItem) {
    const summaryPanel = document.querySelector('.summary');
    summaryPanel.appendChild(summaryItem);

    updateTotalPrice();
    clearBasketArr();
}

function clearBasketArr() {
    basketArr = [];
}

function removeSummaryItem(e) {
    const summaryItemsPanel = panelForm.querySelector('.panel__summary')

    if(e.target.className === 'summary__btn-remove') {
        e.preventDefault();
        summaryItemsPanel.removeChild(e.target.parentElement.parentElement);
        updateTotalPrice();
        
        if(summaryItemsPanel.lastElementChild.className.includes('summary__item--prototype')){
            clearPanelErrors();
            changeSummaryItemsPanelVisibility();
        }
    }
}

function updateTotalPrice() {
    const summaryItemsTotalPrices = document.querySelectorAll('.summary__total-price');
    const orderTotalPrice = countTotal(summaryItemsTotalPrices);
    const orderTotalPriceValue = document.querySelector('.order__total-price-value');
    orderTotalPriceValue.innerText = '£' + orderTotalPrice;
}

function clearPanelErrors() {
    const errorFieldPanel = document.querySelector('.error__field-panel');
    errorFieldPanel.innerHTML = '';
}

function changeSummaryItemsPanelVisibility() {
    const orderPanel = document.querySelector('.panel__order');
    orderPanel.classList.toggle('panel__order--active');
}

function submitDetailsValidation(e) {
    if(e.target.value === 'Buy now') {
        e.preventDefault();
        clearPanelErrors();

        const orderPanel = document.querySelector('.panel__order');
        const errorFieldPanel = document.querySelector('.error__field-panel');
        const namePattern = /^[a-z]{2,}\s{1}[a-z]{2,}$/i;
        const emailPattern = /^\w{1}[\w_-]*\w{1}[\w_-]*\w{1}@{1}\w{1}[\w_-]*\w{1}\.{1}\w+$/i;

        if(!namePattern.test(orderPanel.elements.name.value)) {
            addErrorField(errorFieldPanel, 'Provide correct name');
        }

        if(!emailPattern.test(orderPanel.elements.email.value)) {
            addErrorField(errorFieldPanel, 'Provide correct email');
        }

        if(namePattern.test(orderPanel.elements.name.value) && emailPattern.test(orderPanel.elements.email.value)) {
            const excursionsTotalPricesValueEl = document.querySelector('.order__total-price-value');
            const inputsList = orderPanel.querySelectorAll('.order__field-input');

            alert('Thank you for the order ' + excursionsTotalPricesValueEl.innerText + '.');

            clearInputs(inputsList);
            clearPanelErrors();
            removeSummaryItems();
            updateTotalPrice();
            changeSummaryItemsPanelVisibility()
            removeUploadedFiles();
            removeExcursionsItems()
        }
    }
}

function removeSummaryItems() {
    const summaryItemsPanel = panelForm.querySelector('.panel__summary');
    while(!summaryItemsPanel.lastElementChild.className.includes('summary__item--prototype')) {
        summaryItemsPanel.removeChild(summaryItemsPanel.lastElementChild);
    }
}

function removeUploadedFiles() {
    const uploadButton = document.querySelector('.uploader__input');
    uploadButton.value=null; 
}

function addErrorField(parrent, innerText) {
    const nameError = document.createElement('p');
    nameError.innerText = innerText;
    nameError.classList.add('wrong_value_text');
    parrent.appendChild(nameError);
}

function removeExcursionsItems() {
    const excursionPanel = document.querySelector('.panel__excursions');
    while(!excursionPanel.lastElementChild.className.includes('excursions__item--prototype')) {
        excursionPanel.removeChild(excursionPanel.lastElementChild);
    }
}

function countTotal(summaryItemsTotalPrices) {
    let sum = 0;
    summaryItemsTotalPrices.forEach(function(el) {
        if(el.innerText) {
            sum += parseInt(el.innerText);
        }
    })
    return sum;
}