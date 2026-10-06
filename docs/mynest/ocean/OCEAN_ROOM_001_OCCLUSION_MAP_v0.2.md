# Ocean Room 001 — Occlusion Map v0.2

Coordinates are normalized percentages of each dedicated art master. They guide the web composite and must be recalibrated against the physical pilot room.

## Desktop 16:9

| Mask | Approximate bounds/polygon | Use |
| --- | --- | --- |
| FLOOR | y 53–100 | Fish, contact light, weak caustics |
| LOWER_WALL | y 42–63 | Brief rear fish and Milo entry only |
| BED_FRONT | (73,40) (100,35) (100,100) (76,100) | Conceal Milo on home approach |
| HEADBOARD | x 74–100, y 15–46 | Rear boundary; no ordinary fish |
| SHELF | x 26–47, y 28–56 | Milo entry and fish hide edge |
| REEF | x 38–47, y 30–48 | Reef interaction anchor |
| CURTAIN | x 9–24, y 0–61 | Optional rear transit occluder |
| SHELL | x 64–75, y 24–48 | Shell local-light anchor |
| MILO_PLUSH | x 80–99, y 20–47 | Return-home destination |

## Mobile 9:16

| Mask | Approximate bounds/polygon | Use |
| --- | --- | --- |
| FLOOR | y 52–100 | Primary living zone |
| LOWER_WALL | y 36–58 | Brief rear movement only |
| BED_FRONT | (52,38) (100,35) (100,77) (72,65) | Home-path concealment |
| HEADBOARD | x 52–100, y 29–48 | Rear boundary |
| SHELF | x 14–53, y 39–54 | Entry/hide anchor |
| REEF | x 35–55, y 33–50 | Reef anchor |
| CURTAIN | x 0–19, y 0–55 | Rear boundary |
| SHELL | x 15–37, y 31–49 | Shell anchor |
| MILO_PLUSH | x 54–99, y 28–48 | Return-home destination |

## Composite order

Room background → restrained water light → rear fish → geometry occlusion → Milo/foreground fish → local object response → minimal controls.

The current L0.5 browser scene approximates occlusion with authored paths, scale, opacity, and furniture-aligned endpoints. Exact projector masks require on-site photography and measurements; this is the sole outstanding occlusion-calibration blocker.
