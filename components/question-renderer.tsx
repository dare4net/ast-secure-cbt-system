"use client"
import type React from "react"
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
  const optionId = (suffix: string | number) => `${question.id}-opt-${suffix}`

  const renderQuestionContent = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div
            role="group"
            aria-label="Multiple choice options"
            tabIndex={0}
            onKeyDown={(e) => {
              const opts = question.options || []
              const current = (answer as string) || ""
              const idx = opts.findIndex((o) => o === current)
              if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                const next = opts[(idx + 1 + opts.length) % opts.length]
                if (next) onAnswerChange(next)
              }
              if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                const prev = opts[(idx - 1 + opts.length) % opts.length]
                if (prev) onAnswerChange(prev)
              }
              const n = Number(e.key)
              if (Number.isInteger(n) && n >= 1 && n <= opts.length) {
                onAnswerChange(opts[n - 1] as string)
              }
            }}
          >
            <RadioGroup value={answer as string} onValueChange={onAnswerChange} className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={optionId(index)} aria-checked={(answer as string) === option} />
                  <Label htmlFor={optionId(index)} className="flex-1 cursor-pointer">
                    {index + 1}. {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "true-false":
        return (
          <RadioGroup value={answer as string} onValueChange={onAnswerChange} className="space-y-3" aria-label="True or false">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={optionId("true")}
                aria-checked={(answer as string) === "true"} />
              <Label htmlFor={optionId("true")} className="cursor-pointer">
                True
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={optionId("false")} aria-checked={(answer as string) === "false"} />
              <Label htmlFor={optionId("false")} className="cursor-pointer">
                False
              </Label>
            </div>
          </RadioGroup>
        )

      case "fill-blank":
        return (
          <Input
            value={answer as string}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onAnswerChange(e.target.value)}
            placeholder="Enter your answer..."
            className="w-full"
            aria-label="Answer"
          />
        )

      case "essay":
        return (
          <Textarea
            value={answer as string}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onAnswerChange(e.target.value)}
            placeholder="Write your essay here..."
            className="w-full min-h-32"
            aria-label="Essay answer"
          />
        )

      case "matching":
        const currentAnswers = Array.isArray(answer) ? answer : []
        return (
          <div
            className="space-y-3"
            role="group"
            aria-label="Select all that apply"
            tabIndex={0}
            onKeyDown={(e) => {
              const opts = question.options || []
              const n = Number(e.key)
              if (Number.isInteger(n) && n >= 1 && n <= opts.length) {
                const opt = opts[n - 1] as string
                const isChecked = currentAnswers.includes(opt)
                if (isChecked) {
                  onAnswerChange(currentAnswers.filter((a) => a !== opt))
                } else {
                  onAnswerChange([...currentAnswers, opt])
                }
              }
            }}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  checked={currentAnswers.includes(option)}
                  onCheckedChange={(checked: boolean | "indeterminate") => {
                    const isChecked = checked === true
                    if (isChecked) {
                      onAnswerChange([...currentAnswers, option])
                    } else {
                      onAnswerChange(currentAnswers.filter((a) => a !== option))
                    }
                  }}
                  id={optionId(`match-${index}`)}
                  aria-checked={currentAnswers.includes(option)}
                />
                <Label htmlFor={optionId(`match-${index}`)} className="cursor-pointer">
                  {index + 1}. {option}
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
