import { useState } from "react";
import {
  calculateRoi,
  defaultInputs,
  formatCurrency,
  formatNumber,
  type CalculatorInputs
} from "./calculator";

type AppProps = {
  mode: "standalone" | "embed";
  config?: {
    title: string;
    subtitle: string;
  };
};

const fieldGroups: Array<{
  title: string;
  fields: Array<{
    key: keyof CalculatorInputs;
    label: string;
    step?: number;
    suffix?: string;
  }>;
}> = [
  {
    title: "Call Volume",
    fields: [
      { key: "legitimateCalls", label: "Legitimate Calls", step: 100 },
      { key: "filteredSpamCalls", label: "Filtered Spam Calls", step: 50 },
      {
        key: "missedCallsRecoveredRate",
        label: "Missed Calls Recovered Rate",
        step: 1,
        suffix: "%"
      },
      {
        key: "jobLossRate",
        label: "Estimated Job Loss Rate",
        step: 1,
        suffix: "%"
      }
    ]
  },
  {
    title: "Revenue + Labor",
    fields: [
      { key: "averageJobValue", label: "Average Job Value", step: 10 },
      { key: "laborHoursSaved", label: "Labor Hours Saved", step: 1 },
      { key: "hourlyWage", label: "Hourly Wage", step: 1 },
      { key: "staffingFteSavings", label: "Staffing FTE Savings", step: 0.01 },
      { key: "annualEmployeeCost", label: "Annual Employee Cost", step: 100 }
    ]
  },
  {
    title: "Platform Costs",
    fields: [
      { key: "aiPlanCost", label: "Rocket Level AI Plan Cost", step: 1 },
      { key: "pbxPlanCost", label: "Rocket Level PBX Plan Cost", step: 1 }
    ]
  }
];

export function App({ mode, config }: AppProps) {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const outputs = calculateRoi(inputs);
  const isEmbed = mode === "embed";

  const title = config?.title ?? "NAPA ROI Calculator";
  const subtitle =
    config?.subtitle ??
    "Model the monthly revenue recovery and labor efficiency impact of AI-assisted call handling.";

  function updateInput(key: keyof CalculatorInputs, value: string) {
    const parsedValue = Number(value);
    setInputs((current) => ({
      ...current,
      [key]: Number.isFinite(parsedValue) ? parsedValue : 0
    }));
  }

  return (
    <main className={`app-shell app-shell--${mode}`}>
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">{isEmbed ? "Embedded ROI Widget" : "Revenue Recovery Model"}</p>
          <h1>{title}</h1>
          <p className="subtitle">{subtitle}</p>
        </div>

        <div className="hero-metric">
          <span>Net Monthly ROI</span>
          <strong>{formatCurrency(outputs.netRoi)}</strong>
          <p>{formatNumber(outputs.roiMultiple)}x return on monthly platform spend</p>
        </div>
      </section>

      <section className="content-grid">
        <div className="input-panel">
          {fieldGroups.map((group) => (
            <section className="group-card" key={group.title}>
              <h2>{group.title}</h2>
              <div className="field-grid">
                {group.fields.map((field) => (
                  <label className="field" key={field.key}>
                    <span>{field.label}</span>
                    <div className="input-wrap">
                      <input
                        type="number"
                        step={field.step ?? 1}
                        value={inputs[field.key]}
                        onChange={(event) => updateInput(field.key, event.target.value)}
                      />
                      {field.suffix ? <em>{field.suffix}</em> : null}
                    </div>
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="results-panel">
          <div className="result-card result-card--accent">
            <span>Total Monthly Impact</span>
            <strong>{formatCurrency(outputs.totalImpact)}</strong>
          </div>

          <div className="result-card-grid">
            <ResultCard
              label="Missed Calls Recovered"
              value={formatNumber(outputs.missedCallsRecovered)}
            />
            <ResultCard
              label="Estimated Jobs Saved"
              value={formatNumber(outputs.estimatedJobsLost)}
            />
            <ResultCard
              label="Revenue Recovered"
              value={formatCurrency(outputs.revenueRecovered)}
            />
            <ResultCard
              label="Labor Savings"
              value={formatCurrency(outputs.laborSavings)}
            />
            <ResultCard
              label="Staffing Savings"
              value={formatCurrency(outputs.staffingLaborSavings)}
            />
            <ResultCard
              label="Monthly Software Cost"
              value={formatCurrency(outputs.monthlySoftwareCost)}
            />
          </div>

          <div className="formula-card">
            <h2>Model Notes</h2>
            <p>
              This first version mirrors the published Notion example, where recovered
              calls, average job value, labor savings, and staffing savings roll into
              total impact before subtracting recurring software costs.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

type ResultCardProps = {
  label: string;
  value: string;
};

function ResultCard({ label, value }: ResultCardProps) {
  return (
    <article className="result-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
