import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { BASE_URL } from '../../app/env/env';
import axios from 'axios';

export default function PartiBills() {
  const { id } = useLocalSearchParams();
  const productionCode = true;
  const domain = productionCode ? 'https://application.anandkumarbharatkumar.shop' : 'https://kapad.developeraadesh.cfd';
  const [response, setResponse] = useState([]);
  const router = useRouter();
  const [buffer, setBuffer] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${domain}/bill/data/${id}`);
        setResponse(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setBuffer(false);
      }
    };
    fetchData();
  }, [id]);

  const redirect = (itemId) => {
    router.push(`/partiChalan/${itemId}`);
  };

  const renderItem = ({ item }) => {
    let d = new Date(item.date);
    let date = d.toLocaleDateString();
    let time = d.toLocaleTimeString();
    return (
      <TouchableOpacity
        onPress={() => redirect(item._id)}
        style={{
          borderWidth: 1,
          marginVertical: 5,
          marginHorizontal: 14,
          borderColor: '#ccc',
          padding: 10,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Chalan No: {item.chalanNo}</Text>
          <View>
            <Text>Date : {date}</Text>
            <Text>Time : {time}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Bale No: {item.baleNo}</Text>
        <Text>{item.partyName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      {buffer && <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center', marginTop: 150 }} />}
      {
        !buffer && response.length === 0 && <Text 
        style={{
          fontWeight: 'bold',
          fontSize: 20, 
          textAlign: "center", 
          marginTop: 40, 
          color: '#aaa'
        }}>No Sufficient data</Text>
      }
      <FlatList
        data={response}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
