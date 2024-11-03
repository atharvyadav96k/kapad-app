import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Button, ActivityIndicator, Alert, FlatList, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';  
import { storeIdInFile, readIdFromFile } from '../filehandel';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '../env/env';

export default function FormTab() {
  const [bill, setB] = useState('');
  const domain = BASE_URL;
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [count, setCount] = useState('');
  const [sizesCounts, setSizesCounts] = useState([]); // Array to hold size and count pairs
  const [loading, setLoading] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // For search input
  const [filteredItems, setFilteredItems] = useState([]); // To hold filtered list

  const sendData =async (n, c, s)=>{
    const response = await axios.post(
      `${domain}/product/add/${bill}`,
      { name: n, size: s, count: c } 
    );
  }
  const handleSubmit = async () => {
    setLoading(true);
    if (!(name.length > 1 && sizesCounts.length > 0)) {
      Alert.alert("All fields are required");
      setLoading(false);
      return;
    }
    try {
      for (const ele of sizesCounts) {
        await sendData(name, ele.count, ele.size); 
      }
      Alert.alert('Success', 'Product added successfully!');
      setName(''); 
      setSize('');
      setCount('');
      setSizesCounts([]); 
      setSearchQuery(""); 
      setLoading(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add product.');
    } finally {
      setLoading(false);
    }
};

  

  useFocusEffect(
    React.useCallback(() => {
      const fetchId = async () => {
        try {
          const id = await readIdFromFile();
          console.log("Stored ID:", id);
          setB(id); 
        } catch (error) {
          console.error("Error reading ID from file:", error);
        }
      };

      const fetchItem = async () => {
        try {
          const response = await axios.get(`${domain}/item/get`);
          console.log(response.data);
          setItemList(response.data.items);
          setFilteredItems(response.data.items); // Initialize filtered items
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      };

      fetchId();
      fetchItem();
    }, [])
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = itemList.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const selectItem = (itemName) => {
    setName(itemName);
    setSearchQuery(itemName); // Show selected item in the search input
    setFilteredItems([]); // Hide dropdown after selection
  };

  const addSizeCount = () => {
    if (size.trim() === '' || count.trim() === '') {
      Alert.alert('Error', 'Size and Count fields cannot be empty.');
      return;
    }
    setSizesCounts([...sizesCounts, { size, count }]); // Add new size/count pair
    setSize(''); // Clear size input
    setCount(''); // Clear count input
  };

  const deleteSizeCount = (index) => {
    // Filter out the item at the specified index
    setSizesCounts(sizesCounts.filter((_, i) => i !== index));
  };

  const renderSizesCounts = () => (
    <FlatList
      data={sizesCounts}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View style={styles.sizeCountItem}>
          <Text>Size: {item.size}, Count: {item.count}</Text>
          <Button title="Delete" onPress={() => deleteSizeCount(index)} />
        </View>
      )}
    />
  );

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.input}
        placeholder="Search Item"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Custom Dropdown List */}
      {filteredItems.length > 0 && (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => selectItem(item.name)}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.dropdown}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Size"
        value={size}
        keyboardType="numeric"
        onChangeText={setSize}
      />
      <TextInput
        style={styles.input}
        placeholder="Count"
        value={count}
        onChangeText={setCount}
        keyboardType="numeric"
      />
      <Button title="Add Size/Count" onPress={addSizeCount} />
      <View style={{marginBottom: 20}}/>
      {/* Display added sizes and counts */}
      {renderSizesCounts()}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Submit" onPress={handleSubmit} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
  },
  dropdown: {
    maxHeight: 150, // Limit dropdown height
    marginBottom: 15,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#f0f0f0',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sizeCountItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between', // Align text and button
    alignItems: 'center', // Center vertically
  },
});
