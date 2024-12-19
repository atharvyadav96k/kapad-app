import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { storeIdInFile, readIdFromFile } from '../app/filehandel';
// import {BASE_URL} from '../app/env/env'
const NameSearchDropdown = () => {
  const productionCode = false;
  const domain = productionCode ? 'https://application.anandkumarbharatkumar.shop' : 'https://kapad.developeraadesh.cfd';
  const [names, setNames] = useState([]); // Default value is an empty array
  const [userId, setId] = useState(); // User ID selected from dropdown
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNames, setFilteredNames] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [chalanNo, setChalanNo] = useState('');
  const [baleNo, setBaleNo] = useState('');

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length === 0) {
      setFilteredNames(names);
    } else if (names && names.length > 0) { // Check if names is defined and has items
      const filtered = names.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredNames(filtered);
    }
    setDropdownVisible(true);
  };
  const getBaleNo = async ()=>{
    try{
      const response = await axios.get(`${domain}/getBaleNo`);
      setBaleNo(response.data.data.count.toString());
    }catch(err){
      console.log(err);
    }
  }
  const getChalanNo = async ()=>{
    try{
      const response = await axios.get(`${domain}/getChalanNo`);
      setChalanNo(response.data.data.count.toString());
    }catch(err){
      console.log(err);
    }
  }
  const handleFocus = () => {
    setFilteredNames(names);
    setDropdownVisible(true);
  };

  const handleSelectItem = (name, id) => {
    setSearchQuery(name);
    setId(id); // Set selected user ID
    setDropdownVisible(false);
    Keyboard.dismiss();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${domain}/party/get`);
        setNames(response.data || []); // Ensure the fetched data matches the expected structure, default to empty array
        setFilteredNames(response.data || []); // Also set filteredNames to default to empty array
      } catch (error) {
        console.log('Error fetching data:', error.data.message);
      }
    };
    fetchData();
    getChalanNo();
    getBaleNo();
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const addItem = async () => {
    if (baleNo) {
      try {
        console.log(userId, searchQuery, chalanNo, baleNo, date)
        const response = await axios.post(`${domain}/bill/bills`, {
          id: userId,
          partyName: searchQuery,
          chalanNo,
          baleNo,
          date,
        });
        console.log(response.data.savedBill);
        await storeIdInFile(response.data.savedBill._id);
        Alert.alert('Success', 'Chalan created successfully!');
        router.replace('/tabs');
      } catch (error) {
        console.log('Error creating chalan:', error);
        Alert.alert('Error', 'Failed to create chalan.');
      }
    } else {
      Alert.alert("Incomplete", "Please select a name and enter all details.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 20, backgroundColor: '#fff', height: '100%' }}>
      <Text style={{ padding: 10 }}>Parti Name</Text>
      <View style={{ paddingHorizontal: 16 }}>
        <TextInput
          style={{
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            paddingLeft: 10,
            marginBottom: 20,
          }}
          placeholder="Search for a name"
          value={searchQuery}
          onChangeText={handleSearch}
          onFocus={handleFocus}
        />
      </View>

      {dropdownVisible && (
        <View style={{ marginHorizontal: 16, maxHeight: 200, borderColor: '#ccc', borderWidth: 1, borderRadius: 8 }}>
          <FlatList
            data={filteredNames}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ padding: 7, borderBottomColor: '#ccc', borderBottomWidth: 1 }}
                onPress={() => handleSelectItem(item.name, item._id)}
              >
                <Text style={{ fontSize: 18 }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <Text style={{ paddingBottom: 7, paddingLeft: 10 }}>Chalan No: </Text>
      <View style={{ paddingHorizontal: 16, flexDirection: 'row' }}>
        <TextInput
          style={{
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            paddingLeft: 10,
            marginBottom: 20,
            flex: 1
          }}
          placeholder="Enter chalan No: "
          keyboardType='numeric'
          value={chalanNo}
          onChangeText={setChalanNo}
        />
        <TouchableOpacity
          onPress={getChalanNo}
          style={{
            padding: 4,
            height: 40,
            backgroundColor: '#1EAF64',
            justifyContent: 'center', alignItems: 'center',
            borderRadius: 5,
            marginLeft: 4
          }}>
          <Icon name="replay" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={{ paddingBottom: 7, paddingLeft: 10 }}>Bale No: </Text>
      <View style={{ paddingHorizontal: 16 }}>
        <TextInput
          style={{
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            paddingLeft: 10,
            marginBottom: 20,
          }}
          placeholder="Bale No: "
          keyboardType='numeric'
          value={baleNo}
          onChangeText={setBaleNo}
        />
      </View>

      <Text style={{ paddingBottom: 7, paddingLeft: 10 }}>Date: </Text>
      <View>
        <TouchableOpacity
          onPress={showDatepicker}
          style={{ maxHeight: 200, height: 40, borderWidth: 1, marginHorizontal: 16, borderColor: '#ccc', borderRadius: 8, justifyContent: 'center', paddingLeft: 5 }}
        >
          <Text>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
      </View>

      <TouchableOpacity
        onPress={addItem}
        style={{ backgroundColor: '#1EAF64', position: 'absolute', padding: 7, borderRadius: 5, top: '100%', left: '100%', transform: [{ translateX: -70 }, { translateY: -10 }] }}
      >
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default NameSearchDropdown;
