export type ReferenceSource = "B3" | "BCB";

export type ReferenceUnit =
  | "PERCENT_PER_YEAR"
  | "PERCENT_PER_MONTH"
  | "PERCENT_OF_CREDIT";

export type ReferenceLineage = {
  source: ReferenceSource;
  referenceId: string;
  referencePeriod: string;
  retrievedAt: string;
  methodology: string;
};

export type RateReference<U extends ReferenceUnit = ReferenceUnit> = {
  value: number;
  unit: U;
  lineage: ReferenceLineage;
};

export type DiRateReference = RateReference<"PERCENT_PER_YEAR"> & {
  kind: "DI_RATE";
};

export type VehicleFinancingRateReference = RateReference<"PERCENT_PER_MONTH"> & {
  kind: "VEHICLE_FINANCING_AVERAGE_RATE";
};

export type ConsortiumAdminFeeReference = RateReference<"PERCENT_OF_CREDIT"> & {
  kind: "CONSORTIUM_ADMIN_FEE_AVERAGE";
  vehicleCategory: "AUTOMOBILE";
};

export type VehiclePathReference =
  | DiRateReference
  | VehicleFinancingRateReference
  | ConsortiumAdminFeeReference;
