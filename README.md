# Save the Bucky — Standalone Edition

This branch contains the standalone submission of **Save the Bucky**, an
offline survival game set on the Bucknell University quad. The Standardizer, a
rogue AI, is replacing curiosity and independent thought with obedient
machines. Defend the quad, defeat the robots, collect knowledge, and restore
every university major.

## Run the game

Open [`main.html`](main.html) in a modern browser. The game runs directly from
`file://`; no server, installation, package manager, build step, or network
connection is required.

This branch intentionally keeps the playable game in one self-contained HTML
file so it can be submitted, copied, or archived easily.

## Controls

- Move with `WASD` or the arrow keys.
- Press `Space` to dash and briefly become invulnerable.
- Press `Escape` or `P` to pause.
- Press `M` to mute all sound.
- Press `H` to hide or show the combat sidebar.

The game also includes independent music and sound controls, reduced-motion
settings, progress export/import, and a reset option.

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

## Repository layout

```text
.
├── main.html    # Complete standalone game
├── LICENSE      # MIT License
└── README.md    # Documentation for this standalone branch
```

The full webpage version, including separate CSS and JavaScript files, is
maintained on the [`webpage` branch](https://github.com/techmoocher/bucky/tree/webpage).

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
