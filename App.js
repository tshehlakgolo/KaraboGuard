import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, TextInput, ScrollView } from 'react-native';

export default function App() {
  const [contacts, setContacts] = useState(["", "", ""]);
  const [loc, setLoc] = useState(null);
  const [sirenOn, setSirenOn] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kg_contacts');
      if (saved) setContacts(JSON.parse(saved));
    } catch(e){}
  }, []);

  const saveContact = (text, index) => {
    const newC = [...contacts];
    newC[index] = text;
    setContacts(newC);
    try { localStorage.setItem('kg_contacts', JSON.stringify(newC)); } catch(e){}
  };

  const toggleSiren = () => {
    if (sirenOn) {
      if (audioRef.current) { try{audioRef.current.stop();}catch(e){} audioRef.current = null; }
      setSirenOn(false);
      return;
    }
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      setInterval(() => {
        try{ osc.frequency.linearRampToValueAtTime(400 + Math.random()*800, ctx.currentTime + 0.5); }catch(e){}
      }, 500);
      osc.start();
      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      audioRef.current = osc;
      setSirenOn(true);
      setTimeout(() => { try{osc.stop();}catch(e){} setSirenOn(false); }, 15000);
    } catch(e) {
      Alert.alert("🔊 SIREN!", "SCREAM! HELP!");
    }
  };

  const sendSOS = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLoc({ lat, lon });
        const mapLink = `https://www.google.com/maps?q=${lat},${lon}`;
        const message = `🚨 KARABOGUARD EMERGENCY! I need help NOW!\n📍 Location: ${mapLink}`;
        const valid = contacts.filter(c => c.replace(/\D/g,'').length >= 10);
        if (valid.length === 0) {
          Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`);
        } else {
          const first = valid[0].replace(/\D/g,'');
          Linking.openURL(`https://wa.me/${first}?text=${encodeURIComponent(message)}`);
        }
      },
      () => Alert.alert("Enable GPS", "Turn on Location"),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KaraboGuard</Text>
      <Text style={styles.sub}>V4 Final • Huawei + Android</Text>
      <TouchableOpacity style={[styles.sosBtn, sirenOn && {backgroundColor: '#000'}]} onPress={sendSOS} onLongPress={toggleSiren}>
        <Text style={styles.sosText}>{sirenOn? "STOP" : "SOS"}</Text>
      </TouchableOpacity>
      <Text style={styles.tip}>Tap = SOS • Long Press = Siren</Text>
      {loc && <Text style={styles.loc}>📍 {loc.lat.toFixed(5)}, {loc.lon.toFixed(5)} ✓</Text>}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔒 Trusted Contacts (auto-saved)</Text>
        <TextInput placeholder="Mom 2773..." style={styles.input} keyboardType="phone-pad" onChangeText={t => saveContact(t, 0)} value={contacts[0]} />
        <TextInput placeholder="Sister 2782..." style={styles.input} keyboardType="phone-pad" onChangeText={t => saveContact(t, 1)} value={contacts[1]} />
        <TextInput placeholder="Friend 2760..." style={styles.input} keyboardType="phone-pad" onChangeText={t => saveContact(t, 2)} value={contacts[2]} />
      </View>
      <TouchableOpacity style={[styles.alarm, sirenOn? styles.alarmOn : null]} onPress={toggleSiren}>
        <Text style={styles.alarmText}>{sirenOn? "🔇 STOP SIREN" : "🔊 LOUD SIREN"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff5f5', alignItems: 'center', padding: 20, paddingTop: 60 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#b91c1c' },
  sub: { fontSize: 12, color: '#666' },
  tip: { fontSize: 11, color: '#888', marginTop: 8 },
  sosBtn: { width: 210, height: 210, borderRadius: 105, backgroundColor: '#dc2626', alignItems: 'center', justifyContent: 'center', marginTop: 20, elevation: 10, borderWidth: 4, borderColor: '#fff' },
  sosText: { fontSize: 54, fontWeight: 'bold', color: 'white' },
  loc: { marginTop: 12, fontSize: 11, color: '#15803d', fontWeight: 'bold' },
  card: { width: '100%', backgroundColor: 'white', borderRadius: 16, padding: 16, marginTop: 25, elevation: 3 },
  cardTitle: { fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: '#f3f4f6', borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  alarm: { marginTop: 16, backgroundColor: '#111827', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center' },
  alarmOn: { backgroundColor: '#dc2626' },
  alarmText: { color: 'white', fontWeight: 'bold' },
});