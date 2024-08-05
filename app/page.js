'use client'
import Image from "next/image"
import { useState, useEffect } from "react"
import { firestore } from "@/firebase"
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material"
import { collection, deleteDoc, getDoc, getDocs, query, setDoc, doc } from "firebase/firestore"

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState('')
  const [newQuantity, setNewQuantity] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      })
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const addItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { counts } = docSnap.data()
      await setDoc(docRef, { counts: counts + quantity })
    } else {
      await setDoc(docRef, { counts: quantity })
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { counts } = docSnap.data()
      if (counts === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { counts: counts - 1 })
      }
    }

    await updateInventory()
  }

  const handleQuantityChange = (name, value) => {
    if (/^\d*$/.test(value)) {
      setNewQuantity(prev => ({ ...prev, [name]: value }))
    }
  }

  const updateItemQuantity = async (name) => {
    const newQty = parseInt(newQuantity[name], 10)
    if (isNaN(newQty) || newQty < 0) return

    const docRef = doc(collection(firestore, 'inventory'), name)
    if (newQty === 0) {
      await deleteDoc(docRef)
    } else {
      await setDoc(docRef, { counts: newQty })
    }

    setNewQuantity(prev => ({ ...prev, [name]: '' }))
    await updateInventory()
  }

  const handleKeyPress = (event, name) => {
    if (event.key === 'Enter') {
      updateItemQuantity(name)
    }
  }

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <TextField
        variant="outlined"
        placeholder="Search items"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: 2, width: '400px' }}
      />
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width={400}
          bgcolor="gray"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="column" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
            />
            <Button
              onClick={() => {
                const quantity = parseInt(itemQuantity, 10)
                if (!isNaN(quantity) && quantity > 0) {
                  addItem(itemName, quantity)
                  setItemName('')
                  setItemQuantity('')
                  handleClose()
                } else {
                  alert('Please enter a valid quantity')
                }
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="outlined" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border="3px solid black">
        <Box
          width="800px"
          height="100px"
          bgcolor="#2ab8ab"
          display="Flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          borderBottom="1px solid black"
        >
          <Typography variant="h2" color="#ccc">
            Inventory
          </Typography>
        </Box>

        <Stack
          width="800px"
          height="500px"
          spacing={2}
          overflow="auto"
        >
          {filteredInventory.map(({ name, counts }) => (
            <Box
              key={name}
              width="100%"
              minHeight="100px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={1}
              border="1px solid #ccc"
            >
              <Box display="flex" flexDirection="column">
                <Typography variant="h5" color="#333" textAlign="left">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="body2" color="#666" textAlign="left" sx={{ fontSize: '0.8rem' }}>
                  Quantity: {counts}
                </Typography>
              </Box>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(name, 1)
                  }}
                  sx={{
                    color: "white",
                    borderColor: "darkgray",
                    minWidth: '30px',
                    minHeight: '30px',
                    '&:hover': {
                      borderColor: "#010114",
                      backgroundColor: "aquamarine",
                      color: "black",
                    },
                  }}
                >
                  +
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => removeItem(name)}
                  sx={{
                    color: "white",
                    borderColor: "darkgray",
                    minWidth: '30px',
                    minHeight: '30px',
                    '&:hover': {
                      borderColor: "#010114",
                      backgroundColor: "aquamarine",
                      color: "black",
                    },
                  }}
                >
                  -
                </Button>
                <TextField
                  variant="outlined"
                  size="small"
                  value={newQuantity[name] || ''}
                  onChange={(e) => handleQuantityChange(name, e.target.value)}
                  onBlur={() => updateItemQuantity(name)}
                  onKeyPress={(e) => handleKeyPress(e, name)}
                  sx={{ width: '60px' }}
                />
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}