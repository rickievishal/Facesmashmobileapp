import * as React from 'react';
import {  Image, Text, View } from 'react-native';
import Ratingpage from './routes/screens/RatingPage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Leaderboard from './routes/screens/Leaderboard';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
const Stack = createNativeStackNavigator()



const Tabs = createBottomTabNavigator();

export default function App() {
  return (

      <NavigationContainer className="w-screen h-screen">
        {/* <Stack.Navigator className="w-screen h-screen ">
          <Stack.Screen name="facesmash"  component={Ratingpage} options={{headerShown:false}} />
          <Stack.Screen name="leaderboard" component={Leaderboard} options={{headerShown:true,animation:"fade_from_bottom",animationDuration:400,statusBarAnimation:"slide"}} />
        </Stack.Navigator> */}
        <Tabs.Navigator >
          <Tabs.Screen name="facesmash" component={Ratingpage} options={{headerShown:false,tabBarIcon:((color,size)=>(
            <MaterialIcons
            name='face-retouching-natural'
            size={20}
            color={color}
          />
          )
          )}} />
          <Tabs.Screen name='leaderboard' component={Leaderboard} options={{tabBarIcon:((color,size)=>(
            <MaterialIcons
            name='leaderboard'
            size={20}
            color="black"
          />
          )
          )}}/>
        </Tabs.Navigator>
      </NavigationContainer>

        

     

  );
}


