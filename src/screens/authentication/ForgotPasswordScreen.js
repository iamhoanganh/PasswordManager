import React, { useState } from "react";
import { Alert, View } from "react-native";
import Style from "../../styles/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { auth } from "../../FirebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { TextInputBox } from "../../components/TextInputBox";
import { ClickableButton } from "../../components/ClickableButton";

/**
 * Forgot Password Screen
 * @param props application props
 * @returns {JSX.Element} forgot password screen view
 */
export default function ForgotPasswordScreen(props) {
  // track email text input
  const [email, setEmail] = useState("");

  /**
   * Advisory Prompt once a password request has been sent.
   */
  const sentMessage = () => {
    Alert.alert(
      "Email khôi phục đã gửi!",
      "Nếu email bạn nhập hợp lệ, hãy kiểm tra lại hòm thư email nhé!."
    );
  };

  /**
   * Confirmation Button Listener.
   * When pressed, send a password reset request for the email that has been requested.
   * For security reasons, the application will not display whether the email address is valid or not.
   */
  const onConfirmationPress = () => {
    // Email validation using regex

    const emailRegex =
      /^\w+([.-]?\w+)*@(gmail|hotmail|yahoo|outlook)\.(com|co\.\w{2})$/;
    if (!emailRegex.test(email)) {
      Alert.alert(
        "Email không hợp lệ",
        "Vui lòng nhập một địa chỉ email hợp lệ."
      );
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        sentMessage(); // show advisory prompt after sending message
      })
      .catch(() => {
        sentMessage(); // even if the email is invalid, still show the advisory prompt to obfuscate emails.
      });

    // navigate back to the login screen
    props.navigation.navigate("Login");
  };

  /**
   * Return contents:
   * - Email Input Box
   * - Recovery Email Button
   */
  return (
    <View style={Style.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <TextInputBox
          placeholder={"Địa chỉ e-mail"}
          textSetter={setEmail}
          value={email}
        />
        <ClickableButton
          buttonText={"Gửi email khôi phục"}
          onPressMethod={onConfirmationPress}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}
