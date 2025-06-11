import { Card } from "@/components/ui/card";

export const EmptyState = ({
  isDisClaimer = false,
  isApprovals = false,
  isAuditLog = false,
}) => {
  return (
    <Card className="p-10 mt-4">
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <div className="w-32 h-32 relative">
          <img
            src={`./images/${
              isDisClaimer
                ? "empty_state_disclaim"
                : isApprovals
                ? "empty_state_approvals"
                : isAuditLog
                ? "empty_state_auditlog"
                : "empty_state"
            }.png`}
            alt="Empty State"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-16 font-semibold text-[#000000]">
            {isDisClaimer
              ? "No Disclaimers Available"
              : isApprovals
              ? "No pending approvals yet."
              : isAuditLog
              ? "No activity recorded yet."
              : "Start your Search"}
          </h2>
          <p className="text-14 text-[#616161]">
            {isDisClaimer
              ? "We don’t have any disclaimers to show at the moment."
              : isApprovals
              ? "No pending parameter changes or disclaimers for approval at the moment. "
              : isAuditLog
              ? `Actions and changes will appear here as soon as they're logged. Start using the system to track your activity history.`
              : `Enter a CIF (Client Information File) number or client name to
            display data.`}
          </p>
        </div>
      </div>
    </Card>
  );
};
