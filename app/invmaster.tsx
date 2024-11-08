import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import {BASE_URL} from '../app/env/env'
export default function Partimaster() {
  const domain = 'https://kapad.developeraadesh.cfd';
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newPartyName, setNewPartyName] = useState('');
  const [editedName, setEditedName] = useState('');

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length === 0) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${domain}/item/get`);
      const data = response.data.items;
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.log('Error fetching data:', error);
      Alert.alert("Error", "Failed to load items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openEditModal = (item) => {
    setSelectedItem(item);
    setEditedName(item.name); // Set initial name for editing
    setEditModalVisible(true);
  };

  const deleteItem = async () => {
    console.log(selectedItem._id)
    try {
      await axios.post(`${domain}/item/delete/${selectedItem._id}`);
      fetchData();
      Alert.alert("Success", "Item deleted successfully.");
    } catch (error) {
      console.log("Error deleting item:", error);
      Alert.alert("Error", "Failed to delete item.");
    } finally {
      setEditModalVisible(false);
      setSelectedItem(null);
    }
  };

  const saveEditedItem = async () => {
    if (!editedName.trim()) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }
    try {
      await axios.put(`${domain}/item/update/${selectedItem._id}`, { name: editedName });
      fetchData();
      Alert.alert("Success", "Item updated successfully.");
    } catch (error) {
      console.log("Error updating item:", error);
      Alert.alert("Error", "Failed to update item.");
    } finally {
      setEditModalVisible(false);
      setSelectedItem(null);
    }
  };

  const createParty = async () => {
    if (!newPartyName) {
      Alert.alert("Error", "Please enter a party name");
      return;
    }
    setCreating(true);
    try {
      await axios.post(`${domain}/item/add`, { name: newPartyName });
      await fetchData();
      setModalVisible(false);
      setNewPartyName('');
      Alert.alert("Success", "New party created successfully");
    } catch (error) {
      console.log("Error creating party:", error);
      Alert.alert("Error", "Failed to create new party");
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 5, backgroundColor: '#fff' }}>
      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
          backgroundColor: '#0E68ED',
          justifyContent: 'center',
          alignItems: 'center',
          left: '100%',
          transform: [{ translateX: -60 }],
          marginBottom: 10,
          paddingHorizontal: 5,
          borderRadius: 5
        }}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>
      <View style={{ paddingHorizontal: 16 }}>
        <TextInput
          style={{
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            paddingLeft: 10,
            marginBottom: 20
          }}
          placeholder="Search for a name"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => openEditModal(item)}
              style={{ padding: 7, borderColor: '#ccc', borderWidth: 1, marginVertical: 5, marginHorizontal: 14, borderRadius: 7 }}
            >
              <Text style={{ fontSize: 18 }}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: '#fff', borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Add New Party</Text>
            <TextInput
              placeholder="Enter party name"
              value={newPartyName}
              onChangeText={setNewPartyName}
              style={{
                height: 40,
                borderColor: '#ccc',
                borderWidth: 1,
                borderRadius: 8,
                paddingLeft: 10,
                marginBottom: 20
              }}
            />
            {creating ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Button title="Create" onPress={createParty} />
            )}
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: '#fff', borderRadius: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', padding: 4 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Edit Item</Text>
              <Button title="Delete" onPress={deleteItem} color="red" />
            </View>
            <TextInput
              style={{
                height: 40,
                borderColor: '#ccc',
                borderWidth: 1,
                borderRadius: 8,
                paddingLeft: 10,
                marginBottom: 20
              }}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter new name"
            />
            <Button title="Save" onPress={saveEditedItem} />
            <View style={{ padding: 5 }} />
            <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
