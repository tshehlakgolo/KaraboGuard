import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Linking, ScrollView } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [contacts, setContacts] = useState(['', '', '']);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status!== 'granted') {
        Alert.alert('Need location');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(loc);
    })();
  }, []);

  const updateContact = (t, i) => {
    const n = [...contacts]; n[i]=t; setContacts(n);
  };

  const sendSOS = async () => {
    let cur = location;
    try {
      let l = await Location.getCurrentPositionAsync({});
      cur = l; setLocation(l);
    } catch {}
    if (!cur) { Alert.alert('No GPS yet'); return; }
    const lat=cur.coords.latitude; const lng=cur.coords.longitude;
    const link=`https://maps.google.com/?q=${lat},${lng}`;
    const msg=`🚨 KARABO GUARD SOS! HELP!\nLocation: ${link}\nLat:${lat.toFixed(5)} Lng:${lng.toFixed(5)}`;
    const valid=contacts.filter(c=>c.replace(/[^0-9]/g,'').length>9);
    if(!valid.length){ Alert.alert('Add contact'); return; }

    // 1. WhatsApp
    for(let num of valid){
      let clean=num.replace(/[^0-9]/g,'');
      if(clean.startsWith('0')) clean='27'+clean.substring(1);
      await Linking.openURL(`https://wa.me/${clean}?text=${encodeURIComponent(msg)}`);
      await new Promise(r=>setTimeout(r,1500));
    }
    // 2. SMS fallback - opens SMS app
    setTimeout(()=>{
      const smsBody=encodeURIComponent(msg);
      const smsNums=valid.join(',');
      Linking.openURL(`sms:${smsNums}?body=${smsBody}`);
    },2000);

    Alert.alert('SOS sent via WhatsApp + SMS', link);
  };

  return (
    <ScrollView contentContainerStyle={styles.c}>
      <Text style={styles.t}>KaraboGuard 🛡️</Text>
      <Text style={styles.sub}>V8.2 WhatsApp + SMS</Text>
      <View style={styles.card}>
        <Text style={styles.lab}>Emergency Contacts</Text>
        {contacts.map((c,i)=><TextInput key={i} style={styles.in} placeholder={`Contact ${i+1} 082...`} keyboardType="phone-pad" value={c} onChangeText={t=>updateContact(t,i)} />)}
      </View>
      <View style={styles.card}>
        <Text style={styles.lab}>Live Location</Text>
        <Text style={styles.loc}>{location? `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}` : 'Getting GPS...'}</Text>
      </View>
      <TouchableOpacity style={styles.sos} onPress={sendSOS}><Text style={styles.sost}>🚨 SEND SOS - WHATSAPP + SMS</Text></TouchableOpacity>
    </ScrollView>
  );
}
const styles=StyleSheet.create({
  c:{flexGrow:1,backgroundColor:'#0a0a0a',padding:20,paddingTop:60},
  t:{color:'#ff0040',fontSize:32,fontWeight:'bold',textAlign:'center'},
  sub:{color:'#888',textAlign:'center',marginBottom:20},
  card:{backgroundColor:'#1a1a1a',padding:15,borderRadius:12,marginBottom:15},
  lab:{color:'white',fontWeight:'bold',marginBottom:10},
  in:{backgroundColor:'#2a2a2a',color:'white',padding:12,borderRadius:8,marginBottom:10},
  loc:{color:'#00ff88'},
  sos:{backgroundColor:'#ff0040',padding:22,borderRadius:15,alignItems:'center'},
  sost:{color:'white',fontWeight:'bold'}
});
