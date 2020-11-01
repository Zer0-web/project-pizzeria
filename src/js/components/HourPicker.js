/* global rangeSlider */

import {settings, select} from '../settings.js';
import utils from '../utils.js';
import BaseWidget from './BaseWidget.js';

class HourPicker extends BaseWidget{
  constructor(wrapper) {
    super(wrapper, settings.hours.open);

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);

    thisWidget.initPlugin();
    thisWidget.dom.output.innerHTML = thisWidget.value;
    
  }
  initPlugin(){
    const thisWidget = this;
        
    thisWidget.dom.input.addEventListener('input', function(){
      thisWidget.value = thisWidget.dom.input.value;
    });
    rangeSlider.create(thisWidget.dom.input);
  }
  parseValue(value){
    const numberToHour = utils.numberToHour(value);
    return numberToHour;
  }
  isValid(){
    return true;
  }
  renderValue(){
    const thisWidget = this;

    thisWidget.dom.output.innerHTML = thisWidget.value;
  }
}

export default HourPicker;