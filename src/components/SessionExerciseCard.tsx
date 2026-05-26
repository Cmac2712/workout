import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SessionExercise } from "../types";
import { getById } from "../data/exerciseLibrary";
import { Stepper } from "./Stepper";

type Props = {
  sessionExercise: SessionExercise;
  onLogSet: (reps: number, weight: number) => void;
};

const REP_STEP = 1;
const WEIGHT_STEP = 2.5;

export function SessionExerciseCard({ sessionExercise, onLogSet }: Props) {
  const [reps, setReps] = useState(8);
  const [weight, setWeight] = useState(20);

  const name =
    getById(sessionExercise.exerciseId)?.name ?? sessionExercise.exerciseId;

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <Text className="text-lg font-bold text-gray-900 mb-2">{name}</Text>

      {sessionExercise.sets.length === 0 ? (
        <Text className="text-sm text-gray-400 mb-3">No sets logged yet</Text>
      ) : (
        <View className="mb-3">
          {sessionExercise.sets.map((set) => (
            <Text key={set.id} className="text-sm text-gray-700">
              Set {set.setNumber}: {set.reps} reps × {set.weight} kg
            </Text>
          ))}
        </View>
      )}

      <View className="flex-row justify-around items-end mb-3">
        <Stepper label="Reps" value={reps} step={REP_STEP} min={1} onChange={setReps} />
        <Stepper
          label="Weight"
          value={weight}
          step={WEIGHT_STEP}
          min={0}
          unit="kg"
          onChange={setWeight}
        />
      </View>

      <Pressable
        onPress={() => onLogSet(reps, weight)}
        className="bg-blue-600 rounded-xl py-3 items-center"
      >
        <Text className="text-white font-semibold">Log Set</Text>
      </Pressable>
    </View>
  );
}
