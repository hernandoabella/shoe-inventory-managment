import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PurchaseForm } from "@/components/purchases/PurchaseForm";

export default function NewPurchasePage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Compras" }, { label: "Nueva" }]} />
      <PurchaseForm />
    </div>
  );
}
