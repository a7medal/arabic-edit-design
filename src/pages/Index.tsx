
import React, { useState } from 'react';
import { StudentInfo } from '@/types/student';
import StudentCard from '@/components/StudentCard';
import { toast } from '@/hooks/use-toast';
import { Printer, RefreshCw } from 'lucide-react';

// بيانات طالب عينة تطابق الصورة المرفقة
const initialStudentData: StudentInfo = {
  id: "1",
  name: "Elhaj Ebou Imaaly Ammy - الحاج أبو المعالي عمي",
  arabicName: "الحاج أبو المعالي عمي",
  className: "6MA",
  registrationNumber: 4,
  rimNumber: "RIM25454658",
  schoolYear: "2025 - 2024",
  semester: "Premier Trimestre",
  subjects: [
    {
      name: "Francais",
      nameAr: "اللغة العربية",
      coefficient: 2,
      average: 15,
      examScore: 15,
      homeworkScore: 14
    },
    {
      name: "Arabe",
      nameAr: "Francais",
      coefficient: 2,
      average: 14,
      examScore: 14,
      homeworkScore: 14
    },
    {
      name: "Anglais",
      nameAr: "الإنجليزية",
      coefficient: 2,
      average: 15,
      examScore: 15,
      homeworkScore: 14
    },
    {
      name: "Science Naturelles",
      nameAr: "Science Naturelles",
      coefficient: 3,
      average: 10.5,
      examScore: 10.5
    },
    {
      name: "Education Islamique",
      nameAr: "التربية الإسلامية",
      coefficient: 2,
      average: 16,
      examScore: 16,
      homeworkScore: 15
    },
    {
      name: "Physique et Chimie",
      nameAr: "Physique et Chimie",
      coefficient: 6,
      average: 12,
      examScore: 12,
      homeworkScore: 8
    },
    {
      name: "Mathematique",
      nameAr: "Mathematique",
      coefficient: 7,
      average: 10.5,
      examScore: 10.5,
      homeworkScore: 10
    },
    {
      name: "Histoire et Geographie",
      nameAr: "التاريخ والجغرافيا",
      coefficient: 2,
      average: 15,
      examScore: 15,
      homeworkScore: 15
    },
    {
      name: "Philosophie",
      nameAr: "الفلسفة",
      coefficient: 2,
      average: 10,
      examScore: 10,
      homeworkScore: 10
    },
    {
      name: "Education Physique",
      nameAr: "التربية البدنية",
      coefficient: 2,
      average: 16,
      examScore: 16
    }
  ],
  overallAverage: 12.4,
  mention: "Plaque d'honneur - لوحة شرف"
};

const Index = () => {
  const [student, setStudent] = useState<StudentInfo>(initialStudentData);

  const handleUpdateStudent = (updatedStudent: StudentInfo) => {
    setStudent(updatedStudent);
    console.log('Updated student data:', updatedStudent);
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "تمت الطباعة",
      description: "تم إرسال المستند إلى الطابعة",
    });
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
              <Printer size={18} /> طباعة البطاقة
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
