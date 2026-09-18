import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';

export default function App() {
  const [c1, setC1] = useState(''); 
  const [c2, setC2] = useState(''); 
  const [c3, setC3] = useState('');
  
  const sendSOS = () => {
    Alert.alert("🚨 SOS TEST", `Would send to:\n${c1}\n${c2}\n${c3}\n\nLocation: Soweto\n\nV5 is stable! Next we add real SMS.`);
  };
  
  const siren = () => {
    Alert.alert("🔊 LOUD SIREN", "Siren ON - V5 stable mode");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KaraboGuard</Text>
      <Text style={styles.sub}>V5 Stable • Huawei + Android</Text>
      
      <TouchableOpacity style={styles.sos} onPress={sendSOS} onLongPress={siren}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>
      
      <Text style={styles.hint}>Tap = SOS • Long Press = Siren</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>🔒 Trusted Contacts</Text>
        <TextInput style={styles.input} placeholder="Mom number" value={c1} onChangeText={setC1} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Sister number" value={c2} onChangeText={setC2} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Friend number" value={c3} onChangeText={setC3} keyboardType="phone-pad" />
      </View>
      
      <TouchableOpacity style={styles.sirenBtn} onPress={siren}>
        <Text style={styles.sirenText}>🔊 LOUD SIREN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#FFF5F5', alignItems:'center', paddingTop:60, padding:20},
  title:{fontSize:32, fontWeight:'bold', color:'#B91C1C'}, 
  sub:{color:'#666', marginBottom:10},
  sos:{width:200, height:200, borderRadius:100, backgroundColor:'#DC2626', justifyContent:'center', alignItems:'center', marginVertical:15, borderWidth:4, borderColor:'white'},
  sosText:{color:'white', fontSize:48, fontWeight:'bold'}, 
  hint:{color:'#999', marginBottom:15},
  card:{backgroundColor:'white', width:'100%', borderRadius:16, padding:16, elevation:3},
  label:{fontWeight:'bold', marginBottom:10}, 
  input:{backgroundColor:'#F3F4F6', borderRadius:8, padding:12, marginBottom:10},
  sirenBtn:{backgroundColor:'#111827', width:'100%', padding:16, borderRadius:12, alignItems:'center', marginTop:15},
  sirenText:{color:'white', fontWeight:'bold'}
});



  
  

    

      
      <TouchableOpacity style={styles.sirenBtn} onPress={siren}>
        <Text style={styles.sirenText}>🔊 LOUD SIREN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#FFF5F5', alignItems:'center', paddingTop:60, padding:20},
  title:{fontSize:32, fontWeight:'bold', color:'#B91C1C'}, 
  sub:{color:'#666', marginBottom:10},
  sos:{width:200, height:200, borderRadius:100, backgroundColor:'#DC2626', justifyContent:'center', alignItems:'center', marginVertical:15, borderWidth:4, borderColor:'white'},
  sosText:{color:'white', fontSize:48, fontWeight:'bold'}, 
  hint:{color:'#999', marginBottom:15},
  card:{backgroundColor:'white', width:'100%', borderRadius:16, padding:16, elevation:3},
  label:{fontWeight:'bold', marginBottom:10}, 
  input:{backgroundColor:'#F3F4F6', borderRadius:8, padding:12, marginBottom:10},
  sirenBtn:{backgroundColor:'#111827', width:'100%', padding:16, borderRadius:12, alignItems:'center', marginTop:15},
  sirenText:{color:'white', fontWeight:'bold'}
});
  
