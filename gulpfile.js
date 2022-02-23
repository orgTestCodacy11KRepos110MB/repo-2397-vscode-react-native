// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.

const gulp = require("gulp");
const vscodeTest = require("vscode-test");
const cp = require("child_process");
const { promisify } = require("util");
const fs = require("fs/promises");
const gulpTs = require("gulp-typescript");
const nls = require("vscode-nls-dev");
const filter = require("gulp-filter");
const { Writable } = require("stream");
const path = require("path");
const sourcemaps = require("gulp-sourcemaps");

const languages = [
    { id: "zh-tw", folderName: "cht", transifexId: "zh-hant" },
    { id: "zh-cn", folderName: "chs", transifexId: "zh-hans" },
    { id: "ja", folderName: "jpn" },
    { id: "ko", folderName: "kor" },
    { id: "de", folderName: "deu" },
    { id: "fr", folderName: "fra" },
    { id: "es", folderName: "esn" },
    { id: "ru", folderName: "rus" },
    { id: "it", folderName: "ita" },

    // These language-pack languages are included for VS but excluded from the vscode package
    { id: "cs", folderName: "csy" },
    { id: "tr", folderName: "trk" },
    { id: "pt-br", folderName: "ptb", transifexId: "pt-BR" },
    { id: "pl", folderName: "plk" },
];

const config = {
    extensionName: process.argv.includes("--nightly")
        ? "vscode-react-native-preview"
        : "vscode-react-native",

    dest: path.resolve("./dist"),
    entry: path.resolve(`./src/extension/rn-extension.ts`),
    languages,
};

const buildTranslation = async () => {
    {
        // disables useless logs
        let stdWrite = process.stdout.write;
        var stopOuput = () => (process.stdout.write = () => {});
        var resumeOutput = () => (process.stdout.write = stdWrite);
    }

    const tsProject = gulpTs.createProject("tsconfig.json");

    stopOuput();
    await new Promise(resolve => {
        tsProject
            .src()
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .js.pipe(nls.createMetaDataFiles())
            .pipe(nls.createAdditionalLanguageFiles(languages, "i18n"))
            .pipe(nls.bundleMetaDataFiles(config.extensionName, "dist"))
            .pipe(nls.bundleLanguageFiles())
            .pipe(
                filter([
                    "**/nls.bundle.*.json",
                    "**/nls.metadata.header.json",
                    "**/nls.metadata.json",
                    "!src/**",
                ]),
            )
            .pipe(gulp.dest("dist"))
            .once("end", resolve);
    });
    resumeOutput();
};

gulp.task("build", async () => {
    await fs.rm(config.dest, { recursive: true, force: true });
    // await buildTranslation();
    await new Promise(resolve => {
        cp.exec(`npx webpack ${config.entry} --mode development --output-path ${config.dest} `)
            .stdout.once("end", () => {
                resolve();
            })
            .pipe(process.stdout);
    });
});
