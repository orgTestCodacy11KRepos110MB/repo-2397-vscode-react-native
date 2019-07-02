// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.

import * as cp from "child_process";
import * as kill from "tree-kill";
import * as path from "path";
import { artifactsPath } from "../main";

/**
 * Defines the needed `ffmpeg` launch args
 * @param Format - approach for recording video. Depends on platform
 * @param Input - system device from which video stream will be captured. Not needed for Windows, but required for macOS and Linux, e.g. `:0`
 * @param Framerate - positive integer which represents the framerate of target video file
 * @param VideoSize - string in format `Width`x`Height` which represents the resolution of target video file
 * @param Output - path to the result video file with extension e.g. `.mp4`, `.avi`, `.mkv`
 */
export interface ffmpegOptions {
    Format?: string;
    Input?: string;
    Framerate: number;
    VideoSize: string;
    Output: string;
};

/**
 * Class for screen recording on macOS, Windows and Linux that uses `ffmpeg` for recording
 */
export class DesktopRecorder {
    private recorderProcess: cp.ChildProcess | null;
    private ffmpegExecutable = process.platform === "win32" ? "ffmpeg.exe": "ffmpeg";
    private ffmpegFormat = {
        "win32": "gdigrab",
        "linux": "x11grab",
        "darwin": "avfoundation",
    }
    private defaultOptions: ffmpegOptions = {
        Framerate: 30,
        VideoSize: "1920x1080",
        Output: path.join(artifactsPath, "testsRecord.mp4"),
    }

    public startRecord(options?: ffmpegOptions) {
        if (!options) {
            options = this.defaultOptions;
        }
        if (!options.Format) {
            options.Format = this.ffmpegFormat[process.platform];
        }

        let args = [
            "-video_size", options.VideoSize,
            "-f", options.Format || "",
        ];
        if (process.platform !== "win32") {
            args.push("-i", options.Input || "");
        }
        args.push(options.Output);
        this.recorderProcess = cp.spawn(this.ffmpegExecutable, args);
        this.recorderProcess.on("exit", () => {
            console.log("*** Video record finished, video saved as: %s", options ? options.Output : undefined);
        });
        this.recorderProcess.on("error", (error) => {
            console.error("Error occurred in ffmpeg process: ", error);
        });
    }


    public stopRecord() {
        if (this.recorderProcess) {
            kill(this.recorderProcess.pid, "SIGINT");
        }
    }
}

