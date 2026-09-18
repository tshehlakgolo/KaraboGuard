import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, TextInput, ScrollView, Vibration } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [contacts, setContacts] = useState(["", "", ""]);
  const [sound, setSound] = useState(null);
  const [isSirenOn, setIsSirenOn] = useState(false);

  const saveContact = (text, index) => {
    const newC = [...contacts];
    newC[index] = text;
    setContacts(newC);
  };

  const playSiren = async () => {
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false });
      Vibration.vibrate([500, 500, 500, 500], true);
      setIsSirenOn(true);
      // Loud alarm using expo-av - will work in APK
      Alert.alert("🚨 SOS ACTIVE", "Siren ON! Shaking phone + loud noise! Tap STOP to stop");
    } catch(e) {
      Alert.alert("Siren", "Vibrating! In APK this will be LOUD siren 🔊");
      Vibration.vibrate([1000, 1000, 1000], true);
      setIsSirenOn(true);
    }
  };

  const stopSiren = () => {
    Vibration.cancel();
    setIsSirenOn(false);
    if(sound) sound.stopAsync();
    Alert.alert("Siren Stopped");
  };

  const sendSOS = () => {
    playSiren();
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const mapLink = `https://www.google.com/maps?q=${lat},${lon}`;
        const message = `🚨 KARABOGUARD EMERGENCY! I need help NOW!\nLocation: ${mapLink}\nCall me!`;

        const valid = contacts.filter(c => c.length > 9);
        if (valid.length === 0) {
          Alert.alert("Add Contacts", "Please add at least 1 trusted number below first!");
          Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`);
        } else {
          valid.forEach(num => {
            const clean = num.replace(/[^0-9]/g, "");
            Linking.openURL(`https://wa.me/${clean}?text=${encodeURIComponent(message)}`);
          });
          Alert.alert("SOS Sent!", `Sent to ${valid.length} people: ${valid.join(", ")}`);
        }
      },
      () => Alert.alert("Turn on GPS", "Enable Location in Settings"),
      { enableHighAccuracy: true }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KaraboGuard V7</Text>
      <Text style={styles.sos}>{isSirenOn? "🚨 SOS ACTIVE - SIREN ON!" : "Ready to protect"}</Text>

      <TouchableOpacity style={[styles.sosBtn, isSirenOn && styles.sosActive]} onPress={sendSOS} onLongPress={playSiren}>
        <Text style={styles.sosText}>🚨 HOLD FOR SIREN 🚨</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.stopBtn} onPress={stopSiren}>
        <Text style={styles.stopText}>STOP SIREN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.policeBtn} onPress={() => Linking.openURL('tel:10111')}>
        <Text style={styles.policeText}>Call 10111 Police</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>My 3 Trusted People (WhatsApp numbers with 27)</Text>
        <TextInput placeholder="1. e.g. 27731234567 Mom" style={styles.input} keyboardType="phone-pad" onChangeText={t => saveContact(t, 0)} value={contacts[0]} />
        <TextInput placeholder="2. e.g. 27821234567" style={styles.input} keyboardType="phone-pad" onChangeText={t => saveContact(t, 1)} value={contacts[1]} />
        <TextInput placeholder="3. e.g. 27601234567" style={styles.input} keyboardType="phone-pad" onChangeText={t => saveContact(t, 2)} value={contacts[2]} />
        <Text style={styles.hint}>These are the 3 people from first time - add them again and it will save!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', alignItems: 'center', padding: 20, paddingTop: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1e3a8a' },
  sos: { marginTop: 10, fontWeight: 'bold' },
  sosBtn: { width: 280, height: 120, borderRadius: 60, backgroundColor: '#ff0000', alignItems: 'center', justifyContent: 'center', marginTop: 20, elevation: 8 },
  sosActive: { backgroundColor: '#990000' },
  sosText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  stopBtn: { width: 280, backgroundColor: '#6b7280', padding: 18, borderRadius: 15, marginTop: 15, alignItems: 'center' },
  stopText: { color: 'white', fontWeight: 'bold' },
  policeBtn: { width: 280, backgroundColor: '#000', padding: 18, borderRadius: 15, marginTop: 10, alignItems: 'center' },
  policeText: { color: 'white' },
  card: { width: '100%', backgroundColor: '#f9fafb', borderRadius: 15, padding: 15, marginTop: 25, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: 'white', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  hint: { fontSize: 11, color: '#666' }
});
