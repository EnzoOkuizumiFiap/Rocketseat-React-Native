import { TextInput, TextInputProps } from "react-native";

import { styles } from "./style";

export function Input({...rest}: TextInputProps) {
    return <TextInput 
    style={styles.container}
    placeholderTextColor="#74798B"
    {...rest} 
    />
}