# Tarot Card Tracker

A simple, elegant web application for tracking tarot card readings and analyzing patterns over time. Built as a standalone HTML/JavaScript app that runs entirely in your browser.

## Features

### Card Selection
- **All 78 Tarot Cards** organized logically:
  - 22 Major Arcana cards (0-XXI)
  - 56 Minor Arcana cards organized by suit (Wands, Cups, Swords, Pentacles)
- **Quick-click interface** for fast card logging
- **Reversed card toggle** for tracking card orientations

### Session Tracking
- Build readings by clicking cards in sequence
- Track position of each card in the reading
- Add optional notes to readings
- Remove individual cards from current reading
- Clear or save readings easily

### Data Persistence
- **Automatic saving** to browser localStorage
- **Export to JSON** for backup and portability
- **Import JSON** to restore or merge data
- Download readings as timestamped JSON files

### Statistics & Analytics
- Total readings and cards tracked
- Average cards per reading
- Reversed card percentage
- Category breakdown (Major vs Minor Arcana)
- Suit distribution analysis
- Top 10 most frequently drawn cards
- Recent reading history with full details

## Getting Started

### Installation
1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. No server, dependencies, or installation required!

### Usage

#### Recording a Reading
1. Click cards in the order you draw them
2. Toggle "Reversed Card" before clicking if the card appears reversed
3. Cards appear in the "Current Reading" panel on the right
4. Add optional notes about the reading
5. Click "Save Reading" when complete

#### Viewing Statistics
- Quick stats always visible in the right panel
- Click "View Statistics" for detailed analysis
- See patterns, frequencies, and recent reading history

#### Managing Data
- **Export Data**: Download all readings as JSON
- **Import Data**: Restore or merge readings from JSON file
- **Clear Reading**: Discard current reading without saving

## Data Format

Readings are stored in JSON format with the following structure:

```json
{
  "exportDate": "2025-10-25T12:00:00.000Z",
  "version": "1.0",
  "totalSessions": 10,
  "sessions": [
    {
      "id": "session_1234567890_abc123",
      "timestamp": "2025-10-25T12:00:00.000Z",
      "cardCount": 3,
      "notes": "Morning reading about career",
      "cards": [
        {
          "name": "0 - The Fool",
          "category": "Major Arcana",
          "suit": null,
          "reversed": false,
          "timestamp": "2025-10-25T12:00:00.000Z",
          "position": 1
        }
      ]
    }
  ]
}
```

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires JavaScript enabled and localStorage support.

## Privacy

All data stays on your device:
- No server communication
- No tracking or analytics
- Data stored only in browser localStorage
- Export your data anytime for backup

## Tips

- **Regular Exports**: Export your data regularly as backup
- **Detailed Notes**: Add notes to remember context of readings
- **Pattern Analysis**: Use statistics to identify which cards appear most frequently
- **Multiple Devices**: Export from one device and import to another to sync

## Future Enhancements

Potential features for future versions:
- Spread type templates (Celtic Cross, Three Card, etc.)
- Multiple deck support
- Advanced pattern detection
- Date range filtering
- Card meaning references
- Visual charts and graphs
- Dark/light theme toggle

## Technical Details

- **Pure HTML/CSS/JavaScript** - No frameworks or dependencies
- **localStorage API** for data persistence
- **Responsive design** for mobile and desktop
- **Single-page application** for instant loading

## License

See LICENSE file for details.

## Contributing

This is a personal project but suggestions and improvements are welcome!

---

**Enjoy tracking your tarot journey!** 🔮
