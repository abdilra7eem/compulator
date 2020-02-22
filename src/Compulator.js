import React, {useState, useEffect} from 'react';
import './reset.css';
import './compulator.css';

  // The 'Button' component is a template for each individual button
function Button(props) {
  let myid = (props.value === '.') ? 'btndot': props.myid; // CSS grids did not accept "btn."
  return(
    <button onClick={() => {props.clickHandler(props.value)}} id={myid} style={{gridArea: myid}}>{props.value}</button>
  )
}

// The 'Buttons' component creates buttons based on the "Button" template an array of elements
function Buttons(props){
  if (props.type==="nums"){
    return(
        props.values.map(x => <Button clickHandler={props.clickHandler} value={x} key={x} myid={`btn${x}`} />)
    )
  } else if(props.type==="ops") {
    return (
      props.values.map((x,i) => <Button clickHandler={props.clickHandler} value={x} key={`op${i}`} myid={`op${i}`} />)
    )
  } else {
    console.trace("ERROR! unknown type")
  }
}

// the Screen component resembles the screen of the calculator
function Screen(props){
  return(
    <div id='screen'>
      {props.value || 0}
    </div>
  )
}



// Compulator is the main calculator component
function Compulator() {

  // Create arrays for the buttons. 'num' represents numbers, and 'ops' represents operations
  let nums = Array.from({length: 10}, (v, i) => i);
  nums.push('.');
  let ops = '=+-*/'.split('');
  ops.push('AC');

  // State variables needed for the calculator
  const [screen, setScreen] = useState(0); // the screen content
  const [memory, setMemory] = useState(0); // the memory contains the previous number
  const [op, setOp] = useState(''); // the previous operator; it's used when the next operator button is pressed

  // Called by the number buttons
  const numClick = (value) => {
    if (op === '' || op === 'AC'){
      if (!(value==='.' && (screen.toString()).includes('.'))){//Avoid multiple decimal separators
        let newScreen = `${screen}${value}`.replace(/^0+/, ''); // Remove leading zeros
        newScreen = newScreen.startsWith('.') ? "0"+newScreen: newScreen; // Adds a leading zero if 'screen' starts with a decimal separator
        setScreen(newScreen);
      }
    }else if (value !== '.'){
      setScreen(value);
    }
  }

  // 'calculate' evaluates the operator and does the calculation
  // parseFloat is used because JS is weakly typed.
  const calculate = ()=>{
    let result = 0;
    switch(op){
      case ('+' || '='):
        result = parseFloat(memory) + parseFloat(screen);
        break;
      case '-':
        result = parseFloat(memory) - parseFloat(screen);
        break;
      case '*':
        result = parseFloat(memory) * parseFloat(screen);
        break;
      case '/':
        result = parseFloat(memory) / parseFloat(screen);
        break;
      default:
        console.trace('Unexpected error occured');
    }

    console.log(`result = ${result}`);
    return(result);
  }

  // Called by operation buttons (+, -, *, /, =, AC)
  const opClick = (value) => {

    console.log('opClick: '+value)

    // 'op' is the previous operator, 'value' is the currently pressed button operator
    if (value === 'AC'){
      // When 'AC' is pressed, both 'memory' and 'screen' are reset.
        setMemory(0);
        setScreen(0);
    }else if(op === '' || op === '=' || op === 'AC'){
      // If there is no previous operator, no calculation will be done
      setMemory( value==='=' ? 0 : screen ) // the memory will be reset when '=' is pressed
    } else{
      // The code to be run if there was a previous operator
      let result = calculate();
      if (isNaN(result)){ // to avoid NaN values (Happens when multiplying infinity by zero)
        result=0;
      }
      setMemory(result);
      setScreen(result);
    }

    setOp(value); // set 'op' to the currently pressed operator button
  }

  // KeyboardEvents: still broken
  function KBNumPad(key){
    useEffect(() => {
      window.addEventListener("keydown", onDown)
      return () => {
          window.removeEventListener("keydown", onDown)
      }
    }, [key])
  
    const onDown = event => {
      console.log(event);
      if((event.key).toString() === 'Enter'){
        // console.log((event.key).toString() + " is Enter")
        opClick('=');
      }

      if((nums.toString()).includes(event.key)){
        // console.log((event.key).toString() + " is a number")
        numClick((event.key).toString());
      }
      
      if((ops.toString()).includes(event.key)){
        // console.log((event.key).toString() + " is an operator")
        opClick((event.key).toString());
      }
    }
  }
  KBNumPad();
  
  return (
    <div id="Compulator">
      <Screen value={screen}/>
      <Buttons clickHandler={numClick} values={nums} type='nums' />
      <Buttons clickHandler={opClick} values={ops} type='ops' />
    </div>
  );
}

export default Compulator;
