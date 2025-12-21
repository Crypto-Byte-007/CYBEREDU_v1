# Sound Effects

This directory contains audio files for the simulation engine:

- `success.mp3` - Played when user answers correctly
- `fail.mp3` - Played when user answers incorrectly

## Adding Sound Files

To add actual sound effects:

1. Find or create short audio clips (0.5-1 second duration)
2. Convert to MP3 format
3. Name them `success.mp3` and `fail.mp3`
4. Place in this directory

## Fallback

If audio files are not available, the system will use Web Audio API to generate synthetic beep sounds.