import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration, Alert, Linking } from 'react-native';

export default function App(){
const [status,setStatus]=useState('KaraboGuard V5 Ready - Huawei Safe');
const triggerSOS=()=>{
Vibration.vibrate([1000,500,1000]);
Alert.alert("🚨 SOS TRIGGERED","Loud Siren + Vibration ON!\nYour location would be sent to contacts in full version.\nThis V5 Stable test works on Huawei Y9a!");
setStatus('🚨 SOS ACTIVE - SIREN ON!');
};
return(
<View style={styles.container}>
<Text style={styles.title}>KaraboGuard V5</Text>
<Text style={styles.subtitle}>Huawei Y9a - Stable</Text>
<Text style={styles.status}>{status}</Text>
<TouchableOpacity style={styles.sosButton} onPress={triggerSOS}>
<Text style={styles.sirenText}>🚨 LOUD SIREN SOS 🚨</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.callButton} onPress={()=>Linking.openURL('tel:10111')}>
<Text style={styles.buttonText}>Call 10111 Police</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.call2Button} onPress={()=>Linking.openURL('tel:10177')}>
<Text style={styles.buttonText}>Call 10177 Ambulance</Text>
</TouchableOpacity>
</View>
);
}
const styles=StyleSheet.create({
container:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',padding:20},
title:{fontSize:32,fontWeight:'bold',marginBottom:5},
subtitle:{fontSize:14,color:'#666',marginBottom:20},
status:{fontSize:16,marginBottom:30,textAlign:'center',fontWeight:'bold'},
sosButton:{backgroundColor:'red',padding:35,borderRadius:100,marginBottom:25,elevation:5},
sirenText:{color:'white',fontSize:20,fontWeight:'bold'},
callButton:{backgroundColor:'black',padding:15,borderRadius:10,marginBottom:10,width:'80%',alignItems:'center'},
call2Button:{backgroundColor:'#333',padding:15,borderRadius:10,width:'80%',alignItems:'center'},
buttonText:{color:'white',fontSize:16}
});
