// import express and seaplane
const express = require('express');

// create the express app
const app = express();


const { Configuration, Metadata, Locks } = require("seaplane")

// configure the Seaplane API key
const config = new Configuration({ 
    apiKey: "my-super-secret-api-key"  
  })

// create a metadata and locks instance
const metadata = new Metadata(config)
const locks = new Locks(config)

// endpoint to get the current state
app.get('/get_state', async (req, res) => {
  
  // get the current state of the tree lights and convert to boolean
  let current_state = await metadata.get({key: "christmas-tree-lights"})

  // return the current state to the user
  res.send(current_state.value)

});

// endpoint to set the current state
app.get('/set_state', async (req, res) => {

    // try to acquire lock and set the state
    try {
        
        // construct lock name
        const name = { name: "light-switch" }

        // ask to acquire lock for 10 seconds
        const heldLock = await locks.acquire(name, "client-id", 10)

        // get the current state of the tree lights and convert to boolean
        let kv = await metadata.get({key: "christmas-tree-lights"}) 
        let current_state = (kv.value === 'true')

        res.send(!current_state)
        // update the new state 
        await metadata.set({key: "christmas-tree-lights", value: String(!current_state)})

        // release the lock when we are done
        await locks.release(name, heldLock.id)

        // let the user know we successfuly flipped the switch
        res.send(!current_state)

    } catch (error) {

        // return 409 error if lock is alredy held
        if (error.status === 409) {
            res.send("Someone else is already flipping the lightswitch")

        } else {

            // log error to server if not locked already held
            console.log(error)
        }
    }
  });

// start the server
app.listen(3002, () => {
  console.log('API listening on port 3002');
});