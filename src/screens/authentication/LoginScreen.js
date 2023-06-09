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
  const isEmailValid = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    // Password should contain at least 6 characters, including at least one letter and one digit
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSignIn = () => {
    if (!isEmailValid(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!isPasswordValid(password)) {
      alert(
        "Please enter a valid password. It should contain at least 6 characters, including at least one letter and one digit."
      );
      return;
    }

    signIn({ email, password });
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
            label="Email"
            value={email}
            mode="outlined"
            onChangeText={(text) => setEmail(text)}
            style={Style.input}
          />

          <TextInput
            label="Mật khẩu"
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

          <Button style={Style.button} mode="contained" onPress={handleSignIn}>
            Đăng nhập
          </Button>

          <Button
            style={Style.button}
            mode="outlined"
            onPress={onFooterLinkPress}
          >
            Đăng ký tài khoản
          </Button>
          <Button
            style={Style.button}
            mode="outlined"
            onPress={onForgotPasswordLinkPress}
          >
            Khôi phục mật khẩu
          </Button>
        </Card>
      </KeyboardAwareScrollView>
    </View>
  );
}
