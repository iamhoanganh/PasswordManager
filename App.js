import "react-native-gesture-handler";
import React, { useState, useMemo } from "react";
import { Alert } from "react-native";
import { auth, db } from "./src/config/FirebaseConfig";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { NavigationContainer } from "@react-navigation/native";
import { StackNavigatorContainer } from "./src/models/StackNavigatorContainer";
import { AuthContext } from "./src/contexts/AuthContext";
import AndroidTimerFix from "./src/util/AndroidTimerFix";
import {
  Button,
  Dialog,
  MD3LightTheme as DefaultTheme,
  Portal,
  Provider as PaperProvider,
  Text,
} from "react-native-paper";

/**
 * Main Insertion Point for the Application.
 * This function is primarily used for user authentication and its relevant actions such as sign in, sign out.
 * As the navigation stack is oriented around authentication, its insertion point is also here
 * @returns {JSX.Element} AuthContext and navigation stack, this then uses react-navigation to start up the application.
 */
export default function App() {
  AndroidTimerFix(); // First of all, run a timer fix to suppress the LogBox timer warning messages.

  // State to keep track of user
  const [user, setUser] = useState(null);

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#002366",
      primaryContainer: "#002366",
      secondaryContainer: "#7ca6f7",
      onPrimaryContainer: "white",
      surface: "green",
    },
  };

  /**
   * Function to handle user pickup through biometric authentication.
   * This is only executed after successful authentication, the user is then retrieved from context and signed back in
   */
  const biometricAuth = () => {
    const usersRef = collection(db, "users");
    onAuthStateChanged(auth, (user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data();
            setUser(userData);
          })
          .catch((error) => {});
      }
    });
  };

  /**
   * Sign out.
   * Signs the current user out of firebase, then nullifies the user state.
   */
  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        alert(error);
      });
  };

  /**
   * Login Error Message.
   */
  const loginError = () => {
    Alert.alert(
      "Could not sign in",
      "Please sign in using your email address and password.",
      [{ text: "Return", style: "cancel" }]
    );
  };

  const authContext = useMemo(
    () => ({
      /**
       * Sign In.
       * Takes data from the login screen or saved user context and authenticates
       * @param data user data
       */
      signIn: async (data) => {
        // console.log(data);
        await signInWithEmailAndPassword(auth, data.email, data.password)
          .then((response) => {
            // console.log(response);
            const uid = response.user.uid;
            // Further information about the user is stored in the users firestore collection
            // The app will not work without this collection, as passwords are stored as a subset of this.
            const usersRef = collection(db, "users");

            getDoc(doc(db, "users", uid))
              .then((firestoreDocument) => {
                if (!firestoreDocument.exists()) {
                  // Show error if no accompanying user information is found.
                  // Returns before the user is set, so it shouldn't be possible to proceed further
                  loginError();
                  showDialog();
                  return;
                }
                const userData = firestoreDocument.data();
                // Set user, this will then trigger the home screen through the navigation stack
                setUser(userData);
              })
              .catch((error) => {
                // Show login error on failure
                loginError();
                showDialog();
              });
          })
          .catch((error) => {
            // Show login error on failure
            loginError();
            showDialog();
          });
      },
      /**
       * Sign out.
       * Signs the current user out of firebase, then nullifies the user state.
       * This is activated from a button in the settings screen.
       */
      signOutUser: async () => {
        await signOut(auth)
          .then(() => {
            setUser(null);
            console.log("User signed out");
          })
          .catch((error) => {
            alert(error);
          });
      },
      /**
       * Sign Up.
       * The sign up process goes through multiple screens before completing.
       * Login Screen -> Registration Screen -> Encryption Key Setup
       * Data is passed through to the encryption key setup screen. Once complete, this function is then executed
       * using all data inherited through the frames.
       */
      signUp: async (data) => {
        // Create Firebase Authentication entry
        createUserWithEmailAndPassword(auth, data.email, data.password)
          .then((response) => {
            const uid = response.user.uid;
            // Create supplementary user database
            const userData = {
              id: uid,
              email: data.email,
              fullName: data.fullName,
              passphrase: data.passphrase,
            };
            // console.log(userData);

            const userRef = doc(db, "users", uid);
            setDoc(userRef, userData)
              .then(() => {
                // console.log("tao acc thanh cong");
                setUser(userData);
              })
              .catch((error) => {
                // Show error on failure
                alert(error);
              });
          })
          .catch((error) => {
            // Show error on failure
            alert(error);
          });
      },
    }),
    []
  );
  // Finally return the auth context and react navigation stack to launch the application.
  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          {/* Call Stack Navigator */}
          <StackNavigatorContainer
            user={user}
            signOut={signOutUser}
            biometricAuth={biometricAuth}
          />
        </NavigationContainer>
      </AuthContext.Provider>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Icon icon="alert" />

          <Dialog.Title style={{ textAlign: "center" }}>
            Invalid Login Credentials
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              The email address and/or password details entered are not valid.
              Please enter the correct details in the address and password
              fields. If you have forgotten your password, you can reset it
              through the reset password button. A new account can also be made
              in this location.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Okay</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
}
