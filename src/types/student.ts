
export type Subject = {
  name: string;
  nameAr?: string;
  coefficient: number;
  average: number;
  examScore: number;
  homeworkScore?: number;
};

export type StudentInfo = {
  id: string;
  name: string;
  arabicName?: string;
  className: string;
  registrationNumber: number;
  rimNumber: string;
  schoolYear: string;
  semester: string;
  subjects: Subject[];
  overallAverage: number;
  mention: string;
};
