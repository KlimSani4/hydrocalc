/**
 * Главный навигатор приложения
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import {
  LoginScreen,
  RegisterScreen,
  CalculatorScreen,
  HistoryScreen
} from '../screens';

// Типы для навигации
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Calculator: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  // Пока загружаются данные авторизации - ничего не показываем
  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3b82f6'
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600'
          }
        }}
      >
        {user ? (
          // Авторизованный пользователь
          <>
            <Stack.Screen
              name="Calculator"
              component={CalculatorScreen}
              options={{ title: 'HydroCalc' }}
            />
            <Stack.Screen
              name="History"
              component={HistoryScreen}
              options={{ title: 'История' }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          // Неавторизованный пользователь
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Calculator"
              component={CalculatorScreen}
              options={{ title: 'HydroCalc' }}
            />
            <Stack.Screen
              name="History"
              component={HistoryScreen}
              options={{ title: 'История' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
