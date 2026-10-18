# Forest Starter fulfillment runbook

## Intake

1. Assign a unique private internal order reference.
2. Copy only required Etsy inputs into private storage.
3. Validate broad age range, room information, preferences, forest elements, furniture constraints, and optional room-only photo.
4. If required information is missing, prepare the clarification template for human approval. Do not send automatically.

## Production

1. Verify the six approved source hashes against `baseline/asset-provenance.json`.
2. Choose the relevant approved day, night, or rest artwork. Never substitute a generic forest image.
3. Create the annotated concept board using exact Forest artwork, a suggested palette, and constraint-aware direction.
4. Create the PDF summary from the approved template.
5. Record local processing time, rework count, and any measurable API/compute cost. Keep unknown labor and platform costs as `NOT_MEASURED`.

## QA and delivery

1. Run every item in `delivery/qa-checklist.md`.
2. Render the PDF to images and inspect all pages for clipping, overlap, and illegible text.
3. Route identity drift or complex geometry to manual design review.
4. Obtain human QA and human delivery approval.
5. Complete the made-to-order Etsy order with the agreed concept image and PDF. This step is outside the authorization of pilot v0.1.
6. Record delivery timestamp, actual cost, and optional buyer feedback privately.
