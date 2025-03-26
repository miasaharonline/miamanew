// This file provides a mock implementation of ffmpeg for compatibility

const ffmpeg = {
  setFfmpegPath: function (path) {
    // Mock implementation to prevent errors
    console.log("Mock ffmpeg.setFfmpegPath called with path:", path);
    this.ffmpegPath = path;
  },
  ffmpegPath: null,
};

// Export the mock object directly
module.exports = ffmpeg;
