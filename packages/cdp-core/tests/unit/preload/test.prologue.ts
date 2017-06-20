namespace Config {
    export const DEBUG = ((): boolean => {
        return !!("%% buildsetting %%");
    })();
}
