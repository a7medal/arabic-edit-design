
import React, { useState } from 'react';
import { StudentInfo } from '@/types/student';
import StudentCard from '@/components/StudentCard';
import { toast } from '@/hooks/use-toast';
import { Printer, RefreshCw } from 'lucide-react';

// بيانات طالب عينة تطابق الصورة المرفقة
const initialStudentData: StudentInfo = {
  id: "1",
  name: "nom - الإسم",
  arabicName: "الإسم",
  className: "6MA",
  registrationNumber: رقمك,
  rimNumber: "رقم RIM",
  schoolYear: "2025 - 2024",
  semester: "Deuxième Trimestre",
  subjects: [
    {
      name: "اللغة العربية",
      nameAr: "اللغة العربية",
      coefficient: 2,
      average: 0,
      examScore: 0,
      homeworkScore: 0
    },
    {
      name: "Francais",
      nameAr: "Francais",
      coefficient: 0,
      average: 0,
      examScore: 0,
      homeworkScore: 0
    },
    {
      name: "الإنجليزية",
      nameAr: "الإنجليزية",
      coefficient: 2,
      average: 0,
      examScore: 0,
      homeworkScore: 0
    },
    {
      name: "Science Naturelles",
      nameAr: "Science Naturelles",
      coefficient: 3,
      average: 0,
      examScore: 0
      homeworkScore: 0
    },
    {
      name: "التربية الإسلامية",
      nameAr: "التربية الإسلامية",
      coefficient: 2,
      average: 0,
      examScore: 0,
      homeworkScore: 0
    },
    {
      name: "Physique et Chimie",
      nameAr: "Physique et Chimie",
      coefficient: 6,
      average: 0,
      examScore: 0,
      homeworkScore: 0
    },
    {
      name: "Mathematique",
      nameAr: "Mathematique",
      coefficient: 7,
      average: 0,
      examScore: 0,
      homeworkScore: 0
    },
    {
      name: "التاريخ والجغرافيا",
      nameAr: "التاريخ والجغرافيا",
      coefficient: 2,
      average: 0,
      examScore: 0,
      homeworkScore: 0
    },
    {
      name: "الفلسفة",
      nameAr: "الفلسفة",
      coefficient: 2,
      average: 0,
      examScore: 0,
      homeworkScore: 0
    },
    {
      name: "التربية البدنية",
      nameAr: "التربية البدنية",
      coefficient: 2,
      average: 0,
      examScore: 0
      homeworkScore: 0
    }
  ],
  overallAverage: 0.0,
  mention: "اكتب هنا التقدير المناسب "
};

const Index = () => {
  const [student, setStudent] = useState<StudentInfo>(initialStudentData);

  const handleUpdateStudent = (updatedStudent: StudentInfo) => {
    setStudent(updatedStudent);
    console.log('Updated student data:', updatedStudent);
  };

  const handlePrint = () => {
    window.print();
    // Removed toast notification as per user request
  };

  const handleReset = () => {
    if (confirm('هل أنت متأكد من إعادة ضبط جميع البيانات؟')) {
      setStudent(initialStudentData);
      toast({
        title: "تمت إعادة الضبط",
        description: "تم استعادة البيانات الأصلية",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 font-cairo">
      <div className="container mx-auto p-0">
        <div className="mx-auto p-0" style={{ maxWidth: '21cm' }}>
          <div className="flex justify-between mb-4 print:hidden">
            <button
              onClick={handleReset}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <RefreshCw size={18} /> إعادة ضبط البيانات
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <Printer size={18} /> طباعة النتيجة
            </button>
          </div>
          
          <div className="p-0">
            <StudentCard student={student} onUpdate={handleUpdateStudent} />
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-600 print:hidden">
            <p>انقر على أي قيمة لتعديلها. سيتم تحديث المعدل العام تلقائيًا عند تغيير الدرجات.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
