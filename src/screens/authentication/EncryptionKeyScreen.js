import React from "react";
import { Text, View } from "react-native";
import Style from "../../styles/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInputBox } from "../../components/TextInputBox";
import { Button } from "react-native-paper";

export function EncryptionKeyScreen({
  setPassphrase,
  passphrase,
  setConfirmPassphrase,
  confirmPassphrase,
  onGenerateEncryptionKey,
  copyEncryptionKey,
  onRegisterPress,
}) {
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
            onPress={() => onGenerateEncryptionKey}
          >
            Auto Generate Encryption Key
          </Button>
          <Button
            style={Style.button}
            mode="contained"
            onPress={() => copyEncryptionKey}
          >
            Copy Encryption Key to Clipboard
          </Button>
        </View>

        <Button
          style={Style.button}
          mode="contained"
          onPress={() => onRegisterPress}
        >
          Complete Registration
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
}
