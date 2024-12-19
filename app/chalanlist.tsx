import { View, Text, TextInput, Button, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { storeIdInFile } from '../app/filehandel';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
// import {BASE_URL} from '../app/env/env'
export default function ChalanList() {
  const router = useRouter();
  const productionCode = true;
  const domain = productionCode ? 'https://application.anandkumarbharatkumar.shop' : 'https://kapad.developeraadesh.cfd';
  const [searchQuery, setSearch] = useState('');
  const [renderData, setRenderData] = useState([]);
  const [data, setData] = useState([]);
  const [buffer, setBuffer] = useState(true);
  const [searchRender, serSearchRender] = useState('');

  const handleSearch = (val) => {
    setSearch(val);
    console.log(val);
    if (val == "") {
      setRenderData(data);
    }
  };

  const search = async () => {
    const response = await axios.post(`${domain}/product/getSearch/${searchQuery}`);
    console.log(response.data);
    setRenderData(response.data.data);
    console.log(search);
  }

  const fetchData = async () => {
    const response = await axios.post(`${domain}/product/getAll`);
    setData(response.data.data || []);
    setRenderData(response.data.data);
    setBuffer(false);
  };

  const redirect = async (id) => {
    try {
      await storeIdInFile(id);
      router.push('/tabs')
    } catch (err) {
      alert("Something went wrong")
    }
  }
  const deleteChalan = async (id) =>{
    try{
      const response = await axios.delete(`${domain}/bill/delete/${id}`);
      alert("Chalan deleted Successfully");
      fetchData();
    }catch(err){
      console.log(err)
      alert("Failed to delete Chalan");
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = (data) => {
    const item = data.item;
    const date = new Date(item.date);
    return (
      <View style={styles.borderStyle}>
        <TouchableOpacity  onPress={() => redirect(item._id)}>
          <View style={[styles.flex, { justifyContent: 'space-between' }]}>
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Chalan No: {item.chalanNo}</Text>
              <Text>Bale No: {item.baleNo}</Text>
            </View>
            <View>
              <Text>{date.toLocaleDateString()}</Text>
              <Text>{date.toLocaleTimeString()}</Text>
            </View>
          </View>
          <Text>{item.partyName}</Text>
        </TouchableOpacity>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}>
        <TouchableOpacity onPress={()=>router.replace(`/editChalan/${item._id}`)} style={{ backgroundColor: 'green', width: 30, height: 30, borderRadius: 10, display: 'flex', justifyContent: "center", alignItems: 'center' }}>
            <Icon name="edit" color={'white'} size={15} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>deleteChalan(item._id)} style={{ backgroundColor: 'red', width: 30, height: 30, borderRadius: 10, display: 'flex', justifyContent: "center", alignItems: 'center' }}>
            <Icon name="delete" color={'white'} size={15} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, flexDirection: 'row', marginTop: 5 }}>
        <TextInput
          style={{
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            paddingLeft: 10,
            marginBottom: 20,
            flex: 1,
          }}
          keyboardType='numeric'
          placeholder="Search for a chalan no"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <View style={{ height: '100%', marginLeft: 5, padding: 2 }}>
          <Button title="Search" onPress={search} />
        </View>
      </View>
      {
        (
          buffer && (
            <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />
          )
        )
      }
      <FlatList
        data={renderData}
        renderItem={renderItem}
        // keyExtractor={(item) => item._id} 
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flexDirection: 'row',
  },
  borderStyle: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 7,
    marginHorizontal: 14,
    padding: 5,
    borderRadius: 7,
  },
});
