import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, TextInput, ScrollView, Vibration } from 'react-native';

export default function App() {
  const [contacts, setContacts] = useState(["", "", ""]);
  const [isOn, setIsOn] = useState(false);

  const playSiren = () => {
    try {
      Vibration.vibrate([1000, 1000, 1000, 1000], true);
      setIsOn(true);
    } catch(e) {}
  };

  const stopSiren = () => {
    Vibration.cancel();
    setIsOn(false);
  };

  const sendSOS = () => {
    playSiren();
    if (typeof navigator!== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const mapLink = `https://www.google.com/maps?q=${lat},${lon}`;
          const message = `🚨 KARABOGUARD EMERGENCY! I need help NOW!\nLocation: ${mapLink}`;

          const valid = contacts.filter(c => c.length > 9);
          if (valid.length === 0) {
            Alert.alert("Add contacts first", "Add your 3 trusted numbers below, then press SOS again");
            Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`);
          } else {
            valid.forEach(num => {
              const clean = num.replace(/[^0-9]/g, "");
              Linking.openURL(`https://wa.me/${clean}?text=${encodeURIComponent(message)}`);
            });
            Alert.alert("SOS Sent!", `WhatsApp opened for ${valid.length} contacts`);
          }
        },
        () => {
          Alert.alert("GPS off", "Turn on Location - still sending SOS");
          const message = `🚨 KARABOGUARD EMERGENCY! I need help!`;
          Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KaraboGuard V7.1</Text>
      <Text style={styles.status}>{isOn? "🚨 SOS ACTIVE - VIBRATING!" : "Ready"}</Text>

      <TouchableOpacity style={styles.sosBtn} onPress={sendSOS}>
        <Text style={styles.sosText}>🚨 HOLD FOR SIREN 🚨</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.stopBtn} onPress={stopSiren}>
        <Text style={styles.stopText}>STOP SIREN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.policeBtn} onPress={() => Linking.openURL('tel:10111')}>
        <Text style={styles.policeText}>Call 10111 Police</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>My 3 Trusted People</Text>
        <TextInput placeholder="1. 27... Mom" style={styles.input} keyboardType="phone-pad" onChangeText={t => {let a=[...contacts]; a[0]=t; setContacts(a)}} value={contacts[0]} />
        <TextInput placeholder="2. 27... " style={styles.input} keyboardType="phone-pad" onChangeText={t => {let a=[...contacts]; a[1]=t; setContacts(a)}} value={contacts[1]} />
        <TextInput placeholder="3. 27... " style={styles.input} keyboardType="phone-pad" onChangeText={t => {let a=[...contacts]; a[2]=t; setContacts(a)}} value={contacts[2]} />
        <Text style={styles.hint}>This fixes crash - your 3 people are back!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', alignItems: 'center', padding: 20, paddingTop: 40 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#1e3a8a' },
  status: { marginTop: 10, fontWeight: 'bold' },
  sosBtn: { width: 280, height: 110, borderRadius: 55, backgroundColor: '#ff0000', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  sosText: { color: 'white', fontWeight: 'bold' },
  stopBtn: { width: 280, backgroundColor: '#6b7280', padding: 16, borderRadius: 12, marginTop: 15, alignItems: 'center' },
  stopText: { color: 'white' },
  policeBtn: { width: 280, backgroundColor: '#000', padding: 16, borderRadius: 12, marginTop: 10, alignItems: 'center' },
  policeText: { color: 'white' },
  card: { width: '100%', backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, marginTop: 20 },
  cardTitle: { fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: 'white', borderRadius: 8, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: '#ddd' },
  hint: { fontSize: 11, color: '#666' }
});
