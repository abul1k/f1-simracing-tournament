# Championship data

Everything the site shows comes from the files in this folder. Edit them, commit,
and push — the site rebuilds itself. You never need to touch the code.

## Which file do I edit?

| File | What it holds |
| --- | --- |
| `championship.json` | Season name, game, and the points-per-position table |
| `teams.json` | The ten teams: id, name, short name, livery colour |
| `drivers.json` | The twenty drivers: id, name, car number, and which team they drive for |
| `calendar.json` | The season calendar: round number, country, race type, date |
| `rounds/round-NN.json` | One file per round — qualifying and race results |
| `standings.json` | **Generated. Do not edit** — it is overwritten on every push |

## Entering a race result

Open the round's file, for example `rounds/round-01.json`, and fill in the
`race.results` list. One entry per driver:

```json
{
  "driverId": "DRV001",
  "position": 1,
  "gridPosition": 3,
  "status": "finished",
  "fastestLap": true
}
```

- `driverId` — must match an `id` in `drivers.json`
- `position` — where they finished
- `gridPosition` — where they started
- `status` — `finished`, `dnf` (did not finish), or `dsq` (disqualified)
- `fastestLap` — `true` for the one driver who set it, `false` for everyone else

**Do not type in `points`.** Points are calculated automatically from the scoring
table in `championship.json`, and anything you type there is overwritten.

When the round is done, change `"status": "pending"` to `"status": "completed"`
at the top of the `race` section. **A round only appears in the standings once
its race status is `completed`.** Qualifying has its own separate status.

## Adding a new round

Copy an existing round file, rename it to match the round number
(`round-07.json` for round 7), and update the `round` field inside it. The round
number must already exist in `calendar.json`.

## If the push fails

The build checks your edits before publishing, and refuses to publish broken
data. If a push fails, open the failed run on the repository's Actions tab — the
error names the file, the field, and what is wrong with it, for example:

```
data/rounds/round-01.json
  race.results[4].driverId — "DRV099" is not a driver in data/drivers.json
```

Fix that field and push again. Nothing goes live until the data is valid.

## How points are worked out

- A finisher scores the points listed for their position in `championship.json`.
- The fastest lap adds a bonus point, but only for a driver finishing in the top ten.
- A `dnf` or `dsq` scores nothing, whatever position is recorded.
- Drivers level on points are separated by countback: most wins first, then most
  second places, then most thirds, and so on.
