"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";

export function BarcodeInput() {
  const [barcode, setBarcode] = useState("");

  const handleBarcodeScan = async (value: string) => {
    console.log("Código de barras escaneado:", value);
    // Lógica para buscar producto por código de barras
  };

  return (
    <div className="space-y-2">
      <Input
        type="text"
        placeholder="Escanear código de barras"
        value={barcode}
        onChange={(e) => {
          setBarcode(e.target.value);
          handleBarcodeScan(e.target.value);
        }}
        className="text-center font-mono tracking-wider"
      />
      <p className="text-xs text-muted-foreground">
        O ingresa el SKU manualmente
      </p>
    </div>
  );
}

export default BarcodeInput;