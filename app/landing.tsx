import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'
import { deleteIdFile } from '../app/loginTokenHandel';

const HomeScreen = () => {
    const router = useRouter();
    const logOut =async ()=>{
        await deleteIdFile();
        router.navigate('/')
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: 20 }}>
            <View style={{display: 'flex', alignItems:'flex-end', paddingRight: 15}}>
                <TouchableOpacity onPress={logOut} style={styles.button}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
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
const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007bff', // Blue background
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3, // Shadow effect for Android
        shadowColor: '#000', // Shadow effect for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        maxWidth: 100,
    },
    buttonText: {
        color: '#fff', // White text
        fontSize: 16,
        fontWeight: 'bold',
    },
});
const CategoryButton = ({ title, icon, run }) => (
    <TouchableOpacity onPress={run} style={{ alignItems: 'center', width: '50%', height: 100 }}>
        <Ionicons name={icon} size={32} color="#1EAF64" />
        <Text style={{ marginTop: 8, color: '#333' }}>{title}</Text>
    </TouchableOpacity>
);

export default HomeScreen;