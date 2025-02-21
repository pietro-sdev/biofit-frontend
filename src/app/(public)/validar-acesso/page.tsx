"use client";

import { Suspense } from "react";
import ValidarAcesso from "./ValidarAcesso";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ValidarAcesso />
    </Suspense>
  );
}
