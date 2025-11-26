import type { ExamData } from "@/types/cbt"
import examTest1 from "./Exam Test 1.json"
import examTest2 from "./Exam Test 2.json"
import mathBasics from "./Mathematics Basics.json"
import scienceFundamentals from "./Science Fundamentals.json"
import jsProgramming from "./JavaScript Programming.json"
import generalKnowledge from "./General Knowledge.json"

export function loadAvailableExams(): ExamData[] {
  return [
    examTest1,
    examTest2,
    mathBasics,
    scienceFundamentals,
    jsProgramming,
    generalKnowledge,
  ] as ExamData[]
}
