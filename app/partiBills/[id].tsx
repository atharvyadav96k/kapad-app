import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../env/env';
import axios from 'axios';

export default function PartiBills() {
  const { id } = useLocalSearchParams();
  const domain = BASE_URL;
  const [response, setResponse] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${domain}/bill/data/${id}`);
        setResponse(res.data.data);
      } catch (err) {
        console.log(err);
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
    return (
      <TouchableOpacity
        onPress={() => redirect(item._id)}
        style={{
          borderWidth: 1,
          marginVertical: 5,
          marginHorizontal: 14,
          borderColor: '#ccc',
          padding: 10
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Bale No: {item.baleNo}</Text>
          <Text>Date : {date}</Text>
        </View>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Chalan No: {item.chalanNo}</Text>
        <Text>{item.partyName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <Text>{id}</Text>
      <FlatList
        data={response}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
