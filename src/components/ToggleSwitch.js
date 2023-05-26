import React from "react";
import {Text, View} from 'react-native'
import { Switch } from 'react-native-paper';

import ApplicationStyles from "../styles/Style";

export function ToggleSwitch({text, enabledStatus,switchValue}){
    return (
        <View style={ApplicationStyles.switchView}>
            <Text style={ApplicationStyles.text}>{text}</Text>
            <Switch
                onValueChange={switchValue}
                value={enabledStatus}
            />
        </View>
    )
}
