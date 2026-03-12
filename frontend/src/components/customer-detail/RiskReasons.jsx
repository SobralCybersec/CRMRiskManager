import { AlertTriangle } from 'lucide-react';

const RiskReasons = ({ reasons }) => (
  <div>
    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
      <AlertTriangle className="w-5 h-5 text-red-500" />
      Motivos de Risco
    </h3>
    <div className="space-y-2">
      {reasons?.length > 0 ? (
        reasons.map((reason, idx) => (
          <RiskReasonCard key={idx} reason={reason} />
        ))
      ) : (
        <p className="text-gray-500 text-sm">Nenhum motivo de risco registrado</p>
      )}
    </div>
  </div>
);

const RiskReasonCard = ({ reason }) => (
  <div className="bg-red-50 p-3 rounded border border-red-200">
    <p className="font-medium text-red-800">{reason.reason}</p>
    <p className="text-sm text-red-600">{reason.description}</p>
    <p className="text-xs text-red-500 mt-1">
      Impacto: {(reason.impactScore * 100).toFixed(0)}%
    </p>
  </div>
);

export default RiskReasons;
