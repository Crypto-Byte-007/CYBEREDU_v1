# Tutor Voice Pack

This directory contains voice files for the AI tutor system:

## Required Files:
- `correct.mp3` - Played when student answers correctly
- `wrong.mp3` - Played when student answers incorrectly  
- `hint.mp3` - Played when providing hints
- `welcome.mp3` - Played when starting a lab
- `strict.mp3` - Default tutor voice for instructions

## Fallback System:
If audio files are not available, the system automatically uses Web Speech API for text-to-speech with contextual voice modulation:

- **Correct answers**: Higher pitch, faster rate
- **Wrong answers**: Lower pitch, slower rate  
- **Hints**: Normal pitch and rate
- **Welcome**: Friendly tone
- **Instructions**: Authoritative tone

## Adding Voice Files:
1. Record or generate short audio clips (1-3 seconds)
2. Convert to MP3 format
3. Name according to the list above
4. Place in this directory