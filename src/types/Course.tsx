export interface Course {
  "adSoyad": string;
  "akademikDonemKodu": string;
  "baslangicSaati": string;
  "binaKodu": string;
  "bitisSaati": string;
  "crn": string;
  "dersAdi": string;
  "ogretimUyesi"?: string;
  "saatAraligi"?: string;
  "dersBransKoduId": string;
  "dersKodu": string;
  "dersTanimiId": string;
  "dilKodu": string;
  "gunAdiEN": string;
  "gunAdiTR": string;
  "kontenjan": string;
  "mekanAdi": string;
  "ogrenciSayisi": string;
  "ogretimYontemi": string;
  "onSart": string;
  "programSeviyeTipi": string;
  "programSeviyeTipiId": string;
  "rezervasyon": string;
  "sinifOnsart": string;
  "sinifProgram": string;
  "webdeGoster": string;
  "parentCRN": string;
}

export interface SelectedCourse {
  course: Course;
  reserveCourse?: SelectedCourse;
  groupId: number;
}

export interface CourseRequest {
  crn: string;
  reserves?: CourseRequest[];
}
