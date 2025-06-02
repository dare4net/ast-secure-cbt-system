"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface CalculatorProps {
  isOpen: boolean
  onClose: () => void
}

export function Calculator({ isOpen, onClose }: CalculatorProps) {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  if (!isOpen) return null

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Calculator</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded mb-4 text-right text-2xl font-mono">{display}</div>
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" onClick={clear} className="col-span-2">
              Clear
            </Button>
            <Button variant="outline" onClick={() => inputOperation("÷")}>
              ÷
            </Button>
            <Button variant="outline" onClick={() => inputOperation("×")}>
              ×
            </Button>

            <Button variant="outline" onClick={() => inputNumber("7")}>
              7
            </Button>
            <Button variant="outline" onClick={() => inputNumber("8")}>
              8
            </Button>
            <Button variant="outline" onClick={() => inputNumber("9")}>
              9
            </Button>
            <Button variant="outline" onClick={() => inputOperation("-")}>
              -
            </Button>

            <Button variant="outline" onClick={() => inputNumber("4")}>
              4
            </Button>
            <Button variant="outline" onClick={() => inputNumber("5")}>
              5
            </Button>
            <Button variant="outline" onClick={() => inputNumber("6")}>
              6
            </Button>
            <Button variant="outline" onClick={() => inputOperation("+")} className="row-span-2">
              +
            </Button>

            <Button variant="outline" onClick={() => inputNumber("1")}>
              1
            </Button>
            <Button variant="outline" onClick={() => inputNumber("2")}>
              2
            </Button>
            <Button variant="outline" onClick={() => inputNumber("3")}>
              3
            </Button>

            <Button variant="outline" onClick={() => inputNumber("0")} className="col-span-2">
              0
            </Button>
            <Button variant="outline" onClick={() => inputNumber(".")}>
              .
            </Button>
            <Button variant="default" onClick={performCalculation}>
              =
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
