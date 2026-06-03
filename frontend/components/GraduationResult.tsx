"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, BookOpen, Dumbbell, FileText } from "lucide-react"
import { type GraduationResult as GraduationResultType } from "@/hooks/useErrorHandler"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface GraduationResultProps {
  result: GraduationResultType
}

export default function GraduationResult({ result }: GraduationResultProps) {
  const { summary, is_eligible_to_graduate, admission_year, main_major } = result

  // 計算各項缺少的學分
  const missingRequired = Math.max(0, summary.required_credits_needed - summary.required_credits_earned)
  const missingGeneral = Math.max(0, summary.general_credits_needed - summary.general_credits_earned)
  const missingElective = Math.max(0, summary.elective_credits_needed - summary.elective_credits_earned)
  const missingPE = Math.max(0, summary.pe_credits_needed - summary.pe_credits_earned)

  return (
    <div className="space-y-6">
      {/* 畢業可否大標題 */}
      <Card className={is_eligible_to_graduate ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
        <CardContent className="py-8">
          <div className="flex flex-col items-center gap-4">
            {is_eligible_to_graduate ? (
              <>
                <CheckCircle2 className="h-16 w-16 text-green-600" />
                <h2 className="text-3xl font-bold text-green-700">恭喜！符合畢業資格</h2>
                <div className="text-center space-y-1">
                  <p className="text-green-600 font-medium">
                    {main_major?.dept_name || result.dept_name}
                  </p>
                  <p className="text-green-600 text-sm">
                    入學 {admission_year} 學年度
                  </p>
                  <p className="text-green-600 text-xs">
                    適用 {result.applicable_year} 學年度課程規則
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-red-600" />
                <h2 className="text-3xl font-bold text-red-700">尚未符合畢業資格</h2>
                <div className="text-center space-y-1">
                  <p className="text-red-600 font-medium">
                    {main_major?.dept_name || result.dept_name}
                  </p>
                  <p className="text-red-600 text-sm">
                    入學 {admission_year} 學年度
                  </p>
                  <p className="text-red-600 text-xs">
                    適用 {result.applicable_year} 學年度課程規則
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 學分統計概覽 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">學分統計概覽</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 必修 */}
            <div className={`text-center p-3 rounded-lg border ${missingRequired === 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <p className="text-xs text-muted-foreground mb-1">必修</p>
              <p className={`text-2xl font-bold ${missingRequired === 0 ? "text-green-700" : "text-red-700"}`}>{summary.required_credits_earned}</p>
              <p className="text-xs text-muted-foreground">/ {summary.required_credits_needed}</p>
            </div>
            {/* 選修 */}
            <div className={`text-center p-3 rounded-lg border ${missingElective === 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <p className="text-xs text-muted-foreground mb-1">選修</p>
              <p className={`text-2xl font-bold ${missingElective === 0 ? "text-green-700" : "text-red-700"}`}>{summary.elective_credits_earned}</p>
              <p className="text-xs text-muted-foreground">/ {summary.elective_credits_needed}</p>
            </div>
            {/* 通識 */}
            <div className={`text-center p-3 rounded-lg border ${missingGeneral === 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <p className="text-xs text-muted-foreground mb-1">通識</p>
              <p className={`text-2xl font-bold ${missingGeneral === 0 ? "text-green-700" : "text-red-700"}`}>{summary.general_credits_earned}</p>
              <p className="text-xs text-muted-foreground">/ {summary.general_credits_needed}</p>
            </div>
            {/* 體育 */}
            <div className={`text-center p-3 rounded-lg border ${missingPE === 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <p className="text-xs text-muted-foreground mb-1">體育</p>
              <p className={`text-2xl font-bold ${missingPE === 0 ? "text-green-700" : "text-red-700"}`}>{summary.pe_credits_earned}</p>
              <p className="text-xs text-muted-foreground">/ {summary.pe_credits_needed}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 必修課程 & 選修學分 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 必修課程 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              必修課程
              {result.required_courses?.main_major?.dept_name && (
                <span className="text-sm text-muted-foreground font-normal">
                  - {result.required_courses.main_major.dept_name}
                </span>
              )}
              {result.required_courses?.main_major?.year && (
                <span className="text-xs text-muted-foreground font-normal">
                  （{result.required_courses.main_major.year} 學年度）
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>

            {/* 必修課程列表（只顯示主修） */}
            {result.required_courses && (() => {
              const main = result.required_courses.main_major
              
              if (main) {
                const missing = Math.max(0, main.credits_needed - main.credits_earned)
                return (
                  <>
                    {/* 學分統計 */}
                    <div className={`p-4 rounded-lg border ${missing === 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">已修學分</span>
                          <span className="text-2xl font-bold">{main.credits_earned}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">需修學分</span>
                          <span className="text-lg">{main.credits_needed}</span>
                        </div>
                        {missing === 0 ? (
                          <div className="flex items-center justify-center gap-2 pt-2 border-t text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="font-medium">已完成</span>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-red-600 font-medium">缺少學分</span>
                            <span className="text-red-600 font-bold">{missing}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 課程明細 */}
                    <div className="mt-6 space-y-4">
                      {main.passed.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-green-700 mb-2">✓ 已通過 ({main.passed.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {main.passed.map((course, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {main.missing.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-red-700 mb-2">✗ 缺少 ({main.missing.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {main.missing.map((course, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )
              }

              // 後援：未提供分項時，顯示舊版合併清單
              return (
              <div className="mt-6 space-y-4">
                {result.required_courses.passed.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-green-700 mb-2">✓ 已通過 ({result.required_courses.passed.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {result.required_courses.passed.map((course, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {result.required_courses.missing.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-red-700 mb-2">✗ 缺少 ({result.required_courses.missing.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {result.required_courses.missing.map((course, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              )
            })()}
          </CardContent>
        </Card>

        {/* 雙主修學分 */}
        {result.double_major && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                雙主修學分
                {result.double_major.dept_name && (
                  <span className="text-sm text-muted-foreground font-normal">
                    - {result.double_major.dept_name}
                  </span>
                )}
                {result.double_major.application_year && (
                  <span className="text-xs text-muted-foreground font-normal">
                    （{result.double_major.application_year} 學年度申請）
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg border ${result.double_major.credits_earned >= result.double_major.credits_needed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">已修學分</span>
                    <span className="text-2xl font-bold">{result.double_major.credits_earned}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">需修學分</span>
                    <span className="text-lg">{result.double_major.credits_needed}</span>
                  </div>
                  {result.double_major.credits_earned >= result.double_major.credits_needed ? (
                    <div className="flex items-center justify-center gap-2 pt-2 border-t text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">已完成</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-red-600 font-medium">缺少學分</span>
                      <span className="text-red-600 font-bold">{result.double_major.credits_needed - result.double_major.credits_earned}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {result.double_major.passed.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-green-700 mb-2">✓ 已通過 ({result.double_major.passed.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {result.double_major.passed.map((course, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {result.double_major.missing.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-red-700 mb-2">✗ 缺少 ({result.double_major.missing.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {result.double_major.missing.map((course, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 輔系學分 */}
        {(result.minor_details?.filter(m => m.result).length
          ? result.minor_details.filter(m => m.result)
          : result.minor ? [{ dept_name: result.minor.dept_name, applicable_year: result.minor.application_year, result: result.minor }] : []
        ).map((minorEntry, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                輔系學分
                {minorEntry.dept_name && (
                  <span className="text-sm text-muted-foreground font-normal">
                    - {minorEntry.dept_name}
                  </span>
                )}
                {minorEntry.applicable_year && (
                  <span className="text-xs text-muted-foreground font-normal">
                    （{minorEntry.applicable_year} 學年度申請）
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg border ${minorEntry.result.credits_earned >= minorEntry.result.credits_needed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">已修學分</span>
                    <span className="text-2xl font-bold">{minorEntry.result.credits_earned}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">需修學分</span>
                    <span className="text-lg">{minorEntry.result.credits_needed}</span>
                  </div>
                  {minorEntry.result.credits_earned >= minorEntry.result.credits_needed ? (
                    <div className="flex items-center justify-center gap-2 pt-2 border-t text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">已完成</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-red-600 font-medium">缺少學分</span>
                      <span className="text-red-600 font-bold">{minorEntry.result.credits_needed - minorEntry.result.credits_earned}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {minorEntry.result.passed.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-green-700 mb-2">✓ 已通過 ({minorEntry.result.passed.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {minorEntry.result.passed.map((course: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {minorEntry.result.missing.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-red-700 mb-2">✗ 缺少 ({minorEntry.result.missing.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {minorEntry.result.missing.map((course: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* 選修學分 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              選修學分
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg border ${missingElective === 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">已修學分</span>
                  <span className="text-2xl font-bold">{summary.elective_credits_earned}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">需修學分</span>
                  <span className="text-lg">{summary.elective_credits_needed}</span>
                </div>
                {missingElective > 0 ? (
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-red-600 font-medium">缺少學分</span>
                    <span className="text-red-600 font-bold">{missingElective}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 pt-2 border-t text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">已完成</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* 系內/系外選修細分（如果有資料） */}
            {result.elective && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-center mb-2">
                    <p className="text-sm text-muted-foreground">系內選修</p>
                    <p className="text-xl font-bold text-primary">{result.elective.in_dept_credits}</p>
                    <p className="text-xs text-muted-foreground">學分</p>
                  </div>
                  {result.elective.in_dept_courses && result.elective.in_dept_courses.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-xs max-h-48 overflow-y-auto">
                      {result.elective.in_dept_courses.map((c, i) => (
                        <li key={`${c.courseCode}-${i}`} className="flex justify-between gap-2 border-b border-muted-foreground/10 pb-1">
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <span className="truncate cursor-help">{c.courseName}</span>
                            </TooltipTrigger>
                            <TooltipContent sideOffset={4}>
                              <p>{c.courseName}</p>
                            </TooltipContent>
                          </Tooltip>
                          <span className="text-muted-foreground shrink-0">{c.credits} 學分</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center mt-2">尚無系內選修課程</p>
                  )}
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-center mb-2">
                    <p className="text-sm text-muted-foreground">系外選修</p>
                    <p className="text-xl font-bold text-primary">{result.elective.out_dept_credits}</p>
                    <p className="text-xs text-muted-foreground">學分</p>
                  </div>
                  {result.elective.out_dept_courses && result.elective.out_dept_courses.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-xs max-h-48 overflow-y-auto">
                      {result.elective.out_dept_courses.map((c, i) => (
                        <li key={`${c.courseCode}-${i}`} className="flex justify-between gap-2 border-b border-muted-foreground/10 pb-1">
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <span className="truncate cursor-help">{c.courseName}</span>
                            </TooltipTrigger>
                            <TooltipContent sideOffset={4}>
                              <p>{c.courseName}</p>
                            </TooltipContent>
                          </Tooltip>
                          <span className="text-muted-foreground shrink-0">{c.credits} 學分</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center mt-2">尚無系外選修課程</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 通識課程 & 體育學分 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 通識課程 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              通識課程
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg border ${missingGeneral === 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">已修學分</span>
                  <span className="text-2xl font-bold">{summary.general_credits_earned}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">需修學分</span>
                  <span className="text-lg">{summary.general_credits_needed}</span>
                </div>
                {missingGeneral > 0 ? (
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-red-600 font-medium">缺少學分</span>
                    <span className="text-red-600 font-bold">{missingGeneral}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 pt-2 border-t text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">已完成</span>
                  </div>
                )}
              </div>
            </div>

            {/* 違規／不足項目 */}
            {result.general_education?.violations && result.general_education.violations.length > 0 && (
              <div className="mt-4 p-3 rounded-lg border border-red-300 bg-red-50 text-sm text-red-900">
                <p className="font-semibold mb-1">⚠️ 未符合的規則</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {result.general_education.violations.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 資科系誤修資訊通識警告 */}
            {result.general_education?.info_warning_courses && result.general_education.info_warning_courses.length > 0 && (
              <div className="mt-4 p-3 rounded-lg border border-amber-300 bg-amber-50 text-sm text-amber-900">
                <p className="font-semibold mb-1">⚠️ 誤修資訊通識（不採計）</p>
                <p className="mb-2 text-xs">資科系免修資訊通識，下列課程之學分與成績皆不採計：</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {result.general_education.info_warning_courses.map((c, i) => (
                    <li key={i}>{c.courseName}（{c.credits} 學分）</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 通識領域分布（如果有資料） */}
            {result.general_education && result.general_education.by_category && (
              <div className="mt-6">
                <p className="text-sm font-semibold mb-3">各領域學分分布（已採計）</p>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(result.general_education.by_category).map(([category, credits]) => {
                    const limits = result.general_education?.limits?.[category]
                    const raw = result.general_education?.raw_by_category?.[category]
                    const rangeLabel = limits
                      ? (limits[0] === limits[1] ? `${limits[0]}` : `${limits[0]}-${limits[1]}`)
                      : ""
                    return (
                      <div key={category} className="text-center p-3 bg-muted rounded-lg border">
                        <p className="text-xs text-muted-foreground mb-1">{category}</p>
                        <p className="text-xl font-bold text-primary">{credits}</p>
                        <p className="text-xs text-muted-foreground">
                          {rangeLabel ? `（${rangeLabel} 學分）` : "學分"}
                        </p>
                        {typeof raw === "number" && raw > Number(credits) && (
                          <p className="text-[10px] text-amber-700 mt-1">
                            原修 {raw}，超修 {raw - Number(credits)}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 核心通識統計 */}
            {result.general_education && typeof result.general_education.core_count === "number" && (
              <div className="mt-4 p-3 bg-muted rounded-lg border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">核心通識</span>
                  <span className={`text-sm font-bold ${
                    (result.general_education.core_count ?? 0) >= (result.general_education.core_required ?? 2)
                      ? "text-green-700" : "text-red-700"
                  }`}>
                    {result.general_education.core_count} / {result.general_education.core_required} 個不同領域
                  </span>
                </div>
                {result.general_education.core_domains_taken && result.general_education.core_domains_taken.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    已修領域：{result.general_education.core_domains_taken.join("、")}
                  </p>
                )}
                {result.general_education.core_courses && result.general_education.core_courses.length > 0 && (
                  <ul className="mt-3 space-y-1 text-xs">
                    {result.general_education.core_courses.map((c, i) => (
                      <li
                        key={`${c.courseCode}-${i}`}
                        className="flex justify-between items-center gap-2 px-2 py-1 bg-background rounded border"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0">
                            {c.category}
                          </span>
                          <span className="truncate">{c.courseName}</span>
                          {c.source === "waived" && (
                            <span className="text-amber-700 shrink-0">（抵免）</span>
                          )}
                        </span>
                        <span className="text-muted-foreground shrink-0">{c.credits} 學分</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* 已修通識課程清單 */}
            {result.general_education?.taken_courses && result.general_education.taken_courses.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold mb-3">已修通識課程</p>
                <ul className="space-y-1 text-sm max-h-64 overflow-y-auto pr-1">
                  {result.general_education.taken_courses.map((c, i) => (
                    <li
                      key={`${c.courseCode}-${i}`}
                      className="flex justify-between items-center gap-2 px-3 py-2 bg-muted rounded-md border"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800 shrink-0">
                          {c.category}
                        </span>
                        <span className="truncate">{c.courseName}</span>
                        {c.source === "waived" && (
                          <span className="text-xs text-amber-700 shrink-0">（抵免）</span>
                        )}
                      </span>
                      <span className="text-muted-foreground text-xs shrink-0">{c.credits} 學分</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 體育學分 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              體育學分
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg border ${missingPE === 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">已修學分</span>
                  <span className="text-2xl font-bold">{summary.pe_credits_earned}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">需修學分</span>
                  <span className="text-lg">{summary.pe_credits_needed}</span>
                </div>
                {missingPE > 0 ? (
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-red-600 font-medium">缺少學分</span>
                    <span className="text-red-600 font-bold">{missingPE}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 pt-2 border-t text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">已完成</span>
                  </div>
                )}
              </div>
            </div>

            {/* 大四單學期 2 門體育警示 */}
            {result.physical_education?.senior_warning && (
              <div className="mt-4 p-3 rounded-lg border border-amber-300 bg-amber-50 text-sm text-amber-900">
                <p className="font-semibold mb-1">⚠️ 大四加修體育確認</p>
                <p>
                  偵測到大四學期
                  {` ${result.physical_education.senior_warning_semesters?.join("、")} `}
                  修了 2 門必修體育課。請確認是否已申請大四加修體育課，否則僅以 1 門計入。
                </p>
              </div>
            )}

            {/* 體育課程詳細清單 */}
            {result.physical_education?.course_details && result.physical_education.course_details.length > 0 ? (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">已修課程</p>
                <ul className="space-y-1 text-sm max-h-64 overflow-y-auto pr-1">
                  {result.physical_education.course_details.map((c, i) => {
                    const statusColor =
                      c.status === "通過"
                        ? "bg-green-100 text-green-800"
                        : c.status === "重複不計"
                        ? "bg-red-100 text-red-800"
                        : "bg-orange-100 text-orange-800"
                    return (
                      <li
                        key={`${c.courseCode}-${i}`}
                        className="flex justify-between items-center gap-2 px-3 py-2 bg-muted rounded-md border"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className={`px-2 py-0.5 text-xs rounded shrink-0 ${statusColor}`}>
                            {c.status}
                          </span>
                          <span className="truncate">{c.courseName}</span>
                        </span>
                        <span className="text-muted-foreground text-xs shrink-0">
                          {c.semester && c.semester !== "waived" ? c.semester : "抵免"}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : (
              result.physical_education && result.physical_education.courses.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">已修課程</p>
                  <div className="flex flex-wrap gap-2">
                    {result.physical_education.courses.map((course, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
