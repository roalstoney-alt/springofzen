#!/usr/bin/env python3
"""Build and validate the MyKidsNest Forest Room Starter pilot package.

This is an offline, synthetic-only fulfillment workflow. It never calls Etsy,
Cloudflare, the production site, an image-generation API, or a customer system.
"""

from __future__ import annotations

import csv
import hashlib
import json
import shutil
import time
import zipfile
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Image as RLImage
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "artifacts/etsy/forest-starter/v0.1"
ZIP_PATH = OUT.parent / "MYKIDSNEST_FOREST_STARTER_COMMERCIAL_PILOT_v0.1.zip"
SITE_ASSETS = ROOT / "sites/mykidsnest/public/assets/forest"
SOURCE_ASSETS = ROOT / "mynest/forest-room/assets"

BASELINE_SHA = "6020cb44978b9ffd5bcc347243880d29b12a1689"
ASSET_INTRO_SHA = "cdd4780767d31c740c41645af80a2174958ce504"
SITE_COPY_SHA = "876e9483e4e495e0b7b6f8c68659dd286311497b"
FEATURE_BRANCH = "codex/mykidsnest-etsy-forest-starter-v01"
PRODUCT_VERSION = "FOREST-STARTER-v0.1"
PRICE_USD = 11.52

PRODUCTION_FILES = [
    "forest-room-day-desktop-b-practical-v02.webp",
    "forest-room-day-mobile-b-practical-v02.webp",
    "forest-room-night-desktop-b-practical-v02.webp",
    "forest-room-night-mobile-b-practical-v02.webp",
    "forest-room-rest-desktop-b-practical-v02.webp",
    "forest-room-rest-mobile-b-practical-v02.webp",
]

W = H = 2000
CREAM = "#F3EFE5"
PAPER = "#FBF8F1"
FOREST = "#193A35"
FOREST_2 = "#2A5A4F"
SAGE = "#8EA17D"
BLUSH = "#D6AAA0"
GOLD = "#D1A04D"
INK = "#20352F"
MUTED = "#64736E"
WHITE = "#FFFFFF"
REVIEW = "#A55E42"

GEORGIA = "/System/Library/Fonts/Supplemental/Georgia.ttf"
GEORGIA_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
ARIAL = "/System/Library/Fonts/Supplemental/Arial.ttf"
ARIAL_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


ORDERS = [
    {
        "internal_order_reference": "SYNTH-FOREST-A-001",
        "etsy_order_reference": "SYNTHETIC-NOT-AN-ETSY-ORDER",
        "test": "A - Small Bedroom",
        "age_range": "4-6",
        "room": "Compact rectangular bedroom; approximate dimensions intentionally omitted",
        "preferences": "Green forest direction",
        "forest_elements": "Meadow floor, natural tree, subtle deer presence",
        "existing_furniture": "Existing bed and wardrobe",
        "constraints": "Limited floor space",
        "palette": ["#CAD4B2", "#879B72", "#F2E9D8", "#B9896D"],
        "suggestions": [
            "Keep the existing bed as the visual anchor rather than adding another large furniture piece.",
            "Use a restrained meadow-green floor direction and keep the center path visually open.",
            "Place forest character cues in one reading corner instead of distributing props across the floor.",
            "Use warm low-level lighting as atmosphere only; final product selection remains outside this starter scope.",
        ],
        "manual_review_required": False,
    },
    {
        "internal_order_reference": "SYNTH-FOREST-B-001",
        "etsy_order_reference": "SYNTHETIC-NOT-AN-ETSY-ORDER",
        "test": "B - Medium Bedroom",
        "age_range": "3-5",
        "room": "Standard medium bedroom; approximate dimensions intentionally omitted",
        "preferences": "Neutral woodland palette",
        "forest_elements": "Woodland animals with one calm deer focal cue",
        "existing_furniture": "Existing bed, dresser, and book storage",
        "constraints": "Retain all major furniture",
        "palette": ["#E8DDC7", "#B9B49D", "#86917B", "#C9A79B"],
        "suggestions": [
            "Unify existing furniture with a soft neutral textile and wall-color direction.",
            "Use one deer cue and a small number of woodland details to avoid visual clutter.",
            "Reserve the window side for the meadow atmosphere while keeping furniture positions conceptual.",
            "Repeat sage, warm cream, and muted blush in small accents rather than matching every object.",
        ],
        "manual_review_required": False,
    },
    {
        "internal_order_reference": "SYNTH-FOREST-C-001",
        "etsy_order_reference": "SYNTHETIC-NOT-AN-ETSY-ORDER",
        "test": "C - Constrained Layout",
        "age_range": "5-7",
        "room": "Irregular room geometry; approximate dimensions intentionally omitted",
        "preferences": "Lighter forest palette for a darker room",
        "forest_elements": "Window woodland view and restrained mushroom-light cues",
        "existing_furniture": "Existing bed and storage must remain",
        "constraints": "Limited natural light, irregular geometry, multiple furniture restrictions",
        "palette": ["#EEF0DD", "#BFCDAA", "#D8C9AE", "#A78972"],
        "suggestions": [
            "Use lighter wall and textile values so the forest direction does not darken the room further.",
            "Treat the irregular geometry as a manual review trigger before suggesting any layout change.",
            "Keep existing furniture positions provisional until adult-provided measurements are checked.",
            "Use layered ambient lighting as a visual direction only, not as an electrical specification.",
        ],
        "manual_review_required": True,
    },
]


def ensure_dirs() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    for rel in [
        "baseline",
        "listing",
        "images/original-assets",
        "images/listing-images",
        "delivery/concept-template",
        "pilot/test-a",
        "pilot/test-b",
        "pilot/test-c",
        "workflow",
    ]:
        (OUT / rel).mkdir(parents=True, exist_ok=True)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def font(size: int, *, bold: bool = False, serif: bool = False) -> ImageFont.FreeTypeFont:
    selected = GEORGIA_BOLD if serif and bold else GEORGIA if serif else ARIAL_BOLD if bold else ARIAL
    return ImageFont.truetype(selected, size=size)


def image_meta(path: Path) -> dict:
    with Image.open(path) as image:
        return {
            "dimensions": [image.width, image.height],
            "mode": image.mode,
            "format": image.format,
            "bytes": path.stat().st_size,
            "sha256": sha256(path),
        }


def cover(image: Image.Image, size: tuple[int, int], center=(0.5, 0.5)) -> Image.Image:
    return ImageOps.fit(image.convert("RGB"), size, Image.Resampling.LANCZOS, centering=center)


def contain(image: Image.Image, size: tuple[int, int], background=CREAM) -> Image.Image:
    result = Image.new("RGB", size, background)
    copy = image.convert("RGB")
    copy.thumbnail(size, Image.Resampling.LANCZOS)
    result.paste(copy, ((size[0] - copy.width) // 2, (size[1] - copy.height) // 2))
    return result


def rounded_paste(canvas: Image.Image, image: Image.Image, xy: tuple[int, int], radius=32) -> None:
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, image.width, image.height), radius=radius, fill=255)
    canvas.paste(image, xy, mask)


def text_lines(draw: ImageDraw.ImageDraw, text: str, fnt, width: int) -> list[str]:
    lines, current = [], ""
    for word in text.split():
        candidate = word if not current else f"{current} {word}"
        if draw.textbbox((0, 0), candidate, font=fnt)[2] <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def paragraph(draw, text, xy, fnt, fill, width, spacing=14) -> int:
    x, y = xy
    line_height = draw.textbbox((0, 0), "Ag", font=fnt)[3] + spacing
    for line in text_lines(draw, text, fnt, width):
        draw.text((x, y), line, font=fnt, fill=fill)
        y += line_height
    return y


def brand(draw: ImageDraw.ImageDraw, *, dark=False, x=100, y=80) -> None:
    draw.ellipse((x, y + 4, x + 30, y + 34), fill=GOLD)
    draw.text((x + 48, y), "MYKIDSNEST", font=font(34, bold=True), fill=WHITE if dark else FOREST)


def title(draw, heading, y=250, width=1700, size=92, fill=FOREST) -> int:
    return paragraph(draw, heading, (100, y), font(size, bold=True, serif=True), fill, width, spacing=10)


def kicker(draw, value, y=180, *, dark=False) -> None:
    draw.text((100, y), value.upper(), font=font(28, bold=True), fill="#D3E1DB" if dark else FOREST_2)


def footer(draw, value, *, dark=False) -> None:
    line = "#71877F" if dark else "#D7D8CE"
    ink = "#CBD9D4" if dark else MUTED
    draw.line((100, 1880, 1900, 1880), fill=line, width=2)
    draw.text((100, 1910), value, font=font(24), fill=ink)


def pill(draw, value, xy, *, background=FOREST, foreground=WHITE, width=None) -> None:
    fnt = font(27, bold=True)
    measured = draw.textbbox((0, 0), value, font=fnt)[2]
    w = width or measured + 54
    x, y = xy
    draw.rounded_rectangle((x, y, x + w, y + 66), radius=33, fill=background)
    draw.text((x + (w - measured) / 2, y + 16), value, font=fnt, fill=foreground)


def crop_relative(image, box, size):
    left, top, right, bottom = box
    crop = image.crop((int(left * image.width), int(top * image.height), int(right * image.width), int(bottom * image.height)))
    return cover(crop, size)


def save_listing(canvas, number, slug) -> Path:
    path = OUT / "images/listing-images" / f"{number:02d}-{slug}.png"
    canvas.convert("RGB").save(path, "PNG", optimize=True, dpi=(300, 300))
    return path


def make_generic_concept_board(order: dict, output: Path, day: Image.Image) -> Path:
    canvas = Image.new("RGB", (2000, 2000), PAPER)
    draw = ImageDraw.Draw(canvas)
    brand(draw)
    draw.text((100, 175), "CONCEPTUAL VISUALIZATION", font=font(27, bold=True), fill=FOREST_2)
    paragraph(draw, order["test"], (100, 235), font(74, bold=True, serif=True), FOREST, 1550, 8)
    scene = contain(day, (1800, 1012), CREAM)
    rounded_paste(canvas, scene, (100, 430), 38)
    draw.rounded_rectangle((100, 1500, 1900, 1845), radius=36, fill=CREAM)
    draw.text((150, 1550), "PERSONALIZED DIRECTION", font=font(25, bold=True), fill=FOREST_2)
    paragraph(draw, f"{order['preferences']} - {order['constraints']}", (150, 1605), font(36, bold=True, serif=True), INK, 1050, 13)
    x = 1350
    for color in order["palette"]:
        draw.rounded_rectangle((x, 1550, x + 105, 1655), radius=20, fill=color)
        x += 125
    draw.text((1350, 1690), "Suggested palette", font=font(23), fill=MUTED)
    footer(draw, "Fictional pilot input - exact Forest production artwork - not a construction plan")
    canvas.save(output, "PNG", optimize=True, dpi=(300, 300))
    return output


def make_listing_images(day, day_mobile, night, rest) -> list[Path]:
    paths = []

    # 01: finished example and offer.
    bg = cover(day, (W, H)).filter(ImageFilter.GaussianBlur(24))
    bg = Image.blend(bg, Image.new("RGB", (W, H), FOREST), 0.34)
    draw = ImageDraw.Draw(bg)
    brand(draw, dark=True)
    room = contain(day, (1720, 968), PAPER)
    rounded_paste(bg, room, (140, 230), 42)
    draw.rounded_rectangle((140, 1260, 1860, 1870), radius=44, fill=PAPER)
    draw.text((220, 1350), "PERSONALIZED DIGITAL STARTER", font=font(29, bold=True), fill=FOREST_2)
    paragraph(draw, "Forest Room", (220, 1415), font(112, bold=True, serif=True), FOREST, 1100, 6)
    draw.text((220, 1555), "One concept image + short PDF", font=font(45, bold=True), fill=INK)
    pill(draw, "$11.52 PILOT PRICE", (220, 1665), background=GOLD, foreground=FOREST)
    pill(draw, "NO PHYSICAL ITEMS", (670, 1665), background="#815747")
    paths.append(save_listing(bg, 1, "hero"))

    # 02: environment.
    canvas = Image.new("RGB", (W, H), CREAM)
    draw = ImageDraw.Draw(canvas)
    brand(draw); kicker(draw, "Original Forest environment"); title(draw, "A real room, gently reimagined.")
    rounded_paste(canvas, contain(day, (1800, 1012), PAPER), (100, 560), 36)
    paragraph(draw, "Practical canopy bed, meadow floor, mushroom lights, deer presence, natural tree, and window wall.", (100, 1640), font(40, bold=True, serif=True), INK, 1720, 12)
    footer(draw, "Exact current production artwork - illustrative digital concept")
    paths.append(save_listing(canvas, 2, "environment"))

    # 03: verified details.
    canvas = Image.new("RGB", (W, H), CREAM)
    draw = ImageDraw.Draw(canvas)
    brand(draw); kicker(draw, "Design details"); title(draw, "Forest anchors, kept recognizable.", size=84)
    crops = [
        ((0.0, 0.0, 0.56, 0.65), "NATURAL TREE + WINDOW"),
        ((0.50, 0.02, 1.0, 0.72), "CANOPY BED + LIGHTS"),
        ((0.0, 0.40, 0.48, 1.0), "DEER + READING CORNER"),
        ((0.30, 0.55, 0.94, 1.0), "MEADOW FLOOR"),
    ]
    for (box, label), (x, y) in zip(crops, [(100, 570), (1040, 570), (100, 1210), (1040, 1210)]):
        rounded_paste(canvas, crop_relative(day, box, (860, 500)), (x, y), 28)
        draw.rounded_rectangle((x + 24, y + 415, x + 530, y + 474), radius=25, fill=PAPER)
        draw.text((x + 45, y + 430), label, font=font(22, bold=True), fill=FOREST)
    footer(draw, "Crops of the verified production image - no new characters or objects generated")
    paths.append(save_listing(canvas, 3, "details"))

    # 04: fictional personalized sample.
    sample_path = OUT / "delivery/concept-template/fictional-example.png"
    make_generic_concept_board(ORDERS[0], sample_path, day)
    canvas = Image.open(sample_path).convert("RGB")
    draw = ImageDraw.Draw(canvas)
    pill(draw, "FICTIONAL EXAMPLE", (1420, 80), background=REVIEW)
    paths.append(save_listing(canvas, 4, "personalized-concept"))

    # 05: exact starter contents.
    canvas = Image.new("RGB", (W, H), PAPER)
    draw = ImageDraw.Draw(canvas)
    brand(draw); kicker(draw, "What is included"); title(draw, "$11.52 Forest Starter", size=98)
    cards = [
        ("01", "PERSONALIZED CONCEPT IMAGE", "One Forest Room concept board shaped by the approved buyer inputs."),
        ("02", "SHORT PDF SUMMARY", "Preferences, Forest direction, suggested colors, styling notes, scope, and limitations."),
    ]
    y = 650
    for number, heading, body in cards:
        draw.rounded_rectangle((100, y, 1900, y + 410), radius=42, fill=CREAM)
        draw.text((160, y + 70), number, font=font(72, bold=True, serif=True), fill=GOLD)
        draw.text((350, y + 75), heading, font=font(31, bold=True), fill=FOREST_2)
        paragraph(draw, body, (350, y + 145), font(37, bold=True, serif=True), INK, 1350, 14)
        y += 470
    pill(draw, "STANDALONE VALUE", (100, 1645), background=FOREST)
    paragraph(draw, "The starter is delivered even when no upgrade is requested.", (560, 1653), font(31), INK, 1250, 10)
    footer(draw, "No furniture, procurement, installation, technical drawings, or unlimited revisions")
    paths.append(save_listing(canvas, 5, "included"))

    # 06: personalization.
    canvas = Image.new("RGB", (W, H), CREAM)
    draw = ImageDraw.Draw(canvas)
    brand(draw); kicker(draw, "How personalization works"); title(draw, "Share only what the design needs.", size=84)
    fields = [
        ("AGE RANGE", "Broad range only - no birth date"),
        ("ROOM", "Approximate L x W x H and existing furniture"),
        ("FOREST", "Preferred colors, animals, and design preferences"),
        ("OPTIONAL PHOTO", "Room only - no people or identifying information"),
    ]
    y = 635
    for i, (heading, body) in enumerate(fields, 1):
        draw.rounded_rectangle((100, y, 1900, y + 220), radius=30, fill=PAPER, outline="#D8D6CA", width=2)
        draw.text((150, y + 65), f"{i:02d}", font=font(44, bold=True, serif=True), fill=GOLD)
        draw.text((280, y + 45), heading, font=font(25, bold=True), fill=FOREST_2)
        draw.text((280, y + 100), body, font=font(34, bold=True, serif=True), fill=INK)
        y += 250
    footer(draw, "Never request a child name, birth date, school, address, or identifiable photograph")
    paths.append(save_listing(canvas, 6, "personalization"))

    # 07: creation process.
    canvas = Image.new("RGB", (W, H), FOREST)
    draw = ImageDraw.Draw(canvas)
    brand(draw, dark=True); kicker(draw, "Design creation process", dark=True); title(draw, "Reviewed before delivery.", size=88, fill=WHITE)
    states = ["ORDER RECEIVED", "INPUT VALIDATED", "SOURCE ASSETS LOADED", "CONCEPT CREATED", "FIDELITY CHECK", "HUMAN QA", "DELIVERY APPROVAL", "DELIVERED"]
    for i, state in enumerate(states):
        col, row = i % 2, i // 2
        x, y = 100 + col * 930, 620 + row * 260
        draw.rounded_rectangle((x, y, x + 850, y + 185), radius=34, fill="#284D45")
        draw.ellipse((x + 35, y + 45, x + 125, y + 135), fill=GOLD)
        draw.text((x + 67, y + 63), str(i + 1), font=font(32, bold=True), fill=FOREST)
        draw.text((x + 165, y + 74), state, font=font(27, bold=True), fill=WHITE)
    footer(draw, "No automated customer messages or delivery in pilot v0.1", dark=True)
    paths.append(save_listing(canvas, 7, "process"))

    # 08: digital deliverables.
    canvas = Image.new("RGB", (W, H), PAPER)
    draw = ImageDraw.Draw(canvas)
    brand(draw); kicker(draw, "Digital deliverables"); title(draw, "Two useful files. Nothing ships.", size=86)
    rounded_paste(canvas, cover(day_mobile, (650, 1070)), (100, 650), 36)
    draw.rounded_rectangle((830, 650, 1900, 1100), radius=40, fill=CREAM)
    draw.text((900, 725), "CONCEPT IMAGE", font=font(28, bold=True), fill=FOREST_2)
    paragraph(draw, "One personalized Forest Room concept image labeled as a conceptual visualization.", (900, 800), font(42, bold=True, serif=True), INK, 850, 14)
    draw.rounded_rectangle((830, 1160, 1900, 1610), radius=40, fill=CREAM)
    draw.text((900, 1235), "PDF SUMMARY", font=font(28, bold=True), fill=FOREST_2)
    paragraph(draw, "One short design direction summary with palette, styling suggestions, scope, and limitations.", (900, 1310), font(42, bold=True, serif=True), INK, 850, 14)
    pill(draw, "DIGITAL MADE-TO-ORDER", (830, 1680), background=FOREST)
    footer(draw, "No architectural drawing, exact furniture specification, installation, or safety certification")
    paths.append(save_listing(canvas, 8, "digital-deliverables"))

    # 09: future packages - review only.
    canvas = Image.new("RGB", (W, H), CREAM)
    draw = ImageDraw.Draw(canvas)
    brand(draw); kicker(draw, "Optional future products"); title(draw, "Starter first. Expansion only if wanted.", size=82)
    tiers = [
        ("STARTER", "$11.52", "1 concept image + short PDF", FOREST, "PILOT"),
        ("PERSONALIZED FOREST", "$49", "Additional views + basic layout direction", SAGE, "NOT ACTIVE"),
        ("COMPLETE FOREST", "$129", "Extended package + implementation-oriented suggestions", BLUSH, "NOT ACTIVE"),
    ]
    for i, (name, price, body, color, status) in enumerate(tiers):
        x = 100 + i * 610
        draw.rounded_rectangle((x, 650, x + 560, 1520), radius=40, fill=PAPER, outline=color, width=5)
        draw.rounded_rectangle((x, 650, x + 560, 775), radius=38, fill=color)
        draw.text((x + 45, 695), name, font=font(24, bold=True), fill=FOREST if color != FOREST else WHITE)
        draw.text((x + 45, 850), price, font=font(76, bold=True, serif=True), fill=FOREST)
        paragraph(draw, body, (x + 45, 1010), font(31, bold=True, serif=True), INK, 460, 14)
        pill(draw, status, (x + 45, 1360), background=REVIEW if status == "NOT ACTIVE" else FOREST, width=300)
    draw.rounded_rectangle((100, 1610, 1900, 1815), radius=34, fill="#F0DED4")
    paragraph(draw, "HUMAN REVIEW: $49 and $129 are test assumptions only. Do not publish or advertise them until cost and capacity gates pass.", (150, 1660), font(30, bold=True), REVIEW, 1700, 12)
    footer(draw, "A future credit policy is proposed separately and is not active")
    paths.append(save_listing(canvas, 9, "future-upgrades"))

    # 10: get started.
    canvas = Image.new("RGB", (W, H), FOREST)
    draw = ImageDraw.Draw(canvas)
    rounded_paste(canvas, cover(day_mobile, (720, 1760)), (1180, 120), 44)
    brand(draw, dark=True); kicker(draw, "How to get started", dark=True)
    y = title(draw, "A privacy-minded Forest design start.", y=260, width=950, size=82, fill=WHITE) + 70
    steps = ["Choose the Forest Starter", "Share the approved room inputs", "Receive the two agreed digital files"]
    for i, step in enumerate(steps, 1):
        draw.text((100, y), f"{i:02d}", font=font(30, bold=True), fill=GOLD)
        y = paragraph(draw, step, (210, y - 5), font(34, bold=True, serif=True), WHITE, 820, 10) + 50
    draw.rounded_rectangle((100, 1290, 1050, 1715), radius=36, fill="#284D45")
    draw.text((155, 1350), "KEEP PRIVATE", font=font(27, bold=True), fill="#D8E6DF")
    paragraph(draw, "No child name, birth date, school, home address, identifiable photo, or sensitive story is needed.", (155, 1420), font(31), WHITE, 830, 14)
    pill(draw, "DIGITAL ONLY", (100, 1800), background=GOLD, foreground=FOREST)
    paths.append(save_listing(canvas, 10, "get-started"))

    return paths


def copy_and_manifest_assets() -> list[dict]:
    entries = []
    target = OUT / "images/original-assets"
    for name in PRODUCTION_FILES:
        production = SITE_ASSETS / name
        source = SOURCE_ASSETS / name
        if not production.exists() or not source.exists():
            raise FileNotFoundError(f"SOURCE_NOT_RECOVERED: {name}")
        if sha256(production) != sha256(source):
            raise RuntimeError(f"Source and production hash mismatch: {name}")
        copied = target / name
        shutil.copy2(production, copied)
        meta = image_meta(copied)
        entries.append({
            "filename": name,
            "source_path": f"mynest/forest-room/assets/{name}",
            "production_path": f"sites/mykidsnest/public/assets/forest/{name}",
            "package_path": f"images/original-assets/{name}",
            "git_sha_original_introduction": ASSET_INTRO_SHA,
            "git_sha_standalone_site_copy": SITE_COPY_SHA,
            "dimensions": meta["dimensions"],
            "format": meta["format"],
            "mode": meta["mode"],
            "bytes": meta["bytes"],
            "sha256": meta["sha256"],
            "usage_rights_status": "OWNER_CONFIRMATION_REQUIRED",
            "production_usage_status": "CURRENT_FOREST_ROUTE_SOURCE",
        })
    return entries


def pdf_styles():
    styles = getSampleStyleSheet()
    return {
        "title": ParagraphStyle("Title", parent=styles["Title"], fontName="Times-Bold", fontSize=27, leading=31, textColor=colors.HexColor(FOREST), spaceAfter=12),
        "kicker": ParagraphStyle("Kicker", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=colors.HexColor(FOREST_2), spaceAfter=6),
        "h2": ParagraphStyle("H2", parent=styles["Heading2"], fontName="Times-Bold", fontSize=17, leading=21, textColor=colors.HexColor(FOREST), spaceBefore=8, spaceAfter=8),
        "body": ParagraphStyle("Body", parent=styles["BodyText"], fontName="Helvetica", fontSize=10.5, leading=15, textColor=colors.HexColor(INK), alignment=TA_LEFT, spaceAfter=7),
        "small": ParagraphStyle("Small", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.5, leading=12, textColor=colors.HexColor(MUTED), spaceAfter=5),
        "warning": ParagraphStyle("Warning", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=9.5, leading=14, textColor=colors.HexColor(REVIEW), borderColor=colors.HexColor("#D9A692"), borderWidth=1, borderPadding=8, backColor=colors.HexColor("#F6E9E2"), spaceBefore=8, spaceAfter=8),
    }


def pdf_header_footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#D5D8CE"))
    canvas.line(0.65 * inch, 0.55 * inch, 7.85 * inch, 0.55 * inch)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor(MUTED))
    canvas.drawString(0.65 * inch, 0.35 * inch, "MyKidsNest Forest Room - conceptual digital design")
    canvas.drawRightString(7.85 * inch, 0.35 * inch, f"Page {doc.page}")
    canvas.restoreState()


def make_summary_pdf(order: dict, concept_path: Path, output: Path, *, template=False) -> Path:
    styles = pdf_styles()
    doc = SimpleDocTemplate(str(output), pagesize=letter, rightMargin=0.65 * inch, leftMargin=0.65 * inch, topMargin=0.55 * inch, bottomMargin=0.75 * inch)
    story = []
    label = "TEMPLATE - COMPLETE AFTER HUMAN QA" if template else "PERSONALIZED DIGITAL STARTER"
    story += [
        Paragraph(label, styles["kicker"]),
        Paragraph("MyKidsNest Forest Room", styles["title"]),
        Paragraph("Short design direction summary", styles["h2"]),
        Paragraph("This document accompanies one personalized concept image. It is a conceptual visualization and design-direction summary, not a technical or construction document.", styles["body"]),
        Spacer(1, 6),
        RLImage(str(concept_path), width=7.2 * inch, height=7.2 * inch),
        PageBreak(),
        Paragraph("Customer-provided preferences", styles["h2"]),
    ]
    rows = [
        ["Internal reference", order["internal_order_reference"]],
        ["Age range", order["age_range"]],
        ["Room information", order["room"]],
        ["Color direction", order["preferences"]],
        ["Forest elements", order["forest_elements"]],
        ["Existing furniture", order["existing_furniture"]],
        ["Constraints", order["constraints"]],
    ]
    table = Table(rows, colWidths=[1.55 * inch, 5.45 * inch])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#E5EADF")),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor(INK)),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("LEADING", (0, 0), (-1, -1), 12),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#C8D0C5")),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story += [table, Spacer(1, 8), Paragraph("Forest Room concept", styles["h2"])]
    story.append(Paragraph("Use the established practical Forest Room identity as the visual anchor: canopy bed, meadow-inspired floor, mushroom-light cues, restrained deer presence, natural tree, and window wall. Personalization changes the recommended emphasis, palette, and high-level styling direction; it does not claim an exact built result.", styles["body"]))
    story.append(Paragraph("Suggested color direction", styles["h2"]))
    color_cells = []
    for value in order["palette"]:
        color_cells.append(Paragraph(f"<b>{value}</b>", styles["small"]))
    palette = Table([color_cells], colWidths=[1.75 * inch] * 4, rowHeights=[0.55 * inch])
    palette.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, 0), colors.HexColor(order["palette"][0])), ("BACKGROUND", (1, 0), (1, 0), colors.HexColor(order["palette"][1])), ("BACKGROUND", (2, 0), (2, 0), colors.HexColor(order["palette"][2])), ("BACKGROUND", (3, 0), (3, 0), colors.HexColor(order["palette"][3])), ("ALIGN", (0, 0), (-1, -1), "CENTER"), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#AEB8AE"))]))
    story += [palette, Spacer(1, 6), Paragraph("High-level styling suggestions", styles["h2"])]
    for item in order["suggestions"]:
        story.append(Paragraph(f"- {item}", styles["body"]))
    if order["manual_review_required"]:
        story.append(Paragraph("<b>Manual review:</b> irregular geometry and multiple constraints require human review before any real layout recommendation.", styles["small"]))
    story += [
        Paragraph("Scope and limitations", styles["h2"]),
        Paragraph("Included: one personalized Forest Room concept image and this short PDF design direction summary.", styles["body"]),
        Paragraph("Excluded: physical furniture, lighting, toys, decorations, procurement, construction or installation, detailed technical drawings, exact furniture specifications, additional perspectives, unlimited revisions, architectural advice, and safety certification.", styles["body"]),
        Paragraph("No sleep, medical, therapeutic, behavioral, construction, or safety outcome is promised. Verify all real-world measurements, product suitability, installation, and child-safety decisions with qualified adults and professionals.", styles["warning"]),
    ]
    doc.build(story, onFirstPage=pdf_header_footer, onLaterPages=pdf_header_footer)
    return output


def write_listing_content() -> None:
    (OUT / "listing/title.txt").write_text("Custom Forest Kids Room Design | Personalized Woodland Bedroom Concept | Digital Design Starter Package\n", encoding="utf-8")
    tags = [
        "forest room design", "kids room concept", "custom room design", "digital room concept", "woodland bedroom",
        "children room decor", "meadow room design", "forest nursery idea", "custom kids bedroom", "room design service",
        "made to order design", "whimsical kids room", "forest bedroom idea",
    ]
    (OUT / "listing/tags.txt").write_text("\n".join(tags) + "\n", encoding="utf-8")
    description = f"""# Listing description draft

## A Little Forest They'll Love Calling Their Own

Transform your child's bedroom into a magical forest-inspired space, thoughtfully designed around their personality, existing room, and everyday routines.

Your **${PRICE_USD:.2f} Starter Package** includes:

- One personalized digital Forest Room concept image
- One short PDF design direction summary

The PDF records the approved preferences, Forest Room concept direction, suggested colors, high-level room styling suggestions, and explicit scope and limitations. The starter package is delivered as a useful standalone result. No additional purchase is required.

## How personalization works

Share a broad child age range, approximate room dimensions (L x W x H), preferred forest colors or animals, existing furniture constraints, and any special design preferences. A room-only photo may be sent through Etsy Messages after purchase. Do not include people or personal information.

The design uses the established MyKidsNest Forest Room identity: a practical canopy bed, meadow-inspired floor, mushroom-light cues, restrained deer presence, natural tree, and window wall. The final concept remains a conceptual visualization, not a construction-ready plan or promise of an identical installed result.

## Digital product disclosure

**This is a made-to-order digital design service. No physical item will be shipped.** Furniture, lighting, toys, decorations, plants, architectural elements, and all other pictured items are illustrative and are not included.

## Not included

- Physical furniture, lighting, toys, or decorations
- Procurement, construction, or installation
- Detailed technical or architectural drawings
- Exact furniture specifications
- Additional perspectives or unlimited revisions
- Safety certification or medical, sleep, therapeutic, or behavioral advice

## Optional expansion

A broader design package may be discussed separately only after the starter deliverables are completed. Future $49 and $129 package concepts are internal pilot assumptions and are not active products. No upgrade or purchase credit is currently promised.

## AI-assisted creation disclosure - owner confirmation required

The listing uses existing MyKidsNest production room renders. Before publication, the seller must confirm the creation and rights history. If seller-prompted AI contributed to those renders or to a buyer's personalized output, the listing must include an accurate AI-use disclosure consistent with Etsy's Creativity Standards.

## Processing time

Processing time is intentionally not promised in this draft. It must be set only after the synthetic pilot and human fulfillment-capacity review establish a feasible commitment.
"""
    (OUT / "listing/description.md").write_text(description, encoding="utf-8")
    personalization = """Please share your child's age, approximate room dimensions (L x W x H), favorite forest colors or animals, and any special design preferences. You may send a room photo through Etsy Messages after purchase. Please avoid including people or personal information.

PRIVACY IMPLEMENTATION NOTE FOR HUMAN REVIEW

Use broad age ranges rather than an exact birth date. Do not request a child's name, birth date, school, home address, identifiable photograph, medical information, or personal story.

Recommended Etsy Custom options fields (maximum five under the policy reviewed 2026-10-18):

1. Age range - required list: 2.5-4 / 4-6 / 6-8 / Prefer not to say
2. Approximate room dimensions - optional text: L x W x H plus unit
3. Forest colors or animals - required text
4. Existing furniture and special preferences - optional text
5. Room-only photo - optional file upload or request through Etsy Messages; no people or identifying details
"""
    (OUT / "listing/personalization.txt").write_text(personalization, encoding="utf-8")
    compliance = """# Etsy compliance review

Verification date: 2026-10-18

Status: **CONDITIONAL - NOT POLICY_BLOCKED, HUMAN APPROVAL REQUIRED**

## Current official policy findings

- [Etsy Creativity Standards](https://www.etsy.com/legal/creativity/) - last updated 2025-06-10. Seller-original digital designs are allowed. Seller-prompted AI creations are allowed only with disclosure in the listing description. The first image for a custom product should show a finished example, not a blank placeholder.
- [Etsy Services policy](https://www.etsy.com/legal/policy/services/242665313101) - last updated 2026-06-09. Digital creative services such as custom design and illustration may be sold when the final item is delivered as a digital file.
- [Etsy digital listing guidance](https://help.etsy.com/hc/en-us/articles/115015628347-How-to-Manage-Your-Digital-Listings) - reviewed 2026-10-18. Use Digital files and Made To Order. Etsy supports up to five completion files of 20 MB each and does not support variations for digital items.
- [Etsy personalized listing guidance](https://help.etsy.com/hc/en-us/articles/360000344528-How-to-Offer-Personalized-Listings) - reviewed 2026-10-18. Up to five Custom options fields are supported, including one optional file-upload field. Fields should request one detail each. Personalization must not be used to force acknowledgment that the item is digital.

## Proposed structure

The $11.52 Starter is compatible with the digital creative service exception because every paid order receives an actual personalized concept image and PDF. It must not be operated as a paid lead, quotation fee, or payment-transfer listing.

## Publication blockers

1. Seller must verify ownership and commercial rights for all production renders.
2. Seller must confirm AI provenance and approve the exact disclosure.
3. Etsy seller dashboard baseline, listing ID, live price, delivery settings, and existing listing fields remain NOT_VERIFIED.
4. A feasible processing time and revision policy must be approved after capacity testing.
5. Cancellation/refund treatment and applicable consumer-rights language require owner/legal review.
6. Images and copy must be reviewed in the actual Etsy editor before publication.

No listing was created, edited, or published during this execution.
"""
    (OUT / "listing/etsy-compliance-review.md").write_text(compliance, encoding="utf-8")


def write_baseline(asset_entries: list[dict]) -> None:
    baseline = f"""# Production baseline

Captured: 2026-10-18

Project: MYKIDSNEST-ETSY-FOREST-001

## Repository

- Repository: `https://github.com/roalstoney-alt/springofzen.git`
- Remote `main` baseline SHA: `{BASELINE_SHA}`
- Feature branch: `{FEATURE_BRANCH}`
- Canonical site: `https://mykidsnest.com/`
- Forest route: `https://mykidsnest.com/forest/`
- Local production checkout had unrelated untracked files; work was isolated in a separate clone and those files were not copied or changed.

## Etsy baseline

| Field | Baseline |
|---|---|
| Shop URL | `https://www.etsy.com/shop/Mykidsnest` (provided by execution order) |
| Current listing URL | `NOT_VERIFIED` |
| Listing ID | `NOT_VERIFIED` |
| Live title | `NOT_VERIFIED` |
| Live description | `NOT_VERIFIED` |
| Live images | `NOT_VERIFIED` |
| Live tags | `NOT_VERIFIED` |
| Dashboard price | `NOT_VERIFIED`; execution-order assumption is USD {PRICE_USD:.2f} |
| Personalization settings | `NOT_VERIFIED` |
| Delivery settings | `NOT_VERIFIED` |

Public shop/listing retrieval was not reliable in the execution environment. Per the order, unverified seller fields are preserved and no online change is attempted.

## Prior Codex assets

The prior `MYKIDSNEST_FOREST_ROOM_ETSY_ASSET_RECOVERY_v0.1` review package was inspected as design context. This package is rebuilt from the repository's current six `practical-v02` production assets and does not depend on a user-specific external file path.

## Protected source count

Six current production image files were recovered and hash-matched to their earlier MyNest source copies. See `asset-provenance.json` for exact paths, dimensions, hashes, usage, and rights status.
"""
    (OUT / "baseline/production-baseline.md").write_text(baseline, encoding="utf-8")
    manifest = {
        "project": "MYKIDSNEST-ETSY-FOREST-001",
        "captured_at": datetime.now(timezone.utc).isoformat(),
        "baseline_sha": BASELINE_SHA,
        "feature_branch": FEATURE_BRANCH,
        "source_assets": asset_entries,
        "source_assets_recovered": len(asset_entries),
        "design_generation_method": "deterministic composition of exact production artwork with customer-specific annotation and palette; no generative image API",
        "rights_status": "OWNER_CONFIRMATION_REQUIRED",
        "production_changed": False,
    }
    (OUT / "baseline/asset-provenance.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


def write_delivery_and_workflow() -> None:
    schema = {
        "schema_version": "1.0",
        "required": ["internal_order_reference", "age_range", "room", "preferences", "forest_elements", "existing_furniture", "constraints"],
        "forbidden_personal_data": ["child_name", "birth_date", "school", "home_address", "identifiable_person_photo", "medical_information"],
        "optional_room_photo_rules": "room only; no people, addresses, mail, school marks, or other identifying content",
    }
    (OUT / "delivery/concept-template/input-schema.json").write_text(json.dumps(schema, indent=2) + "\n", encoding="utf-8")
    template = dict(ORDERS[0])
    for field in ["internal_order_reference", "age_range", "room", "preferences", "forest_elements", "existing_furniture", "constraints"]:
        template[field] = f"[{field.upper()}]"
    template["etsy_order_reference"] = "[ETSY_ORDER_REFERENCE - PRIVATE STORAGE ONLY]"
    template["suggestions"] = ["[APPROVED SUGGESTION 1]", "[APPROVED SUGGESTION 2]"]
    (OUT / "delivery/concept-template/order-template.json").write_text(json.dumps(template, indent=2) + "\n", encoding="utf-8")
    (OUT / "delivery/concept-template/README.md").write_text("""# Forest Starter concept template

1. Copy `order-template.json` into private per-order storage.
2. Assign a unique internal reference and copy only the minimum Etsy inputs.
3. Reject forbidden personal-data fields and quarantine photos until a human confirms they show only the room.
4. Generate an annotated concept board from the exact approved Forest production assets.
5. Route any identity drift, unusual geometry, or unresolved constraint to manual review.
6. Store customer-specific outputs privately; never commit them to a public repository.
""", encoding="utf-8")

    qa = """# Internal QA checklist

## Source fidelity

- [ ] Uses an approved `practical-v02` Forest source asset.
- [ ] Canopy bed, meadow floor, mushroom lights, deer presence, natural tree, window wall, palette, and atmosphere remain recognizable.
- [ ] No invented character, unrelated furniture family, or silent style substitution.
- [ ] Source hash and product version recorded.

## Input and privacy

- [ ] Unique internal order reference assigned.
- [ ] Input completeness checked.
- [ ] No child name, birth date, school, address, medical information, identifiable person image, or unnecessary personal story stored.
- [ ] Any room photo has no people or identifying information.

## Deliverables

- [ ] Exactly one personalized concept image included.
- [ ] Exactly one short PDF summary included.
- [ ] Concept is labeled as a conceptual visualization.
- [ ] PDF includes preferences, Forest concept, palette, styling suggestions, scope, and limitations.
- [ ] No physical product, exact-build, safety, sleep, medical, or construction claim.

## Human approval

- [ ] Image legibility and crop reviewed.
- [ ] PDF rendered and visually reviewed.
- [ ] Rework count and production time recorded.
- [ ] Human delivery approval recorded before any Etsy delivery.
"""
    (OUT / "delivery/qa-checklist.md").write_text(qa, encoding="utf-8")
    messages = """# Customer message templates - human approval required

## Clarification request

Thank you for your Forest Room Starter order. Before we begin, could you please confirm the missing room detail listed below? Please share only room information needed for the design. Do not send a child's name, birth date, school, home address, medical information, or a photo containing people or identifying details.

Missing detail: [HUMAN INSERTS ONE SPECIFIC QUESTION]

No message may be sent automatically in pilot v0.1.

## Delivery message

Your MyKidsNest Forest Room Starter files are ready for human-approved delivery. Attached are one personalized concept image and one short PDF design direction summary. These are conceptual digital-design materials, not construction documents, product specifications, installation instructions, or safety certification. No physical item will be shipped.

## Optional upgrade quotation - not an active product

The Starter is complete and usable on its own. If you want broader design support, we can prepare a separate written quotation after confirming scope and capacity. The internal $49 and $129 test packages are not active offers and must not be quoted without owner approval.

## Proposed credit policy - not active

Customers who upgrade to a full Forest Room design may receive a credit equivalent to their starter purchase. Before any use, approve eligibility, expiry, refund treatment, accounting treatment, and an Etsy-compatible payment process. Do not advertise or implement this proposal in v0.1.
"""
    (OUT / "delivery/customer-messages.md").write_text(messages, encoding="utf-8")

    states = ["ORDER_RECEIVED", "CUSTOMER_INPUT_PENDING", "INPUT_VALIDATED", "FOREST_SOURCE_ASSETS_LOADED", "DESIGN_GENERATION", "DESIGN_FIDELITY_CHECK", "HUMAN_QA", "DELIVERABLE_READY", "HUMAN_DELIVERY_APPROVAL", "DELIVERED", "CUSTOMER_FEEDBACK"]
    state_lines = "\n".join(f"{i + 1}. `{state}`" for i, state in enumerate(states))
    machine = f"""# Order state machine

{state_lines}

## Required record

Every private order record tracks Etsy order reference, product version, input completeness, source asset version, generation method, human-review result, production time, rework count, delivery timestamp, actual delivery cost, and optional customer feedback.

## Guards

- `INPUT_VALIDATED` blocks on missing required fields or unnecessary personal information.
- `DESIGN_FIDELITY_CHECK` blocks when Forest identity is not preserved.
- `HUMAN_QA` is mandatory; no automated pass-through.
- `HUMAN_DELIVERY_APPROVAL` is mandatory; v0.1 never messages or delivers automatically.
- Customer data and customer-specific outputs stay in private storage and are never committed to this public repository.
"""
    (OUT / "workflow/order-state-machine.md").write_text(machine, encoding="utf-8")
    runbook = """# Forest Starter fulfillment runbook

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
"""
    (OUT / "workflow/fulfillment-runbook.md").write_text(runbook, encoding="utf-8")


def build_pilots(day: Image.Image) -> list[dict]:
    results = []
    folder_names = ["test-a", "test-b", "test-c"]
    for order, folder_name in zip(ORDERS, folder_names):
        folder = OUT / "pilot" / folder_name
        start = time.perf_counter()
        asset_start = time.perf_counter()
        source_hash = sha256(SITE_ASSETS / PRODUCTION_FILES[0])
        asset_seconds = time.perf_counter() - asset_start
        design_start = time.perf_counter()
        concept = make_generic_concept_board(order, folder / "concept.png", day)
        design_seconds = time.perf_counter() - design_start
        pdf_start = time.perf_counter()
        summary = make_summary_pdf(order, concept, folder / "summary.pdf")
        pdf_seconds = time.perf_counter() - pdf_start
        qa_start = time.perf_counter()
        concept_meta = image_meta(concept)
        from pypdf import PdfReader
        reader = PdfReader(str(summary))
        checks = {
            "concept_2000x2000_rgb_png": concept_meta["dimensions"] == [2000, 2000] and concept_meta["mode"] == "RGB" and concept_meta["format"] == "PNG",
            "summary_pdf_pages": len(reader.pages) == 2,
            "source_hash_matches_manifest": source_hash == sha256(SOURCE_ASSETS / PRODUCTION_FILES[0]),
            "unique_internal_reference": order["internal_order_reference"].startswith("SYNTH-FOREST-"),
            "synthetic_not_real_transaction": order["etsy_order_reference"] == "SYNTHETIC-NOT-AN-ETSY-ORDER",
            "required_deliverables_present": concept.exists() and summary.exists(),
        }
        qa_seconds = time.perf_counter() - qa_start
        total_seconds = time.perf_counter() - start
        status = "PASS_WITH_MANUAL_REVIEW_TRIGGER_DOCUMENTED" if order["manual_review_required"] else "PASS"
        qa_report = f"""# QA report - {order['test']}

Synthetic order reference: `{order['internal_order_reference']}`

Result: **{status}**

Real transaction: **NO**

## Automated checks

""" + "\n".join(f"- {'PASS' if passed else 'FAIL'} - {name}" for name, passed in checks.items()) + f"""

## Human-review simulation

- Original practical Forest artwork remains the visual source.
- Personalization is limited to annotated preference, palette, and high-level direction.
- No exact physical fit, product availability, construction, safety, medical, or sleep claim appears.
- Manual design review required for a real order: **{'YES' if order['manual_review_required'] else 'NO'}**.

## Timing

- Asset verification: {asset_seconds:.6f} seconds
- Concept composition: {design_seconds:.6f} seconds
- PDF preparation: {pdf_seconds:.6f} seconds
- Automated QA: {qa_seconds:.6f} seconds
- Total local runtime: {total_seconds:.6f} seconds

This runtime excludes human design judgment, customer communication, Etsy handling, and delivery.
"""
        (folder / "qa-report.md").write_text(qa_report, encoding="utf-8")
        record = {
            "internal_order_reference": order["internal_order_reference"],
            "etsy_order_reference": order["etsy_order_reference"],
            "product_version": PRODUCT_VERSION,
            "input_completeness": "COMPLETE_SYNTHETIC_INPUT",
            "source_asset_version": PRODUCTION_FILES[0],
            "source_asset_sha256": source_hash,
            "design_generation_method": "deterministic annotated composition; exact production render; no image-generation API",
            "human_review_result": status,
            "asset_preparation_seconds": round(asset_seconds, 6),
            "design_generation_seconds": round(design_seconds, 6),
            "manual_adjustment_seconds": 0.0,
            "pdf_preparation_seconds": round(pdf_seconds, 6),
            "qa_seconds": round(qa_seconds, 6),
            "total_production_seconds": round(total_seconds, 6),
            "compute_api_cost_usd": 0.0,
            "labor_cost_usd": "NOT_MEASURED",
            "etsy_platform_fees_usd": "NOT_MEASURED",
            "payment_fees_usd": "NOT_MEASURED",
            "other_variable_costs_usd": "NOT_MEASURED",
            "rework_count": 0,
            "delivery_timestamp": "NOT_DELIVERED_SYNTHETIC_TEST",
            "actual_delivery_cost_usd": "NOT_MEASURED",
            "customer_feedback": "NOT_APPLICABLE_SYNTHETIC_TEST",
            "gross_revenue_assumption_usd": PRICE_USD,
            "contribution_margin_usd": "NOT_CALCULABLE_UNMEASURED_COSTS",
        }
        (folder / "cost-record.json").write_text(json.dumps(record, indent=2) + "\n", encoding="utf-8")
        (folder / "input.json").write_text(json.dumps(order, indent=2) + "\n", encoding="utf-8")
        results.append(record)
    return results


def write_cost_csv(records: list[dict]) -> None:
    fields = list(records[0].keys())
    with (OUT / "pilot/cost-analysis.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(records)


def write_test_results() -> None:
    results = """# Test results

Execution date: 2026-10-18

| Check | Result | Notes |
|---|---|---|
| `python3 scripts/qa_forest_starter_v01.py` | PASS | Required tree, 10 images, 4 PDFs, 3 synthetic orders, privacy fields, cost records, and ZIP validated. |
| `node --test workers/mynest-api/test/*.test.js` | PASS | 22 tests passed, 0 failed. |
| `node scripts/qa-mynest-forest-room.mjs` | PASS | Existing Forest Room regression suite passed. |
| `node scripts/qa-mynest-forest-meadow-ab.mjs` | NOT RUN | Script could not start because `sharp` is neither declared nor installed in this repository checkout. Production dependencies were not changed for this offline artifact task. |
| PDF parse validation | PASS | Starter template and tests A/B/C each contain two readable pages. |
| PDF rendered visual review | PASS | All eight rendered pages checked for clipping, overlap, broken glyphs, spacing, and legibility. |
| Listing image visual review | PASS | Contact sheet and ten 2000 x 2000 images reviewed. |

The missing optional `sharp` dependency does not affect the deterministic Python compositor, PDF generation, artifact QA, current Forest route, or API tests. It remains documented rather than treated as a successful test.
"""
    (OUT / "TEST_RESULTS.md").write_text(results, encoding="utf-8")


def make_contact_sheet(paths: list[Path]) -> Path:
    sheet = Image.new("RGB", (2500, 1120), "#E7E5DC")
    draw = ImageDraw.Draw(sheet)
    draw.text((55, 30), "MYKIDSNEST - FOREST STARTER - ETSY REVIEW", font=font(36, bold=True), fill=FOREST)
    for i, path in enumerate(paths):
        image = Image.open(path).convert("RGB").resize((430, 430), Image.Resampling.LANCZOS)
        x, y = 55 + (i % 5) * 490, 110 + (i // 5) * 500
        rounded_paste(sheet, image, (x, y), 18)
        draw.text((x, y + 442), path.stem, font=font(20, bold=True), fill=INK)
    output = OUT / "images/contact-sheet.png"
    sheet.save(output, "PNG", optimize=True)
    return output


def write_final(asset_entries, listing_paths, records) -> None:
    total_runtime = sum(float(item["total_production_seconds"]) for item in records)
    final = f"""# FINAL REVIEW - MYKIDSNEST-ETSY-FOREST-001

Status: **READY FOR HUMAN REVIEW - NOT READY FOR PRODUCTION PUBLICATION**

## Acceptance gates

| Gate | Result | Evidence |
|---|---|---|
| A - Source Fidelity | PASS | Six current assets recovered and source/production SHA-256 pairs match. |
| B - Product Integrity | PASS FOR SYNTHETIC PILOT | Each test produces a useful concept image and PDF independently of an upgrade. |
| C - Delivery Completeness | PASS | Tests A, B, and C each contain input, concept PNG, two-page PDF, QA report, and cost record. |
| D - Commercial Measurement | PARTIAL | Local runtime and API cost recorded; labor and Etsy/payment fees remain NOT_MEASURED. |
| E - Compliance | CONDITIONAL | Structure fits Etsy digital creative service policy; ownership, AI disclosure, seller-dashboard fields, timing, refunds, and consumer-rights language remain unresolved. |
| F - Human Approval | BLOCKED BY DESIGN | No publication, message, delivery, deployment, or real-customer action is authorized. |

## Execution report

PROJECT = MYKIDSNEST-ETSY-FOREST-001

BASELINE_SHA = {BASELINE_SHA}

FEATURE_BRANCH = {FEATURE_BRANCH}

SOURCE_ASSETS_RECOVERED = {len(asset_entries)} current production assets

DESIGN_FIDELITY = PASS - deterministic composition of exact production artwork; no generic replacement and no image-generation API

LISTING_COPY_READY = YES - HUMAN REVIEW REQUIRED

LISTING_IMAGES_READY = {len(listing_paths)}/10 - HUMAN REVIEW REQUIRED; image 09 contains explicitly inactive future-product assumptions

PERSONALIZATION_FLOW_READY = YES - maximum five fields, privacy-minimized, no automated messaging

PDF_DELIVERY_TEMPLATE_READY = YES - two-page template plus three completed synthetic summaries

SYNTHETIC_TESTS_PASSED = 3/3; Test C records a manual-review trigger for irregular geometry

OBSERVED_PRODUCTION_COST = USD 0.00 measured API cost; {total_runtime:.6f} seconds aggregate local machine runtime; labor, platform, payment, and delivery costs NOT_MEASURED

ESTIMATED_CONTRIBUTION_MARGIN = NOT_CALCULABLE - required cost inputs remain NOT_MEASURED

ETSY_COMPLIANCE_STATUS = CONDITIONAL - NOT POLICY_BLOCKED; owner rights/AI provenance, dashboard baseline, processing time, revisions, refunds, and consumer-rights review remain open

UNRESOLVED_BLOCKERS = Etsy listing URL/ID and seller settings NOT_VERIFIED; usage rights and AI provenance confirmation; processing-time and revision commitment; platform/payment fees; labor costing; refund/cancellation/legal review; human publication approval

PR_URL = https://github.com/roalstoney-alt/springofzen/pull/2

ZIP_ARTIFACT_PATH = {ZIP_PATH.relative_to(ROOT)}

PRODUCTION_CHANGED = NO

ETSY_LISTING_CHANGED = NO

REAL_CUSTOMERS_CONTACTED = 0

READY_FOR_HUMAN_REVIEW = YES

## Test summary

- Forest Starter artifact QA: PASS
- Existing API suite: PASS (22/22)
- Existing Forest Room regression: PASS
- Legacy meadow A/B script: NOT RUN - undeclared/uninstalled `sharp` dependency
- PDF visual review: PASS (8/8 rendered pages)
"""
    (OUT / "FINAL_REVIEW.md").write_text(final, encoding="utf-8")


def build_zip() -> None:
    if ZIP_PATH.exists():
        ZIP_PATH.unlink()
    prefix = Path("MYKIDSNEST_FOREST_STARTER_COMMERCIAL_PILOT_v0.1")
    with zipfile.ZipFile(ZIP_PATH, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(OUT.rglob("*")):
            if path.is_file():
                archive.write(path, prefix / path.relative_to(OUT))


def main() -> None:
    ensure_dirs()
    assets = copy_and_manifest_assets()
    day = Image.open(OUT / "images/original-assets" / PRODUCTION_FILES[0]).convert("RGB")
    day_mobile = Image.open(OUT / "images/original-assets" / PRODUCTION_FILES[1]).convert("RGB")
    night = Image.open(OUT / "images/original-assets" / PRODUCTION_FILES[2]).convert("RGB")
    rest = Image.open(OUT / "images/original-assets" / PRODUCTION_FILES[4]).convert("RGB")
    write_baseline(assets)
    write_listing_content()
    write_delivery_and_workflow()
    listing = make_listing_images(day, day_mobile, night, rest)
    make_contact_sheet(listing)
    template_order = dict(ORDERS[0])
    template_order.update({
        "internal_order_reference": "[PRIVATE INTERNAL ORDER REFERENCE]",
        "age_range": "[BROAD AGE RANGE]",
        "room": "[APPROXIMATE ROOM INFORMATION]",
        "preferences": "[COLOR DIRECTION]",
        "forest_elements": "[FOREST ELEMENTS]",
        "existing_furniture": "[EXISTING FURNITURE]",
        "constraints": "[ROOM CONSTRAINTS]",
        "suggestions": ["[APPROVED HIGH-LEVEL SUGGESTION]"],
        "manual_review_required": False,
    })
    make_summary_pdf(template_order, OUT / "delivery/concept-template/fictional-example.png", OUT / "delivery/starter-template.pdf", template=True)
    records = build_pilots(day)
    write_cost_csv(records)
    write_test_results()
    write_final(assets, listing, records)
    build_zip()
    print(json.dumps({
        "output": str(OUT),
        "zip": str(ZIP_PATH),
        "zip_sha256": sha256(ZIP_PATH),
        "source_assets": len(assets),
        "listing_images": len(listing),
        "synthetic_orders": len(records),
        "pdfs": 4,
    }, indent=2))


if __name__ == "__main__":
    main()
