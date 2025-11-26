"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { Question, ExamConfig, ExamData } from "@/types/cbt"
import { loadAvailableExams } from "@/lib/exam-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Download, ArrowLeft, Save, Eye, Edit, Copy } from "lucide-react"
import { ExamScheduler } from "@/components/exam-scheduler"

export default function ExamEditorPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.id as string

  const [examConfig, setExamConfig] = useState<ExamConfig>({
    title: "",
    description: "",
    timeLimit: 60,
    totalQuestions: 10,
    passingScore: 70,
    allowCalculator: false,
    allowBackNavigation: true,
    randomizeQuestions: false,
    randomizeOptions: false,
    showResultsImmediately: true,
    maxAttempts: 1,
    enableTabSwitchDetection: true,
    enableFullScreenMode: false,
    enableCopyPasteProtection: true,
    enableRightClickProtection: true,
    autoSubmitOnTimeExpiry: true,
    showTimeWarnings: true,
    timeWarningIntervals: [30, 10, 5],
    enableAutoSave: true,
    autoSaveInterval: 30,
  })

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
    difficulty: "medium",
    category: "",
    allowCalculator: false,
  })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load exam if editing existing one
  useEffect(() => {
    if (examId !== "new") {
      const savedExams = loadAvailableExams()
      const exam = savedExams.find((e) => 
        e.config.title.toLowerCase().replace(/\s+/g, "-") === examId
      )
      
      if (exam) {
        setExamConfig(exam.config)
        setQuestions(exam.questions)
      }
    }
    setIsLoading(false)
  }, [examId])

  const addQuestion = () => {
    if (!currentQuestion.question) return

    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type: currentQuestion.type as Question["type"],
      question: currentQuestion.question,
      options: currentQuestion.options?.filter((opt) => opt.trim() !== ""),
      correctAnswer: currentQuestion.correctAnswer,
      points: currentQuestion.points || 1,
      difficulty: currentQuestion.difficulty,
      category: currentQuestion.category,
      allowCalculator: currentQuestion.allowCalculator,
    }

    if (editingIndex !== null) {
      const updatedQuestions = [...questions]
      updatedQuestions[editingIndex] = newQuestion
      setQuestions(updatedQuestions)
      setEditingIndex(null)
    } else {
      setQuestions([...questions, newQuestion])
    }

    resetCurrentQuestion()
  }

  const resetCurrentQuestion = () => {
    setCurrentQuestion({
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
      difficulty: "medium",
      category: "",
      allowCalculator: false,
    })
  }

  const editQuestion = (index: number) => {
    const question = questions[index]
    setCurrentQuestion({
      ...question,
      options: question.options || ["", "", "", ""],
    })
    setEditingIndex(index)
  }

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const duplicateQuestion = (index: number) => {
    const question = { ...questions[index], id: `q-${Date.now()}` }
    setQuestions([...questions, question])
  }

  const saveExam = () => {
    const examData: ExamData = {
      config: examConfig,
      questions: questions,
    }

    const blob = new Blob([JSON.stringify(examData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${examConfig.title || "exam"}.json`
    a.click()
    URL.revokeObjectURL(url)

    alert("Exam saved! Download the file and place it in the lib folder.")
  }

  const updateQuestionOption = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])]
    newOptions[index] = value
    setCurrentQuestion({ ...currentQuestion, options: newOptions })
  }

  const addOption = () => {
    const newOptions = [...(currentQuestion.options || []), ""]
    setCurrentQuestion({ ...currentQuestion, options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = (currentQuestion.options || []).filter((_, i) => i !== index)
    setCurrentQuestion({ ...currentQuestion, options: newOptions })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading exam...</p>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <h1 className="text-3xl font-bold">
              {examId === "new" ? "Create New Exam" : "Edit Exam"}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={saveExam} disabled={questions.length === 0 || !examConfig.title}>
              <Save className="h-4 w-4 mr-2" />
              Save Exam
            </Button>
            <Button onClick={saveExam} disabled={questions.length === 0} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="config" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">Exam Configuration</TabsTrigger>
            <TabsTrigger value="questions">Questions ({questions.length})</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>Exam Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Exam Title</Label>
                      <Input
                        id="title"
                        value={examConfig.title}
                        onChange={(e) => setExamConfig({ ...examConfig, title: e.target.value })}
                        placeholder="Enter exam title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={examConfig.description}
                        onChange={(e) => setExamConfig({ ...examConfig, description: e.target.value })}
                        placeholder="Enter exam description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                        <Input
                          id="timeLimit"
                          type="number"
                          value={examConfig.timeLimit}
                          onChange={(e) => setExamConfig({ ...examConfig, timeLimit: Number.parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="totalQuestions">Total Questions</Label>
                        <Input
                          id="totalQuestions"
                          type="number"
                          value={examConfig.totalQuestions}
                          onChange={(e) =>
                            setExamConfig({ ...examConfig, totalQuestions: Number.parseInt(e.target.value) })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="passingScore">Passing Score (%)</Label>
                        <Input
                          id="passingScore"
                          type="number"
                          value={examConfig.passingScore}
                          onChange={(e) =>
                            setExamConfig({ ...examConfig, passingScore: Number.parseInt(e.target.value) })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxAttempts">Max Attempts</Label>
                        <Input
                          id="maxAttempts"
                          type="number"
                          value={examConfig.maxAttempts}
                          onChange={(e) =>
                            setExamConfig({ ...examConfig, maxAttempts: Number.parseInt(e.target.value) })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Security & Features</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="allowCalculator">Allow Calculator</Label>
                        <Switch
                          id="allowCalculator"
                          checked={examConfig.allowCalculator}
                          onCheckedChange={(checked) => setExamConfig({ ...examConfig, allowCalculator: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="allowBackNavigation">Allow Back Navigation</Label>
                        <Switch
                          id="allowBackNavigation"
                          checked={examConfig.allowBackNavigation}
                          onCheckedChange={(checked) => setExamConfig({ ...examConfig, allowBackNavigation: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="randomizeQuestions">Randomize Questions</Label>
                        <Switch
                          id="randomizeQuestions"
                          checked={examConfig.randomizeQuestions}
                          onCheckedChange={(checked) => setExamConfig({ ...examConfig, randomizeQuestions: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="randomizeOptions">Randomize Options</Label>
                        <Switch
                          id="randomizeOptions"
                          checked={examConfig.randomizeOptions}
                          onCheckedChange={(checked) => setExamConfig({ ...examConfig, randomizeOptions: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="enableTabSwitchDetection">Tab Switch Detection</Label>
                        <Switch
                          id="enableTabSwitchDetection"
                          checked={examConfig.enableTabSwitchDetection}
                          onCheckedChange={(checked) =>
                            setExamConfig({ ...examConfig, enableTabSwitchDetection: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="enableFullScreenMode">Full Screen Mode</Label>
                        <Switch
                          id="enableFullScreenMode"
                          checked={examConfig.enableFullScreenMode}
                          onCheckedChange={(checked) => setExamConfig({ ...examConfig, enableFullScreenMode: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="enableCopyPasteProtection">Copy/Paste Protection</Label>
                        <Switch
                          id="enableCopyPasteProtection"
                          checked={examConfig.enableCopyPasteProtection}
                          onCheckedChange={(checked) =>
                            setExamConfig({ ...examConfig, enableCopyPasteProtection: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="autoSubmitOnTimeExpiry">Auto Submit on Time Expiry</Label>
                        <Switch
                          id="autoSubmitOnTimeExpiry"
                          checked={examConfig.autoSubmitOnTimeExpiry}
                          onCheckedChange={(checked) =>
                            setExamConfig({ ...examConfig, autoSubmitOnTimeExpiry: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="enableAutoSave">Enable Auto Save</Label>
                        <Switch
                          id="enableAutoSave"
                          checked={examConfig.enableAutoSave}
                          onCheckedChange={(checked) => setExamConfig({ ...examConfig, enableAutoSave: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <ExamScheduler
                  schedule={examConfig.schedule}
                  onScheduleChange={(schedule) => setExamConfig({ ...examConfig, schedule })}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Question Creator */}
              <Card>
                <CardHeader>
                  <CardTitle>{editingIndex !== null ? "Edit Question" : "Create Question"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                  <div>
                    <Label htmlFor="questionType">Question Type</Label>
                    <Select
                      value={currentQuestion.type}
                      onValueChange={(value) =>
                        setCurrentQuestion({ ...currentQuestion, type: value as Question["type"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                        <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                        <SelectItem value="essay">Essay</SelectItem>
                        <SelectItem value="matching">Matching</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="questionText">Question</Label>
                    <Textarea
                      id="questionText"
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                      placeholder="Enter your question here..."
                    />
                  </div>

                  {(currentQuestion.type === "multiple-choice" || currentQuestion.type === "matching") && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Options</Label>
                        <Button variant="outline" size="sm" onClick={addOption}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {currentQuestion.options?.map((option, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={option}
                              onChange={(e) => updateQuestionOption(index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                            />
                            {(currentQuestion.options?.length || 0) > 2 && (
                              <Button variant="outline" size="sm" onClick={() => removeOption(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="correctAnswer">Correct Answer</Label>
                    {currentQuestion.type === "multiple-choice" ? (
                      <Select
                        value={currentQuestion.correctAnswer as string}
                        onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentQuestion.options
                            ?.filter((opt) => opt.trim() !== "")
                            .map((option, index) => (
                              <SelectItem key={index} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    ) : currentQuestion.type === "true-false" ? (
                      <Select
                        value={currentQuestion.correctAnswer as string}
                        onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">True</SelectItem>
                          <SelectItem value="false">False</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={currentQuestion.correctAnswer as string}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                        placeholder="Enter correct answer"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="points">Points</Label>
                      <Input
                        id="points"
                        type="number"
                        value={currentQuestion.points}
                        onChange={(e) =>
                          setCurrentQuestion({ ...currentQuestion, points: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select
                        value={currentQuestion.difficulty}
                        onValueChange={(value) =>
                          setCurrentQuestion({ ...currentQuestion, difficulty: value as Question["difficulty"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={currentQuestion.category}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, category: e.target.value })}
                      placeholder="Enter category (optional)"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowCalculatorQuestion">Allow Calculator for this question</Label>
                    <Switch
                      id="allowCalculatorQuestion"
                      checked={currentQuestion.allowCalculator}
                      onCheckedChange={(checked) =>
                        setCurrentQuestion({ ...currentQuestion, allowCalculator: checked })
                      }
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={addQuestion} className="flex-1">
                      {editingIndex !== null ? "Update Question" : "Add Question"}
                    </Button>
                    {editingIndex !== null && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingIndex(null)
                          resetCurrentQuestion()
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Questions List */}
              <Card>
                <CardHeader>
                  <CardTitle>Questions List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
                    {questions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">{question.type}</Badge>
                              <Badge variant="secondary">{question.points} pts</Badge>
                              {question.difficulty && (
                                <Badge
                                  variant={
                                    question.difficulty === "easy"
                                      ? "default"
                                      : question.difficulty === "medium"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                >
                                  {question.difficulty}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{question.question}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => editQuestion(index)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => duplicateQuestion(index)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteQuestion(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {questions.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        No questions created yet. Add your first question!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Exam Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[calc(100vh-250px)] overflow-y-auto">
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h2 className="text-xl font-semibold mb-2">{examConfig.title || "Untitled Exam"}</h2>
                    <p className="text-muted-foreground mb-4">{examConfig.description || "No description provided"}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Duration:</span> {examConfig.timeLimit} min
                      </div>
                      <div>
                        <span className="font-medium">Questions:</span> {examConfig.totalQuestions}
                      </div>
                      <div>
                        <span className="font-medium">Passing:</span> {examConfig.passingScore}%
                      </div>
                      <div>
                        <span className="font-medium">Attempts:</span> {examConfig.maxAttempts}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Security Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {examConfig.enableTabSwitchDetection && <Badge>Tab Switch Detection</Badge>}
                      {examConfig.enableFullScreenMode && <Badge>Full Screen Mode</Badge>}
                      {examConfig.enableCopyPasteProtection && <Badge>Copy/Paste Protection</Badge>}
                      {examConfig.enableRightClickProtection && <Badge>Right Click Protection</Badge>}
                      {examConfig.allowCalculator && <Badge variant="secondary">Calculator Allowed</Badge>}
                      {examConfig.enableAutoSave && <Badge variant="secondary">Auto Save</Badge>}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Questions Summary</h3>
                    <div className="space-y-2">
                      {questions.map((question, index) => (
                        <div key={question.id} className="flex justify-between items-center p-2 border rounded">
                          <span className="text-sm">
                            {index + 1}. {question.question.substring(0, 50)}...
                          </span>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              {question.type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {question.points}pts
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
