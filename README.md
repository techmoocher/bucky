# Save the Bucky

This is the full webpage version of **Save the Bucky**, an offline survival
game set on the Bucknell University quad. The Standardizer, a rogue AI, is
replacing curiosity and independent thought with obedient machines. Defend the
quad, defeat the robots, collect knowledge, and restore every university major.

## Run the game

No server, package manager, build step, or network connection is required.

1. Open [`index.html`](index.html) in a modern browser.
2. If you want to run the standalone submission instead, open
   [`main.html`](main.html).

The game works directly from `file://`.

## Controls

- Move with `WASD` or the arrow keys.
- Press `Space` to dash and briefly become invulnerable.
- Press `Escape` or `P` to pause.
- Press `M` to mute all sound.
- Press `H` to hide or show the combat sidebar.

The game also includes independent music and sound controls, reduced-motion
settings, progress export/import, and a reset option.

## Repository layout

```text
.
├── index.html          # Main webpage entry point
├── main.html           # Self-contained standalone game entry point
├── scripts/
│   └── game.js         # Shared game logic
├── styles/
│   └── main.css        # Shared webpage styles
├── docs/
│   └── GAME_SPEC.md    # Development specification, when included locally
├── LICENSE             # MIT License
└── README.md           # Documentation for this webpage branch
```

The runtime has no external assets, libraries, fonts, or services. Keep
`index.html`, `scripts/`, and `styles/` together when moving or deploying the
webpage version.

## Progression

Each run starts with baseline abilities. Survive escalating 20-second waves,
defeat Scouts, Enforcers, Bulwarks, Artillery units, Interceptors, and the
Standardizer boss, then spend EXP on temporary combat upgrades.

Major discoveries persist between runs. Every major can be selected three
times:

1. Declared
2. Practiced
3. Mastered

Master all 67 majors to unlock the Bucky and Digger victory ceremony. The
Academic Progress Report provides searchable collection details, colleges,
effects, discovery state, and mastery filters.

## Saving and importing

- Browser local storage provides best-effort autosave for campaign progress.
- Use **Export Progress** to download a portable `bucky-progress.json` backup.
- Use **Import Progress** from the title screen to review and restore a
  compatible save.
- **Reset Progress** requires confirmation and retains sound and display
  preferences.

An exported save is a campaign snapshot. It does not resume an exact active
battle.

## References

The 67-major collection follows the separately listed entries under the Arts &
Sciences, Management, and Engineering major lists in Bucknell University's
directory, checked on September 18, 2026. It preserves separately listed
tracks and interdisciplinary entries, and excludes minors and the separate
dual-degree-program section.

- [Bucknell majors and minors](https://www.bucknell.edu/academics/majors-minors)
- [About Bucky](https://magazine.bucknell.edu/issue/summer-2019/all-about-bucky/)
- [Digger the Bernese mountain dog](https://www.bucknell.edu/fac-staff/digger)

These references inform the game's collection convention and characters. The
game itself remains playable without an internet connection.

## License

This project is released under the [MIT License](LICENSE).
