export const AI_PLANS = {
  growth: { label: "Growth", monthlyCost: 499 },
  scale: { label: "Scale", monthlyCost: 800 },
  pro: { label: "Pro", monthlyCost: 1200 }
} as const;

export type AiPlanKey = keyof typeof AI_PLANS;

export type CalculatorInputs = {
  legitimateCalls: number;
  filteredSpamCalls: number;
  aiPlan: AiPlanKey;
  pbxUsers: number;
};

export type CalculatorAssumptions = {
  missedCallsRecoveredRate: number;
  jobLossRate: number;
  averageJobValue: number;
  laborMinutesSavedPerSpamCall: number;
  hourlyWage: number;
  monthlyHoursPerStaffRole: number;
  staffingMonthlyRoleCost: number;
  pbxSeatCost: number;
  pbxMinimumUsers: number;
};

export type CalculatorOutputs = {
  missedCallsRecovered: number;
  estimatedJobsLost: number;
  revenueRecovered: number;
  laborHoursSaved: number;
  laborSavings: number;
  staffingLaborRequirements: number;
  staffingLaborSavings: number;
  totalImpact: number;
  aiPlanCost: number;
  billablePbxUsers: number;
  pbxPlanCost: number;
  monthlySoftwareCost: number;
  netRoi: number;
  roiMultiple: number;
};

export const defaultInputs: CalculatorInputs = {
  legitimateCalls: 6000,
  filteredSpamCalls: 1000,
  aiPlan: "growth",
  pbxUsers: 5
};

export const defaultAssumptions: CalculatorAssumptions = {
  missedCallsRecoveredRate: 30,
  jobLossRate: 30,
  averageJobValue: 100,
  laborMinutesSavedPerSpamCall: 1.5,
  hourlyWage: 18,
  monthlyHoursPerStaffRole: 165,
  staffingMonthlyRoleCost: 2500,
  pbxSeatCost: 29.99,
  pbxMinimumUsers: 5
};

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateRoi(
  inputs: CalculatorInputs,
  assumptions: CalculatorAssumptions = defaultAssumptions
): CalculatorOutputs {
  const aiPlanCost = AI_PLANS[inputs.aiPlan].monthlyCost;
  const billablePbxUsers = Math.max(
    assumptions.pbxMinimumUsers,
    Math.round(inputs.pbxUsers)
  );
  const pbxPlanCost = billablePbxUsers * assumptions.pbxSeatCost;
  const missedCallsRecovered =
    (inputs.legitimateCalls + inputs.filteredSpamCalls) *
    (assumptions.missedCallsRecoveredRate / 100);
  const estimatedJobsLost =
    missedCallsRecovered * (assumptions.jobLossRate / 100);
  const revenueRecovered = estimatedJobsLost * assumptions.averageJobValue;
  const laborHoursSaved =
    (inputs.filteredSpamCalls * assumptions.laborMinutesSavedPerSpamCall) / 60;
  const laborSavings = laborHoursSaved * assumptions.hourlyWage;
  const staffingLaborRequirements =
    laborHoursSaved / assumptions.monthlyHoursPerStaffRole;
  const staffingLaborSavings =
    staffingLaborRequirements * assumptions.staffingMonthlyRoleCost;
  const totalImpact =
    revenueRecovered + laborSavings + staffingLaborSavings;
  const monthlySoftwareCost = aiPlanCost + pbxPlanCost;
  const netRoi = totalImpact - monthlySoftwareCost;
  const roiMultiple =
    monthlySoftwareCost > 0 ? totalImpact / monthlySoftwareCost : 0;

  return {
    missedCallsRecovered: roundCurrency(missedCallsRecovered),
    estimatedJobsLost: roundCurrency(estimatedJobsLost),
    revenueRecovered: roundCurrency(revenueRecovered),
    laborHoursSaved: roundCurrency(laborHoursSaved),
    laborSavings: roundCurrency(laborSavings),
    staffingLaborRequirements: roundCurrency(staffingLaborRequirements),
    staffingLaborSavings: roundCurrency(staffingLaborSavings),
    totalImpact: roundCurrency(totalImpact),
    aiPlanCost: roundCurrency(aiPlanCost),
    billablePbxUsers,
    pbxPlanCost: roundCurrency(pbxPlanCost),
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
