// SignUpScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity , ActivityIndicator} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import {storeIdInFile, readIdFromFile} from "../app/loginTokenHandel"
import {BASE_URL} from './env/env'
const SignUpScreen = () => {
  const domain = BASE_URL;
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginRequest, setLoginRequest] = useState(false);
  const [loginError, setError] = useState(false);
  const [cPstyle, cpSetStyle] = useState();
  const handleSignUp = async () => {
    setLoginRequest(true);
    try{
      const response = await axios.post(`${domain}/u/register/`, {
        username: email,
        password: password
      });
      console.log(response.data);
      await storeIdInFile(response.data.token)
      router.replace('/login')
    }catch(err){
      console.log(err.message)
      setLoginRequest(false)
      setError(true);
    }
  };
  const confirmPasswordCheck = (pass)=>{
    setConfirmPassword(pass)
    if(pass == password){
      console.log("same");
      cpSetStyle();
    }else{
      cpSetStyle(styles.dangerBack);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {
        loginError && (
          <Text style={{textAlign: "right", paddingBottom: 4, color: "rgb(255, 50, 50)"}}>*Please try again</Text>
        )
      }
      <TextInput
        style={styles.input}
        placeholder="username"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TextInput
        style={[cPstyle, styles.input]}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={confirmPasswordCheck}
        secureTextEntry
        autoCapitalize="none"
      />

      
      {
        !loginRequest && (
          <Button title="Sign Up" onPress={handleSignUp} />
        )
      }
      {
        loginRequest && (
          <ActivityIndicator size="large" color="#0000ff" />
        )
      }

      <View style={styles.loginPrompt}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
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
  dangerBack:{
  backgroundColor: 'rgba(255, 0, 0, 0.3)'
  }
  ,
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
});

export default SignUpScreen;
