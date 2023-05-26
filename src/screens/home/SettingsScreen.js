import React, { useEffect, useState } from "react";
import { Linking, View } from "react-native";
import styles from "./styles";
import { db } from "../../config/FirebaseConfig";
import { Card, Text, Button, Divider } from "react-native-paper";
import { doc, getDoc } from "firebase/firestore";

export default function SettingsScreen(props) {
  // Get user ID from props. Used only for retrieving the name and email information for the account.
  const { userId } = props.route.params;
  let userID = userId;

  // States for name and email account
  const [userFullName, setUserFullName] = useState("");
  const [userEmailAddress, setUserEmailAddress] = useState("");

  // On entering this page, retrieve the name and email information about the user, and set the above fields
  useEffect(() => {
    getDoc(doc(db, "users", userID)).then((snapshot) => {
      let data = snapshot.data();
      setUserFullName(data.fullName);
      setUserEmailAddress(data.email);
    }, []);
  });

  /**
   * Return contents
   * - User Profile Information: Username and password
   * - Account Information: Sign out button
   */
  return (
    <View style={styles.container}>
      <Card
        style={{
          marginTop: 5,
          marginBottom: 5,
          marginHorizontal: 7,
          paddingVertical: 10,
        }}
      >
        <Card.Content>
          <Text variant="titleLarge">{userFullName}</Text>
          <Text variant="bodyMedium">Email Address: {userEmailAddress}</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={props.onSignOut}>
            Sign Out
          </Button>
        </Card.Actions>
      </Card>
      <Card
        style={{
          marginTop: 5,
          marginBottom: 5,
          marginHorizontal: 7,
          paddingVertical: 10,
        }}
      >
        <Card.Content>
          <Text variant="titleLarge">About</Text>
          <Text variant="bodyMedium">Password Manager</Text>
          <Divider />
          <Text variant="labelMedium">Packages Used:</Text>
          <Text variant="labelSmall">react-native-community/slider</Text>
          <Text variant="labelSmall">react-native-masked-view/masked-view</Text>
          <Text variant="labelSmall">react-native-picker/picker</Text>
          <Text variant="labelSmall">react-navigation/native</Text>
          <Text variant="labelSmall">react-navigation/stack</Text>
          <Text variant="labelSmall">crypto-es</Text>
          <Text variant="labelSmall">expo</Text>
          <Text variant="labelSmall">expo-cli</Text>
          <Text variant="labelSmall">expo-clipboard</Text>
          <Text variant="labelSmall">firebase</Text>
          <Text variant="labelSmall">react</Text>
          <Text variant="labelSmall">react-colorful</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => {}}>
            Github Repository
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
