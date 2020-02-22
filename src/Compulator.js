import React, {useState} from 'react';
import './reset.css';
import './compulator.css';

function Button(props) {
  let myid = (props.value === '.') ? 'btndot': props.myid; 
  let btnstyle = {gridArea: myid}
  return(
    <button onClick={() => {props.clickHandler(props.value)}} id={myid} style={btnstyle}>{props.value}</button>
  )
}

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

function Screen(props){
  return(
    <div id='screen'>
      {props.value || 0}
    </div>
  )
}

function Compulator() {
  let nums = Array.from({length: 10}, (v, i) => i);
  nums.push('.');
  let ops = '=+-*/'.split('');
  ops.push('AC');

  const [screen, setScreen] = useState(0);
  const [memory, setMemory] = useState(0);
  const [op, setOp] = useState('');

  const numClick = (value) => {
    if (op === '' || op === 'AC'){
      let newScreen = `${screen}${value}`.replace(/^0+/, '');
      newScreen = newScreen.startsWith('.') ? "0"+newScreen: newScreen;
      setScreen(newScreen);
    }else{
      setScreen(value);
      setOp('');
    }
  }

  const opClick = (value) => {
    if (value === 'AC'){
        setMemory(0);
        setScreen(0);
    }else if (value ==='='){
        if(op === '' || op === '='){
          
        }
        let result = parseFloat(`${memory} ${op} ${screen}`);
        console.log(`result is ${result}`);
        setMemory(result);
        setScreen(result);
      } else{
        let result = parseFloat(`${memory} ${op} ${screen}`);
        console.log(`result is ${result}`);
        setMemory(result);
      }

    setOp(value);
  }

  return (
    <div id="Compulator">
      <Screen value={screen}/>
      <Buttons clickHandler={numClick} values={nums} type='nums' />
      <Buttons clickHandler={opClick} values={ops} type='ops' />
    </div>
  );
}

export default Compulator;
