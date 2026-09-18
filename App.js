import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration, Linking } from 'react-native';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';

export default function App(){
const [status,setStatus]=useState('Ready');
const triggerSOS=async()=>{
setStatus('SOS TRIGGERED!');
Vibration.vibrate([500,500,500]);
try{
let {status:locStatus}=await Location.requestForegroundPermissionsAsync();
if(locStatus!=='granted'){setStatus('Location denied');return;}
let location=await Location.getCurrentPositionAsync({});
let {latitude,longitude}=location.coords;
let mapLink=`https://maps.google.com/?q=${latitude},${longitude}`;
let message=`KARABO SOS! Help! ${mapLink}`;
let isAvailable=await SMS.isAvailableAsync();
if(isAvailable){
await SMS.sendSMSAsync(['0791234567'],message);
setStatus('SOS Sent!');
}else{setStatus('SMS not available');}
}catch(e){setStatus('Error:'+e.message);}
};
return(
<View style={styles.container}>
<Text style={styles.title}>KaraboGuard V5</Text>
<Text style={styles.status}>{status}</Text>
<TouchableOpacity style={styles.sosButton} onPress={triggerSOS}>
<Text style={styles.sirenText}>LOUD SIREN SOS</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.callButton} onPress={()=>Linking.openURL('tel:10111')}>
<Text style={styles.buttonText}>Call 10111</Text>
</TouchableOpacity>
</View>
);
}
const styles=StyleSheet.create({
container:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',padding:20},
title:{fontSize:28,fontWeight:'bold',marginBottom:20},
status:{fontSize:16,marginBottom:30,textAlign:'center'},
sosButton:{backgroundColor:'red',padding:30,borderRadius:100,marginBottom:20},
sirenText:{color:'white',fontSize:18,fontWeight:'bold'},
callButton:{backgroundColor:'black',padding:15,borderRadius:10},
buttonText:{color:'white',fontSize:16}
});
