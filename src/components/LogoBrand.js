import React from "react";
import { Avatar } from "react-native-paper";
import { Image } from "react-native";

const LogoBrand = ({ brand, logoUrl }) => {
  return (
    <Avatar.Image
      size={42}
      source={() => (
        <Image
          source={{ uri: logoUrl }}
          style={{
            width: 42,
            height: 42,
            borderRadius: 50,
            backgroundColor: "#fff",
          }}
        />
      )}
    />
  );
};

export default LogoBrand;
