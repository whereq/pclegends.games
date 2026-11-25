#!/usr/bin/env python3
"""Fetch the CN DOS Games Wiki and read the English title off every page.

The archive files each game under its Chinese name. This wiki is the one
published catalogue that records the original English title of each of
those releases, in the `original name (en)` field of its infobox. The
titles are fetched first, then the pages themselves in batches of fifty.

Out: /home/whereq/git/dos/wiki-english-names.json
"""
import json
import re
import urllib.parse
import urllib.request

API = "https://cn-dos-games.fandom.com/zh/api.php"
OUT = "/home/whereq/git/dos/wiki-english-names.json"

ENGLISH = re.compile(r"\|\s*original name \(en\)\s*=\s*([^\n|]+)", re.I)


def fetch(params):
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "pclegends-catalogue/1.0"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read().decode("utf-8"))


def all_titles():
    """Every page in the wiki's main namespace."""
    titles = []
    params = {"action": "query", "list": "allpages", "apnamespace": "0",
              "aplimit": "500", "format": "json"}
    while True:
        data = fetch(params)
        titles.extend(page["title"] for page in data["query"]["allpages"])
        cont = data.get("continue", {}).get("apcontinue")
        if not cont:
            break
        params["apcontinue"] = cont
        print(f"  {len(titles)} titles", flush=True)
    return titles


def main():
    titles = all_titles()
    print(f"pages: {len(titles)}")

    names = {}
    for start in range(0, len(titles), 50):
        chunk = titles[start:start + 50]
        data = fetch({
            "action": "query",
            "prop": "revisions",
            "rvprop": "content",
            "rvslots": "main",
            "titles": "|".join(chunk),
            "format": "json",
        })
        for page in data.get("query", {}).get("pages", {}).values():
            try:
                text = page["revisions"][0]["slots"]["main"]["*"]
            except (KeyError, IndexError):
                continue
            match = ENGLISH.search(text)
            if not match:
                continue
            name = match.group(1).strip().strip("'\"")
            if name:
                names[page["title"]] = name
        print(f"  {start + len(chunk)}/{len(titles)} fetched, {len(names)} named", flush=True)

    print(f"pages with an English name: {len(names)}")
    with open(OUT, "w", encoding="utf-8") as handle:
        json.dump(names, handle, ensure_ascii=False, indent=1)
    print("wrote", OUT)


if __name__ == "__main__":
    main()
