
import React, { useState } from 'react';
import { StudentInfo, Subject } from '@/types/student';
import { Edit2, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface EditableFieldProps {
  value: string | number;
  onSave: (value: string | number) => void;
  isNumeric?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({ value, onSave, isNumeric = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    setIsEditing(false);
    onSave(currentValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <div className="flex items-center">
      <input
        type={isNumeric ? "number" : "text"}
        className="border border-gray-300 p-1 w-full text-center"
        value={currentValue}
        onChange={(e) => setCurrentValue(isNumeric ? Number(e.target.value) : e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        step={isNumeric ? "0.5" : undefined}
      />
      <button onClick={handleSave} className="ml-1 text-green-600">
        <Check size={16} />
      </button>
    </div>
  ) : (
    <div 
      className="editable flex items-center justify-center gap-1" 
      onClick={() => setIsEditing(true)}
    >
      <span>{value}</span>
      <Edit2 size={14} className="opacity-50" />
    </div>
  );
};

interface StudentCardProps {
  student: StudentInfo;
  onUpdate: (updatedStudent: StudentInfo) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onUpdate }) => {
  const { toast } = useToast();

  const updateStudentInfo = (field: string, value: string | number) => {
    const updatedStudent = { ...student, [field]: value };
    onUpdate(updatedStudent);
    toast({
      title: "تم التحديث",
      description: `تم تحديث ${field} بنجاح`,
    });
  };

  const updateSubject = (index: number, field: string, value: string | number) => {
    const updatedSubjects = [...student.subjects];
    updatedSubjects[index] = { 
      ...updatedSubjects[index], 
      [field]: field === 'coefficient' || field === 'average' || field === 'examScore' || field === 'homeworkScore' ? Number(value) : value 
    };
    
    // Recalculate overall average
    const totalPoints = updatedSubjects.reduce((sum, subject) => 
      sum + (subject.average * subject.coefficient), 0);
    const totalCoefficients = updatedSubjects.reduce((sum, subject) => 
      sum + subject.coefficient, 0);
    
    const newAverage = totalPoints / totalCoefficients;
    
    const updatedStudent = { 
      ...student, 
      subjects: updatedSubjects,
      overallAverage: Math.round(newAverage * 10) / 10
    };
    
    onUpdate(updatedStudent);
    
    toast({
      title: "تم التحديث",
      description: "تم تحديث المادة بنجاح",
    });
  };

  // Calculate the total for each subject
  const calculateTotal = (subject: Subject): number => {
    return subject.coefficient * subject.average;
  };

  return (
    <div className="student-card">
      {/* School Header with Logo */}
      <div className="school-header bg-[url('/lovable-uploads/d0be4ee0-e70c-4843-ae37-d25ec02a7023.png')]"></div>
      
      {/* Student Information */}
      <div className="student-info">
        <div className="grid grid-cols-4 gap-2">
          <div className="flex items-center justify-center">
            <div className="student-photo">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          
          <div className="col-span-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-left font-normal">
                <div className="mb-2">Nom:</div>
                <div className="mb-2">Classe:</div>
                <div className="mb-2">Matricule:</div>
                <div className="mb-2">RIM:</div>
                <div className="mb-2">Annee Scolaire:</div>
              </div>
              
              <div className="col-span-1">
                <div className="mb-2 font-bold text-center">
                  <EditableField 
                    value={student.name} 
                    onSave={(value) => updateStudentInfo('name', value)} 
                  />
                </div>
                <div className="mb-2 font-bold text-center">
                  <EditableField 
                    value={student.className} 
                    onSave={(value) => updateStudentInfo('className', value)} 
                  />
                </div>
                <div className="mb-2 font-bold text-center">
                  <EditableField 
                    value={student.registrationNumber} 
                    onSave={(value) => updateStudentInfo('registrationNumber', value)} 
                    isNumeric
                  />
                </div>
                <div className="mb-2 font-bold text-center">
                  <EditableField 
                    value={student.rimNumber} 
                    onSave={(value) => updateStudentInfo('rimNumber', value)} 
                  />
                </div>
                <div className="mb-2 font-bold text-center">
                  <EditableField 
                    value={student.schoolYear} 
                    onSave={(value) => updateStudentInfo('schoolYear', value)} 
                  />
                </div>
              </div>
              
              <div className="text-right font-normal">
                <div className="mb-2">:الإسم</div>
                <div className="mb-2">:القسم</div>
                <div className="mb-2">:رقم التسجيل</div>
                <div className="mb-2">:الرقم التربوي</div>
                <div className="mb-2">:السنة الدراسية</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="semester-title">
        {student.semester} - {student.semester === 'Premier Trimestre' ? 'الفصل الأول' : 'الفصل الثاني'}
      </div>
      
      <div className="grade-report-title">
        كشف الدرجات
      </div>
      
      <div className="px-8">
        <table className="student-table">
          <thead>
            <tr>
              <th className="min-w-20">
                المجموع<br/>Totale
              </th>
              <th className="w-24">
                الضارب<br/>Coieficien
              </th>
              <th className="w-24">
                المعدل<br/>Moyenne
              </th>
              <th className="w-36">
                نتائج الامتحان<br/>Note de Compo
              </th>
              <th className="w-36">
                نتائج الاختبارات<br/>Note de Devoire
              </th>
              <th className="w-44">
                المادة<br/>Matiere
              </th>
            </tr>
          </thead>
          <tbody>
            {student.subjects.map((subject, index) => (
              <tr key={index}>
                <td>{calculateTotal(subject).toFixed(1)}</td>
                <td>
                  <EditableField 
                    value={subject.coefficient} 
                    onSave={(value) => updateSubject(index, 'coefficient', value)} 
                    isNumeric
                  />
                </td>
                <td>
                  <EditableField 
                    value={subject.average} 
                    onSave={(value) => updateSubject(index, 'average', value)} 
                    isNumeric
                  />
                </td>
                <td>
                  <EditableField 
                    value={subject.examScore} 
                    onSave={(value) => updateSubject(index, 'examScore', value)} 
                    isNumeric
                  />
                </td>
                <td>
                  {subject.homeworkScore !== undefined ? (
                    <EditableField 
                      value={subject.homeworkScore} 
                      onSave={(value) => updateSubject(index, 'homeworkScore', value)} 
                      isNumeric
                    />
                  ) : "-"}
                </td>
                <td className="text-right">
                  <div className="flex justify-between px-2">
                    <span>{subject.nameAr}</span>
                    <span>{subject.name}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="average-section">
        <div className="text-left font-bold">
          <div className="mb-2">المعدل العام:</div>
          <div>التقدير:</div>
        </div>

        <div className="text-center font-bold">
          <div className="mb-2">
            <EditableField 
              value={student.overallAverage} 
              onSave={(value) => updateStudentInfo('overallAverage', value)} 
              isNumeric
            />
          </div>
          <div>
            <EditableField 
              value={student.mention} 
              onSave={(value) => updateStudentInfo('mention', value)} 
            />
          </div>
        </div>
        
        <div className="text-right font-bold">
          <div className="mb-2">Moyenne generale:</div>
          <div>Mention:</div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
