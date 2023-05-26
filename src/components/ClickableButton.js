import React from "react";
import Style from "../styles/Style";
import { Button } from 'react-native-paper';


/**
 * A simple button structure. Allows for an action to be called when pressed, and has a customisable text.
 * Style inherited from global styles file (/styles/Style.js)
 * @param buttonText Button label
 * @param onPressMethod Passed in function for what you want the button to do
 * @returns {JSX.Element} Button Render View
 */
export function ClickableButton({buttonText, onPressMethod}) {
    return (
        <Button style={Style.button} mode="contained" onPress={() => onPressMethod()}>{buttonText}</Button>
    );
}
