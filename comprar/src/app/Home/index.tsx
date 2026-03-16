import { View, Image} from 'react-native';
import { Button } from '@/components/Button'
import { styles } from "./styles";

export function Home() {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("@/assets/logo.png")} />
      
      <Button title="Entrar"/>
    </View>
  );
}
