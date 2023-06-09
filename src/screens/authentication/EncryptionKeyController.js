import React, { useContext, useState } from "react";
import { Alert, Text, View } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import * as Clipboard from "expo-clipboard";
import PasswordGeneration from "../../models/PasswordGeneration";
import { EncryptionKeyScreen } from "./EncryptionKeyScreen";
import Style from "../../styles/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInputBox } from "../../components/TextInputBox";
import { Button } from "react-native-paper";

/**
 * Controller Method for Encryption Key Setup.
 * @param props application props
 * @returns {JSX.Element} encryption key screen render view
 */
export default function EncryptionKeyController(props) {
  // route parameters, name, email and password passed in from the registration screen
  const { fullName, email, password, confirmPassword } = props.route.params;

  // Track passphrase text input fields
  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");

  // User Context
  const { signUp } = useContext(AuthContext);

  /**
   * Register Button Listener.
   * When the register button is pressed, validate the entries, then complete the firebase sign up process
   */
  const onRegisterPress = () => {
    // Check that passwords are matching. This is somewhat redundant as it is also done in the previous screen.
    if (password !== confirmPassword) {
      Alert.alert("Mật khẩu không khớp.");
      return;
    }

    // Check that the encryption keys are matching
    if (passphrase !== confirmPassphrase) {
      Alert.alert(
        "Khoá mã hoá không khớp",
        "Không thể xác thực với thông tin đăng nhập. Vui lòng đăng nhập sử dụng email và mật khẩu.",
        [
          {
            text: "Return",
            style: "cancel",
          },
        ]
      );
      return;
    }

    // Ensure that the encryption key length is greater than 12 characters
    if (passphrase.length < 12) {
      Alert.alert(
        "Khoá quá ngắn",
        "Nhập khoá dài hơn 12 ký tự để đảm bảo dữ liệu được mã hoá an toàn.",
        [
          {
            text: "Return",
            style: "cancel",
          },
        ]
      );
      return;
    }
    // Complete firebase sign up process and add to user context
    signUp({ fullName, email, password, passphrase });
  };

  /**
   * Encryption Key Generator Button Listener.
   */
  const onGenerateEncryptionKey = () => {
    // Generate encryption key using a fixed version of the password generation model
    let encryptionKey = PasswordGeneration(
      true,
      true,
      true,
      false,
      32,
      setPassphrase
    );

    // set both text boxes to the generated encryption key
    setPassphrase(encryptionKey);
    setConfirmPassphrase(encryptionKey);
  };

  /**
   * Copy Encryption Key to Clipboard.
   */
  const copyEncryptionKey = () => {
    if (passphrase.length > 0) {
      Clipboard.setString(passphrase);
    }
  };

  // Return Encryption Key render view
  return (
    <View style={Style.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <View style={Style.infoView}>
          <Text style={Style.text}>
            Password Manager mã hoá thông tin sử dụng thuật toán Advanced
            Encryption Standard.
          </Text>
          <Text style={Style.text}>Để mã hoá, hãy nhập khoá mã hoá.</Text>
          <Text style={Style.text}>
            Bạn nên sao chép lại khoá mã hoá cho tương lai.
          </Text>
          <TextInputBox
            placeholder={"Nhập khoá"}
            textSetter={setPassphrase}
            value={passphrase}
          />
          <TextInputBox
            placeholder={"Nhập lại khoá"}
            textSetter={setConfirmPassphrase}
            value={confirmPassphrase}
          />

          <Button
            style={Style.button}
            mode="contained"
            onPress={onGenerateEncryptionKey}
          >
            Sinh khoá tự động
          </Button>
          <Button
            style={Style.button}
            mode="contained"
            onPress={copyEncryptionKey}
          >
            Copy khoá vào Clipboard
          </Button>
        </View>

        <Button style={Style.button} mode="contained" onPress={onRegisterPress}>
          Hoàn tất đăng ký
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
}
