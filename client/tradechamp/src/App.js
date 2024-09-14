import logo from './logo.svg';
import './App.css';
import {useEffect} from 'react';

function App() {

  // testing api request -> REMOVE WHEN READY FOR DEVELOPMENT

  useEffect(()=>{
    async function test(){
      try {
        const response = await fetch('http://localhost:1738/test');
        if(response.ok){
          console.log(await response.text())
        }else{
          console.log("RESPONSE WAS NOT OK")
        }
      } catch (error) {
        console.log("AN ERROR OCCURED -> ", error)
      }
    }
    test()
  }, )



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
