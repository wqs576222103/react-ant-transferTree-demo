import React from "react";
import "./App.css";

import { useState, useEffect } from "react";

import TreeTransfer from "./TreeTransfer";
const generateKeys = () => {
  const keys = []
  for(let i = 0; i < 10000; i++) {
    keys.push(`aa.bbb.ccc.eee_FFFF_p${i}`)
    keys.push(`aa.bbb.ccc.eee_FF2F_p${i}`)
    keys.push(`aa.44.ccc.e3e_FFFF_p${i}`)
    keys.push(`aa.44.ccc.e2e__p${i}`)
    keys.push(`aa.44.ccc.e1e_FFFF_p${i}`)
  }
  return keys
}

function App() {
  const [targetKeys, setTargetKeys] = useState([]);
  const [allKeys, setAllKeys] = useState([]);

  useEffect(() => {
    setAllKeys(generateKeys())
  }, [])
  const onChange = (keys) => {
    setTargetKeys(keys);
  };
  
  return (
    <div>
      <TreeTransfer
        allKeys={allKeys}
        targetKeys={targetKeys}
        onChange={onChange}
      />
    </div>
  );
}

export default App;
