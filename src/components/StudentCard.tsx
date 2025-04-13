
import React, { useState } from 'react';
import { StudentInfo, Subject } from '@/types/student';
import { Avatar, AvatarFallback } from "./ui/avatar";
import { User } from "lucide-react";

interface EditableFieldProps {
  value: string | number;
  onSave: (value: string | number) => void;
  isNumeric?: boolean;
  className?: string;
  hideIcons?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  value, 
  onSave, 
  isNumeric = false, 
  className = "",
  hideIcons = false
}) => {
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
    </div>
  ) : (
    <div 
      className={`editable flex items-center justify-center ${className}`} 
      onClick={() => setIsEditing(true)}
    >
      <span>{value}</span>
      {!hideIcons && <span className="opacity-50 ml-1 edit-icons">✎</span>}
    </div>
  );
};

interface StudentCardProps {
  student: StudentInfo;
  onUpdate: (updatedStudent: StudentInfo) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onUpdate }) => {
  const updateStudentInfo = (field: string, value: string | number) => {
    const updatedStudent = { ...student, [field]: value };
    onUpdate(updatedStudent);
  };

  const updateSubject = (index: number, field: string, value: string | number) => {
    const updatedSubjects = [...student.subjects];
    updatedSubjects[index] = { 
      ...updatedSubjects[index], 
      [field]: field === 'coefficient' || field === 'average' || field === 'examScore' || field === 'homeworkScore' ? Number(value) : value 
    };
    
    // Recalculate overall average and totals
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
  };

  // Calculate the total for each subject
  const calculateTotal = (subject: Subject): number => {
    return subject.coefficient * subject.average;
  };

  return (
    <div className="student-card">
      {/* School Header with Logo */}
      <div className="school-header bg-[url('/lovable-uploads/62fd8c8f-d756-4aa8-ba0f-1ae3096b0f79.png')]"></div>
      
      {/* Student Information */}
      <div className="student-info">
        <div className="student-info-grid">
          <div className="student-photo">
            <Avatar className="w-full h-full bg-gray-300">
              <AvatarFallback className="text-gray-400 w-full h-full flex items-center justify-center">
                <User size={80} />
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex flex-col w-full justify-between space-y-2">
            <div className="student-info-row">
              <div className="student-info-label-left">Nom:</div>
              <div className="student-info-value">
                <EditableField 
                  value={student.name} 
                  onSave={(value) => updateStudentInfo('name', value)} 
                  hideIcons={true}
                />
              </div>
              <div className="student-info-label-right">:الإسم</div>
            </div>
            
            <div className="student-info-row">
              <div className="student-info-label-left">Classe:</div>
              <div className="student-info-value">
                <EditableField 
                  value={student.className} 
                  onSave={(value) => updateStudentInfo('className', value)} 
                  hideIcons={true}
                />
              </div>
              <div className="student-info-label-right">:القسم</div>
            </div>
            
            <div className="student-info-row">
              <div className="student-info-label-left">Matricule</div>
              <div className="student-info-value">
                <EditableField 
                  value={student.registrationNumber} 
                  onSave={(value) => updateStudentInfo('registrationNumber', value)} 
                  isNumeric
                  hideIcons={true}
                />
              </div>
              <div className="student-info-label-right">:رقم التسجيل</div>
            </div>
            
            <div className="student-info-row">
              <div className="student-info-label-left">RIM:</div>
              <div className="student-info-value">
                <EditableField 
                  value={student.rimNumber} 
                  onSave={(value) => updateStudentInfo('rimNumber', value)} 
                  hideIcons={true}
                />
              </div>
              <div className="student-info-label-right">:الرقم التربوي</div>
            </div>
            
            <div className="student-info-row">
              <div className="student-info-label-left">Annee Scolaire:</div>
              <div className="student-info-value">
                <EditableField 
                  value={student.schoolYear} 
                  onSave={(value) => updateStudentInfo('schoolYear', value)} 
                  hideIcons={true}
                />
              </div>
              <div className="student-info-label-right">:السنة الدراسية</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="semester-title">
        <EditableField 
          value={student.semester} 
          onSave={(value) => updateStudentInfo('semester', value)} 
          hideIcons={true}
        />
      </div>
      
      <div className="grade-report-title">
        كشف الدرجات
      </div>
      
      <div className="px-4">
        <table className="student-table">
          <thead>
            <tr>
              <th>
                المادة<br/>Matiere
              </th>
              <th>
                نتائج الاختبارات<br/>Note Devoir
              </th>
              <th>
                نتائج الامتحان<br/>Note Compo
              </th>
              <th>
                المعدل<br/>Moyenne
              </th>
              <th>
                المعامل<br/>Coef
              </th>
              <th>
                المجموع<br/>Total
              </th>
            </tr>
          </thead>
          <tbody>
            {student.subjects.map((subject, index) => (
              <tr key={index}>
                <td className="text-right">
                  <EditableField 
                    value={subject.nameAr} 
                    onSave={(value) => updateSubject(index, 'nameAr', value)} 
                    hideIcons={true}
                  />
                </td>
                <td>
                  {subject.homeworkScore !== undefined ? (
                    <EditableField 
                      value={subject.homeworkScore} 
                      onSave={(value) => updateSubject(index, 'homeworkScore', value)} 
                      isNumeric
                      hideIcons={true}
                    />
                  ) : "-"}
                </td>
                <td>
                  <EditableField 
                    value={subject.examScore} 
                    onSave={(value) => updateSubject(index, 'examScore', value)} 
                    isNumeric
                    hideIcons={true}
                  />
                </td>
                <td>
                  <EditableField 
                    value={subject.average} 
                    onSave={(value) => updateSubject(index, 'average', value)} 
                    isNumeric
                    hideIcons={true}
                  />
                </td>
                <td>
                  <EditableField 
                    value={subject.coefficient} 
                    onSave={(value) => updateSubject(index, 'coefficient', value)} 
                    isNumeric
                    hideIcons={true}
                  />
                </td>
                <td>{calculateTotal(subject).toFixed(subject.average % 1 === 0 ? 0 : 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="footer-section">
        <div className="footer-row">
          <div className="footer-label-left">Moyenne generale</div>
          <div className="footer-value">
            <EditableField 
              value={student.overallAverage} 
              onSave={(value) => updateStudentInfo('overallAverage', value)} 
              isNumeric
              hideIcons={true}
            />
          </div>
          <div className="footer-label-right">المعدل العام</div>
        </div>
        
        <div className="footer-row">
          <div className="footer-label-left">Mention</div>
          <div className="footer-value">
            <EditableField 
              value={student.mention} 
              onSave={(value) => updateStudentInfo('mention', value)} 
              hideIcons={true}
            />
          </div>
          <div className="footer-label-right">التقدير</div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
