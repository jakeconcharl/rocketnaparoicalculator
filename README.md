# NAPA ROI Calculator

Client-side ROI calculator built from the public Notion example for the NAPA metrics model.

## What it includes

- A standalone landing page calculator at the site root.
- An embeddable widget script at `dist/embed.js`.
- Shared calculation logic so both experiences use the same ROI math.
- Public users only edit call volume and platform pricing inputs.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The output is written to `dist/`.

## Vercel deployment

This project is static and can be deployed directly on Vercel.

1. Import the repo into Vercel.
2. Keep the default framework setting as `Vite`.
3. Use the default build command `npm run build`.
4. Use `dist` as the output directory if Vercel does not detect it automatically.

## Embedding on a website

### Script embed

Add a container where the calculator should appear:

```html
<div id="napa-roi-widget"></div>
```

Then load the built embed bundle:

```html
<script type="module">
  import "https://your-domain.com/embed.js";

  window.NapaCalculator?.mount("#napa-roi-widget", {
    title: "Estimate Your Monthly ROI",
    subtitle: "Interactive revenue recovery model for call handling and lead capture."
  });
</script>
```

### Iframe embed

If you want stronger style isolation, embed the standalone page inside an iframe:

```html
<iframe
  src="https://your-domain.com/"
  title="NAPA ROI Calculator"
  style="width:100%;min-height:1400px;border:0;"
></iframe>
```

## Calculation assumptions

The current model now exposes only these editable inputs:

- `Legitimate Calls`
- `Filtered Spam Calls`
- `RocketLevel AI Plan` with `Growth ($499)`, `Scale ($800)`, and `Pro ($1,200)`
- `RocketLevel PBX Users` at `$29/user` with a minimum of `5` users

The rest of the model continues to mirror the public Notion example values:

- `Missed Calls Recovered = (Legitimate Calls + Filtered Spam Calls) * Recovered Rate`
- `Estimated Jobs Saved = Missed Calls Recovered * Job Loss Rate`
- `Revenue Recovered = Estimated Jobs Saved * Average Job Value`
- `Labor Savings = Labor Hours Saved * Hourly Wage`
- `Staffing Savings = fixed monthly baseline`
- `Total Impact = Revenue Recovered + Labor Savings + Staffing Savings`
- `PBX Plan Cost = max(Users, 5) * 29`
- `Net ROI = Total Impact - (AI Plan Cost + PBX Plan Cost)`

## Next refinement

If you want, the next step can be connecting this UI to the actual Notion database or moving the assumptions into a CMS/admin config so non-developers can update the model without editing code.
