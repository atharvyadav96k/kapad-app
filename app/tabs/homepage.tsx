import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { storeIdInFile, readIdFromFile } from '../filehandel'

export default function HomePage() {
    const doamin = "https://kapad.developeraadesh.cfd"
    const [billId, setB] = useState("");
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [data, setData] = useState('');
    const [sound, setSound] = useState(null);
    const [d, setD] = useState([]);
    const [loading, setLoading] = useState(false);
    const [scannerActive, setScannerActive] = useState(true);

    // Request camera permissions
    const requestCamera = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    useEffect(() => {
        (async () => {
            await requestCamera();
        })();
    }, []);

    async function playBeepSound() {
        const { sound } = await Audio.Sound.createAsync(require('../../assets/audio/beep.mp3'));
        setSound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);
    useFocusEffect(
        React.useCallback(() => {
            setScannerActive(false); // Disable the scanner
            const timer = setTimeout(() => {
                setScannerActive(true); // Re-enable the scanner after a delay
            }, 100);

            const fetchId = async () => {
                try {
                    const id = await readIdFromFile();
                    console.log("Stored ID:", id);
                    setB(id);
                    console.log(billId)
                } catch (error) {
                    console.error("Error reading ID from file:", error);
                }
            };

            fetchId(); // Call the function to read the ID

            return () => {
                clearTimeout(timer); // Cleanup timeout on unmount
            };
        }, [])
    );
    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        setData(data);
        console.log(`QR code data: ${data}`);
        await playBeepSound();

        let [name, value] = data.split(':');
        setD((prevD) => [...prevD, { name, value }]);
    };

    const submitHandel = async () => {
        if (!billId) {
            alert('Bill ID is not available. Please try again.');
            return;
        }

        setLoading(true);
        let res = [];
        d.forEach((item) => {
            const existingItem = res.find((obj) => obj.name === item.name && obj.value === item.value);
            if (existingItem) {
                existingItem.count += 1;
            } else {
                res.push({ ...item, count: 1 });
            }
        });

        for (let i = 0; i < res.length; i++) {
            try {
                const response = await axios.post(
                    `${doamin}/product/add/${billId}`,
                    { name: res[i].name, size: res[i].value, count: res[i].count }
                );
                console.log('Response status: ', response.status);
                alert('Data added successfully');
                if (i === res.length - 1) setD([]);
            } catch (error) {
                alert('Error sending data, please check if the server is on.');
                console.error(`Error sending data for ${res[i].name}:`, error.message);
            }
        }
        setLoading(false);
    };

    if (hasPermission === null) {
        return <Text>Requesting camera permission...</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    if (!billId) {
        return <Text>Loading bill data...</Text>;
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {scannerActive && !loading && (
                <BarCodeScanner
                    onBarCodeScanned={scanned || loading ? undefined : handleBarCodeScanned}
                    style={{ width: '100%', height: '100%' }}
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                />
            )}
            <View style={{ position: 'absolute', width: 300, height: 300, display: 'flex', justifyContent: 'space-between' }}>
                <View style={style.scannerContainer}>
                    <View style={[style.scannerBorder, { borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 30 }]}></View>
                    <View style={[style.scannerBorder, { borderTopRightRadius: 30, borderLeftWidth: 0, borderBottomWidth: 0 }]}></View>
                </View>
                <View style={style.scannerContainer}>
                    <View style={[style.scannerBorder, { borderBottomLeftRadius: 30, borderTopWidth: 0, borderRightWidth: 0 }]}></View>
                    <View style={[style.scannerBorder, { borderBottomRightRadius: 30, borderLeftWidth: 0, borderTopWidth: 0 }]}></View>
                </View>
            </View>

            {scanned && !loading && (
                <View style={{ marginTop: 20, position: 'absolute', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: 10 }} onPress={() => setScanned(false)}>
                        <Icon name="replay" size={60} color="white" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
                onPress={submitHandel}
                disabled={loading}
                style={{
                    position: 'absolute',
                    backgroundColor: loading ? 'rgba(0, 0, 200, 0.5)' : 'rgba(0, 0, 200, 1)',
                    padding: 10,
                    borderRadius: 5,
                    bottom: 30,
                    right: 30,
                }}>
                {loading ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <Icon name="send" size={30} color="white" />
                )}
            </TouchableOpacity>
        </View>
    );
}

const style = StyleSheet.create({
    scannerContainer: {
        width: '100%',
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    scannerBorder: {
        borderColor: 'white',
        height: 50,
        width: 50,
        borderWidth: 5,
    },
});
