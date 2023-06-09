import React, { useEffect, useState, Fragment } from "react";
import { Alert, Platform, View, Text } from "react-native";
import * as Clipboard from "expo-clipboard";
import { db } from "../../FirebaseConfig";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import CryptoES from "crypto-es";
import { OptionsMenuView } from "../../components/OptionsMenuView";
import Style from "../../styles/Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Card, Dialog, Portal, TextInput } from "react-native-paper";
import { ClickableButton } from "../../components/ClickableButton";

// Identify system Operating System
let OPERATING_SYSTEM = Platform.OS;

/**
 * Controller Method for the Password View Screen
 * @param props application props
 * @returns {JSX.Element} password screen render
 */
export default function ViewPasswordController(props) {
  // user and entity firebase information
  const { passwordEntityId, userId } = props.route.params;
  let id = passwordEntityId;
  let userID = userId;

  // States for managing retrieved information
  const [entityName, setEntityName] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");

  const [entityUserEmail, setEntityUserEmail] = useState("");
  const [entityPassword, setEntityPassword] = useState("");
  const [passwordRevealed, setPasswordRevealed] = useState(false);
  const [notesText, setNotesText] = useState("");

  const [passwordVisibility, setPasswordVisibility] = useState(true);

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  // Decryption key
  let passphrase;

  // Determine operating type
  let largeButtonsEnabled;
  if (
    OPERATING_SYSTEM === "web" ||
    OPERATING_SYSTEM === "windows" ||
    OPERATING_SYSTEM === "macos"
  ) {
    largeButtonsEnabled = true;
  } else {
    largeButtonsEnabled = false;
  }

  /**
   * When the user enters this page, retrieve the decryption key from firebase
   * After this, update the data states.
   * This is also where the overflow options menu is set.
   */
  useEffect(() => {
    // Retrieve decryption key from Firebase

    getDoc(doc(db, "users", userID)).then((snapshot) => {
      let data = snapshot.data();
      passphrase = data.passphrase;
    });

    // When in focus (Either when entering the screen or returning from it) update the information states
    props.navigation.addListener("focus", () => {
      setPasswordVisibility(true);
      updateData();
    });

    //if (!largeButtonsEnabled) {
    // If on a mobile device set the title to the entity name, and add an actions menu to the right side of the header.
    props.navigation.setOptions({
      title: entityName,
      headerRight: () => (
        <OptionsMenuView
          copyUsername={copyUsername}
          copyPassword={copyPassword}
          onEditButtonPress={onEditButtonPress}
          showConfirmDialog={showConfirmDialog}
        />
      ),
    });
    // }
  });

  /**
   * Copy the email address or username to the system clipboard.
   */
  const copyUsername = () => {
    if (entityUserEmail.length > 0) {
      Clipboard.setString(entityUserEmail);
    }
  };

  /**
   * Copy the password to the clipboard.
   */
  const copyPassword = () => {
    if (entityUserEmail.length > 0) {
      Clipboard.setString(entityPassword);
    }
  };

  /**
   * Update the password entry information from Firebase
   */
  const updateData = () => {
    getDoc(doc(db, `users/${userID}/passwords`, id)).then((snapshot) => {
      let data = snapshot.data();
      // Decrypt Username/Email Address and Password
      let decryptedPasswordText = CryptoES.AES.decrypt(
        data.password,
        passphrase
      );
      let decryptedUsernameText = CryptoES.AES.decrypt(
        data.userEmail,
        passphrase
      );
      // Set unencrypted entity plaintext information
      setEntityName(data.name);
      setNotesText(data.notes);
      setBackgroundColor(data.accent);
      // Set decrypted username/email address and password strings
      setEntityUserEmail(decryptedUsernameText.toString(CryptoES.enc.Utf8));
      setEntityPassword(decryptedPasswordText.toString(CryptoES.enc.Utf8));
      // Set the password to be hidden using a secured text field
      setPasswordRevealed(false);
    }, []);
  };

  /**
   * When attempting to delete a password entry, show a warning to offer a "last chance" before an entry is deleted
   */
  const showConfirmDialog = () => {
    return Alert.alert(
      "Xoá thông tin đăng nhập " + entityName,
      "Are you sure you want to remove this password entry? Once deleted, entries can not be recovered.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        // if the delete option (Highlighted in red to indicate its destructive behaviour) then call the deletion function
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDeleteButtonPress();
          },
        },
      ]
    );
  };

  /**
   * Function to Delete an entry from the Firestore database.
   */
  const onDeleteButtonPress = () => {
    // Item is deleted from the Firestore passwords collection, with the navigation stack then returned to the home screen

    deleteDoc(doc(db, `users/${userID}/passwords`, id))
      .then(() => {
        props.navigation.goBack("HomeScreen");
      })
      .catch(() => {});

    hideDialog();
  };

  /**
   * Move to the edit password screen when clicked.
   * User and entity ID is passed through to allow the database to be updated
   */
  const onEditButtonPress = () => {
    props.navigation.navigate("EditPasswordScreen", {
      userId: userID,
      entityId: id,
    });
  };
  /**
   * Notes are updated whenever new information is added or removed to the text box.
   * @param notes text from the notes box
   */
  const onChangeNotesText = (notes) => {
    // update the notes text box state
    setNotesText(notes);

    updateDoc(doc(db, `users/${userID}/passwords`, id), { notes: notes });
  };

  // Return Password Screen View passing in all relevant variables and functions from this file
  return (
    <View style={Style.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="never"
      >
        {/* Entity Information View Box */}

        <Card
          style={{
            marginTop: 5,
            marginBottom: 5,
            marginHorizontal: 7,
            paddingVertical: 10,
            backgroundColor: backgroundColor,
          }}
        >
          <Card
            style={{
              marginVertical: 10,
              marginHorizontal: 15,
              paddingVertical: 10,
            }}
          >
            <Text style={Style.titleText}>{entityName}</Text>

            <Card.Content>
              <TextInput
                label="Tài khoản"
                value={entityUserEmail}
                mode="outlined"
                style={Style.input}
              />

              <TextInput
                label="Mật khẩu"
                value={entityPassword}
                mode="outlined"
                style={Style.input}
                secureTextEntry={passwordVisibility}
                right={
                  <TextInput.Icon
                    icon="eye"
                    onPress={() => setPasswordVisibility(!passwordVisibility)}
                  />
                }
              />
            </Card.Content>
            <Card.Actions>
              <ClickableButton
                buttonText={"Copy Tài khoản"}
                onPressMethod={copyUsername}
              />
              <ClickableButton
                buttonText={"Copy Mật khẩu"}
                onPressMethod={copyPassword}
              />
            </Card.Actions>
          </Card>
        </Card>

        <Card
          style={{
            marginTop: 5,
            marginBottom: 5,
            marginHorizontal: 7,
            paddingVertical: 10,
          }}
        >
          <View style={Style.textAreaContainer}>
            {/* Notes Box */}

            <TextInput
              label="Notes"
              value={notesText}
              mode="outlined"
              onChangeText={(text) => onChangeNotesText(text)}
              numberOfLines={5}
              multiline={true}
            />
          </View>
        </Card>

        <Card
          style={{
            marginTop: 5,
            marginBottom: 5,
            marginHorizontal: 7,
            paddingVertical: 10,
          }}
        >
          <ClickableButton
            buttonText={"Chỉnh sửa"}
            onPressMethod={onEditButtonPress}
          />
          <ClickableButton buttonText={"Xoá"} onPressMethod={showDialog} />
        </Card>
      </KeyboardAwareScrollView>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={{ textAlign: "center" }}>
            {"Xoá thông tin đăng nhập " + entityName}
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Bạn có chắc chắn muốn xoá thông tin đăng nhập này? Khi đã xoá
              không thể khôi phục
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Huỷ bỏ</Button>
            <Button onPress={onDeleteButtonPress}>Xoá</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
