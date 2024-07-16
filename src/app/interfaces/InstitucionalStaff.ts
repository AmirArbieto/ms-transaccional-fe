export interface Ubigeo {
  id: string;
  department?: string;
  province?: string;
  district?: string;
}

export interface InstitucionalStaff {
  id_institucional_staff?: string;
  father_lastname: string;
  mother_lastname: string;
  name: string;
  document_type: string;
  document_number: string;
  sex: string;
  country: string;
  ubigeo: Ubigeo;
  email: string;
  phone: string;
  civil_status: string;
  instruction_grade: string;
  disability_type: string;
  disability: string;
  work_condition: string;
  occupation: string;
  native_language: string;
  state: string;
  address: string;
}
