import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sinapse Lab</Text>
      <Text style={styles.subtitle}>Solicitacoes para laboratorio de proteses</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}> 
        <Text style={styles.buttonText}>Fazer solicitacao</Text>
      </TouchableOpacity>
    </View>
  );
}

function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>JWT, Google e Apple no backend</Text>
    </View>
  );
}

function SolicitacoesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas solicitacoes</Text>
      <Text style={styles.subtitle}>Filtros por data e status</Text>
    </View>
  );
}

function ContaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conta</Text>
      <Text style={styles.subtitle}>Perfil, idioma e notificacoes</Text>
    </View>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Solicitacoes" component={SolicitacoesScreen} />
      <Tab.Screen name="Conta" component={ContaScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator>
          <Stack.Screen name="App" component={AppTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Entrar" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f0e8",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    color: "#1f2a2a",
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#3f5353",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#28666e",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
