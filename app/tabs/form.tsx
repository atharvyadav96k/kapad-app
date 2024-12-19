import React, { useEffect, useState , useRef} from 'react';
import { StyleSheet, View, TextInput, Button, ActivityIndicator, Alert, FlatList, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import { storeIdInFile, readIdFromFile } from '../filehandel';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

export default function FormTab() {
  const textInputRef = useRef(null);
  const [bill, setB] = useState('');
  const productionCode = true;
  const domain = productionCode
    ? 'https://application.anandkumarbharatkumar.shop'
    : 'https://kapad.developeraadesh.cfd';
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [count, setCount] = useState('');
  const [sizesCounts, setSizesCounts] = useState([]); // Array to hold size and count pairs
  const [loading, setLoading] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // For search input
  const [filteredItems, setFilteredItems] = useState([]); // To hold filtered list

  const sendData = async (n, c, s) => {
    const response = await axios.post(
      `${domain}/product/add/${bill}`,
      { name: n, size: s, count: c }
    );
  };
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
          // console.log(response.data);
          setItemList(response.data.items);
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

    if (query.trim() === '') {
      setFilteredItems([]);
    } else {
      const filtered = itemList.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  const selectItem = (itemName) => {
    setName(itemName);
    setSearchQuery(itemName);
    setFilteredItems([]);
  };

  const addSizeCount = () => {
    if (size.trim() === '' || count.trim() === '') {
      Alert.alert('Error', 'Size and Count fields cannot be empty.');
      return;
    }
    setSizesCounts([...sizesCounts, { size, count }]);
    setSize('');
    setCount('');
  };

  const deleteSizeCount = (index) => {
    setSizesCounts(sizesCounts.filter((_, i) => i !== index));
  };

  const renderSizesCounts = (item, index) => {
    console.log(item, index)
    return (
      <View style={styles.sizeCountItem}>
        <Text>Size: {item.size}, Count: {item.count}</Text>
        <Button title="Delete" onPress={() => deleteSizeCount(index)} />
      </View>
    )
  }

  // <FlatList
  //     data={sizesCounts}
  //     keyExtractor={(item, index) => index.toString()}
  //     renderItem={({ item, index }) => (
  //       <View style={styles.sizeCountItem}>
  //         <Text>Size: {item.size}, Count: {item.count}</Text>
  //         <Button title="Delete" onPress={() => deleteSizeCount(index)} />
  //       </View>
  //     )}
  //   />
  return (
    <ScrollView style={[styles.container]}>
      <TextInput
        style={styles.input}
        placeholder="Search Item"
        value={searchQuery}
        onChangeText={handleSearch}
      />

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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Submit" onPress={handleSubmit} />
        )}
        <Button title="Add Size/Count" onPress={addSizeCount} />
      </View>

      <View style={{ marginBottom: 20 }} />
      {
        sizesCounts.map((ele, index)=>{
          return (
            renderSizesCounts(ele, index)
          )
        })
      }
      <View style={{margin: 20}}/>
    </ScrollView>
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
    maxHeight: 150,
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
