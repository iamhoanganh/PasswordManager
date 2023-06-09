import React, { useState } from "react";
import { Text, View } from "react-native";
import Styles from "../../styles/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInputBox } from "../../components/TextInputBox";
import { ClickableButton } from "../../components/ClickableButton";
import Style from "../../styles/Style";
import { TextInput } from "react-native-paper";

/**
 * Registration Screen
 * @param setFullName user full name setter
 * @param fullName user full name
 * @param setEmail set email address
 * @param email email address
 * @param setPassword password setter
 * @param password password
 * @param setConfirmPassword confirm password setter
 * @param confirmPassword confirm password
 * @param onRegisterPress register button listener function
 * @param onFooterLinkPress footer button listener function
 * @returns {JSX.Element} registration view
 */
export function RegistrationScreen({
  setFullName,
  fullName,
  setEmail,
  email,
  setPassword,
  password,
  setConfirmPassword,
  confirmPassword,
  onRegisterPress,
  onFooterLinkPress,
}) {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  return (
    <View style={Styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        {/* Text input fields */}
        <TextInputBox
          placeholder={"Họ tên"}
          textSetter={setFullName}
          value={fullName}
        />
        <TextInputBox
          placeholder={"E-mail"}
          textSetter={setEmail}
          value={email}
        />

        <TextInput
          label="Mật khẩu"
          value={password}
          mode="outlined"
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={passwordVisibility}
          right={
            <TextInput.Icon
              icon="eye"
              onPress={() => setPasswordVisibility(!passwordVisibility)}
            />
          }
          style={Style.input}
        />

        <TextInput
          label="Nhập lại mật khẩu"
          value={confirmPassword}
          mode="outlined"
          secureTextEntry={passwordVisibility}
          right={
            <TextInput.Icon
              icon="eye"
              onPress={() => setPasswordVisibility(!passwordVisibility)}
            />
          }
          onChangeText={(text) => setConfirmPassword(text)}
          style={Style.input}
        />

        {/* Continue Button */}
        <ClickableButton
          buttonText={"Tiếp tục"}
          onPressMethod={onRegisterPress}
        />

        {/* Footer Link */}
        <View style={Styles.footerView}>
          <Text style={Styles.footerText}>
            <Text onPress={onFooterLinkPress} style={Styles.footerLink}>
              Đã có tài khoản? Đăng nhập
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
