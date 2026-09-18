import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, TextInput, ScrollView, Vibration } from 'react-native';

export default function App() {
  const [contacts, setContacts] = useState(["", "", ""]);
  const [isOn, setIsOn] = useState(false);
  const [myLoc, setMyLoc] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setMyLoc(pos.coords),
      err => console.log(err),
      { enableHighAccuracy: true }
    );
  }, []);

  const fixNumber = (num) => {
    let clean = num.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) clean = "27" + clean.substring(1);
    return clean;
  };

  const sendSOS = async () => {
    Vibration.vibrate([500, 200, 500]);
    setIsOn(true);

    let lat = myLoc?.latitude;
    let lon = myLoc?.longitude;

    const getLocation = () => new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        p => resolve(p.coords),
        () => resolve(null),
        { timeout: 5000 }
      );
    });

    const fresh = await getLocation();
    if (fresh) { lat = fresh.latitude; lon = fresh.longitude; setMyLoc(fresh); }

    const mapLink = lat && lon? `https://www.google.com/maps?q=${lat},${lon}` : "Location off - Call me urgently!";
    const msg = `🚨 KARABOGUARD HELP! 🚨\n${mapLink}\nI need help now! Silent SOS`;

    const valid = contacts.map(fixNumber).filter(c => c.length >= 11);
    if (valid.length === 0) {
      Alert.alert("Add your people", "Add 27716809393 format in boxes below, then SOS will send location");
      return;
    }

    const first = valid[0];
    Alert.alert("🤫 STEALTH SOS", `Vibrating + Location: ${lat? lat.toFixed(4) : 'getting...'} \nSending to ${first}`, [
      { text: "OPEN WHATSAPP", onPress: () => Linking.openURL(`https://wa.me/${first}?text=${encodeURIComponent(msg)}`) }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KaraboGuard V7.3</Text>
      <Text style={styles.badge}>{isOn? "🤫 STEALTH ACTIVE" : "Ready - Silent Mode"}</Text>
      {myLoc && <Text style={styles.loc}>📍 GPS: {myLoc.latitude.toFixed(4)}, {myLoc.longitude.toFixed(4)}</Text>}

      <TouchableOpacity style={styles.sosBtn} onPress={sendSOS}>
        <Text style={styles.sosText}>🚨 TAP FOR SILENT SOS</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.stop} onPress={() => { Vibration.cancel(); setIsOn(false); }}>
        <Text style={styles.stopT}>STOP</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.police} onPress={() => Linking.openURL('tel:10111')}>
        <Text style={styles.policeT}>Call 10111</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardT}>My 3 People - Each phone adds OWN</Text>
        <TextInput style={styles.input} placeholder="1. 27716809393" value={contacts[0]} onChangeText={t => { let a=[...contacts]; a[0]=t; setContacts(a); }} />
        <TextInput style={styles.input} placeholder="2. 2782..." value={contacts[1]} onChangeText={t => { let a=[...contacts]; a[1]=t; setContacts(a); }} />
        <TextInput style={styles.input} placeholder="3. 2760..." value={contacts[2]} onChangeText={t => { let a=[...contacts]; a[2]=t; setContacts(a); }} />
        <Text style={styles.hint}>Change 071 to 2771 - eg 0716809393 = 27716809393. Silent vibration, no loud siren.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20, backgroundColor: '#fff', paddingTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold' },
  badge: { marginTop: 10, backgroundColor: '#dcfce7', padding: 6, borderRadius: 6, fontWeight: 'bold' },
  loc: { fontSize: 11, color: 'green', marginTop: 5 },
  sosBtn: { backgroundColor: '#dc2626', width: 290, height: 110, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  sosText: { color: 'white', fontWeight: 'bold' },
  stop: { backgroundColor: '#6b7280', width: 290, padding: 12, borderRadius: 10, marginTop: 12, alignItems: 'center' },
  stopT: { color: 'white', fontWeight: 'bold' },
  police: { backgroundColor: 'black', width: 290, padding: 12, borderRadius: 10, marginTop: 8, alignItems: 'center' },
  policeT: { color: 'white' },
  card: { width: '100%', backgroundColor: '#f9fafb', padding: 12, borderRadius: 10, marginTop: 18, borderWidth: 1, borderColor: '#eee' },
  cardT: { fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: 'white', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 8 },
  hint: { fontSize: 11, color: '#555' }
});
