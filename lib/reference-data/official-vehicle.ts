import { authorizeValidatedVehiclePathReference, type ValidatedVehiclePathReference } from "./schema";

export type OfficialReferenceSnapshot = Readonly<{
  financing: ValidatedVehiclePathReference;
  consortium: ValidatedVehiclePathReference;
}>;

/**
 * Canonical official references for vehicle-path simulations.
 * Financing remains caller-supplied because SGS 25471 is monthly/current data.
 * Consortium is a frozen historical BCB statistical reference (2024), not an offer.
 */
export function buildOfficialVehicleReferences(input: {
  financingMonthlyRatePercent: number;
  financingReferencePeriod: string;
  retrievedAt: string;
}): OfficialReferenceSnapshot {
  const financing=authorizeValidatedVehiclePathReference({
    kind:"VEHICLE_FINANCING_AVERAGE_RATE",
    value:input.financingMonthlyRatePercent,
    unit:"PERCENT_PER_MONTH",
    lineage:{
      source:"BCB",
      referenceId:"SGS-25471",
      referencePeriod:input.financingReferencePeriod,
      retrievedAt:input.retrievedAt,
      methodology:"BCB SGS 25471: taxa media mensal das novas operacoes de credito livre para pessoas fisicas - aquisicao de veiculos, ponderada pelo valor das concessoes."
    }
  });
  const consortium=authorizeValidatedVehiclePathReference({
    kind:"CONSORTIUM_ADMIN_FEE_AVERAGE",
    value:15.01,
    unit:"PERCENT_OF_CREDIT",
    vehicleCategory:"AUTOMOBILE",
    lineage:{
      source:"BCB",
      referenceId:"PANORAMA-CONSORCIOS-2024-AUTOMOVEIS",
      referencePeriod:"2024",
      retrievedAt:input.retrievedAt,
      methodology:"BCB Panorama do Sistema de Consorcios 2024: taxa media de administracao dos grupos novos de automoveis. Referencia estatistica historica; nao e oferta nem condicao contratual."
    }
  });
  return Object.freeze({financing,consortium});
}
