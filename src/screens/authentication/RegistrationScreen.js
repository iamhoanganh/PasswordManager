import React from 'react'
import {Text, View} from "react-native";
import Styles from "../../styles/Style";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {TextInputBox} from "../../components/TextInputBox";
import {ClickableButton} from "../../components/ClickableButton";
import Style from "../../styles/Style";
import { TextInput } from 'react-native-paper'


/**
 * Registration Screen
 * @param setFullName user full name setter
 * @param fullName user full name
 * @param setEmail set email address
 * @param email email address
 * @param setPassword password setter
 * @param password password
 * @param setConfirmPassword confirm password setter
 * @param confirmPassword confirm password
 * @param onRegisterPress register button listener function
 * @param onFooterLinkPress footer button listener function
 * @returns {JSX.Element} registration view
 */
export function RegistrationScreen({setFullName, fullName, setEmail, email, setPassword, password, setConfirmPassword, confirmPassword, onRegisterPress, onFooterLinkPress}){
    return (
        <View style={Styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">

                {/* Text input fields */}
                <TextInputBox placeholder={'Full Name'} textSetter={setFullName} value={fullName}/>
                <TextInputBox placeholder={'E-mail'} textSetter={setEmail} value={email}/>



                <TextInput
                    label="Password"
                    value={password}
                    mode="outlined"
                    onChangeText={(text) => setPassword(text)}
                    style={Style.input}
                />

                <TextInput
                    label="Confirm password"
                    value={confirmPassword}
                    mode="outlined"
                    onChangeText={(text) => setConfirmPassword(text)}
                    style={Style.input}
                />




                {/* Continue Button */}
                <ClickableButton buttonText={"Continue"} onPressMethod={onRegisterPress}/>

                {/* Footer Link */}
                <View style={Styles.footerView}>
                    <Text style={Styles.footerText}><Text onPress={onFooterLinkPress} style={Styles.footerLink}>Already have an account? Log in</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}
