import { Person } from "./person";

export interface MiTrabajadorPersonalizado {
  id: number;
  person_id: Person;
  document_type: string;
  number_document: string;
  charges: string;
  states: string;
  // Add other properties as needed
}