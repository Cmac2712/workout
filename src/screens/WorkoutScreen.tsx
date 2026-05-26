import { View, Text, Pressable, ScrollView } from "react-native";
import { useWorkoutStore, workoutStore } from "../store/workoutStore";
import { PLACEHOLDER_EXERCISE_ID } from "../types";
import { SessionExerciseCard } from "../components/SessionExerciseCard";

export function WorkoutScreen() {
  const activeSession = useWorkoutStore((s) => s.activeSession);

  if (activeSession === null) {
    return <IdleView />;
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerClassName="p-4"
    >
      <Text className="text-2xl font-bold text-gray-900 mb-4">
        Active Workout
      </Text>

      {activeSession.sessionExercises.map((se) => (
        <SessionExerciseCard
          key={se.id}
          sessionExercise={se}
          onLogSet={(reps, weight) =>
            workoutStore.getState().logSet(se.id, reps, weight)
          }
        />
      ))}

      <Pressable
        onPress={() => workoutStore.getState().endSession()}
        className="bg-red-600 rounded-xl py-4 items-center mt-2"
      >
        <Text className="text-white font-bold text-base">End Workout</Text>
      </Pressable>
    </ScrollView>
  );
}

function IdleView() {
  const onStart = () => {
    // Two store dispatches: create the session, then seed it with the
    // hardcoded placeholder exercise (replaced by a picker in Slice 2).
    const store = workoutStore.getState();
    store.startSession();
    store.addExerciseToSession(PLACEHOLDER_EXERCISE_ID);
  };

  return (
    <View className="flex-1 bg-gray-100 items-center justify-center p-6">
      <Pressable
        onPress={onStart}
        className="bg-blue-600 rounded-2xl px-10 py-6"
      >
        <Text className="text-white font-bold text-xl">Start Workout</Text>
      </Pressable>
    </View>
  );
}
