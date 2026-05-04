"""
Wave 5 — Refactor: <button className="aa-btn aa-btn--V aa-btn--S" {...}> -> <Button variant="V" size="S" {...}>
Char-by-char parser: respect quoted strings + brace depth. Only rewrite buttons WITH aa-btn class.
"""
import re
import sys
from pathlib import Path

PATH = Path(__file__).parent.parent / "ui_kits" / "default" / "index.html"
src = PATH.read_text(encoding="utf-8")


def parse_open_tag(s: str, start: int):
    """Find end of <button ...> tag starting at `start` (which points just after '<button').
    Respects strings ("...") and JSX braces ({...} with depth). Returns end index (just after '>')."""
    i = start
    n = len(s)
    in_str = None  # '"' or "'"
    brace = 0
    while i < n:
        c = s[i]
        if in_str:
            if c == "\\" and i + 1 < n:
                i += 2
                continue
            if c == in_str:
                in_str = None
            i += 1
            continue
        if c == '"' or c == "'":
            in_str = c
            i += 1
            continue
        if c == "{":
            brace += 1
            i += 1
            continue
        if c == "}":
            brace -= 1
            i += 1
            continue
        if c == ">" and brace == 0:
            return i + 1
        i += 1
    raise ValueError(f"Unclosed tag at {start}")


def find_close(s: str, start: int):
    """Find matching </button> for an open at `start` (after the open tag).
    Tracks <button ...> nesting (raw lowercase, not <Button>)."""
    i = start
    n = len(s)
    depth = 1
    pat = re.compile(r"</button>|<button\b")
    while i < n:
        m = pat.search(s, i)
        if not m:
            return -1
        if m.group(0) == "</button>":
            depth -= 1
            if depth == 0:
                return m.start(), m.end()
            i = m.end()
        else:
            depth += 1
            i = m.end()
    return -1


def extract_classname(open_tag: str):
    """Find className="..." or className={"..."} value. Returns (start_idx, end_idx, value) or None."""
    m = re.search(r'\bclassName=(?P<q>")(?P<v>[^"]*)"', open_tag)
    if m:
        return m.start("v") - 1, m.end(), m.group("v")  # span includes "..." quotes
    return None


out = []
i = 0
n = len(src)
count_changed = 0
count_skipped_no_aa = 0
count_skipped_no_variant = 0

open_re = re.compile(r"<button\b")

while i < n:
    m = open_re.search(src, i)
    if not m:
        out.append(src[i:])
        break
    out.append(src[i:m.start()])
    # Parse the full open tag
    try:
        end_tag = parse_open_tag(src, m.end())
    except ValueError:
        out.append(src[m.start():])
        break
    open_tag = src[m.start():end_tag]  # full <button ...>

    # Check if it has aa-btn class
    cn = extract_classname(open_tag)
    if not cn or "aa-btn" not in cn[2]:
        # Not an aa-btn button — keep as-is
        out.append(open_tag)
        i = end_tag
        count_skipped_no_aa += 1 if cn else 0
        continue

    classes = cn[2].strip().split()
    variant = None
    size = None
    full_width = False
    icon_only = False
    extra_classes = []
    for p in classes:
        if p == "aa-btn":
            continue
        if p.startswith("aa-btn--"):
            mod = p[len("aa-btn--"):]
            if mod in ("primary", "secondary", "outline", "ghost", "destructive", "accent"):
                variant = mod
            elif mod in ("sm", "md", "lg"):
                size = mod
            elif mod == "full":
                full_width = True
            elif mod == "icon":
                icon_only = True
            else:
                extra_classes.append(p)
        else:
            extra_classes.append(p)

    if variant is None:
        # No variant — Button.jsx defaults to primary, but visual antes era ghost-ish (transparent base).
        # For Pagination page numbers (linha 977 example), use 'ghost' to preserve transparent look.
        variant = "ghost"

    # Build new open tag: replace className="..." span with new props
    cn_start, cn_end, _ = cn
    # cn_start points to the opening quote of the value
    # Find "className=" before it
    cn_attr_start = open_tag.rfind("className=", 0, cn_start)
    if cn_attr_start == -1:
        # Defensive: skip
        out.append(open_tag)
        i = end_tag
        count_skipped_no_variant += 1
        continue
    # Compose new props string
    new_props_parts = [f'variant="{variant}"']
    if size:
        new_props_parts.append(f'size="{size}"')
    if full_width:
        new_props_parts.append("fullWidth")
    if icon_only:
        new_props_parts.append("iconOnly")
    if extra_classes:
        ec = " ".join(extra_classes)
        new_props_parts.append(f'className="{ec}"')
    new_props = " ".join(new_props_parts)

    # Replace `className="..."` with new_props in open_tag, then change <button -> <Button
    new_open = open_tag[:cn_attr_start] + new_props + open_tag[cn_end:]
    new_open = "<Button" + new_open[len("<button"):]
    out.append(new_open)

    # Find matching </button>
    close_res = find_close(src, end_tag)
    if close_res == -1:
        print(f"WARN: no closing for open at {m.start()}", file=sys.stderr)
        out.append(src[end_tag:])
        break
    close_start, close_end = close_res
    out.append(src[end_tag:close_start])
    out.append("</Button>")
    i = close_end
    count_changed += 1

result = "".join(out)
PATH.write_text(result, encoding="utf-8", newline="\n")
print(f"Changed: {count_changed}")
print(f"Skipped (no aa-btn): {count_skipped_no_aa}")
print(f"Skipped (parse fail): {count_skipped_no_variant}")
