import chalk from "chalk";

export const logger = {
    log: (message: string) => {
        console.log(
            chalk.bgGreenBright.black(" LOG ") +
                " " +
                chalk.greenBright(message)
        );
    },
    error: (message: string) => {
        console.log(
            chalk.bgRedBright.black(" ERROR ") + " " + chalk.redBright(message)
        );
    },
    warn: (message: string) => {
        console.log(
            chalk.bgYellowBright.black(" WARN ") +
                " " +
                chalk.yellowBright(message)
        );
    },
    info: (message: string) => {
        console.log(
            chalk.bgBlueBright.black(" INFO ") + " " + chalk.blueBright(message)
        );
    },
};
