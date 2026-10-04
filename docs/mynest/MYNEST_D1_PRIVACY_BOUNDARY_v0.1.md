# MyNest D1 Privacy Boundary v0.1

Date: 2026-10-04

## Boundary

Only families who select anonymous pilot sharing generate network events.
Personal notes and child-selected text remain browser-local. The client builds
a new object from an explicit allowlist before every request, and the Worker
independently rejects unknown or prohibited keys before touching D1.

## Allowed envelope

- `client_event_id`: random UUID v4 generated once in the browser
- `household_id`: anonymous `NEST-` code plus four uppercase alphanumerics
- `event_type`: one of the five defined progress events
- `step`: integer 1–5
- `client_created_at`: bounded parseable timestamp
- `payload`: only the structured fields below

Allowed payload fields are `age_band`, `problem_code`, `theme`,
`room_entry_willingness`, `own_room_result`, `own_room_nights`,
`verified_transition`, `readiness_confirmed`, `checkpoint_day`,
`checkpoint_willingness`, and `checkpoint_result`.

## Explicitly prohibited

The Worker rejects `name`, `child_name`, `email`, `phone`, `address`, `notes`,
`note`, `comment`, `message`, `free_text`, `text`, `exact_birthdate`,
`date_of_birth`, `birthdate`, `dob`, `child_selected_text`, and `tinyChoice` at
both the top-level and payload boundary. Any other unknown field is rejected.

The D1 schema has no destination columns for any of these values. Raw IP
addresses are not stored. There is no service-role key, public database key,
or database credential in the browser bundle.

## Regression protection

Automated tests iterate the explicit prohibited-field list at both nesting
levels and require HTTP 400 `PROHIBITED_FIELD`. Client tests also verify that
legacy local events containing synthetic notes or child-selected text are
stripped before `fetch` is called.
