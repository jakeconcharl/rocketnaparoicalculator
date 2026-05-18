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
import rocketLevelLogo from "../rllogowhite.svg";

type AppProps = {
  mode: "standalone" | "embed";
  config?: {
    title: string;
    subtitle: string;
  };
};

const solutionsNav = [
  {
    label: "Digital Marketing",
    href: "https://rocketlevel.com/solutions/digital-marketing/"
  },
  {
    label: "Outbound Sales",
    href: "https://rocketlevel.com/solutions/outbound-sales/"
  },
  {
    label: "Inbound Sales",
    href: "https://rocketlevel.com/solutions/inbound-sales/"
  },
  {
    label: "Managed Services",
    href: "https://rocketlevel.com/solutions/managed-services/"
  },
  {
    label: "Commercial Systems",
    href: "https://rocketlevel.com/commercial-systems/"
  }
] as const;

const primaryNav = [
  { label: "Home", href: "https://rocketlevel.com/" },
  { label: "Technology", href: "https://rocketlevel.com/technology/" },
  { label: "Who We Help", href: "https://rocketlevel.com/who-we-help/" },
  { label: "Testimonials", href: "https://rocketlevel.com/testimonials/" },
  { label: "Company", href: "https://rocketlevel.com/company/" }
] as const;

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
              <img className="rocketlevel-logo" src={rocketLevelLogo} alt="RocketLevel" />
            </a>

            <nav className="site-nav" aria-label="Primary navigation">
              <div className="site-nav__dropdown">
                <a href="https://rocketlevel.com/solutions/" aria-haspopup="true">
                  Solutions
                </a>
                <div className="site-nav__menu">
                  {solutionsNav.map((item) => (
                    <a key={item.label} href={item.href}>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
              {primaryNav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-current={item.label === "Testimonials" ? "page" : undefined}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <a className="site-cta" href="https://rocketlevel.com/request-a-demo/">
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
            <div className="controls-grid">
              <section className="group-card">
                <h2>Call Volume</h2>
                <div className="field-stack">
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
                <div className="field-stack">
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
                <div className="assumptions-stack">
                  <AssumptionCard
                    label="Revenue Recovered"
                    value={formatCurrency(outputs.revenueRecovered)}
                  />
                  <AssumptionCard
                    label="Labor Savings"
                    value={formatCurrency(outputs.laborSavings)}
                  />
                  <AssumptionCard
                    label="Staffing Savings"
                    value={formatCurrency(outputs.staffingLaborSavings)}
                  />
                  <AssumptionCard
                    label="Total Monthly Impact"
                    value={formatCurrency(outputs.totalImpact)}
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

        {!isEmbed ? (
          <>
            <section className="cta-band">
              <div>
                <p className="cta-band__eyebrow">Scale Smarter</p>
                <h2>See how RocketLevel can turn missed demand into measurable revenue.</h2>
              </div>
              <a className="site-cta" href="https://rocketlevel.com/request-a-demo/">
                Book Your Free Session
              </a>
            </section>

            <footer className="site-footer" id="footer">
              <div className="site-footer__grid">
                <div>
                  <img className="rocketlevel-logo rocketlevel-logo--footer" src={rocketLevelLogo} alt="RocketLevel" />
                  <p className="site-footer__copy">
                    AI growth systems for local, franchise, and multi-location brands.
                  </p>
                  <ul className="footer-list footer-list--contact">
                    <li>3535 Peachtree Road NE, Suite 320 Atlanta, GA 30326</li>
                    <li>(877) 552-9418</li>
                  </ul>
                </div>

                <div>
                  <h3>Solutions</h3>
                  <ul className="footer-list">
                    {solutionsNav.map((item) => (
                      <li key={item.label}>
                        <a href={item.href}>{item.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3>Get in Touch</h3>
                  <p className="site-footer__copy">
                    Book a strategy session to map AI-assisted call handling to your revenue goals.
                  </p>
                  <a className="site-cta" href="https://rocketlevel.com/request-a-demo/">
                    Request Demo
                  </a>
                </div>
              </div>

              <div className="site-footer__bottom">
                <span>Copyright © 2026 RocketLevel. All rights reserved.</span>
                <div className="site-footer__bottom-links">
                  <a href="https://rocketlevel.com/company/">Company</a>
                  <a href="https://rocketlevel.com/request-a-demo/">Request a Demo</a>
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
