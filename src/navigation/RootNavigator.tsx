import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WorkoutScreen } from "../screens/WorkoutScreen";
import { ExercisePickerScreen } from "../screens/ExercisePickerScreen";
import { HistoryScreen } from "../screens/HistoryScreen";

export type WorkoutStackParamList = {
  WorkoutHome: undefined;
  ExercisePicker: undefined;
};

const Tab = createBottomTabNavigator();
const WorkoutStack = createNativeStackNavigator<WorkoutStackParamList>();
const HistoryStack = createNativeStackNavigator();

function WorkoutStackScreen() {
  return (
    <WorkoutStack.Navigator>
      <WorkoutStack.Screen name="WorkoutHome" component={WorkoutScreen} options={{ title: "Workout" }} />
      <WorkoutStack.Screen
        name="ExercisePicker"
        component={ExercisePickerScreen}
        options={{ presentation: "modal", title: "Add Exercise" }}
      />
    </WorkoutStack.Navigator>
  );
}

function HistoryStackScreen() {
  return (
    <HistoryStack.Navigator>
      <HistoryStack.Screen name="HistoryHome" component={HistoryScreen} options={{ title: "History" }} />
    </HistoryStack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Workout" component={WorkoutStackScreen} />
      <Tab.Screen name="History" component={HistoryStackScreen} />
    </Tab.Navigator>
  );
}
