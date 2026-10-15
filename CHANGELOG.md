# Changelog

All notable changes to runeoverland.no are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The site is published from the `live` branch and has no version numbers.

## Unreleased

### Added

- The "How I build" page at `/build/`: the 3D studio tells the story in four reading stops in the camera's forward order, then a recap chapter where the four headlines, as one paragraph, light up word by word as you scroll while the scene fades to black. The page falls back to a plain reading mode, with the same five chapters, when the 3D code cannot load.
- GitHub in the navigation and in the contact block on the build page.
- `README.md`, `AGENTS.md` and `CLAUDE.md`, so the repo explains how to run it, what each folder and root file is for, and the local rules.
- `docs/decisions/`, starting with the decision to deploy by serving the `live` branch raw.
- Decision 0002: the build page story stops at four camera views in film order and ends on a recap.
- Decision 0003: the recap lights its words one by one, driven linearly by scroll.
- A pull request template and code owners.
