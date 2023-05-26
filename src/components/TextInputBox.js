import React from "react";
import {TextInput} from 'react-native-paper'
import Style from "../styles/Style";

export function TextInputBox({placeholder, textSetter, value}) {
    return (
        <TextInput
            label={placeholder}
            value={value}
            mode="outlined"
            onChangeText={(text) => textSetter(text)}
            style={Style.input}
        />
    )
}
