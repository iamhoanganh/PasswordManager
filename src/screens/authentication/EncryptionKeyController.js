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
      Alert.alert("Passwords don't match.");
      return;
    }

    // Check that the encryption keys are matching
    if (passphrase !== confirmPassphrase) {
      Alert.alert(
        "Encryption key does not match",
        "Could not authenticate with the provided biometric credentials. Please sign in using your email address and password.",
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
        "Specified encryption key too short",
        "Please specify an encryption key that is at the minimum 12 characters in length.",
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
            Password Manager encrypts your information using Advanced Encryption
            Standard.
          </Text>
          <Text style={Style.text}>
            For this to work, an encryption key is needed.
          </Text>
          <Text style={Style.text}>
            It is recommend that you copy this key for future reference.
          </Text>
          <TextInputBox
            placeholder={"Encryption Passphrase"}
            textSetter={setPassphrase}
            value={passphrase}
          />
          <TextInputBox
            placeholder={"Confirm Encryption Passphrase"}
            textSetter={setConfirmPassphrase}
            value={confirmPassphrase}
          />

          <Button
            style={Style.button}
            mode="contained"
            onPress={onGenerateEncryptionKey}
          >
            Auto Generate Encryption Key
          </Button>
          <Button
            style={Style.button}
            mode="contained"
            onPress={copyEncryptionKey}
          >
            Copy Encryption Key to Clipboard
          </Button>
        </View>

        <Button style={Style.button} mode="contained" onPress={onRegisterPress}>
          Complete Registration
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
}
