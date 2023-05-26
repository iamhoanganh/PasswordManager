import { StyleSheet } from 'react-native';

/**
 * Global Application Stylesheet.
 * used to store stylesheet information for entities which are used throughout the application.
 */
export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },

    passwordLengthText: {
        alignSelf: 'center',
        fontSize: 36,
        fontWeight: "bold",
    },

    input: {
        marginHorizontal: 7,
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20
    },
    footerText: {
        fontSize: 16,
        color: '#002366',
        marginBottom: 15

    },
    footerLink: {
        color: "#002366",
        fontWeight: "bold",
        fontSize: 16
    },
    button: {
        marginHorizontal: 7,
        marginTop: 10,
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
    text: {
        fontSize: 18,
        marginLeft: 30,
        paddingLeft: 0,
    },
    titleText: {
        fontSize: 18,
        textAlign: "center",
        flex: 1,
        fontWeight: "bold",
    },
    infoView: {
        paddingTop: 15,
        paddingBottom: 15,
        margin: 15,
        borderColor: 'black',
        borderRadius: 3,
        borderTopWidth:1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1

    },
    textAreaContainer: {
        paddingHorizontal: 12,
    },
    textArea: {
        textAlignVertical: "top",
        height: 120,
        justifyContent: "flex-start",
        maxHeight: 60,
    },
    settingsContainer: {
        backgroundColor: "white",
        margin: 8,
        borderRadius: 5,
        padding: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        borderBottomColor: "#E0E0E0",
        borderBottomWidth: 2,
    },

    switchView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 30,
        paddingVertical: 12,
    },
    slider: {
        marginHorizontal: 30,
    },
    selectedButtonStyle: {
        backgroundColor: '#DBDBDB',
    },

    segmentedButtons: {
        paddingTop: 5,
    },

    fab: {
        position: 'absolute',
        margin: 36,
        right: 0,
        bottom: 0,
    },

    cont: {
        flex: 1,
        justifyContent: 'space-between',
    },

    title: {
        textAlign: 'center',
    }

});
