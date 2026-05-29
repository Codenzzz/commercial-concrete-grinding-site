# Commercial Concrete Grinding website

Static replacement for the Wix site at `www.commercialconcretegrinding.co.nz`, ready for GitHub Pages.

## Files

- `index.html` - site markup and SEO metadata.
- `styles.css` - responsive design.
- `script.js` - mobile navigation and email enquiry behaviour.
- `assets/` - project-local generated replacement images.
- `CNAME` - custom domain for GitHub Pages.

## Publish on GitHub Pages

1. Push this folder to a public GitHub repository.
2. In the repository, open **Settings > Pages**.
3. Set the source to **Deploy from a branch**, branch `main`, folder `/`.
4. Set the custom domain to `www.commercialconcretegrinding.co.nz`.
5. Enable **Enforce HTTPS** after GitHub has issued the certificate.

## DNS records

Set these records at the domain registrar or DNS host:

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

## Contact form note

GitHub Pages is static hosting, so the enquiry form opens a pre-filled email to
`nick@commercialconcretegrinding.co.nz`. To collect submissions without opening
an email app, connect a form service such as Formspree, Getform, Basin, or a
small backend endpoint.
