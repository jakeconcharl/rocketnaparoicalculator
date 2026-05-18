export type CalculatorInputs = {
  legitimateCalls: number;
  filteredSpamCalls: number;
  missedCallsRecoveredRate: number;
  jobLossRate: number;
  averageJobValue: number;
  laborHoursSaved: number;
  hourlyWage: number;
  staffingFteSavings: number;
  annualEmployeeCost: number;
  aiPlanCost: number;
  pbxPlanCost: number;
};

export type CalculatorOutputs = {
  missedCallsRecovered: number;
  estimatedJobsLost: number;
  revenueRecovered: number;
  laborSavings: number;
  staffingLaborSavings: number;
  totalImpact: number;
  monthlySoftwareCost: number;
  netRoi: number;
  roiMultiple: number;
};

export const defaultInputs: CalculatorInputs = {
  legitimateCalls: 6000,
  filteredSpamCalls: 1000,
  missedCallsRecoveredRate: 30,
  jobLossRate: 30,
  averageJobValue: 100,
  laborHoursSaved: 25,
  hourlyWage: 18,
  staffingFteSavings: 0.15,
  annualEmployeeCost: 30303.03,
  aiPlanCost: 499,
  pbxPlanCost: 149.95
};

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateRoi(inputs: CalculatorInputs): CalculatorOutputs {
  const missedCallsRecovered =
    (inputs.legitimateCalls + inputs.filteredSpamCalls) *
    (inputs.missedCallsRecoveredRate / 100);
  const estimatedJobsLost = missedCallsRecovered * (inputs.jobLossRate / 100);
  const revenueRecovered = estimatedJobsLost * inputs.averageJobValue;
  const laborSavings = inputs.laborHoursSaved * inputs.hourlyWage;
  const staffingLaborSavings =
    (inputs.staffingFteSavings * inputs.annualEmployeeCost) / 12;
  const totalImpact =
    revenueRecovered + laborSavings + staffingLaborSavings;
  const monthlySoftwareCost = inputs.aiPlanCost + inputs.pbxPlanCost;
  const netRoi = totalImpact - monthlySoftwareCost;
  const roiMultiple =
    monthlySoftwareCost > 0 ? totalImpact / monthlySoftwareCost : 0;

  return {
    missedCallsRecovered: roundCurrency(missedCallsRecovered),
    estimatedJobsLost: roundCurrency(estimatedJobsLost),
    revenueRecovered: roundCurrency(revenueRecovered),
    laborSavings: roundCurrency(laborSavings),
    staffingLaborSavings: roundCurrency(staffingLaborSavings),
    totalImpact: roundCurrency(totalImpact),
    monthlySoftwareCost: roundCurrency(monthlySoftwareCost),
    netRoi: roundCurrency(netRoi),
    roiMultiple: Math.round((roiMultiple + Number.EPSILON) * 100) / 100
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(value);
}
