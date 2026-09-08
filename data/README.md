# Championship data

Everything the site shows comes from the files in this folder. Edit them, commit,
and push — the site rebuilds itself. You never need to touch the code.

## Which file do I edit?

| File | What it holds |
| --- | --- |
| `championship.json` | Season name, game, and the points-per-position table |
| `teams.json` | The ten teams: id, name, short name, livery colour |
| `drivers.json` | Every driver: id, name, car number, and which team they drive for |
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
- `position` — where they are classified. A `dnf` or `dsq` can keep a position
  too — it scores nothing either way — or use `null` to leave them unclassified
- `gridPosition` — where they started
- `status` — `finished`, `dnf` (did not finish), `dsq` (disqualified), or `dns`
  (did not start)
- `fastestLap` — `true` for the one driver who set it, `false` for everyone else
- `racedFor` — **reserve drivers only.** The team they stood in for that round

**You only list the drivers who turned up.** Anyone with a seat who is missing
from the file is shown as `DNS` for that round automatically, in both qualifying
and the race — you never have to type those rows in yourself.

## Reserve drivers

A reserve driver has `"teamId": null` in `drivers.json`. They have no team of
their own, so the site shows them as **Reserve Driver** everywhere their own
team would normally appear.

When admins call one up to replace a driver who cannot race, say who they drove
for by adding `racedFor` to their result:

```json
{
  "driverId": "DRV021",
  "position": 6,
  "gridPosition": 18,
  "status": "finished",
  "fastestLap": false,
  "racedFor": "TEAM_REN"
}
```

That one line is all it takes. From it:

- The reserve keeps the points **for themselves** in the drivers' championship.
- The same points go to **Renault** in the constructors' championship.
- Every table for that round — results, podium, race history — shows them in
  Renault colours instead of `Reserve Driver`.

You only have to write `racedFor` once. Put it on the race result and the round's
qualifying result picks it up too. If you write it in both places, the two must
name the same team, or the build stops.

The driver being replaced is **not** left in the file as a finisher. Either drop
them from that round entirely, or mark them `"status": "dns"`. If three cars end
up counted for one team, the build warns you and names them — it still publishes,
because a warning is a guess about your intent, not a broken file.

A reserve who was not called up for a round is simply left out of it. They are
not an entrant, so they show a dash rather than `DNS`.

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
- Points always follow the driver. In the constructors' table they follow the
  car, which is what `racedFor` names.
- The fastest lap adds a bonus point, but only for a driver finishing in the top ten.
- A `dnf`, `dsq` or `dns` scores nothing, whatever position is recorded.
- Drivers level on points are separated by countback: most wins first, then most
  second places, then most thirds, and so on.
