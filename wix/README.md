# Installing the signup endpoint on a Wix site

1. In the Wix editor: **Dev Mode → Turn on Dev Mode** (Velo, free on every plan).
2. In the code panel, **Backend & Public → Backend → + → Expose site API** (creates `backend/http-functions.js` with the right name and place; a wrong name/folder gives `404 MODULE_NOT_FOUND`, see 8). Replace its contents with `http-functions.js` from this folder.
3. Before handing it to Faust, delete the two `localhost` entries from `ORIGINS`.
4. **Publish** the site. Warning: Publish ships every pending editor edit on the whole site too; check for unpublished changes first.
5. Nothing to create in Contacts: on its first run the function creates the label `tuner` and the three Text custom fields `tuner-consent-at`, `tuner-consent-version`, `tuner-source` itself (`findOrCreateLabel` / `findOrCreateExtendedField`). Some sites' dashboards offer no way to add custom fields at all, which is another reason the code does it.
6. Keys are assigned by Wix, not by us: a label or field created through the API gets a key like `custom.tuner-consent-at-x7f3k` (random suffix), so the code never hardcodes keys; it uses the ones `findOrCreate*` returns, matched by display name. Renaming a label/field in the dashboard breaks that match and makes the code create a fresh one, so leave the names alone.
7. Check: `./test.sh https://www.fauststudio.net/_functions/tunerSignup` (free test site: `https://<user>.wixsite.com/<site>/_functions/tunerSignup`).
8. Troubleshooting: `404` with header `x-wix-code-user-error-details: {"code":"MODULE_NOT_FOUND"}` means Wix finds no `backend/http-functions.js` at all (a site with no Velo file answers identically): check the file sits under **Backend** (not Public), is named exactly, Dev Mode is on, and the site was published after the paste. `/_functions-dev/tunerSignup` runs the unpublished editor code, so it tells "not published" apart from "file not found".
