export interface User {
  id: number;
  navn: string | null;
  email: string;
  passord_hash: string;
  salt: string;
  addresse: string | null;
  kommune_nummer: number | null;
  gårds_nummer: number | null;
  bruks_nummer: number | null;
  leverandør_nummer: number | null;
}