import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'


const HomeScreen = () => {
    const router = useRouter();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: 20 }}>
            <View style={{ padding: 16, position: 'absolute', top: "100%", transform: [{ translateY: -200 }] }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <CategoryButton title="New Chalan" icon="add" run={() => router.push('/newchalan')} />
                    <CategoryButton title="Chalan List" icon="receipt" run={() => router.push('/chalanlist')} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                    <CategoryButton title="Parti Master" icon="person" run={() => router.push('/partimaster')} />
                    <CategoryButton title="Inventory Master" icon="cube" run={() => router.push('/invmaster')} />
                </View>
            </View>
        </SafeAreaView>
    );
};

const CategoryButton = ({ title, icon, run }) => (
    <TouchableOpacity onPress={run} style={{ alignItems: 'center', width: '50%', height: 100 }}>
        <Ionicons name={icon} size={32} color="#1EAF64" />
        <Text style={{ marginTop: 8, color: '#333' }}>{title}</Text>
    </TouchableOpacity>
);

export default HomeScreen;