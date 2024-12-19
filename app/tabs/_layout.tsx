import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="form"
        options={{
          title: 'form',
          tabBarIcon: ({ color, size }) => (
            <Icon name="assignment" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="homepage"
        options={{
          title: 'home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="qr-code-scanner" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="getbilldata"
        options={{
          title: 'Get Bill',
          tabBarIcon: ({ color, size }) => (
            <Icon name="receipt" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
