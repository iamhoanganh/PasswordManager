import React from "react";
import {View} from "react-native";
import Style from "../styles/Style";
import Slider from "@react-native-community/slider";

export function LengthSlider({value, setter}) {
    return (
        <View style={Style.slider}>
            <Slider
                onValueChange={(text) => setter(text)}
                minimumValue={1}
                value={value}
                maximumValue={64}
                step={1}
                minimumTrackTintColor={'#002366'}
            />
        </View>
    );
}
