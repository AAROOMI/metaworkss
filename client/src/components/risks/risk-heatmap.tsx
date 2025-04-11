import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface DomainData {
  domain: string;
  domainCode: string;
  controls: any[];
  implemented: number;
  partially_implemented: number;
  not_implemented: number;
  risk_level: number;
}

interface RiskHeatmapProps {
  domains?: DomainData[];
}

function RiskHeatmapComponent({ domains = [] }: RiskHeatmapProps) {
  // If no domains or empty data, show placeholder
  if (!domains || domains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4 h-64">
        <AlertTriangle className="h-12 w-12 text-yellow-500" />
        <h3 className="text-lg font-medium">No Data Available</h3>
        <p className="text-center text-gray-500">
          There is no risk data to display for this assessment.
        </p>
      </div>
    );
  }

  // Function to determine color based on risk level
  const getRiskColor = (riskLevel: number) => {
    if (riskLevel <= 20) return "bg-green-500"; // Very Low Risk
    if (riskLevel <= 40) return "bg-green-300"; // Low Risk
    if (riskLevel <= 60) return "bg-yellow-300"; // Medium Risk
    if (riskLevel <= 80) return "bg-orange-400"; // High Risk
    return "bg-red-500"; // Very High Risk
  };

  // Function to get text color based on background color
  const getTextColor = (riskLevel: number) => {
    if (riskLevel <= 40) return "text-gray-800"; // Dark text for light backgrounds
    return "text-white"; // Light text for dark backgrounds
  };

  // Function to get risk level label
  const getRiskLabel = (riskLevel: number) => {
    if (riskLevel <= 20) return "Very Low";
    if (riskLevel <= 40) return "Low";
    if (riskLevel <= 60) return "Medium";
    if (riskLevel <= 80) return "High";
    return "Very High";
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-2">
        {domains.map((domain, index) => (
          <Card key={index} className={`p-0 overflow-hidden border-l-4 ${getRiskColor(domain.risk_level)}`}>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium mb-1">{domain.domainCode || 'D'} - {domain.domain}</h4>
                  <div className="text-xs text-gray-500">
                    {domain.controls.length} controls
                  </div>
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded ${getRiskColor(domain.risk_level)} ${getTextColor(domain.risk_level)}`}>
                  {getRiskLabel(domain.risk_level)}
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-3 gap-1 text-center text-xs">
                <div className="bg-green-100 text-green-800 rounded py-1">
                  <span className="font-medium">{domain.implemented}</span>
                  <span className="block text-[10px]">Implemented</span>
                </div>
                <div className="bg-yellow-100 text-yellow-800 rounded py-1">
                  <span className="font-medium">{domain.partially_implemented}</span>
                  <span className="block text-[10px]">Partial</span>
                </div>
                <div className="bg-red-100 text-red-800 rounded py-1">
                  <span className="font-medium">{domain.not_implemented}</span>
                  <span className="block text-[10px]">Not Impl.</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex justify-center items-center space-x-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span>Very Low</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-300 mr-1"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-300 mr-1"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-orange-400 mr-1"></div>
          <span>High</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
          <span>Very High</span>
        </div>
      </div>
    </div>
  );
}

// Sample data for dashboard view when no props are provided
const sampleDomainData: DomainData[] = [
  {
    domain: "Governance",
    domainCode: "GOV",
    controls: new Array(12),
    implemented: 5,
    partially_implemented: 4,
    not_implemented: 3,
    risk_level: 40
  },
  {
    domain: "Defense",
    domainCode: "DEF",
    controls: new Array(8),
    implemented: 6,
    partially_implemented: 1,
    not_implemented: 1,
    risk_level: 20
  },
  {
    domain: "Resilience",
    domainCode: "RES",
    controls: new Array(10),
    implemented: 4,
    partially_implemented: 3,
    not_implemented: 3,
    risk_level: 60
  },
  {
    domain: "Risk Management",
    domainCode: "RISK",
    controls: new Array(7),
    implemented: 2,
    partially_implemented: 2,
    not_implemented: 3,
    risk_level: 70
  }
];

// Default export with data fetching for dashboard
export default function RiskHeatmap() {
  // In a real implementation, we would fetch domain data
  // For now, showing sample data
  return <RiskHeatmapComponent domains={sampleDomainData} />;
}

// Named export for when data is provided
export { RiskHeatmapComponent };