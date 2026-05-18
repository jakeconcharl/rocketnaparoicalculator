import { useState } from "react";
import {
  AI_PLANS,
  calculateRoi,
  defaultAssumptions,
  defaultInputs,
  formatCurrency,
  formatNumber,
  type AiPlanKey,
  type CalculatorInputs
} from "./calculator";

type AppProps = {
  mode: "standalone" | "embed";
  config?: {
    title: string;
    subtitle: string;
  };
};

const primaryNav = [
  { label: "Home", href: "https://rocketlevel.com/" },
  { label: "Solutions", href: "#calculator" },
  { label: "Technology", href: "#impact" },
  { label: "Who We Help", href: "#assumptions" },
  { label: "Company", href: "#footer" }
];

const footerSolutions = [
  "Digital Marketing",
  "Outbound Sales",
  "Inbound Sales",
  "Managed Services",
  "Commercial Systems"
];

export function App({ mode, config }: AppProps) {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs);
  const outputs = calculateRoi(inputs);
  const isEmbed = mode === "embed";

  const title = config?.title ?? "NAPA ROI Calculator";
  const subtitle =
    config?.subtitle ??
    "Model the monthly revenue recovery and labor efficiency impact of AI-assisted call handling.";

  function updateNumberInput(key: keyof CalculatorInputs, value: string) {
    const parsedValue = Number(value);
    setInputs((current) => ({
      ...current,
      [key]: Number.isFinite(parsedValue) ? parsedValue : 0
    }));
  }

  function updatePlan(value: string) {
    setInputs((current) => ({
      ...current,
      aiPlan: value as AiPlanKey
    }));
  }

  return (
    <main className={`app-shell app-shell--${mode}`}>
      {!isEmbed ? (
        <header className="site-header">
          <div className="site-header__inner">
            <a className="site-brand" href="https://rocketlevel.com/">
              <RocketLevelLogo />
              <span className="site-brand__copy">
                <strong>NAPA ROI Calculator</strong>
                <em>Revenue recovery dashboard</em>
              </span>
            </a>

            <nav className="site-nav" aria-label="Primary navigation">
              {primaryNav.map((item) => (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>

            <a className="site-cta" href="https://rocketlevel.com/">
              Request Demo
            </a>
          </div>
        </header>
      ) : null}

      <div className="page-content">
        <section className="dashboard-shell" id="calculator">
          <div className="dashboard-kpis">
            <MetricPanel
              label="Net Monthly ROI"
              value={formatCurrency(outputs.netRoi)}
              detail={`${formatNumber(outputs.roiMultiple)}x return on monthly platform spend`}
              tone="primary"
            />
            <MetricPanel
              label="Total Monthly Impact"
              value={formatCurrency(outputs.totalImpact)}
              detail="Recovered revenue plus labor and staffing savings"
            />
            <MetricPanel
              label="Total Platform Cost"
              value={formatCurrency(outputs.monthlySoftwareCost)}
              detail={`${AI_PLANS[inputs.aiPlan].label} plan + PBX for ${outputs.billablePbxUsers} users`}
            />
          </div>

          <div className="dashboard-layout">
          <div className="dashboard-main">
            {!isEmbed ? (
              <section className="dashboard-intro">
                <p className="eyebrow">Revenue Recovery Model</p>
                <h1>{title}</h1>
                <p className="subtitle">{subtitle}</p>
              </section>
            ) : null}

            <div className="controls-grid">
              <section className="group-card">
                <h2>Call Volume</h2>
                <div className="field-grid">
                  <label className="field">
                    <span>Legitimate Calls</span>
                    <div className="input-wrap">
                      <input
                        type="number"
                        step={100}
                        min={0}
                        value={inputs.legitimateCalls}
                        onChange={(event) =>
                          updateNumberInput("legitimateCalls", event.target.value)
                        }
                      />
                    </div>
                  </label>

                  <label className="field">
                    <span>Filtered Spam Calls</span>
                    <div className="input-wrap">
                      <input
                        type="number"
                        step={50}
                        min={0}
                        value={inputs.filteredSpamCalls}
                        onChange={(event) =>
                          updateNumberInput("filteredSpamCalls", event.target.value)
                        }
                      />
                    </div>
                  </label>
                </div>
              </section>

              <section className="group-card">
                <h2>Platform Cost</h2>
                <div className="field-grid">
                <label className="field">
                  <span>AI Plan</span>
                  <div className="input-wrap input-wrap--select">
                    <select
                      value={inputs.aiPlan}
                        onChange={(event) => updatePlan(event.target.value)}
                      >
                        {Object.entries(AI_PLANS).map(([key, plan]) => (
                          <option key={key} value={key}>
                            {plan.label} ({formatCurrency(plan.monthlyCost)})
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>

                <label className="field">
                  <span>PBX Users</span>
                  <div className="input-wrap">
                    <input
                      type="number"
                        step={1}
                        min={defaultAssumptions.pbxMinimumUsers}
                        value={inputs.pbxUsers}
                        onChange={(event) =>
                        updateNumberInput("pbxUsers", event.target.value)
                      }
                    />
                  </div>
                </label>
              </div>
              <p className="helper-copy">
                Billed at {formatCurrency(defaultAssumptions.pbxSeatCost)}/user with a{" "}
                {defaultAssumptions.pbxMinimumUsers}-user minimum.
              </p>
            </section>

              <section className="group-card">
                <h2>Revenue + Labor</h2>
                <div className="assumptions-grid">
                  <AssumptionCard
                    label="Average Job Value"
                    value={formatCurrency(defaultAssumptions.averageJobValue)}
                  />
                  <AssumptionCard
                    label="Labor Hours Saved"
                    value={formatNumber(defaultAssumptions.laborHoursSaved)}
                  />
                  <AssumptionCard
                    label="Hourly Wage"
                    value={formatCurrency(defaultAssumptions.hourlyWage)}
                  />
                  <AssumptionCard
                    label="Staffing Savings"
                    value={formatCurrency(defaultAssumptions.staffingMonthlySavings)}
                  />
                </div>
              </section>
            </div>
          </div>

          <aside className="results-panel" id="impact">
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
                label="AI Plan Cost"
                value={formatCurrency(outputs.aiPlanCost)}
              />
              <ResultCard
                label={`PBX Cost (${outputs.billablePbxUsers} Users)`}
                value={formatCurrency(outputs.pbxPlanCost)}
              />
            </div>
          </aside>
          </div>
        </section>
      </div>
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

type MetricPanelProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "default" | "primary";
};

function MetricPanel({ label, value, detail, tone = "default" }: MetricPanelProps) {
  return (
    <article className={`metric-panel metric-panel--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

type AssumptionCardProps = {
  label: string;
  value: string;
};

function AssumptionCard({ label, value }: AssumptionCardProps) {
  return (
    <article className="assumption-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function RocketLevelLogo() {
  return (
    <span className="rocketlevel-logo" aria-label="RocketLevel">
      <span className="rocketlevel-logo__mark" />
      <span className="rocketlevel-logo__word">ROCKETLEVEL</span>
    </span>
  );
}
