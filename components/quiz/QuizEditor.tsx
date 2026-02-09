import React, { useState } from 'react';
import { Quiz } from '../types';

interface QuizEditorProps {
  quiz: Quiz;
  onSave: (updatedQuiz: Quiz) => void;
  onCancel: () => void;
}

export const QuizEditor: React.FC<QuizEditorProps> = ({ quiz, onSave, onCancel }) => {
  const [editedQuiz, setEditedQuiz] = useState<Quiz>(JSON.parse(JSON.stringify(quiz)));

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedQuiz({ ...editedQuiz, title: e.target.value });
  };

  const handleQuestionChange = (qIndex: number, field: string, value: any) => {
    const updatedQuestions = [...editedQuiz.questions];
    updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], [field]: value };
    setEditedQuiz({ ...editedQuiz, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updatedQuestions = [...editedQuiz.questions];
    const updatedOptions = [...updatedQuestions[qIndex].options];
    updatedOptions[oIndex] = value;
    updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], options: updatedOptions };
    setEditedQuiz({ ...editedQuiz, questions: updatedQuestions });
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white rounded-lg shadow-lg border border-gray-200 p-8">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Edit Quiz</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 font-medium text-sm">Cancel</button>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-2">Quiz Title</label>
        <input
          type="text"
          value={editedQuiz.title}
          onChange={handleTitleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          placeholder="Enter quiz title"
        />
      </div>

      <div className="space-y-8">
        {editedQuiz.questions.map((q, qIdx) => (
          <div key={qIdx} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="mb-4">
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Question {qIdx + 1}</label>
               <input
                type="text"
                value={q.questionText}
                onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                placeholder="Enter question text"
               />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-500 uppercase">Answers (Select the radio button for the correct answer)</label>
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`correct-answer-${qIdx}`}
                    checked={q.correctAnswerIndex === oIdx}
                    onChange={() => handleQuestionChange(qIdx, 'correctAnswerIndex', oIdx)}
                    className="text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                    className={`flex-grow px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white ${q.correctAnswerIndex === oIdx ? 'border-primary ring-1 ring-primary' : 'border-gray-300'}`}
                    placeholder={`Option ${oIdx + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end gap-4 pt-4 border-t border-gray-100">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-full font-bold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(editedQuiz)}
          className="px-6 py-2 bg-primary hover:bg-primary-hover rounded-full font-bold text-white shadow-md transition-transform transform active:scale-95"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
