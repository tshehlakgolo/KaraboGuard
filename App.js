import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration, Alert, Linking } from 'react-native';
import { Audio } from 'expo-av';

export default function App(){
const [status,setStatus]=useState('KaraboGuard V6 Ready');
const [sound,setSound]=useState();
async function playSiren(){
try{
await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true, shouldDuckAndroid: false });
const { sound: newSound } = await Audio.Sound.createAsync(
{ uri: 'https://www.soundjay.com/mechanical/sounds/siren-01a.mp3' },
{ shouldPlay: true, isLooping: true, volume: 1.0 }
);
setSound(newSound);
await newSound.playAsync();
}catch(e){ console.log(e); }
}
const triggerSOS=async()=>{
Vibration.vibrate([1000,500,1000,500,1000]);
setStatus('🚨 SOS ACTIVE - SIREN ON!');
await playSiren();
};
const stopSiren=async()=>{
if(sound){ await sound.stopAsync(); setStatus('KaraboGuard V6 Ready - Siren Stopped'); }
};
return(
<View style={styles.container}>
<Text style={styles.title}>KaraboGuard V6</Text>
<Text style={styles.status}>{status}</Text>
<TouchableOpacity style={styles.sosButton} onPress={triggerSOS}>
<Text style={styles.sirenText}>🚨 HOLD FOR SIREN 🚨</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.stopButton} onPress={stopSiren}>
<Text style={styles.buttonText}>STOP SIREN</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.callButton} onPress={()=>Linking.openURL('tel:10111')}>
<Text style={styles.buttonText}>Call 10111 Police</Text>
</TouchableOpacity>
</View>
);
}
const styles=StyleSheet.create({
container:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',padding:20},
title:{fontSize:32,fontWeight:'bold',marginBottom:20,color:'#0B3D91'},
status:{fontSize:16,marginBottom:30,textAlign:'center',fontWeight:'bold'},
sosButton:{backgroundColor:'#FF0000',padding:40,borderRadius:100,marginBottom:20,elevation:10},
sirenText:{color:'white',fontSize:18,fontWeight:'bold'},
stopButton:{backgroundColor:'#666',padding:15,borderRadius:10,marginBottom:15,width:'80%',alignItems:'center'},
callButton:{backgroundColor:'black',padding:15,borderRadius:10,width:'80%',alignItems:'center'},
buttonText:{color:'white',fontSize:16}
});
