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
              <span className="site-brand__mark">RL</span>
              <span className="site-brand__copy">
                <strong>RocketLevel</strong>
                <em>NAPA ROI Calculator</em>
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
            <div className="hero-cost-card">
              <span>Total Platform Cost</span>
              <strong>{formatCurrency(outputs.monthlySoftwareCost)}</strong>
              <p>
                {AI_PLANS[inputs.aiPlan].label} plan + PBX for {outputs.billablePbxUsers} users
              </p>
            </div>
          </div>
        </section>

        <section className="content-grid" id="calculator">
          <div className="input-panel">
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
                  <span>RocketLevel AI Plan</span>
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
                  <span>RocketLevel PBX Users</span>
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
                    <em>{formatCurrency(defaultAssumptions.pbxSeatCost)}/user</em>
                  </div>
                </label>
              </div>
              <p className="helper-copy">
                PBX pricing is {formatCurrency(defaultAssumptions.pbxSeatCost)} per
                user with a minimum of {defaultAssumptions.pbxMinimumUsers} users.
              </p>
            </section>
          </div>

          <aside className="results-panel" id="impact">
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
                label="AI Plan Cost"
                value={formatCurrency(outputs.aiPlanCost)}
              />
              <ResultCard
                label={`PBX Cost (${outputs.billablePbxUsers} Users)`}
                value={formatCurrency(outputs.pbxPlanCost)}
              />
            </div>

          </aside>
        </section>

        {!isEmbed ? (
          <>
            <section className="cta-band">
              <p className="eyebrow">Scale Smarter</p>
              <h2>See how RocketLevel can turn missed demand into measurable revenue.</h2>
              <a className="site-cta site-cta--large" href="https://rocketlevel.com/">
                Book Your Free Session
              </a>
            </section>

            <footer className="site-footer" id="footer">
              <div className="site-footer__grid">
                <div>
                  <a className="site-brand site-brand--footer" href="https://rocketlevel.com/">
                    <span className="site-brand__mark">RL</span>
                    <span className="site-brand__copy">
                      <strong>RocketLevel</strong>
                      <em>AI Growth Solutions</em>
                    </span>
                  </a>
                  <ul className="footer-list footer-list--contact">
                    <li>3535 Peachtree Road NE, Suite 320 Atlanta, GA 30326</li>
                    <li>(877) 552-9418</li>
                  </ul>
                </div>

                <div>
                  <h3>Quick Links</h3>
                  <ul className="footer-list">
                    {primaryNav.map((item) => (
                      <li key={item.label}>
                        <a href={item.href}>{item.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3>Solutions</h3>
                  <ul className="footer-list">
                    {footerSolutions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3>Get in Touch</h3>
                  <p className="footer-copy">
                    Smarter growth systems for local, multi-location, and franchise brands.
                  </p>
                  <a className="site-cta" href="https://rocketlevel.com/">
                    Book Your Free Session
                  </a>
                </div>
              </div>

              <div className="site-footer__bottom">
                <span>Copyright © 2026 RocketLevel. All rights reserved.</span>
                <div className="site-footer__bottom-links">
                  <a href="https://rocketlevel.com/">Privacy Policy</a>
                  <a href="https://rocketlevel.com/">Terms & Conditions</a>
                </div>
              </div>
            </footer>
          </>
        ) : null}
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
