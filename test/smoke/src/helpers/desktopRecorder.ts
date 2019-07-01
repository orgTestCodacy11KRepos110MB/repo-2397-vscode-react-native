// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
import * as fs from "fs";
import * as path from "path";
const recorder = require("screen-capture-recorder");

export class DesktopRecorder {
    private recorderProcess: any;
    public startRecord(x: number, y: number, w: number, h: number, savePath: string){
        this.recorderProcess = new recorder({ x:0, y:0, w:1920, h:1080 });
        this.recorderProcess.warmup((err) => {
            //recorder is ready, now start capture
            this.recorderProcess.StartRecord((err) => {
                if(err) {
                    throw err;
                }
            });

            this.recorderProcess.once(recorder.EVENT_DONE, (err, tmp_path) => {
                if(!err) {
                    const filename = "videoRecord.ogg";
                    console.log("*** Video record finished successfully, file saved at: %s", path.join(savePath, filename));
                    //tmp_path is a temporary file that will be deleted on process exit, keep it by renaming it
                    fs.renameSync(tmp_path, tmp_path + ".ogg");
                    fs.copyFileSync(filename, path.join(savePath, filename));
                }
            });
        });
    }


    public stopRecord() {
        if (this.recorderProcess) {
            this.recorderProcess.StopRecord((err) => {
                if(err) {
                    throw err;
                }
            });
        }
    }
}

