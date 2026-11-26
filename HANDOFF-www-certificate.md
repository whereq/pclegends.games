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
| `_github-pages-challenge-whereq.pclegends.games` | **absent** — the domain-verification TXT has not been added yet. Optional: takeover protection only, not part of the certificate flow (§6) |
| `http://pclegends.games/` | **200, not a 301** — Enforce HTTPS is off (see §3) |
| `pclegends.games` repo | `f3f5f50`, clean, matches `origin/main` |
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

### 3.2 Why it is stuck: `www` has no DNS record

GitHub is trying to certify **two** names, and `www.pclegends.games` cannot be validated, so the request never completes:

- **`www` has no DNS record at all.** Verified on all three NameSilo servers (`ns1/ns2/ns3.dnsowl.com`), on `8.8.8.8` / `1.1.1.1` / `9.9.9.9`, and the zone serial is a stable `1795664031`:
  ```sh
  for ns in ns1.dnsowl.com ns2.dnsowl.com ns3.dnsowl.com; do
    dig +short "@$ns" www.pclegends.games CNAME
  done   # → nothing, on every server
  ```
- **The deployed `CNAME` file says the apex**, not `www`: `https://pclegends.games/CNAME` → `pclegends.games`. The repo's `static/CNAME` is the same. (For a workflow-published site that file is ignored anyway; GitHub takes the domain from the Pages record.)

**`www` is in the domain list by design, not by accident.** An earlier reading of this session treated it as a *stale claim* left over from the 21:56 attempt. GitHub's documentation says otherwise, and the documentation is the better evidence:

> *"If you are using an apex domain as your custom domain, we recommend also setting up a `www` subdomain. If you configure the correct records for each domain type through your DNS provider, GitHub Pages will automatically create redirects between the domains."*
> — [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

So for an **apex** custom domain, GitHub always provisions the **`www` variant alongside it** — it appears in `https_certificate.domains`, in the redirect set, and in the certificate request, with or without anything in DNS. The experiment that looked like proof of a stale claim is just this behaviour seen from the other side:

```sh
gh api -X PUT repos/whereq/pclegends.games/pages -f cname=''
# → {"cert":null,"cname":null,"domains":null,"enf":true}
gh api -X PUT repos/whereq/pclegends.games/pages -f cname='pclegends.games'
# → {"cert":"new","cname":"pclegends.games",
#    "domains":["pclegends.games","www.pclegends.games"],"enf":false}
```

`www` reappeared within 20 seconds with no `www` anywhere in DNS — because GitHub provisions the `www` variant for an apex domain automatically. **The request is stuck because `www` does not resolve, not because GitHub is holding a claim.**

This matters because it changes the fix: **one DNS record is enough** (§6), and deleting and recreating the Pages site (§Route B) is not needed and buys nothing.

### 3.3 The domain set cannot be edited by API

This is no longer a blocker (§3.2 — the `www` entry is GitHub's own doing), but it is worth recording because it is the reason there is no shortcut around DNS. Every endpoint that could manage Pages domains returns 404 for this account (GitHub Free, and these are newer paid-plan APIs):

```
GET|POST /repos/whereq/pclegends.games/pages/custom_domains   → 404
GET      /repos/whereq/pclegends.games/pages/domains           → 404
GET      /repos/whereq/pclegends.games/pages/domains/verify    → 404
GET|POST /users/whereq/pages/domains                           → 404
GET      /users/whereq/pages                                   → 404
GET      /orgs/whereq/pages                                    → 404
GET      /orgs/whereq/pages/domains                            → 404
```

GitHub's Pages record is also not the place the domain-verification TXT value lives — the record carries only `protected_domain_state: null` and `pending_domain_unverified_at: null`.

### 3.4 No browser is available in this session

`tool_search` for `mcp_browser` returns nothing, so GitHub's web UI cannot be driven from here. Every step that needs a button is a human step. (The `browser-use:control-in-app-browser` skill is installed but unbound — the Host does not expose the capability.)

---

## 4. What was tried, and what each attempt proved

Read this before repeating anything. Several of these make the situation worse.

| Attempt | Outcome | Lesson |
|---|---|---|
| `PUT cname=www.pclegends.games` (21:56) | GitHub paired `www`; state went `dns_changed` → `new`; the apex started **301-ing to `www`**, whose certificate did not exist → **browsers could not reach the site at all** for ~55 minutes (apex → www → TLS error) | Making `www` canonical before its certificate exists takes the apex down with it |
| `DELETE` + `POST` the Pages site (22:28) | State `new` again, **with `www` in the list** | A recreate does not remove `www` — GitHub provisions it for every apex domain (§3.2) |
| `PUT cname=''` then `PUT cname=pclegends.games` (03:07) | Cleared the set to null, then `www` reappeared within 20 s | Read at the time as "the claim is stored server-side"; **corrected later** — this is just GitHub provisioning the `www` variant for an apex domain (§3.2) |
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
| The `www` CNAME (required) and the TXT record (optional) | NameSilo, for `pclegends.games` |
| The giscus App installation | `whereq/pclegends.games` |
| The AdSense consent message | The AdSense console, for `pclegends.games` |
| Any code change | `src/data/adsense.ts`, `docusaurus.config.ts`, `static/` in the games repo |

The docs hub has **no open work**: its privacy page is rewritten and deployed, the DOS-games catalogue is gone with 1 905 redirects pointing at `pclegends.games`, and the A-DOS route is corrected. The games repo also carries its own `CLAUDE.md` with the house rules, so the next session is not blind.

Two couplings to know about:

- **The two repos are joined by one script.** `whereq.github.io-docusaurus/scripts/generate-game-redirects.py` reads the games repo's own route directory (`~/git/pclegends.games/src/pages/dos-games`) and rewrites `src/data/game-redirects.ts` — 1 906 entries today. **If games are added to or removed from `pclegends.games`, the hub's table must be regenerated and the hub redeployed**, or the old URLs stop redirecting.
- **The family repo** (`whereq/whereq-family`, private) holds the cross-repo identity gate — `registry/oss-policy.json` and `bin/audit-oss-readiness.sh` — and this handoff note. Nothing about the `www` work touches it.

---

## 6. Two ways forward

### Route A — the `www` CNAME (recommended; needs a human)

**One DNS record is all it takes.** GitHub's documented record table for an apex domain plus its `www` variant:

| Scenario | Type | Name | Value |
|---|---|---|---|
| Apex `pclegends.games` | `A` | `@` | `185.199.108.153` `185.199.109.153` `185.199.110.153` `185.199.111.153` |
| Apex `pclegends.games` | `AAAA` | `@` | `2606:50c0:8000::153` `2606:50c0:8001::153` `2606:50c0:8002::153` `2606:50c0:8003::153` |
| `www.pclegends.games` | `CNAME` | `www.pclegends.games.` | `whereq.github.io` |

The apex records are already in place and correct. **Only the CNAME is missing.**

1. In NameSilo, add a DNS record for `pclegends.games`:
   - type: `CNAME`
   - host/name: `www`
   - value: `whereq.github.io.` — **not** the apex. GitHub's docs are explicit that *"if you point your custom subdomain to your apex domain, you will encounter issues with enforcing HTTPS"*, and that the CNAME must point at the Pages default domain.
2. Wait for it to resolve:
   ```sh
   for ns in ns1.dnsowl.com ns2.dnsowl.com ns3.dnsowl.com; do
     dig +short "@$ns" www.pclegends.games CNAME
   done
   ```
3. Nothing else. The watcher (§7) notices the CNAME, kicks GitHub's DNS check once, waits for the certificate to be approved, arms Enforce HTTPS and verifies the site.

**The domain-verification TXT is a separate, optional thing.** `_github-pages-challenge-whereq.pclegends.games` is what GitHub's *Verify a custom domain* page asks for, and it buys **takeover protection** — it stops other GitHub users from claiming the domain if this site is ever deleted or downgraded. It is **not** part of the certificate flow and **not** needed for `www` to be certified. Adding it is still worth doing, but it no longer gates anything:

- name: `_github-pages-challenge-whereq.pclegends.games`
- type: `TXT`
- value: exactly the string GitHub shows at **Profile settings → Pages → Add a domain → `pclegends.games`**

That value is generated by GitHub and shown only in the UI, which is why it cannot be scripted from here. It can be added later, independently.

### Route B — delete and recreate the Pages site (not needed; do not do this)

This was the plan while the `www` entry was believed to be a stale claim. It is now unnecessary: `www` is GitHub's own apex-variant provisioning (§3.2), and Route A fixes the actual cause. Kept here only because it was tried and its cost is worth recording.

```sh
REPO=whereq/pclegends.games
gh api -X DELETE "repos/$REPO/pages"
gh api -X POST "repos/$REPO/pages" -f build_type=workflow \
  -f source[branch]=main -f source[path]=/
gh api -X PUT "repos/$REPO/pages" -f cname='pclegends.games'
gh workflow run deploy.yml --repo "$REPO"      # republish the artifact
```

- **Cost:** the site is unreachable for roughly **5–10 minutes** while the 1 898 game pages rebuild (the build took 4 min 41 s last time). Nothing in the repository changes — source, commits, `static/CNAME` and the workflow are untouched; only the Pages site's own record is replaced.
- **Why it was tried:** it was believed to clear the `www` claim. It does not — `www` comes straight back, because GitHub provisions it for every apex domain.
- **Recommendation: leave the site up.** The CNAME is one record and takes a minute; an outage is not worth it.

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

**`/home/whereq/git/.scratch/finish-www-certification.sh`** — the one to use. It watches all three NameSilo servers for the **`www` CNAME** (and only that — the TXT is optional, so waiting for it would stall the job forever), and when the CNAME appears it:

1. kicks GitHub's DNS check — **once** (a repeated `PUT` restarts the certificate request, which is what kept this job stuck for nine hours),
2. polls read-only until the certificate reads `approved`,
3. sets Enforce HTTPS,
4. verifies the apex, `www`, a game page, `ads.txt` and the ad script, and prints the `www` certificate's SANs.

Background tasks in this runtime are capped at **1 hour**, so it has to be re-launched when it ends:

```sh
/home/whereq/git/.scratch/finish-www-certification.sh
```

Its output goes to `/home/whereq/git/.scratch/finish-www-certification.log`.

`/home/whereq/git/.scratch/arm-https-when-approved.sh` is the simpler variant: it only watches the certificate and arms Enforce HTTPS, without waiting for DNS. Use it if the DNS is already in place.

Other scripts from the session, all in `/home/whereq/git/.scratch/`, are kept for reference: `restore-games-pages.sh`, `restore-apex.sh`, `reset-domain-set.sh`, `kick-apex-cert.sh`, `finish-www-cert.sh`, `finish-www-cert-long.sh`, `rearm-https.sh`, `wait-for-www-removal.sh`, `watch-cert-readonly.sh`, `watch-cert.sh`, `watch-www.sh`. **Read before running any of them** — several were written against assumptions that turned out to be wrong, and `reset-domain-set.sh` has an unbound-variable bug under `set -u` (it reads `$last` before assigning it). `finish-www-certification.sh` had the same bug and it is fixed; the lesson generalises: under `set -u`, initialise every loop-carried variable.

### Why the DNS records could not be added from this session

Two blockers, each verified rather than assumed. Both are about *access*, not about *what to add* — the record and its value are now known exactly (§6).

1. **No NameSilo credentials on this machine, or on PROD.** `/home/whereq` was searched for `namesilo`, `dnsowl`, `namesilo.com/api` and API-key patterns — including `~/.whereq-credentials.env`, `~/.hermes/.env`, every repo's `.env`, `~/.git-credentials`, `~/.netrc` and the shell history. The only hits were a DNS-provider dataset inside a Python package and unrelated pnpm store files. The PROD host (`whereq@whereq`) was searched too: no registrar credentials, no `~/.cloudflared`, no DNS env vars. NameSilo's API needs a key from the account's profile page.
2. **No browser binding.** The `browser-use:control-in-app-browser` skill is installed, but `mcp_browser` is not exposed: `tool_search` with the exact name, with a regex, and for `run_code` / computer-use all return zero hits. The NameSilo web UI cannot be driven from here.

A Playwright/Chromium build exists under `/home/whereq/git/.scratch/node_modules`, but it is a bare browser with no stored NameSilo session, so it cannot sign in.

### The DNS state as handed over

Checked at 10:20 on 26 November, on all three nameservers and on `8.8.8.8` / `1.1.1.1` / `9.9.9.9`:

```
_github-pages-challenge-whereq.pclegends.games  TXT   → nothing, anywhere
www.pclegends.games                              CNAME → nothing, anywhere
```

The apex is complete and correct:

```
pclegends.games  A     185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153
pclegends.games  AAAA  2606:50c0:8000::153 2606:50c0:8001::153 2606:50c0:8002::153 2606:50c0:8003::153
```

The `www` CNAME was **deleted** during this session — it had to go, because while it pointed at `whereq.github.io` and GitHub held a certificate request for it, the edge redirected the apex to `www` and `www` had no certificate, so browsers could not reach the site at all. Re-adding it is part of Route A and is **not optional**: without it `www` cannot be certified.

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
| 26 Nov, 03:07 | `PUT cname=''` then `PUT cname=pclegends.games` — at the time this was read as proof that the `www` claim is stored server-side. GitHub's docs later showed it is simply the apex variant being provisioned automatically (§3.2) |
| 26 Nov, 03:14 | A `_headers` file with HSTS was deployed and proved useless — GitHub Pages reads no custom HTTP headers. Reverted in `1786c18` |
| 26 Nov, 09:30 | This handoff note written and pushed |
| 26 Nov, 09:44 | Neither DNS record present; the watcher in `finish-www-certification.sh` armed and waiting |
| 26 Nov, 10:05 | The handoff note moved into this repository as `HANDOFF-www-certificate.md`; the family repo keeps only a pointer |
| 26 Nov, 10:20 | GitHub's Pages documentation re-read. **The diagnosis was wrong in one important respect**: `www` is GitHub's automatic apex-variant provisioning, not a stale claim, and the domain-verification TXT is takeover protection that is **not** part of the certificate flow. The human step shrinks from two records to **one CNAME**, and Route B is no longer needed |
| 26 Nov, 10:25 | The watcher rewritten to key on the `www` CNAME alone, and re-armed |


---

## 8. Still on the human side

1. **AdSense → Privacy & messaging → European regulations message.** Without it there is no consent prompt and no ads for visitors in the EEA, the UK and Switzerland. This is the last piece of the AdSense setup and it is a console toggle.
2. **Install the giscus App** for `whereq/pclegends.games`: <https://github.com/apps/giscus/installations/new>. Until then the Comments box on every game page shows giscus's *"giscus is not installed on this repository"* error. The component's configuration is already correct and verified — `repo="whereq/pclegends.games"`, `repoId="R_kgDOV6mb3g"`, `category="General"`, `categoryId="DIC_kwDOV6mb3s4DL5Ik"`, `mapping="pathname"` — and Discussions are enabled on the repo.
3. **Route A's `www` CNAME** — the one record that is actually required (§6). The domain-verification TXT is optional and can be added at any time.

Once the `www` CNAME is in place, nothing else is needed from a human: the watcher does the rest.

---

## 9. Gotchas that will bite the next person

- **`PUT` on the Pages config restarts the certificate request.** Never write to it while waiting for a certificate.
- **`PUT` resets unspecified fields.** `gh api -X PUT …/pages -f cname=…` silently sets `https_enforced` back to `false`. Always send both fields, or neither.
- **`PUT cname=''` is how you clear the whole domain set** — and the only way to make GitHub forget a domain it has claimed. Note that putting the apex back re-creates the `www` variant anyway (§3.2), so this does not "remove `www`".
- **An apex custom domain makes GitHub provision the `www` variant automatically.** It appears in `https_certificate.domains` and in the redirect set whether or not DNS has a `www` record. Read GitHub's own docs before concluding that a domain set is stale.
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

**`whereq/pclegends.games`** @ `f3f5f50` (public, `main`):

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
