import Staking from "./Staking";
import Main from "./Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

 
  return (

    <>
    
    
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main />}></Route>
            <Route path="/Claim_Coin" element={<Staking />}></Route>
          </Routes>
    </BrowserRouter>
    
    </>
   
  );
}

export default App;
