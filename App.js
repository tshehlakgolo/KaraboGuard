import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, TextInput, ScrollView, Vibration } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [contacts, setContacts] = useState(["", "", ""]);
  const [isOn, setIsOn] = useState(false);
  const [myLoc, setMyLoc] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getLastKnownPositionAsync({});
        if (loc) setMyLoc(loc.coords);
      }
    })();
  }, []);

  const fixNumber = (num) => {
    let clean = num.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) clean = "27" + clean.substring(1);
    if (!clean.startsWith("27") && clean.length <= 10) clean = "27" + clean;
    return clean;
  };

  const sendStealthSOS = async () => {
    Vibration.vibrate([400, 200, 400, 200, 800]);
    setIsOn(true);

    let lat = myLoc?.latitude;
    let lon = myLoc?.longitude;

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        setMyLoc(pos.coords);
      }
    } catch (e) {
      console.log("GPS error, using last loc");
    }

    const mapLink = lat && lon? `https://www.google.com/maps?q=${lat},${lon}` : "Location: GPS OFF - Call me!";
    const message = `🚨 KARABOGUARD - I NEED HELP! 🚨\n\nI'm in danger, please help me!\n${mapLink}\n\nThis is automated SOS from KaraboGuard - I'm sending this silently.`;

    const valid = contacts.map(fixNumber).filter(c => c.length >= 11);

    if (valid.length === 0) {
      Alert.alert("Add trusted contact", "Add at least 1 number like 27716809393, then SOS will work", [
        { text: "Send without contacts", onPress: () => Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`) }
      ]);
      return;
    }

    // STEALTH: Send to first contact only (most reliable)
    const first = valid[0];
    Alert.alert(
      "🤫 STEALTH SOS SENT",
      `Silent vibration ON!\nLocation: ${lat? `${lat.toFixed(5)}, ${lon.toFixed(5)}` : 'Getting GPS...'}\nSending to: ${first}\n\nWhatsApp will open now - press SEND.`,
      [
        { text: "OPEN WHATSAPP", onPress: () => Linking.openURL(`https://wa.me/${first}?text=${encodeURIComponent(message)}`) }
      ]
    );

    // After 2 sec, offer to send to others
    if (valid.length > 1) {
      setTimeout(() => {
        Alert.alert("Send to others?", `Also send to ${valid.length-1} other contacts?`, [
          { text: "No", style: "cancel" },
          { text: "Yes", onPress: () => {
            valid.slice(1).forEach((num, i) => {
              setTimeout(() => Linking.openURL(`https://wa.me/${num}?text=${encodeURIComponent(message)}`), i * 1500);
            });
          }}
        ]);
      }, 3000);
    }
  };

  const stopAll = () => {
    Vibration.cancel();
    setIsOn(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KaraboGuard V7.2</Text>
      <Text style={styles.badge}>{isOn? "🤫 STEALTH SOS ACTIVE" : "Ready - Silent Mode"}</Text>
      {myLoc && <Text style={styles.loc}>📍 GPS Ready: {myLoc.latitude.toFixed(4)}, {myLoc.longitude.toFixed(4)}</Text>}

      <TouchableOpacity style={[styles.sosBtn, isOn && styles.sosActive]} onPress={sendStealthSOS}>
        <Text style={styles.sosText}>🚨 TAP FOR SILENT SOS 🚨</Text>
        <Text style={styles.sosSub}>Vibrate only - no loud sound</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.stopBtn} onPress={stopAll}>
        <Text style={styles.stopText}>STOP</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.policeBtn} onPress={() => Linking.openURL('tel:10111')}>
        <Text style={styles.policeText}>Call 10111 Police</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>My 3 Trusted People - Use 27 format</Text>
        <TextInput placeholder="1. 27716809393" style={styles.input} keyboardType="phone-pad" onChangeText={t => {let a=[...contacts]; a[0]=t; setContacts(a)}} value={contacts[0]} />
        <TextInput placeholder="2. 2782... " style={styles.input} keyboardType="phone-pad" onChangeText={t => {let a=[...contacts]; a[1]=t; setContacts(a)}} value={contacts[1]} />
        <TextInput placeholder="3. 2760... " style={styles.input} keyboardType="phone-pad" onChangeText={t => {let a=[...contacts]; a[2]=t; setContacts(a)}} value={contacts[2]} />
        <Text style={styles.hint}>STEALTH MODE: No loud siren, only vibration + WhatsApp location. Much safer! Change 071... to 2771...</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', alignItems: 'center', padding: 20, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e3a8a' },
  badge: { marginTop: 10, fontWeight: 'bold', backgroundColor: '#dcfce7', padding: 6, borderRadius: 6 },
  loc: { marginTop: 6, fontSize: 12, color: 'green' },
  sosBtn: { width: 290, height: 120, borderRadius: 20, backgroundColor: '#dc2626', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  sosActive: { backgroundColor: '#991b1b' },
  sosText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  sosSub: { color: 'white', fontSize: 11, marginTop: 4 },
  stopBtn: { width: 290, backgroundColor: '#6b7280', padding: 14, borderRadius: 12, marginTop: 14, alignItems: 'center' },
  stopText: { color: 'white', fontWeight: 'bold' },
  policeBtn: { width: 290, backgroundColor: '#000', padding: 14, borderRadius: 12, marginTop: 10, alignItems: 'center' },
  policeText: { color: 'white' },
  card: { width: '100%', backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, marginTop: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: 'white', borderRadius: 8, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: '#ddd' },
  hint: { fontSize: 11, color: '#666', marginTop: 4 }
});
