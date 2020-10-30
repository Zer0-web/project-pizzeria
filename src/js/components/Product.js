import {select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product{
  constructor(id, data){
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderFrom();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
      

    //console.log('new Product: ', thisProduct);
  }
  renderInMenu(){
    const thisProduct = this;

    /* generate HTML based on template */
    const generatedHTML = templates.menuProduct(thisProduct.data);
    /*create element using utils.crateElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    /*find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);
    /*add element to menu */
    menuContainer.appendChild(thisProduct.element);
  }

  getElements(){
    const thisProduct = this;
    
    thisProduct.accordionTrigger = thisProduct.element.querySelectorAll(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion(){
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */
    const accordions = thisProduct.accordionTrigger; //const accordions = thisProduct.element.querySelectorAll(select.menuProduct.clickable);
    /* START: click event listener to trigger */
    for (let accordion of accordions){
      accordion.addEventListener('click', function(event){
        //console.log('clicked');
        /* prevent default action for event */
        event.preventDefault();

        /* toggle active class on element of thisProduct */
        const addClassActiveToClicked = thisProduct.element.classList.contains(classNames.menuProduct.wrapperActive);
        if (addClassActiveToClicked){
          thisProduct.element.classList.remove('active');
        } else {
          thisProduct.element.classList.add('active');
        }
        /* find all active products */
        const allActiveProducts = document.querySelectorAll(select.all.menuProductsActive);
        /* START LOOP: for each active product */
        for(const product of allActiveProducts){
          /* START: if the active product isn't the element of thisProduct */
          if(product !== thisProduct.element){
            /* remove class active for the active product */
            product.classList.remove(classNames.menuProduct.wrapperActive);
            /* END: if the active product isn't the element of thisProduct */
          }
        }
        /* END LOOP: for each active product */
      });
      /* END: click event listener to trigger */
    }
  }
  

  initOrderFrom(){
    const thisProduct = this;
    //console.log('orderForm: ', thisProduct);
    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });
    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }
    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder(){
    const thisProduct = this;
    //console.log(' processOrder: ', thisProduct);
    /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
    const formData = utils.serializeFormToObject(thisProduct.form);
      
    /* set variable price to equal thisProduct.data.price */
    thisProduct.params = {};
    let price = thisProduct.data.price;
    //console.log('price: ', price);
    /* START LOOP: for each paramId in thisProduct.data.params */
    for(let paramId in thisProduct.data.params){
      const param = thisProduct.data.params[paramId];
      //console.log('param: ',param);
      
      /* save the element in thisProduct.data.params with key paramId as const param */

      /* START LOOP: for each optionId in param.options */
      for(let optionId in param.options){
        const option = param.options[optionId];
        //console.log('option ',option);

        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
        //console.log('optionSelected', optionSelected);

        if(optionSelected && !option.default){
          price += option.price;
        } else if(!optionSelected && option.default){
          price -= option.price;
        }
        const optionImages = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);

        if(optionSelected){

          if(!thisProduct.params[paramId]){
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;
          for(let optionImage of optionImages){
            optionImage.classList.add('active');
          }
        } else {

          for(let optionImage of optionImages){
            optionImage.classList.remove('active');
          }
        }
      }
      //console.log('thisProduct.params', thisProduct.params);
    }
    /* multiply prive by amount */
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    /* set the contents of thisProduct.priceElem to be the value of variable price */
    thisProduct.priceElem.innerHTML = thisProduct.price;

    //console.log(thisProduct.params);
  }
  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }
  addToCart(){
    const thisProduct = this;
      
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail:{
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }
}

export default Product;