
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

  // Calculate and update the total for each subject
  const calculateTotal = (subject: Subject): number => {
    return subject.coefficient * subject.average;
  };

  return (
    <div className="max-w-6xl mx-auto p-0">
      <div className="student-card bg-white">
        {/* School Header with Logo */}
        <div className="school-header bg-[url('/lovable-uploads/1624e385-2d3d-4b97-b84a-1ec333778562.png')]"></div>
        
        {/* Student Information Header */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <div className="text-right">
              <div className="mb-2">Nom:</div>
              <div className="mb-2">Classe:</div>
              <div className="mb-2">Matricule:</div>
              <div className="mb-2">RIM:</div>
              <div className="mb-2">Annee Scolaire:</div>
            </div>
            
            <div>
              <div className="mb-2 font-bold">
                <EditableField 
                  value={student.name} 
                  onSave={(value) => updateStudentInfo('name', value)} 
                />
              </div>
              <div className="mb-2 font-bold">
                <EditableField 
                  value={student.className} 
                  onSave={(value) => updateStudentInfo('className', value)} 
                />
              </div>
              <div className="mb-2 font-bold">
                <EditableField 
                  value={student.registrationNumber} 
                  onSave={(value) => updateStudentInfo('registrationNumber', value)} 
                  isNumeric
                />
              </div>
              <div className="mb-2 font-bold">
                <EditableField 
                  value={student.rimNumber} 
                  onSave={(value) => updateStudentInfo('rimNumber', value)} 
                />
              </div>
              <div className="mb-2 font-bold">
                <EditableField 
                  value={student.schoolYear} 
                  onSave={(value) => updateStudentInfo('schoolYear', value)} 
                />
              </div>
            </div>
            
            <div className="text-left">
              <div className="mb-2">:الإسم</div>
              <div className="mb-2">:القسم</div>
              <div className="mb-2">:رقم التسجيل</div>
              <div className="mb-2">:الرقم التربوي</div>
              <div className="mb-2">:السنة الدراسية</div>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-4 text-xl font-bold">
          {student.semester} - {student.semester === 'Premier Trimestre' ? 'الفصل الأول' : 'الفصل الثاني'}
        </div>
        
        <div className="text-center mb-6 text-2xl font-bold header-title">
          كشف الدرجات
        </div>
        
        <div className="overflow-x-auto">
          <table className="student-table text-sm">
            <thead>
              <tr>
                <th className="w-1/6">المجموع<br/>Totale</th>
                <th className="w-1/12">الضارب<br/>Coieficien</th>
                <th className="w-1/12">المعدل<br/>Moyenne</th>
                <th className="w-1/6">نتائج الامتحان<br/>Note de Compo</th>
                <th className="w-1/6">نتائج الاختبارات<br/>Note de Devoire</th>
                <th className="w-1/4">المادة<br/>Matiere</th>
              </tr>
            </thead>
            <tbody>
              {student.subjects.map((subject, index) => (
                <tr key={index}>
                  <td>{calculateTotal(subject)}</td>
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
                    ) : ""}
                  </td>
                  <td className="text-right">
                    <div className="flex justify-between">
                      <span>{subject.name}</span>
                      <span>{subject.nameAr}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 grid grid-cols-3 text-sm">
          <div className="text-left">
            <div className="font-bold mb-2">المعدل العام</div>
            <div className="font-bold">التقدير</div>
          </div>

          <div className="text-center">
            <div className="font-bold mb-2">
              <EditableField 
                value={student.overallAverage} 
                onSave={(value) => updateStudentInfo('overallAverage', value)} 
                isNumeric
              />
            </div>
            <div className="font-bold">
              <EditableField 
                value={student.mention} 
                onSave={(value) => updateStudentInfo('mention', value)} 
              />
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-bold mb-2">Moyenne generale</div>
            <div className="font-bold">Mention</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
