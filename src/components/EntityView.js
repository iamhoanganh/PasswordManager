import React from "react";
import {Card, IconButton, Badge} from 'react-native-paper';

export function EntityView({displayName, email, passwordEntityId, userId, accent, props}) {

    const pressCard = () => {
        props.navigation.navigate('ViewPasswordScreen', {
            passwordEntityId: passwordEntityId,
            userId: userId,
            returningFromEdit: false,
        });
    }

    return (
            <Card style={{marginTop: 5, marginBottom: 5, marginLeft: 1, marginRight: 1}} onPress={pressCard}>
            <Card.Title
                mode={"contained"}
                title={displayName}
                subtitle={email}
                left={() => <Badge size={42} style={[{ backgroundColor: accent }]}></Badge>}
                right={(props) => <IconButton {...props} icon="menu-right"/>}
            />
            </Card>

    );
}


