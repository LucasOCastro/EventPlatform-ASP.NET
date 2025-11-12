import {createTheme, virtualColor} from "@mantine/core";

export const theme = createTheme({
    colors: {
        myBlueLight:[
            "#ecf4ff",
            "#dce4f5",
            "#b9c7e2",
            "#94a8d0",
            "#748dc0",
            "#5f7cb7",
            "#5474b4",
            "#44639f",
            "#3a5890",
            "#2c4b80"
        ],

        myBlueDark: [
            "#eff2ff",
            "#dfe2f2",
            "#bdc2de",
            "#99a0ca",
            "#7a84b9",
            "#6672af",
            "#5c69ac",
            "#4c5897",
            "#424e88",
            "#36437a"
        ],

        primary: virtualColor({
            name: "primary",
            light: 'myBlueLight',
            dark: 'myBlueDark',
        })
    }
})