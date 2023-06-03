import React, { useContext, useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AuthContext } from "../../contexts/AuthContext";
import Style from "../../styles/Style";
import { Text, Button, Card, TextInput } from "react-native-paper";

export default function LoginScreen(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  const { signIn } = useContext(AuthContext);

  const onFooterLinkPress = () => {
    props.navigation.navigate("Registration");
  };

  /**
   * Listner Method for Forgot Password Link - Go to the Forgot Password Screen.
   */
  const onForgotPasswordLinkPress = () => {
    props.navigation.navigate("ForgotPassword");
  };

  return (
    <View style={Style.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <Card
          style={{
            marginTop: 5,
            marginBottom: 5,
            marginHorizontal: 7,
            paddingVertical: 10,
          }}
        >
          <TextInput
            label="Email Address"
            value={email}
            mode="outlined"
            onChangeText={(text) => setEmail(text)}
            style={Style.input}
          />

          <TextInput
            label="Password"
            value={password}
            mode="outlined"
            secureTextEntry={passwordVisibility}
            right={
              <TextInput.Icon
                icon="eye"
                onPress={() => setPasswordVisibility(!passwordVisibility)}
              />
            }
            onChangeText={(text) => setPassword(text)}
            style={Style.input}
          />

          <Button
            style={Style.button}
            mode="contained"
            onPress={() => signIn({ email, password })}
          >
            Sign in
          </Button>

          <Button
            style={Style.button}
            mode="outlined"
            onPress={onFooterLinkPress}
          >
            Create a new account
          </Button>
          <Button
            style={Style.button}
            mode="outlined"
            onPress={onForgotPasswordLinkPress}
          >
            Password reset
          </Button>
        </Card>
      </KeyboardAwareScrollView>
    </View>
  );
}
