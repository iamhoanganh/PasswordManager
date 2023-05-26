import React, { useContext, useEffect, useState } from "react";
import { Alert, Platform, Text, View } from "react-native";
import { db } from "../../config/FirebaseConfig";
import { collection, getDocs, getDoc, doc, addDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import SettingsContext from "../../contexts/SettingsContext";
import CryptoES from "crypto-es";
import PasswordGeneration from "../../models/PasswordGeneration";
import Style from "../../styles/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInputBox } from "../../components/TextInputBox";
import { Picker } from "@react-native-picker/picker";
import { colourPalette } from "../../constants/ColourPalette";
import { ClickableButton } from "../../components/ClickableButton";
import { Button, Card, Dialog, Portal, Snackbar } from "react-native-paper";
import { LengthSlider } from "../../components/LengthSlider";
import { ToggleSwitch } from "../../components/ToggleSwitch";
import { HexColorPicker } from "react-colorful";

/**
 * Controller Method for the Add Password Screen
 * @param props application props
 * @returns {JSX.Element} add password screen render
 */
export default function AddPasswordController(props) {
  // States to store entity information
  const [passwordEntryName, setPasswordEntryName] = useState("");
  const [usernameText, setUsernameText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const [selectedColour, setSelectedColour] = useState("#002366");

  // Settings context
  const settingsContext = useContext(SettingsContext);

  const [upperEnabled, setUpperEnabled] = useState(
    settingsContext.includeUppercase
  );
  const toggleUpperSwitch = () =>
    setUpperEnabled((previousState) => !previousState);

  const [lowerEnabled, setLowerEnabled] = useState(
    settingsContext.includeLowercase
  );
  const toggleLowerSwitch = () =>
    setLowerEnabled((previousState) => !previousState);

  const [numbersEnabled, setNumbersEnabled] = useState(
    settingsContext.includeNumbers
  );
  const toggleNumberSwitch = () =>
    setNumbersEnabled((previousState) => !previousState);

  const [symbolsEnabled, setSymbolsEnabled] = useState(
    settingsContext.includeSymbols
  );
  const toggleSymbolSwitch = () =>
    setSymbolsEnabled((previousState) => !previousState);

  // Password length adjuster option
  const [passwordLength, setPasswordLength] = useState(
    settingsContext.passwordLength
  );

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);

  const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);

  const onDismissSnackBar = () => setSnackbarVisible(false);

  const returnScreen = () => {
    // Check that at least one character set is enabled
    if (upperEnabled || lowerEnabled || numbersEnabled || symbolsEnabled) {
      // Set password length
      settingsContext.passwordLength = passwordLength;

      // Set selected character sets
      settingsContext.includeUppercase = upperEnabled;
      settingsContext.includeLowercase = lowerEnabled;
      settingsContext.includeNumbers = numbersEnabled;
      settingsContext.includeSymbols = symbolsEnabled;
      setAutoGenerateOptionsVisible(false);
    } else {
      onToggleSnackBar();
    }
  };

  // user and entity information
  let { userId } = props.route.params;
  let userID = userId;

  // Firestore reference
  const entityRef = collection(db, `users/${userID}/passwords`);

  // Encryption/Decryption key
  let passphrase;

  /**
   * When entering the page, retrieve the user passphrase from Firestore
   */
  useEffect(() => {
    const userRef = doc(db, "users", userID);

    getDoc(userRef)
      .then((snapshot) => {
        let data = snapshot.data();
        // Set decryption passphrase
        passphrase = data.passphrase;
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  });

  /**
   * When the generate button is pressed, then call the password generation model.
   * SettingsContext is used to pass in the generation parameters here. This can be modified in the Generation Options screen.
   */
  const handleGeneratePassword = () => {
    PasswordGeneration(
      settingsContext.includeUppercase,
      settingsContext.includeLowercase,
      settingsContext.includeNumbers,
      settingsContext.includeSymbols,
      settingsContext.passwordLength,
      setPasswordText
    );
  };

  /**
   * When the add button is pressed, then encrypt the information and update the firebase database
   */
  const onAddButtonPress = () => {
    if (
      passwordEntryName.length > 0 &&
      usernameText.length > 0 &&
      passwordText.length > 0
    ) {
      // encrypt username and password text using the encryption/decryption key we passed in on initial load
      let encryptedPasswordText = CryptoES.AES.encrypt(
        passwordText,
        passphrase
      );
      let encryptedUsernameText = CryptoES.AES.encrypt(
        usernameText,
        passphrase
      );
      // Create data structure containing all information to be updated
      const data = {
        name: passwordEntryName,
        password: encryptedPasswordText.toString(),
        userEmail: encryptedUsernameText.toString(),
        accent: selectedColour,
        creationDate: serverTimestamp(),
        modificationDate: serverTimestamp(),
        notes: "Add some notes here...",
      };
      const entityRef = collection(db, `users/${userID}/passwords`);

      addDoc(entityRef, data)
        .then((docRef) => {
          // After the entity has been added then return back to the home screen.
          setPasswordEntryName(passwordEntryName);
          props.navigation.navigate("Passwords");
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      setVisible(true);
    }
  };

  const [autoGenerateOptionsVisible, setAutoGenerateOptionsVisible] =
    React.useState(false);

  const showAutoGeneratedOptionsDialog = () =>
    setAutoGenerateOptionsVisible(true);

  const hideAutoGeneratedOptionsDialog = () =>
    setAutoGenerateOptionsVisible(false);

  const [visible, setVisible] = React.useState(false);

  const hideDialog = () => setVisible(false);

  // Return edit screen render view
  return (
    <View style={Style.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        {/* Entity Text Input Fields */}

        <Card
          style={{
            marginTop: 5,
            marginBottom: 5,
            marginHorizontal: 7,
            paddingVertical: 10,
            backgroundColor: selectedColour,
          }}
        >
          <Card
            style={{
              marginVertical: 10,
              marginHorizontal: 15,
              paddingVertical: 10,
            }}
          >
            <TextInputBox
              placeholder={"Name"}
              textSetter={setPasswordEntryName}
              value={passwordEntryName}
            />
            <TextInputBox
              placeholder={"Username / Email"}
              textSetter={setUsernameText}
              value={usernameText}
            />
            <TextInputBox
              placeholder={"Password"}
              textSetter={setPasswordText}
              value={passwordText}
            />
            <View
              style={{
                justifyContent: "center",
                paddingHorizontal: 10,
                marginVertical: 10,
              }}
            >
              {Platform.OS === "ios" || Platform.OS === "android" ? (
                <Picker
                  selectedValue={selectedColour}
                  mode={"dialog"}
                  onValueChange={(colour) => {
                    setSelectedColour(colour);
                  }}
                >
                  {colourPalette.map((colour) => (
                    <Picker.Item
                      label={colour.label}
                      value={colour.colour}
                      key={colour.label}
                    />
                  ))}
                </Picker>
              ) : (
                <HexColorPicker
                  style={{ width: "100%" }}
                  color={selectedColour}
                  onChange={setSelectedColour}
                />
              )}
            </View>
          </Card>
        </Card>

        {/* Buttons */}
        <ClickableButton
          buttonText={"Auto Generate Password"}
          onPressMethod={handleGeneratePassword}
        />
        <ClickableButton
          buttonText={"Settings"}
          onPressMethod={showAutoGeneratedOptionsDialog}
        />
        <ClickableButton buttonText={"Add"} onPressMethod={onAddButtonPress} />
      </KeyboardAwareScrollView>
      <Portal>
        <Dialog
          dismissable={false}
          visible={autoGenerateOptionsVisible}
          onDismiss={hideAutoGeneratedOptionsDialog}
        >
          <Dialog.Title>Password Generator Options</Dialog.Title>
          <Dialog.Content>
            <Text style={Style.text}>Password Length</Text>
            <Text style={Style.passwordLengthText}>{passwordLength}</Text>
            <LengthSlider value={passwordLength} setter={setPasswordLength} />
            <ToggleSwitch
              text={"Uppercase Letters"}
              enabledStatus={upperEnabled}
              switchValue={toggleUpperSwitch}
            />
            <ToggleSwitch
              text={"Lowercase Letters"}
              enabledStatus={lowerEnabled}
              switchValue={toggleLowerSwitch}
            />
            <ToggleSwitch
              text={"Numbers"}
              enabledStatus={numbersEnabled}
              switchValue={toggleNumberSwitch}
            />
            <ToggleSwitch
              text={"Symbols"}
              enabledStatus={symbolsEnabled}
              switchValue={toggleSymbolSwitch}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={returnScreen}>Apply</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog dismissable={false} visible={visible} onDismiss={hideDialog}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={Style.title}>
            Incomplete entry details
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Please ensure you have a name, username/email and password in the
              selection area.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Okay</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Snackbar visible={snackbarVisible} onDismiss={onDismissSnackBar}>
        No character types selected. In order for password generation to work,
        at least one character type must be selected.
      </Snackbar>
    </View>
  );
}
