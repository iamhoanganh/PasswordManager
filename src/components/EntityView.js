import React from "react";
import { Card, IconButton } from "react-native-paper";
import LogoBrand from "./LogoBrand";

export function EntityView({
  displayName,
  email,
  passwordEntityId,
  userId,
  props,
}) {
  const pressCard = () => {
    props.navigation.navigate("ViewPasswordScreen", {
      passwordEntityId: passwordEntityId,
      userId: userId,
      returningFromEdit: false,
    });
  };
  return (
    <Card
      style={{ marginTop: 5, marginBottom: 5, marginLeft: 1, marginRight: 1 }}
      onPress={pressCard}
    >
      <Card.Title
        mode={"contained"}
        title={displayName}
        subtitle={email}
        left={() => (
          <LogoBrand
            brand={displayName}
            logoUrl={`https://logo.clearbit.com/${displayName}.com`}
          />
          // <Badge size={42} style={[{ backgroundColor: accent }]}></Badge>
        )}
        right={(props) => <IconButton {...props} icon="menu-right" />}
      />
    </Card>
  );
}
