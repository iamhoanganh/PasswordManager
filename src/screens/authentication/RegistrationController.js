import React, { useState } from "react";
import { Alert } from "react-native";
import { RegistrationScreen } from "./RegistrationScreen";

/**
 * Controller Method for the Registration Screen
 * @param props application props
 * @returns {JSX.Element} registration screen view
 */
export default function RegistrationController(props) {
  // States to keep track of input text boxes
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /**
   * Navigate back to the login screen if the footer link is pressed
   */
  const onFooterLinkPress = () => {
    props.navigation.navigate("Login");
  };

  /**
   * When the register button is pressed, then validate data then continue on to the encryption key setup screen.
   */
  const onRegisterPress = () => {
    // Check name input is at least one character long
    if (fullName.length < 4) {
      Alert.alert("Tên không hợp lệ", "Nhập lại tên hợp lệ", [
        {
          text: "Return",
          style: "cancel",
        },
      ]);
      return;
    }

    // Check that the email address is valid using regex expression
    // const reg = /^\w+([.-]?\w+)*@\w+([]?\w+)*(\.\w{2,3})+$/;
    // check that email address is valid with gmail, hotmail, yahoo or outlook
    const reg =
      /^\w+([.-]?\w+)*@(gmail|hotmail|yahoo|outlook)\.(com|co\.\w{2})$/;
    if (!reg.test(email)) {
      Alert.alert("Email không hợp lệ", "Vui lòng nhập lại email hợp lệ", [
        {
          text: "Return",
          style: "cancel",
        },
      ]);
      return;
    }

    // Check the two password fields are equal
    if (password !== confirmPassword) {
      Alert.alert(
        "Mật khẩu không khớp",
        "Vui lòng kiểm tra lại mật khẩu và nhập lại.",
        [
          {
            text: "Return",
            style: "cancel",
          },
        ]
      );
      return;
    }

    // Check that the password length is at least 8 characters long
    if (password.length < 8) {
      Alert.alert(
        "Mật khẩu quá ngắn",
        "Nhập lại mật khẩu để đủ 8 ký tự trở lên bạn nhé.",
        [
          {
            text: "Return",
            style: "cancel",
          },
        ]
      );
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Mật khẩu không hợp lệ",
        "Mật khẩu phải chứa ít nhất một chữ cái viết thường, một chữ cái viết hoa và một chữ số.",
        [
          {
            text: "Return",
            style: "cancel",
          },
        ]
      );
      return;
    }
    // If all checks have been validated and succeed, then navigate to the encryption key setup
    // Full Name, Email and password details are passed through to this next screen which are later submitted to Firebase
    props.navigation.navigate("CreateEncryptionKey", {
      fullName: fullName,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    });
  };

  // Render Registration Screen view
  return (
    <RegistrationScreen
      setFullName={setFullName}
      fullName={fullName}
      setEmail={setEmail}
      email={email}
      setPassword={setPassword}
      password={password}
      setConfirmPassword={setConfirmPassword}
      confirmPassword={confirmPassword}
      onRegisterPress={onRegisterPress}
      onFooterLinkPress={onFooterLinkPress}
    />
  );
}
