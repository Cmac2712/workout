import { View, Text, Pressable } from "react-native";

type Props = {
  label: string;
  value: number;
  step: number;
  min?: number;
  unit?: string;
  onChange: (value: number) => void;
};

export function Stepper({ label, value, step, min = 0, unit, onChange }: Props) {
  const dec = () => onChange(Math.max(min, round(value - step)));
  const inc = () => onChange(round(value + step));

  return (
    <View className="items-center">
      <Text className="text-xs text-gray-500 mb-1">{label}</Text>
      <View className="flex-row items-center">
        <Pressable
          onPress={dec}
          accessibilityLabel={`Decrease ${label}`}
          className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center"
        >
          <Text className="text-xl font-bold text-gray-800">−</Text>
        </Pressable>
        <Text className="mx-3 text-lg font-semibold text-gray-900 min-w-16 text-center">
          {formatValue(value)}
          {unit ? ` ${unit}` : ""}
        </Text>
        <Pressable
          onPress={inc}
          accessibilityLabel={`Increase ${label}`}
          className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center"
        >
          <Text className="text-xl font-bold text-gray-800">+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function formatValue(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
