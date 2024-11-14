// scripts/generate-sounds.js

const fs = require('fs');
const { execSync } = require('child_process');

const generateAudioFile = (name, frequency, duration) => {
  const command = `ffmpeg -f lavfi -i "sine=frequency=${frequency}:duration=${duration}" -acodec libmp3lame public/sounds/${name}.mp3`;
  try {
    execSync(command);
    console.log(`Generated ${name}.mp3`);
  } catch (error) {
    console.error(`Failed to generate ${name}.mp3:`, error);
  }
};

// Create sounds directory if it doesn't exist
if (!fs.existsSync('public/sounds')) {
  fs.mkdirSync('public/sounds', { recursive: true });
}


// Generate placeholder sounds
generateAudioFile('card-play', 440, 0.2);     // A4 note
generateAudioFile('card-draw', 523.25, 0.2);  // C5 note
generateAudioFile('resource-gain', 659.25, 0.3); // E5 note
generateAudioFile('combat-start', 392, 0.5);   // G4 note
generateAudioFile('combat-hit', 329.63, 0.3);  // E4 note
generateAudioFile('upgrade-complete', 587.33, 0.4); // D5 note
generateAudioFile('round-start', 493.88, 0.5); // B4 note
generateAudioFile('round-end', 440, 0.5);      // A4 note
generateAudioFile('error', 220, 0.3);          // A3 note
