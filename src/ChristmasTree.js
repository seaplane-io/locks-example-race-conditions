import React, {useState, useEffect} from 'react';
import christmasTreeOff from './img/christmas-tree-off.png'
import christmasTreeOn from './img/christmas-tree-on.jpg'

const ChristmasTree = () => {

  const handleClick = () => {
    fetch('/set_state', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        setData(data)
      });
  };

  // use state for christmas tree state
  const [data, setData] = useState(null);

  // set the current state of the christmas tree
  useEffect(() => {
    fetch('/get_state')
      .then(response => response.json())
      .then(data => {
        setData(data);
      });
  }, []);

  let tree;

  if(data === true){
    tree = <div><img src={christmasTreeOn}></img></div>
  } else if (data == false) {
    tree = <div><img src={christmasTreeOff}></img></div>
  } else {
    tree = <div>LOADING...</div>
  }

  return <div>
    {tree}

    <button onClick={handleClick}>
      Turn Christmas Lights on/off
    </button>

  </div>
};

export default ChristmasTree;