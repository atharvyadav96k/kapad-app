import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Keyboard,
  Alert,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { storeIdInFile } from '../filehandel';

export default function EditChalan() {
  const { id } = useLocalSearchParams();
  const productionCode = true;
  const domain = productionCode
    ? 'https://application.anandkumarbharatkumar.shop'
    : 'https://kapad.developeraadesh.cfd';

  const [names, setNames] = useState([]);
  const [userId, setUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNames, setFilteredNames] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [chalanNo, setChalanNo] = useState('');
  const [baleNo, setBaleNo] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${domain}/party/get`);
        const fetchedNames = response.data || [];
        setNames(fetchedNames);
        setFilteredNames(fetchedNames);
      } catch (error) {
        console.error('Error fetching names:', error);
      }
    };

    const getChalanData = async () => {
        try {
            const response = await axios.get(`${domain}/bill/bill-data/${id}`);
            console.log('API Response:', response.data.data); // Log the data
            const chalanData = response.data.data;
            setChalanNo(chalanData.chalanNo); // Set chalanNo
            setUserId(chalanData.partyId)
            setBaleNo(chalanData.baleNo); // Set baleNo
            setDate(new Date(chalanData.date)); // Set date
            handleSelectItem(chalanData.partyName, chalanData.partyId);
        } catch (err) {
            console.error('Error fetching Chalan Data:', err);
        }
    };

    fetchData();
    if (id) getChalanData();
  }, [id]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = names.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredNames(filtered);
    } else {
      setFilteredNames(names);
    }
    setDropdownVisible(true);
  };

  const handleSelectItem = (name, id) => {
    setSearchQuery(name);
    setUserId(id);
    setDropdownVisible(false);
    Keyboard.dismiss();
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const addItem = async () => {
    if (baleNo) {
      try {
        const response = await axios.post(`${domain}/bill/bill-data/${id}`, {
          partyId: userId,
          partyName: searchQuery,
          chalanNo,
          baleNo,
          date,
        });
        Alert.alert('Success', 'Chalan Updated successfully!');
      } catch (error) {
        console.error('Error creating chalan:', error);
        Alert.alert('Error', 'Failed to update chalan.');
      }
    } else {
      Alert.alert('Incomplete', 'Please select a name and enter all details.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Party Name</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for a name"
          value={searchQuery}
          onChangeText={handleSearch}
          onFocus={() => setDropdownVisible(true)}
        />
      </View>
      {dropdownVisible && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredNames}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectItem(item.name, item._id)}
              >
                <Text style={styles.dropdownText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <Text style={styles.label}>Chalan No:</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.flexInput]}
          placeholder="Enter Chalan No"
          keyboardType="numeric"
          value={chalanNo.toString()}
          onChangeText={setChalanNo}
        />
      </View>

      <Text style={styles.label}>Bale No:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Bale No"
          keyboardType="numeric"
          value={baleNo.toString()}
          onChangeText={setBaleNo}
        />
      </View>

      <Text style={styles.label}>Date:</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.datePicker}
      >
        <Text>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity onPress={addItem} style={styles.addButton}>
        <Icon name="check" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  label: {
    padding: 10,
  },
  inputContainer: {
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
  },
  dropdown: {
    marginHorizontal: 16,
    maxHeight: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownItem: {
    padding: 7,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  dropdownText: {
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  flexInput: {
    flex: 1,
  },
  datePicker: {
    height: 40,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  addButton: {
    backgroundColor: '#1EAF64',
    position: 'absolute',
    padding: 7,
    borderRadius: 5,
    bottom: 20,
    right: 20,
  },
});
