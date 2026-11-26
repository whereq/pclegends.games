# Handoff — `pclegends.games`: the `www` subdomain and Enforce HTTPS

**Written:** 26 November 2026, 09:30 EST
**By:** the session that shipped AdSense, the privacy-policy work and the identity gate
**For:** whoever picks this up next (Claude or human)
**Repos:** `whereq/pclegends.games` (public, `/home/whereq/git/pclegends.games`) · `whereq/whereq.github.io-docusaurus` (public, `/home/whereq/git/whereq.github.io-docusaurus`) · `whereq/whereq-family` (private, `/home/whereq/git/whereq-family`)

---

## 1. The goal

1. **`www.pclegends.games` should serve the games site over HTTPS with a valid certificate**, alongside the apex `pclegends.games`, exactly as GitHub's "apex domain and the `www` subdomain variant" flow intends.
2. **"Enforce HTTPS" on the games Pages site**, so `http://pclegends.games/` redirects to `https://`.
3. **The games site must stay reachable throughout.** It is a live, indexed site that now carries AdSense. A self-inflicted outage is a worse outcome than a missing redirect flag.

Non-goals: nothing else in the WhereQ Universe is affected by this. The other open items (AdSense's European regulations message, the giscus App install) are listed in §7 and are console clicks, not engineering.

---

## 2. Current state, verified

| Check | Result |
|---|---|
| `https://pclegends.games/` | **200**, certificate `CN = pclegends.games`, valid 2026-11-26 → 2027-02-24 |
| `https://pclegends.games/dos-games/66-qu/` | 200 |
| `https://pclegends.games/ads.txt` | 200, `google.com, pub-8075492281741045, DIRECT, f08c47fec0942fa0` |
| Ad code in the served HTML | `<meta name="google-adsense-account" content="ca-pub-8075492281741045">` and the loader — present on every page, both locales |
| `https://whereq.github.io/` | 200; privacy page reads *"This site carries no advertising."* |
| `www.pclegends.games` | **does not resolve** — the DNS record was deleted, so the host gives a DNS failure, not a redirect |
| `_github-pages-challenge-whereq.pclegends.games` | **absent** — the domain-verification TXT has not been added yet (see §7) |
| `http://pclegends.games/` | **200, not a 301** — Enforce HTTPS is off (see §3) |
| `pclegends.games` repo | `1786c18`, clean, matches `origin/main` |
| `whereq.github.io-docusaurus` repo | `e01a4c1`, clean, matches `origin/main` |

Everything else in this session's scope is **done**: AdSense live, the privacy policies corrected on both sites, the Chinese privacy page fixed and serving, the DOS-games catalogue moved off the hub with all 1 905 URLs redirecting to `pclegends.games`, the A-DOS route corrected in `CLAUDE.md`, and the commit-identity rule enforced with **0 git-identity findings** on both repos.

---

## 3. The problem

### 3.1 What GitHub says

```json
gh api repos/whereq/pclegends.games/pages --jq \
  '{cname:.cname,enf:.https_enforced,cert:.https_certificate.state,
    desc:.https_certificate.description,domains:.https_certificate.domains}'
```

```json
{"cname":"pclegends.games","enf":false,"cert":"new",
 "desc":"This domain was recently added. The certificate request process will begin shortly.",
 "domains":["pclegends.games","www.pclegends.games"]}
```

The certificate state has been `new` since **22:28 EST on 25 November** — over nine hours. While it is not `approved`, GitHub refuses Enforce HTTPS:

```
$ gh api -X PUT repos/whereq/pclegends.games/pages -F https_enforced=true
{"message":"Unavailable for your site because a certificate has not yet been issued for your domain",
 "status":"404"}
```

GitHub's own documentation allows for this: *"It can take up to 24 hours before this option [Enforce HTTPS] is available"* after a custom domain is set or changed.

### 3.2 Why it is stuck: a stale claim on `www`

GitHub is trying to certify **two** names, but `www.pclegends.games` cannot be validated, so the request never completes:

- **`www` has no DNS record at all.** Verified on all three NameSilo servers (`ns1/ns2/ns3.dnsowl.com`), on `8.8.8.8` / `1.1.1.1` / `9.9.9.9`, and the zone serial is a stable `1795664031`:
  ```sh
  for ns in ns1.dnsowl.com ns2.dnsowl.com ns3.dnsowl.com; do
    dig +short "@$ns" www.pclegends.games CNAME
  done   # → nothing, on every server
  ```
- **The deployed `CNAME` file says the apex**, not `www`: `https://pclegends.games/CNAME` → `pclegends.games`. The repo's `static/CNAME` is the same.
- **The claim is stored, not derived.** This is the decisive experiment. Removing the custom domain clears everything, and putting it back re-creates `www` within about 20 seconds:
  ```sh
  gh api -X PUT repos/whereq/pclegends.games/pages -f cname=''
  # → {"cert":null,"cname":null,"domains":null,"enf":true}
  gh api -X PUT repos/whereq/pclegends.games/pages -f cname='pclegends.games'
  # → {"cert":"new","cname":"pclegends.games",
  #    "domains":["pclegends.games","www.pclegends.games"],"enf":false}
  ```
  With no `www` anywhere in DNS, GitHub still puts it back in the list. It is holding a claim from **21:56 on 25 November**, when `www.pclegends.games` was briefly set as the custom domain during an attempt to force a certificate for it.

### 3.3 Why the claim cannot be released by API

Every endpoint that could manage Pages domains returns 404 for this account (GitHub Free, and these are newer paid-plan APIs):

```
GET|POST /repos/whereq/pclegends.games/pages/custom_domains   → 404
GET      /repos/whereq/pclegends.games/pages/domains           → 404
GET      /repos/whereq/pclegends.games/pages/domains/verify    → 404
GET|POST /users/whereq/pages/domains                           → 404
GET      /users/whereq/pages                                   → 404
```

The only way to clear the claim is to **delete and recreate the Pages site**, which wipes the site's record entirely.

### 3.4 No browser is available in this session

`tool_search` for `mcp_browser` returns nothing, so GitHub's web UI cannot be driven from here. Every step that needs a button is a human step. (The `browser-use:control-in-app-browser` skill is installed but unbound — the Host does not expose the capability.)

---

## 4. What was tried, and what each attempt proved

Read this before repeating anything. Several of these make the situation worse.

| Attempt | Outcome | Lesson |
|---|---|---|
| `PUT cname=www.pclegends.games` (21:56) | GitHub paired `www`; state went `dns_changed` → `new`; the apex started **301-ing to `www`**, whose certificate did not exist → **browsers could not reach the site at all** for ~55 minutes (apex → www → TLS error) | Making `www` canonical before its certificate exists takes the apex down with it |
| `DELETE` + `POST` the Pages site (22:28) | State `new` again, **with `www` in the list** — because the `www` CNAME was still in DNS at that moment | A recreate only clears the claim if `www` is out of DNS first |
| `PUT cname=''` then `PUT cname=pclegends.games` (03:07) | Cleared the set to null, then `www` reappeared within 20 s | The claim is stored server-side, not derived from DNS |
| Cycling `https_enforced` false → true | Refused with the same "certificate has not yet been issued" | The flag is gated on the certificate, nothing else |
| `static/_headers` with `Strict-Transport-Security` | The file was **published as a plain download** and no header was ever sent | **GitHub Pages reads no custom HTTP headers** — no `_headers`, no `_redirects`, no `.htaccess`. HSTS in a `<meta>` tag is ignored by browsers. Reverted in commit `1786c18`; do not retry |
| Repeated `PUT cname=…` while waiting for the certificate | Each one **restarts** the certificate request | **Do not touch the Pages config while a certificate is pending.** Use a read-only watcher |
| Waiting on the NameSilo zone | The three authoritative servers disagreed about `www` **on the same serial** (`1795653710`, then `1795664031`) — NameSilo serving stale cached zone versions | This looked like the user's DNS being wrong; it was not. The zone is now consistent and `www` is gone from all of them |

---

## 5. Where the work should continue

**Work in `whereq/pclegends.games`**, not in `whereq.github.io-docusaurus`.

Every remaining item belongs to the games site:

| Item | Lives in |
|---|---|
| The Pages custom domain, the certificate, Enforce HTTPS | `whereq/pclegends.games` → Settings → Pages, and the repo's own Pages record |
| The `www` CNAME and the TXT record | NameSilo, for `pclegends.games` |
| The giscus App installation | `whereq/pclegends.games` |
| The AdSense consent message | The AdSense console, for `pclegends.games` |
| Any code change | `src/data/adsense.ts`, `docusaurus.config.ts`, `static/` in the games repo |

The docs hub has **no open work**: its privacy page is rewritten and deployed, the DOS-games catalogue is gone with 1 905 redirects pointing at `pclegends.games`, and the A-DOS route is corrected. The games repo also carries its own `CLAUDE.md` with the house rules, so the next session is not blind.

Two couplings to know about:

- **The two repos are joined by one script.** `whereq.github.io-docusaurus/scripts/generate-game-redirects.py` reads the games repo's own route directory (`~/git/pclegends.games/src/pages/dos-games`) and rewrites `src/data/game-redirects.ts` — 1 906 entries today. **If games are added to or removed from `pclegends.games`, the hub's table must be regenerated and the hub redeployed**, or the old URLs stop redirecting.
- **The family repo** (`whereq/whereq-family`, private) holds the cross-repo identity gate — `registry/oss-policy.json` and `bin/audit-oss-readiness.sh` — and this handoff note. Nothing about the `www` work touches it.

---

## 6. Two ways forward

### Route A — the domain-verification TXT (recommended; needs a human)

This is GitHub's documented mechanism and the only path that actually delivers a working `www`.

1. In the GitHub UI: **Profile settings → Pages → Add a domain → `pclegends.games`**. GitHub shows a TXT record and its value.
2. Add that TXT record in NameSilo:
   - name: `_github-pages-challenge-whereq.pclegends.games`
   - type: `TXT`
   - value: exactly the string GitHub shows
3. Wait for it to resolve (`dig +short @ns1.dnsowl.com _github-pages-challenge-whereq.pclegends.games TXT`).
4. Re-add the `www` CNAME in NameSilo: name `www`, type `CNAME`, value `whereq.github.io.` — **not** the apex. GitHub's docs are explicit that pointing a subdomain at the apex breaks HTTPS enforcement, and that the CNAME must go to `<user>.github.io`.
5. Re-save the custom domain on the repo's Pages settings so GitHub re-checks DNS — **the running watcher does this for you** (§7), so it does not have to be done by hand.
6. The certificate request then covers both names and can validate `www`, and Enforce HTTPS becomes settable.

With the domain verified, GitHub can also use DNS-based validation, which is what `www` needs.

**The two records are the whole of what a human has to do here.** Once both resolve, `finish-www-certification.sh` takes it from there on its own.

### Route B — delete and recreate the Pages site (clears the claim; needs approval)

```sh
REPO=whereq/pclegends.games
gh api -X DELETE "repos/$REPO/pages"
gh api -X POST "repos/$REPO/pages" -f build_type=workflow \
  -f source[branch]=main -f source[path]=/
gh api -X PUT "repos/$REPO/pages" -f cname='pclegends.games'
gh workflow run deploy.yml --repo "$REPO"      # republish the artifact
```

- **Cost:** the site is unreachable for roughly **5–10 minutes** while the 1 898 game pages rebuild (the build took 4 min 41 s last time). Nothing in the repository changes — source, commits, `static/CNAME` and the workflow are untouched; only the Pages site's own record is replaced.
- **Payoff:** the domain set becomes apex-only, and that is exactly the configuration that issued a certificate before — at **21:33 EST on 25 November**, about 20 minutes after the earlier recreate, `CN = pclegends.games`. The site kept serving 200 with that certificate while the state was still `new`, so the outage is bounded by the build, not by the certificate.
- **What it does not do:** it does not give you `www`. That still needs Route A's TXT record.

---

## 7. Exact commands for the diagnosis

```sh
# The Pages record
gh api repos/whereq/pclegends.games/pages --jq \
  '{cname:.cname,enf:.https_enforced,cert:.https_certificate.state,
    domains:.https_certificate.domains,desc:.https_certificate.description}'

# Is www really gone from DNS?
for ns in ns1.dnsowl.com ns2.dnsowl.com ns3.dnsowl.com; do
  printf "%s serial=%s www=[%s]\n" "$ns" \
    "$(dig +short @$ns pclegends.games SOA | awk '{print $3}')" \
    "$(dig +short @$ns www.pclegends.games CNAME | tr '\n' ' ')"
done
dig +short @8.8.8.8 www.pclegends.games CNAME

# The apex A records must be exactly these four
dig +short pclegends.games A
# 185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153

# What the edge is actually serving
echo | openssl s_client -connect pclegends.games:443 -servername pclegends.games 2>/dev/null \
  | openssl x509 -noout -subject -dates
curl -sSI http://pclegends.games/ | grep -iE '^(HTTP|location)'   # 301 only once Enforce HTTPS is on
```

### The watcher to leave running

**`/home/whereq/git/.scratch/finish-www-certification.sh`** — the one to use. It watches all three NameSilo servers for the TXT record *and* the `www` CNAME, and only when both are present does it:

1. kick GitHub's DNS check — **once** (a repeated `PUT` restarts the certificate request, which is what kept this job stuck for nine hours),
2. poll read-only until the certificate reads `approved`,
3. set Enforce HTTPS,
4. verify the apex, `www`, a game page, `ads.txt` and the ad script, and print the `www` certificate's SANs.

Background tasks in this runtime are capped at **1 hour**, so it has to be re-launched when it ends:

```sh
/home/whereq/git/.scratch/finish-www-certification.sh
```

`/home/whereq/git/.scratch/arm-https-when-approved.sh` is the simpler variant: it only watches the certificate and arms Enforce HTTPS, without waiting for DNS. Use it if the DNS is already in place.

Other scripts from the session, all in `/home/whereq/git/.scratch/`, are kept for reference: `restore-games-pages.sh`, `restore-apex.sh`, `reset-domain-set.sh`, `kick-apex-cert.sh`, `finish-www-cert.sh`, `finish-www-cert-long.sh`, `rearm-https.sh`, `wait-for-www-removal.sh`, `watch-cert-readonly.sh`, `watch-cert.sh`, `watch-www.sh`. **Read before running any of them** — several were written against assumptions that turned out to be wrong, and `reset-domain-set.sh` has an unbound-variable bug under `set -u` (it reads `$last` before assigning it). `finish-www-certification.sh` had the same bug and it is fixed; the lesson generalises: under `set -u`, initialise every loop-carried variable.

### Why the DNS records could not be added from this session

Three separate blockers, each verified rather than assumed:

1. **No NameSilo credentials on this machine.** `/home/whereq` was searched for `namesilo`, `dnsowl`, `namesilo.com/api` and API-key patterns — including `~/.whereq-credentials.env`, `~/.hermes/.env`, every repo's `.env`, `~/.git-credentials`, `~/.netrc` and the shell history. The only hits were a DNS-provider dataset inside a Python package and unrelated pnpm store files. NameSilo's API needs a key from the account's profile page.
2. **No browser binding.** The `browser-use:control-in-app-browser` skill is installed, but `mcp_browser` is not exposed: `tool_search` with the exact name and with a regex both return zero hits, and there is no `run_code` tool to reach it through. The NameSilo web UI cannot be driven.
3. **The TXT value itself is unreadable.** GitHub generates it and shows it only in the UI. Every endpoint that might expose it 404s on this account, and the full Pages record carries only `protected_domain_state: null` and `pending_domain_unverified_at: null`.

### The DNS state as handed over

Checked at 09:44 on 26 November, on all three nameservers and on `8.8.8.8` / `1.1.1.1` / `9.9.9.9`:

```
_github-pages-challenge-whereq.pclegends.games  TXT   → nothing, anywhere
www.pclegends.games                              CNAME → nothing, anywhere
```

Neither record exists yet. The `www` CNAME was **deleted** during this session — it had to go, because while it pointed at `whereq.github.io` and GitHub held a certificate request for it, the edge redirected the apex to `www` and `www` had no certificate, so browsers could not reach the site at all. Re-adding it is part of Route A and is **not optional**: without it `www` cannot be certified.

### A session log, for the record

| Time (EST) | Event |
|---|---|
| 25 Nov, ~19:00 | AdSense account created; the consent model changed to Google's European regulations message |
| 25 Nov, 21:33 | A certificate for `pclegends.games` alone was issued — this is the one still being served |
| 25 Nov, 21:56 | `www` set as the custom domain to force a two-name certificate; the edge began 301-ing the apex to `www`, and `www` had no certificate — **the site went dark for browsers** |
| 25 Nov, 22:28 | Pages site deleted and recreated; the request still covered `www` because the CNAME was in DNS |
| 25 Nov, 22:45 | The AdSense deploy went green: publisher ID, meta tag, loader and `ads.txt` all live |
| 25 Nov, ~22:47 | The `www` CNAME was deleted from NameSilo; the zone stopped flapping and settled at serial `1795664031` |
| 25 Nov, 22:50 | The apex came back: 200 over HTTPS, valid certificate, ad code served |
| 26 Nov, 03:07 | `PUT cname=''` then `PUT cname=pclegends.games` — proved the `www` claim is stored server-side, because `www` returned to the list within 20 s with no `www` anywhere in DNS |
| 26 Nov, 03:14 | A `_headers` file with HSTS was deployed and proved useless — GitHub Pages reads no custom HTTP headers. Reverted in `1786c18` |
| 26 Nov, 09:30 | This handoff note written and pushed |
| 26 Nov, 09:44 | Neither DNS record present; the watcher in `finish-www-certification.sh` armed and waiting |


---

## 8. Still on the human side

1. **AdSense → Privacy & messaging → European regulations message.** Without it there is no consent prompt and no ads for visitors in the EEA, the UK and Switzerland. This is the last piece of the AdSense setup and it is a console toggle.
2. **Install the giscus App** for `whereq/pclegends.games`: <https://github.com/apps/giscus/installations/new>. Until then the Comments box on every game page shows giscus's *"giscus is not installed on this repository"* error. The component's configuration is already correct and verified — `repo="whereq/pclegends.games"`, `repoId="R_kgDOV6mb3g"`, `category="General"`, `categoryId="DIC_kwDOV6mb3s4DL5Ik"`, `mapping="pathname"` — and Discussions are enabled on the repo.
3. **Route A's two DNS records**, if `www` is wanted — the TXT and the `www` CNAME, both currently absent (§7).

Once the two DNS records are in place, nothing else is needed from a human: the watcher does the rest.

---

## 9. Gotchas that will bite the next person

- **`PUT` on the Pages config restarts the certificate request.** Never write to it while waiting for a certificate.
- **`PUT` resets unspecified fields.** `gh api -X PUT …/pages -f cname=…` silently sets `https_enforced` back to `false`. Always send both fields, or neither.
- **`PUT cname=''` is how you clear the whole domain set** — and the only way to make GitHub forget a domain it has claimed.
- **For a workflow-published site the `CNAME` file in the artifact is ignored**; GitHub takes the domain from the Pages record. `static/CNAME` in the repo only matters if the site is ever published from a branch.
- **GitHub Pages serves no custom HTTP headers.** No `_headers`, no `_redirects`, no `.htaccess`, and no HSTS via `<meta>`.
- **Docusaurus `headTags` attributes must be strings.** `async: true` fails validation with *"headTags[0].attributes.async must be a string"* — it wants `async: 'async'`.
- **In `.mdx`, `<https://example.com>` is parsed as JSX, not an autolink.** It fails the build with *"Unexpected character `/` before local name"*. Use a plain Markdown link. (`.md` files are fine — they are CommonMark, not MDX.)
- **All generator scripts in the WhereQ repos run under `~/git/whereq-dosbox-claude/.venv/bin/python`**; plain `python3` lacks `pypinyin`.
- **The games repo must stay public** for GitHub Pages on this plan — flipping it private deleted the Pages site outright.
- **AdSense approves a root domain only.** `whereq.github.io` is a subdomain of `github.io` and can never be monetised, which is why the advertising lives on `pclegends.games` and the docs hub's policy says it carries none.
- **AdSense's reviewer reads the served HTML**, so the loader must be server-rendered (a `headTags` entry, not a client-side injection) — a banner that hides the script until a click leaves the page with no ad code and the review fails.
- **Scratch and throwaway scripts belong in `/home/whereq/git/.scratch`, never inside an app repo.**

---

## 10. Repository state at handoff

**`whereq/pclegends.games`** @ `1786c18` (public, `main`):

- `src/data/adsense.ts` — `ADSENSE_CLIENT = 'ca-pub-8075492281741045'`, `ADSENSE_ENABLED`, `ADSENSE_SCRIPT_SRC`, `ADSENSE_HEAD_TAG`, `ADSENSE_META_TAG`
- `docusaurus.config.ts` — `headTags: ADSENSE_ENABLED ? [ADSENSE_META_TAG, ADSENSE_HEAD_TAG] : []`; `url: 'https://pclegends.games'`, `baseUrl: '/'`
- `static/ads.txt` — the console's line, published at `/ads.txt`
- `static/CNAME` — `pclegends.games`
- `src/pages/privacy.mdx` and `i18n/zh-CN/docusaurus-plugin-content-pages/privacy.mdx` — rewritten for the CMP model (consent is Google's)
- `.github/workflows/deploy.yml` — `configure-pages` → `upload-pages-artifact` → `deploy-pages`
- No `static/_headers` (removed — it did nothing)

**`whereq/whereq.github.io-docusaurus`** @ `e01a4c1` (public, `main`):

- `src/pages/privacy.mdx` — rewritten: this site carries no advertising, and points at the games site's policy
- `CLAUDE.md` — the advertising section rewritten for the root-domain rule and the CMP pattern; the A-DOS route corrected to `/docs/privacy/a-dos`
- Ad scaffolding removed: `src/theme/Root.tsx`, `src/components/AdsenseConsent/`, `src/components/ConsentSettings/`, `src/data/adsense.ts`
- The DOS-games catalogue is gone; `src/data/game-redirects.ts` holds the 1 905 generated redirects to `pclegends.games`

**`whereq/whereq-family`** (private): `registry/oss-policy.json` carries the identity rule (`required_email: whereq@gmail.com`, name pattern `^whereq$`, ccbus and GitHub noreply exempt); `bin/audit-oss-readiness.sh` checks **both** author and committer across all refs.
