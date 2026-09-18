import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Linking, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';

export default function App() {
  const [contacts, setContacts] = useState(['', '', '']);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status!== 'granted') {
        Alert.alert('Permission needed', 'Allow location for SOS');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(loc);
    })();
  }, []);

  const updateContact = (text, index) => {
    const newContacts = [...contacts];
    newContacts[index] = text;
    setContacts(newContacts);
  };

  const sendSOS = async () => {
    let currentLoc = location;
    try {
      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      currentLoc = loc;
      setLocation(loc);
    } catch (e) {}

    if (!currentLoc) {
      Alert.alert('No GPS', 'Waiting for location... move outside and try again');
      return;
    }

    const lat = currentLoc.coords.latitude;
    const lng = currentLoc.coords.longitude;
    const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
    const message = `🚨 KARABO GUARD SOS! I NEED HELP!\nLocation: ${mapsLink}\nLat:${lat.toFixed(5)} Lng:${lng.toFixed(5)}\nCome now!`;

    const validContacts = contacts.filter(c => c.replace(/[^0-9]/g,'').length > 9);
    if (validContacts.length === 0) {
      Alert.alert('Add contacts', 'Add at least 1 number like 0821234567');
      return;
    }

    // 1. TRY WHATSAPP FIRST
    try {
      for (let num of validContacts) {
        let cleanNum = num.replace(/[^0-9]/g, '');
        if (cleanNum.startsWith('0')) cleanNum = '27' + cleanNum.substring(1);
        const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`;
        await Linking.openURL(url);
        await new Promise(r => setTimeout(r, 1800));
      }
    } catch (e) {
      console.log('WhatsApp error', e);
    }

    // 2. SMS FALLBACK - opens SMS composer with all contacts
    try {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync(validContacts, message);
      } else {
        // If SMS module not available, use sms: link for first contact
        const first = validContacts[0].replace(/[^0-9]/g,'');
        Linking.openURL(`sms:${first}?body=${encodeURIComponent(message)}`);
      }
    } catch (e) {
      Alert.alert('SOS Ready', `WhatsApp opened. If it failed, send this manually:\n${message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KaraboGuard 🛡️</Text>
      <Text style={styles.sub}>Soweto Safe - V8.1</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Emergency Contacts (WhatsApp + SMS)</Text>
        {contacts.map((c, i) => (
          <TextInput key={i} style={styles.input} placeholder={`Contact ${i+1} - 0821234567`} keyboardType="phone-pad" value={c} onChangeText={(t) => updateContact(t, i)} />
        ))}
        <Text style={styles.hint}>082... auto → 2782... for WhatsApp</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Live Location</Text>
        <Text style={styles.loc}>{location? `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}` : 'Getting GPS...'}</Text>
        {location && <Text style={styles.link}>maps.google.com/?q={location.coords.latitude},{location.coords.longitude}</Text>}
      </View>

      <TouchableOpacity style={styles.sos} onPress={sendSOS}>
        <Text style={styles.sosTxt}>🚨 SEND SOS - WHATSAPP + SMS</Text>
      </TouchableOpacity>
      <Text style={styles.foot}>1. Opens WhatsApp per contact with location{'\n'}2. Then opens SMS with same location</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0a0a0a', padding: 20, paddingTop: 60 },
  title: { color: '#ff0040', fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  sub: { color: '#888', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: '#1a1a1a', padding: 15, borderRadius: 12, marginBottom: 15 },
  label: { color: 'white', fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: '#2a2a2a', color: 'white', padding: 12, borderRadius: 8, marginBottom: 10 },
  hint: { color: '#666', fontSize: 11 },
  loc: { color: '#00ff88', fontSize: 15 },
  link: { color: '#555', fontSize: 10, marginTop: 4 },
  sos: { backgroundColor: '#ff0040', padding: 22, borderRadius: 15, alignItems: 'center' },
  sosTxt: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  foot: { color: '#555', textAlign: 'center', marginTop: 15, fontSize: 11, lineHeight: 16 }
});
