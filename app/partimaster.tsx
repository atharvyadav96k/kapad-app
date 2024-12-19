import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import {BASE_URL} from '../app/env/env'

export default function Partimaster() {
  const router = useRouter();
  const productionCode = true;
  const domain = productionCode ? 'https://application.anandkumarbharatkumar.shop' : 'https://kapad.developeraadesh.cfd';
  const [names, setNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNames, setFilteredNames] = useState([]);
  const [loading, setLoading] = useState(true); // Main loading state
  const [creating, setCreating] = useState(false); // Loading state for creating a new party
  const [modalVisible, setModalVisible] = useState(false);
  const [newPartyName, setNewPartyName] = useState('');

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length === 0) {
      setFilteredNames(names);
    } else {
      const filtered = names.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredNames(filtered);
    }
  };
  const fetchData = async () => {
    setLoading(true); 
    try {
      const response = await axios.get(`${domain}/party/get`);
      setNames(response.data);
      setFilteredNames(response.data);
    } catch (error) {
      console.log('Error fetching data:', error);
      Alert.alert("Error", "Failed to load parties.");
    } finally {
      setLoading(false); // Stop loading after fetch completes
    }
  };
  useEffect(() => {

    fetchData();
  }, []);

  const handlePress = (item) => {
    router.push(`/partiBills/${item._id}`);
  };

  const createParty = async () => {
    if (!newPartyName) {
      Alert.alert("Error", "Please enter a party name");
      return;
    }
    setCreating(true); // Set loading state for create operation
    try {
      await axios.post(`${domain}/party/create`, { name: newPartyName });
      await fetchData();
      setModalVisible(false);
      setNewPartyName('');
      Alert.alert("Success", "New party created successfully");
    } catch (error) {
      console.log("Error creating party:", error);
      Alert.alert("Error", "Failed to create new party");
    } finally {
      setCreating(false); // Stop loading after create completes
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
          transform: [{translateX: -60}],
          marginBottom: 10,
          paddingHorizontal: 5,
          borderRadius: 5
        }}
        onPress={() => setModalVisible(true)}>
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
          data={filteredNames}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePress(item)}
              style={{ padding: 7, borderColor: '#ccc', borderStyle: "solid", borderWidth: 1, margin: 5, borderRadius: 7 }}>
              <Text style={{ fontSize: 18 }}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal for Adding New Party */}
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
            <View style={{padding: 5}}/>
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
