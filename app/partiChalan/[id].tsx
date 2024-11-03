import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BASE_URL } from '../env/env';
import axios from 'axios';

export default function PartiChalan() {
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/bill-data/${id}`);
        console.log(response.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    getData();
  }, [id]);

  return (
    <View>
      <Text>Chalan Details for ID: {id}</Text>
    </View>
  );
}
