export interface User {
  id: number;
  navn: string | null;
  bruker_navn: string;
  passord_hash: string;
  salt: string;
  kommune_nummer: number | null;
  gårds_nummer: number | null;
  bruks_nummer: number | null;
  leverandør_nummer: number | null;
}