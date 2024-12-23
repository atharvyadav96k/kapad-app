import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
// import { BASE_URL } from '../../app/env/env';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PartiChalan() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [buffer, setBuffer] = useState(true);
  let prevNameRef = "";
  let setLine = false;
  const productionCode = true;
  const url = productionCode ? 'https://application.anandkumarbharatkumar.shop' : 'https://kapad.developeraadesh.cfd';
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${url}/bill-data/${id}`);
        console.log(response.data.data);
        setBuffer(false);
        setData(response.data.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    getData();
  }, [id]);

  const displayName = (name, remark) => {
    console.log(name)
    if (name !== prevNameRef) {
      prevNameRef = name;
      setLine = true;
      console.log("line")
      return [name, remark];
    }
    setLine = false;
    return ["",""];
  };
  
  const nameRender = (items) => {
    const [name, remark] = displayName(items.name, items.remark)
    return (
      <View>
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, padding: 10 }} key={items._id}>
          <Text style={{ flexGrow: 1 }}>{name}</Text>
          <Text style={{ width: 50 }}>{items.item.size}</Text>
          <Text style={{ width: 50 }}>{items.item.count}</Text>
        </View>
        {
          remark != "" ? <Text style={{marginLeft: 20}}>Remark: {remark}</Text> : null
        }
        <View style={{ borderTopWidth: 1, borderColor: '#ccc' }} />
      </View>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, padding: 10 }}>
          <Text style={{ flexGrow: 1 }}>Names</Text>
          <Text style={{ width: 50 }}>size</Text>
          <Text style={{ width: 50 }}>count</Text>
        </View>
        <View style={{ borderTopWidth: 1, borderColor: '#ccc' }} />
        {
          buffer && <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center', marginTop: 150 }} />
        }
        {
          !buffer && data.length == 0 && <Text style={{fontWeight: 'bold', fontSize: 20, textAlign: "center", marginTop: 40, color: '#aaa'}}>No Sufficient data</Text>
        }
        {data.map((ele, index) => nameRender(ele))}
      </ScrollView>
    </SafeAreaView>
  );
}
