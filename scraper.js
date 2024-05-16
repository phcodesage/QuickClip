const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR);
}

const YT_DLP_PATH = '/home/devart/.local/bin/yt-dlp';  // Replace with the actual path to yt-dlp

const downloadVideo = (url, outputPath) => {
    return new Promise((resolve, reject) => {
        const command = `${YT_DLP_PATH} -f best -o ${outputPath} ${url}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error downloading video: ${stderr}`);
                reject(new Error('Failed to download video'));
            } else {
                console.log(`Video downloaded: ${outputPath}`);
                resolve(outputPath);
            }
        });
    });
};

const convertToAudio = (videoPath, audioPath) => {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -i ${videoPath} -q:a 0 -map a ${audioPath}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error converting video to audio: ${stderr}`);
                console.error(`ffmpeg stdout: ${stdout}`);
                console.error(`ffmpeg stderr: ${stderr}`);
                reject(new Error('Failed to convert video to audio'));
            } else {
                console.log(`Audio file created: ${audioPath}`);
                resolve(audioPath);
            }
        });
    });
};

const downloadAndConvert = async (url, format) => {
    try {
        const timestamp = new Date().getTime();
        const videoPath = path.join(DOWNLOAD_DIR, `video_${timestamp}.mp4`);
        const audioPath = path.join(DOWNLOAD_DIR, `audio_${timestamp}.mp3`);

        await downloadVideo(url, videoPath);

        if (format === 'mp3') {
            await convertToAudio(videoPath, audioPath);
            // Remove the video file after conversion to save space
            fs.unlinkSync(videoPath);
            return audioPath;
        }

        return videoPath;
    } catch (error) {
        console.error('Error in downloadAndConvert:', error);
        throw error;
    }
};

module.exports = { downloadAndConvert };
