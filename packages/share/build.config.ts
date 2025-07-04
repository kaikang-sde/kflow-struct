import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
    entries: [
        "./src/index",
    ],
    outDir: "./dist",

    // Generates ts files for other sub projects usage
    declaration: true,
    rollup: {
        emitCJS: true, // commonjs 
    },
    externals: [ // exclude external dependencies，they are already included in node_modules in root
        "react", "react-dom", "@mui/material", "@emotion/react", "@emotion/styled"
    ],
});