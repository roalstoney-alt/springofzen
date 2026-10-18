# Order state machine

1. `ORDER_RECEIVED`
2. `CUSTOMER_INPUT_PENDING`
3. `INPUT_VALIDATED`
4. `FOREST_SOURCE_ASSETS_LOADED`
5. `DESIGN_GENERATION`
6. `DESIGN_FIDELITY_CHECK`
7. `HUMAN_QA`
8. `DELIVERABLE_READY`
9. `HUMAN_DELIVERY_APPROVAL`
10. `DELIVERED`
11. `CUSTOMER_FEEDBACK`

## Required record

Every private order record tracks Etsy order reference, product version, input completeness, source asset version, generation method, human-review result, production time, rework count, delivery timestamp, actual delivery cost, and optional customer feedback.

## Guards

- `INPUT_VALIDATED` blocks on missing required fields or unnecessary personal information.
- `DESIGN_FIDELITY_CHECK` blocks when Forest identity is not preserved.
- `HUMAN_QA` is mandatory; no automated pass-through.
- `HUMAN_DELIVERY_APPROVAL` is mandatory; v0.1 never messages or delivers automatically.
- Customer data and customer-specific outputs stay in private storage and are never committed to this public repository.
