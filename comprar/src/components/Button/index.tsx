import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { styles } from "./style";

type Props = TouchableOpacityProps & {
    title: string
}

export function Button({ title, ...rest }: Props) {
    return(
        //O ...rest coloca todas as outras propriedades de forma implícita
        <TouchableOpacity style={styles.container} activeOpacity={0.8} {...rest}> 
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
}