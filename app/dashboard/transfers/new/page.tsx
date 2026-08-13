import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TransferForm } from "@/components/transfers/TransferForm";

export default function NewTransferPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Transferencias" }, { label: "Nueva" }]} />
      <TransferForm />
    </div>
  );
}
