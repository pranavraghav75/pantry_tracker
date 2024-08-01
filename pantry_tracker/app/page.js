'use client'
import Image from "next/image";
import {useState, useEffect} from'react';
import {firestore} from '@/firebase'
import {Box, Modal, Typography, Stack, TextField, Button, ToggleButtonGroup, ToggleButton} from '@mui/material'
import {collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [amountChange, setAmountChange] = useState(false);
  const [increment, setIncrement] = useState(false);
  // const [decrement, setDecrement] = useState(false);
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState(0);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }

  const addItem = async (item, count, modifying) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + count})
    } else if (!modifying) {
      await setDoc(docRef, {quantity: count})
    } else {
      alert("Please add item before making any modifications");
    }

    await updateInventory()
  }

  const removeItem = async (item, count, modifying) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      if(count >= quantity) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity - count})
      }
    } else {
      alert("Please add item before making any modifications");
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const allowAmountChange = () => setAmountChange(true)
  const denyAmountChange = () => setAmountChange(false)

  const handleIncrement = (event, bool) => {
    setIncrement(bool);
  }

  // const allowDecrement = () => setDecrement(true)
  // const denyDecrement = () => setDecrement(false)

  return (
    <Box 
      width = "100vw" 
      height = "100vh" 
      display = "flex" 
      flexDirection="column"
      justifyContent = "center" 
      alignItems = "center"
      gap = {2}
    >
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          position="absolute"
          top = "50%"
          left = "50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShaow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%,-50%)',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width = "100%" direction = "row" spacing = {2}>
            <TextField
              fullWidth
              value={itemName}
              onChange={(e) => {
                let change = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
                setItemName(change)
              }}
            />
            
            <Button 
              variant = "outlined"
              onClick={() => {
                addItem(itemName, 1, false)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={amountChange}
        onClose={denyAmountChange}
        >
          <Box
            position="absolute"
            top = "50%"
            left = "50%"
            width={400}
            bgcolor="white"
            border="2px solid #000"
            boxShaow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: 'translate(-50%,-50%)',
            }}
          >
            <Typography variant="h6">Item Name:</Typography>

            <Stack width = "100%" direction = "row" spacing = {2}>

              <TextField
                fullWidth
                value={itemName}
                onChange={(e) => {
                  let change = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
                  setItemName(change)
                }}
              />
            </Stack>

            <ToggleButtonGroup
              value={increment}
              exclusive
              onChange={handleIncrement}
              color="primary"
            >
              <ToggleButton value={true}>
                Add to Count
              </ToggleButton>
              <ToggleButton value={false}>
                Remove from Count
              </ToggleButton>
            </ToggleButtonGroup>

            <Typography variant="h6">Amount to be changed:</Typography>

            <Stack width = "100%" direction = "row" spacing = {2}>
              <TextField
                fullWidth
                value={amount}
                onChange={(e) => {
                  setAmount((e.target.value))
                }}
              />

              <Button 
                variant = "outlined"
                onClick={() => {
                  if(increment) {
                    addItem(itemName, parseInt(amount), true)
                    setAmount(0)
                    setIncrement(false)
                  } else {
                    removeItem(itemName, parseInt(amount), true)
                    setAmount(0)
                  }
                  denyAmountChange()
                }}
              >
                Enter
              </Button>
            </Stack>
          </Box>
        </Modal>

      <Button variant = "contained" onClick = {() => {
        handleOpen()
      }}>
        Add New Item
      </Button>

      <Button variant = "contained" onClick = {() => {
        allowAmountChange()
      }}>
        Modify Item Quantity
      </Button>

      <Box border="solid #333">
        <Box
          width="800px"
          height = "100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" bgcolor="#ADD8E6">Inventory Items</Typography>
        </Box>
        <Stack width = "800px" height = "fit-content" maxHeight = "300px" spacing={1} overflow="auto">
          {inventory.map(({name, quantity}) => (
            <Box 
              key={name} 
              width="100%" 
              minHeight="125px" 
              display="flex"
              alignItems = "center" 
              justifyContent="space-between"
              bgColor='#f0f0f0'
              padding={5}
              borderBottom="solid"
              borderTop="solid"

            >
              <Typography 
                variant = 'h3' 
                color = '#333' 
                textAlign="center"
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Typography 
                variant = 'h3' 
                color = '#333' 
                textAlign="center"
              >
                {quantity}
              </Typography>
              <Stack direction = "row" spacing={2}>
                <Button 
                  variant = "contained" 
                  onClick={() => {
                    addItem(name, 1, false)
                  }}
                >
                  Add
                </Button>

                <Button 
                  variant = "contained" 
                  onClick={() => {
                    removeItem(name, 1, false)
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>



      {/* <Typography variant = 'h1'>Inventory Management</Typography> */}
      
    </Box>
  )
}
