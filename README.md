# Marmoleum Installation Experts website

Static GitHub Pages website at `www.commercialconcretegrinding.co.nz`, now positioned around Auckland Marmoleum installation, sustainable commercial linoleum, and commercial vinyl flooring.

## Files

- `index.html` - site markup and SEO metadata.
- `styles.css` - responsive design.
- `script.js` - mobile navigation and email enquiry behaviour.
- `assets/` - project-local generated replacement images.
- `docs/search-and-specifier-research.md` - keyword/specifier notes that shaped the Marmoleum-first rewrite.
- `CNAME` - custom domain for GitHub Pages.

## Client interaction

The site includes a free static "Project assistant" widget. It is not a paid AI
bot and does not need a backend. It asks a short Marmoleum/commercial vinyl
project questionnaire and opens a pre-filled email to
`nick@commercialconcretegrinding.co.nz`.

## Publish on GitHub Pages

1. Push this folder to a public GitHub repository.
2. In the repository, open **Settings > Pages**.
3. Set the source to **Deploy from a branch**, branch `main`, folder `/`.
4. Set the custom domain to `www.commercialconcretegrinding.co.nz`.
5. Enable **Enforce HTTPS** after GitHub has issued the certificate.

## DNS records

The domain currently needs to be pointed away from Wix and toward GitHub Pages.

If Crazy Domains is the DNS host, open the DNS Zone Editor for
`commercialconcretegrinding.co.nz` and set these records:

```text
www  CNAME  codenzzz.github.io
@    A      185.199.108.153
@    A      185.199.109.153
@    A      185.199.110.153
@    A      185.199.111.153
```

Optional IPv6 records:

```text
@    AAAA   2606:50c0:8000::153
@    AAAA   2606:50c0:8001::153
@    AAAA   2606:50c0:8002::153
@    AAAA   2606:50c0:8003::153
```

DNS can take up to 24 hours to propagate.

## Current DNS check

As of the first GitHub Pages setup, public DNS still pointed to Wix:

```text
commercialconcretegrinding.co.nz NS     ns12.wixdns.net
commercialconcretegrinding.co.nz NS     ns13.wixdns.net
www.commercialconcretegrinding.co.nz    cdn1.wixdns.net
commercialconcretegrinding.co.nz A      185.230.63.186
commercialconcretegrinding.co.nz A      185.230.63.171
commercialconcretegrinding.co.nz A      185.230.63.107
```

If the registrar has been changed to Crazy Domains nameservers, wait for the NS
change to propagate, then add the GitHub Pages records above inside Crazy
Domains. If the public NS records remain Wix, update the domain delegation at
the registrar before editing DNS records.

## Contact form note

GitHub Pages is static hosting, so the enquiry form opens a pre-filled email to
`nick@commercialconcretegrinding.co.nz`. To collect submissions without opening
an email app, connect a form service such as Formspree, Getform, Basin, or a
small backend endpoint.
