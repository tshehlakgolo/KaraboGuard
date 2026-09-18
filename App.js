import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, TextInput, ScrollView, Vibration } from 'react-native';

export default function App() {
  const [c1, setC1] = useState("");
  const [c2, setC2] = useState("");
  const [c3, setC3] = useState("");

  const fix = (n) => {
    let clean = n.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) clean = "27" + clean.substring(1);
    return clean;
  };

  const sos = () => {
    Vibration.vibrate(1000);
    const nums = [fix(c1), fix(c2), fix(c3)].filter(x => x.length >= 11);
    if (nums.length === 0) {
      Alert.alert("Add numbers", "Type numbers like 27716809393");
      return;
    }
    const msg = "🚨 KARABOGUARD HELP! I need help now! Please call me. Location: https://maps.google.com/?q=-26.2041,28.0473";
    Linking.openURL(`https://wa.me/${nums[0]}?text=${encodeURIComponent(msg)}`);
  };

  return (
    <ScrollView contentContainerStyle={s.box}>
      <Text style={s.title}>KaraboGuard</Text>
      <Text style={s.sub}>V7.4.1 - WILL OPEN</Text>
      <TouchableOpacity style={s.sos} onPress={sos}>
        <Text style={s.sosT}>🚨 TAP FOR SOS 🚨</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.stop} onPress={() => Vibration.cancel()}>
        <Text style={s.stopT}>STOP VIBRATION</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.police} onPress={() => Linking.openURL('tel:10111')}>
        <Text style={s.policeT}>Call 10111 Police</Text>
      </TouchableOpacity>
      <View style={s.card}>
        <Text style={s.cardT}>My 3 People - Add YOUR OWN</Text>
        <TextInput style={s.input} placeholder="1. 27716809393" value={c1} onChangeText={setC1} keyboardType="phone-pad" />
        <TextInput style={s.input} placeholder="2. 2782..." value={c2} onChangeText={setC2} keyboardType="phone-pad" />
        <TextInput style={s.input} placeholder="3. 2760..." value={c3} onChangeText={setC3} keyboardType="phone-pad" />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  box: { flexGrow: 1, alignItems: 'center', padding: 20, backgroundColor: '#fff', paddingTop: 50 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#1e3a8a' },
  sub: { fontSize: 12, color: 'green', marginTop: 4 },
  sos: { backgroundColor: '#dc2626', width: 300, height: 120, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  sosT: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  stop: { backgroundColor: '#666', width: 300, padding: 12, borderRadius: 10, marginTop: 12, alignItems: 'center' },
  stopT: { color: 'white', fontWeight: 'bold' },
  police: { backgroundColor: 'black', width: 300, padding: 12, borderRadius: 10, marginTop: 8, alignItems: 'center' },
  policeT: { color: 'white' },
  card: { width: '100%', backgroundColor: '#f3f4f6', padding: 14, borderRadius: 12, marginTop: 20 },
  cardT: { fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: 'white', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 8 }
});
