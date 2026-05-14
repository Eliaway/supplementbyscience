import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  "house.fill": "home",
  "chevron.left": "chevron-left",
  "chevron.right": "chevron-right",
  "xmark": "close",
  "xmark.circle.fill": "cancel",
  "arrow.clockwise": "refresh",
  "arrow.right": "arrow-forward",
  "arrow.left.arrow.right": "compare-arrows",
  "checkmark": "check",
  "checkmark.circle.fill": "check-circle",
  "magnifyingglass": "search",
  "plus.circle.fill": "add-circle",
  "bookmark": "bookmark-border",
  "bookmark.fill": "bookmark",
  "info.circle": "info",
  "star.fill": "star",
  "trophy.fill": "emoji-events",
  "sparkles": "auto-awesome",
  "clock.fill": "schedule",
  "calendar": "calendar-today",
  "person.fill": "person",
  "pills.fill": "medication",
  "heart.fill": "favorite",
  "leaf.fill": "eco",
  "drop.fill": "water-drop",
  "brain.head.profile": "psychology",
  "shield.fill": "shield",
  "bolt.fill": "bolt",
  "moon.fill": "bedtime",
  "flame.fill": "local-fire-department",
  "cross.fill": "add",
  "flask.fill": "science",
  "graduationcap.fill": "school",
  "exclamationmark.triangle.fill": "warning",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "filter": "filter-list",
  "list.bullet": "list",
} as unknown as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
