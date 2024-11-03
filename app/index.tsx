// SignUpScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, ActivityIndicator , Image} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { storeIdInFile, readIdFromFile } from "../app/loginTokenHandel"
import {BASE_URL} from './env/env'
const SignUpScreen = () => {
  const domain = BASE_URL;
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginRequest, setLoginRequest] = useState(false);
  const [tokenWork, setTokenWork] = useState(false);
  const handleSignUp = async () => {
    setLoginRequest(true);
    try {
      const response = await axios.post(`${domain}/u/login`, {
        username: email,
        password: password
      });
      if (response.data.token) { // Ensure token is valid
        await storeIdInFile(response.data.token); // Corrected typo
        console.log('Token:', response.data.token);
        setLoginRequest(false);
        router.replace('/landing');
      } else {
        console.error('No token received');
        setLoginRequest(false);
      }
    } catch (err) {
      console.log('Error during login:', err);
      alert(err.response.data.error)
      setLoginRequest(false);
    }
  };

  const authToken = async (token) => {
    try {
      const response = await axios.post(`${domain}/u/auth`, {
        token: token
      });
      console.log(response.status)
      router.replace('/landing');
    } catch (err) {
      console.log(err);
      setTokenWork(true);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const data = await readIdFromFile();
        await authToken(data);
      } catch (error) {
        console.error("Error reading token:", error);
      }
    })();
  }, []);

  
  return (
    <View style={styles.container}>
      {
       tokenWork && (
          <View>
            <Text style={styles.title}>Login</Text>

            <TextInput
              style={styles.input}
              placeholder="username"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              editable={tokenWork}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              editable={tokenWork}
            />

            {
              loginRequest && (
                <ActivityIndicator size="large" color="#0000ff" />
              )
            }
            {
              !loginRequest && (
                <Button title="Login" onPress={handleSignUp} />
              )
            }

            <View style={styles.loginPrompt}>
              <Text>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.loginText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  loginPrompt: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  loginText: {
    color: 'blue',
    fontWeight: 'bold',
  },
  image: {
    flex: 1,
    width: 50,
    height: 50,
    backgroundColor: '#0553',
  }
});

export default SignUpScreen;
