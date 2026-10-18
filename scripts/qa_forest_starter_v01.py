#!/usr/bin/env python3
"""Offline acceptance checks for the Forest Starter pilot artifacts."""

from __future__ import annotations

import csv
import json
import re
import sys
import zipfile
from pathlib import Path

from PIL import Image
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "artifacts/etsy/forest-starter/v0.1"
ZIP_PATH = OUT.parent / "MYKIDSNEST_FOREST_STARTER_COMMERCIAL_PILOT_v0.1.zip"


def check(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)
    print(f"PASS: {message}")


def main() -> None:
    required = [
        "baseline/production-baseline.md",
        "baseline/asset-provenance.json",
        "listing/title.txt",
        "listing/description.md",
        "listing/tags.txt",
        "listing/personalization.txt",
        "listing/etsy-compliance-review.md",
        "images/contact-sheet.png",
        "delivery/starter-template.pdf",
        "delivery/concept-template/input-schema.json",
        "delivery/concept-template/order-template.json",
        "delivery/qa-checklist.md",
        "delivery/customer-messages.md",
        "pilot/cost-analysis.csv",
        "workflow/order-state-machine.md",
        "workflow/fulfillment-runbook.md",
        "FINAL_REVIEW.md",
    ]
    check(all((OUT / value).is_file() for value in required), "required artifact tree is complete")

    provenance = json.loads((OUT / "baseline/asset-provenance.json").read_text())
    check(provenance["source_assets_recovered"] == 6, "six current production sources are recorded")
    check(all(item["usage_rights_status"] == "OWNER_CONFIRMATION_REQUIRED" for item in provenance["source_assets"]), "source rights are not silently assumed")

    listing_images = sorted((OUT / "images/listing-images").glob("*.png"))
    check(len(listing_images) == 10, "ten listing images were exported")
    for path in listing_images:
        with Image.open(path) as image:
            check(image.size == (2000, 2000) and image.mode == "RGB" and image.format == "PNG", f"{path.name} is a 2000x2000 RGB PNG")

    tags = [line.strip() for line in (OUT / "listing/tags.txt").read_text().splitlines() if line.strip()]
    check(len(tags) == 13, "exactly 13 Etsy tags are present")
    check(all(len(tag) <= 20 for tag in tags), "each proposed tag is 20 characters or fewer")

    pilot_dirs = [OUT / "pilot/test-a", OUT / "pilot/test-b", OUT / "pilot/test-c"]
    refs = set()
    for folder in pilot_dirs:
        for name in ["input.json", "concept.png", "summary.pdf", "qa-report.md", "cost-record.json"]:
            check((folder / name).is_file(), f"{folder.name}/{name} exists")
        data = json.loads((folder / "input.json").read_text())
        refs.add(data["internal_order_reference"])
        check(data["etsy_order_reference"] == "SYNTHETIC-NOT-AN-ETSY-ORDER", f"{folder.name} is explicitly synthetic")
        check(not any(key in data for key in ["child_name", "birth_date", "school", "home_address", "medical_information"]), f"{folder.name} contains no forbidden PII fields")
        with Image.open(folder / "concept.png") as concept:
            check(concept.size == (2000, 2000) and concept.mode == "RGB", f"{folder.name} concept image passes geometry checks")
        reader = PdfReader(str(folder / "summary.pdf"))
        check(len(reader.pages) == 2, f"{folder.name} PDF has two pages")
        text = "\n".join(page.extract_text() or "" for page in reader.pages)
        check("Scope and limitations" in text and "conceptual visualization" in text, f"{folder.name} PDF includes scope and concept labels")
    check(len(refs) == 3, "synthetic internal references are unique")

    template = PdfReader(str(OUT / "delivery/starter-template.pdf"))
    check(len(template.pages) == 2, "starter PDF template has two pages")

    with (OUT / "pilot/cost-analysis.csv").open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    check(len(rows) == 3, "cost analysis contains three synthetic orders")
    check(all(row["labor_cost_usd"] == "NOT_MEASURED" for row in rows), "unobserved labor cost remains NOT_MEASURED")
    check(all(row["contribution_margin_usd"] == "NOT_CALCULABLE_UNMEASURED_COSTS" for row in rows), "contribution margin is not fabricated")

    final = (OUT / "FINAL_REVIEW.md").read_text()
    check("PRODUCTION_CHANGED = NO" in final and "ETSY_LISTING_CHANGED = NO" in final, "final report preserves production and Etsy")
    check("REAL_CUSTOMERS_CONTACTED = 0" in final, "final report records zero real customer contact")
    check("READY_FOR_HUMAN_REVIEW = YES" in final, "package stops at human review")

    check(ZIP_PATH.is_file(), "non-sensitive review ZIP exists")
    with zipfile.ZipFile(ZIP_PATH) as archive:
        names = archive.namelist()
        check(len(names) >= 35, "ZIP contains the complete review package")
        check(not any(re.search(r"(^|/)(\.env|\.dev\.vars|customer-photo|real-order)", name, re.I) for name in names), "ZIP contains no obvious secret or real-customer paths")

    print("FOREST STARTER QA: PASS")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"FOREST STARTER QA: FAIL - {exc}", file=sys.stderr)
        raise
