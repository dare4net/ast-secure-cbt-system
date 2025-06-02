"use client"
import type { Question } from "@/types/cbt"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface QuestionRendererProps {
  question: Question
  answer: string | string[]
  onAnswerChange: (answer: string | string[]) => void
  questionNumber: number
  totalQuestions: number
}

export function QuestionRenderer({
  question,
  answer,
  onAnswerChange,
  questionNumber,
  totalQuestions,
}: QuestionRendererProps) {
  const renderQuestionContent = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <RadioGroup value={answer as string} onValueChange={onAnswerChange} className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "true-false":
        return (
          <RadioGroup value={answer as string} onValueChange={onAnswerChange} className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="cursor-pointer">
                True
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="cursor-pointer">
                False
              </Label>
            </div>
          </RadioGroup>
        )

      case "fill-blank":
        return (
          <Input
            value={answer as string}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Enter your answer..."
            className="w-full"
          />
        )

      case "essay":
        return (
          <Textarea
            value={answer as string}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Write your essay here..."
            className="w-full min-h-32"
          />
        )

      case "matching":
        const currentAnswers = Array.isArray(answer) ? answer : []
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  checked={currentAnswers.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onAnswerChange([...currentAnswers, option])
                    } else {
                      onAnswerChange(currentAnswers.filter((a) => a !== option))
                    }
                  }}
                  id={`match-${index}`}
                />
                <Label htmlFor={`match-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      default:
        return <div>Unsupported question type</div>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span className="text-lg">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm text-muted-foreground">
            {question.points} point{question.points !== 1 ? "s" : ""}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {question.image && (
          <img
            src={question.image || "/placeholder.svg"}
            alt="Question image"
            className="max-w-full h-auto rounded-lg"
          />
        )}

        <div className="text-base leading-relaxed">{question.question}</div>

        <div className="space-y-4">{renderQuestionContent()}</div>

        {question.category && <div className="text-sm text-muted-foreground">Category: {question.category}</div>}
      </CardContent>
    </Card>
  )
}
