"use client"

import { useEffect, useState, useMemo, use } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useLaboratoryStore } from "@/store/laboratory/laboratory.store"
import { getDashboardPath } from "@/lib/role-dashboard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, Tick01Icon, Medicine01Icon, Alert01Icon, UserCircleIcon, Calendar03Icon, Doctor01Icon, File01Icon } from "@hugeicons/core-free-icons"

export default function LabRequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
     const router = useRouter()
     const resolvedParams = use(params)
     const requestId = resolvedParams.id
     
     const { checkAuth } = useAuthUserStore()
     const { requests, loading, initialize, initialized, createResult, updateRequestStatus, exportReport } = useLaboratoryStore()
     
     const [submitting, setSubmitting] = useState(false)
     const [resultsData, setResultsData] = useState<Record<string, { result: string, remarks: string }>>({})

     useEffect(() => {
          void (async () => {
               const authenticated = await checkAuth()
               if (!authenticated) {
                    router.replace("/login")
                    return
               }

               const resolvedRole = useAuthUserStore.getState().user?.role
               if (resolvedRole !== "lab_tech") {
                    router.replace(getDashboardPath(resolvedRole))
                    return
               }

               if (!initialized) {
                    await initialize()
               }
          })()
     }, [checkAuth, router, initialize, initialized])

     const request = useMemo(() => requests.find(r => r.id === requestId), [requests, requestId])

     if (loading && !request) {
          return (
               <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-muted-foreground font-medium">Loading request details...</p>
               </div>
          )
     }

     if (!request) {
          return (
               <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <HugeiconsIcon icon={Alert01Icon} className="w-16 h-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold text-foreground">Request Not Found</h2>
                    <p className="text-muted-foreground mb-6">This lab request may have been deleted or does not exist.</p>
                    <Button onClick={() => router.push("/lab-tech-dashboard/requests")}>
                         Return to Requests
                    </Button>
               </div>
          )
     }

     const handleResultChange = (itemId: string, field: 'result' | 'remarks', value: string) => {
          setResultsData(prev => ({
               ...prev,
               [itemId]: {
                    ...prev[itemId],
                    [field]: value
               }
          }))
     }

     const handleSubmitResults = async () => {
          setSubmitting(true)
          try {
               // Submit all results for this request
               for (const item of request.items) {
                    const data = resultsData[item.id]
                    if (data && data.result.trim()) {
                         await createResult({
                              request_item_uuid: item.id,
                              result: data.result,
                              remarks: data.remarks || ""
                         })
                    }
               }

               // Mark the overall request as completed
               await updateRequestStatus(request.id, "completed")
               
               router.push("/lab-tech-dashboard/requests")
          } catch (error) {
               console.error("Failed to submit results", error)
               // Could add a toast notification here
          } finally {
               setSubmitting(false)
          }
     }

     const handleMarkInProgress = async () => {
          setSubmitting(true)
          try {
               await updateRequestStatus(request.id, "processing")
          } catch (error) {
               console.error("Failed to update status", error)
          } finally {
               setSubmitting(false)
          }
     }

     const getStatusBadge = (status: string) => {
          switch (status.toLowerCase()) {
               case "pending": return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Pending</Badge>
               case "processing": return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">In Progress</Badge>
               case "completed": return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Completed</Badge>
               default: return <Badge variant="outline" className="capitalize">{status}</Badge>
          }
     }

     return (
          <motion.div 
               className="mx-auto w-full max-w-8xl space-y-6 p-4 md:p-8"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
          >
               <Button 
                    variant="ghost" 
                    className="text-muted-foreground hover:text-foreground pl-0 mb-2"
                    onClick={() => router.back()}
               >
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-2 w-4 h-4" />
                    Back to Queue
               </Button>

               <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                         <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                              <HugeiconsIcon icon={Medicine01Icon} className="w-8 h-8 text-primary" />
                              Lab Request Details
                         </h1>
                         <p className="text-muted-foreground mt-1">
                              Process and verify test results for this patient.
                         </p>
                    </div>
                    <div className="flex items-center gap-3">
                         {request.status === "completed" && (
                              <div className="flex gap-2 mr-4 border-r border-muted/40 pr-4">
                                   <Button size="sm" variant="outline" onClick={() => exportReport(request.id, "pdf")} disabled={loading}>
                                        <HugeiconsIcon icon={File01Icon} className="w-4 h-4 mr-2" />
                                        PDF
                                   </Button>
                                   <Button size="sm" variant="outline" onClick={() => exportReport(request.id, "docx")} disabled={loading}>
                                        <HugeiconsIcon icon={File01Icon} className="w-4 h-4 mr-2" />
                                        DOCX
                                   </Button>
                              </div>
                         )}
                         {getStatusBadge(request.status)}
                    </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Patient Info Card */}
                    <Card className="shadow-sm border-muted/40">
                         <CardHeader className="bg-muted/10 pb-4 border-b border-muted/20">
                              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                                   <HugeiconsIcon icon={UserCircleIcon} className="w-4 h-4" /> Patient Information
                              </CardTitle>
                         </CardHeader>
                         <CardContent className="pt-4 space-y-4">
                              <div>
                                   <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Patient Name</p>
                                   <p className="font-medium">{request.patientName}</p>
                              </div>
                              <div>
                                   <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Request Date</p>
                                   <p className="font-medium flex items-center gap-2">
                                        <HugeiconsIcon icon={Calendar03Icon} className="w-4 h-4 text-muted-foreground" />
                                        {new Date(request.requestedAt).toLocaleString()}
                                   </p>
                              </div>
                         </CardContent>
                    </Card>

                    {/* Doctor Info Card */}
                    <Card className="shadow-sm border-muted/40">
                         <CardHeader className="bg-muted/10 pb-4 border-b border-muted/20">
                              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                                   <HugeiconsIcon icon={Doctor01Icon} className="w-4 h-4" /> Requester Information
                              </CardTitle>
                         </CardHeader>
                         <CardContent className="pt-4 space-y-4">
                              <div>
                                   <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Doctor Name</p>
                                   <p className="font-medium">{request.doctorName}</p>
                              </div>
                         </CardContent>
                    </Card>
               </div>

               {/* Process Results Card */}
               <Card className="shadow-md border-muted/60 overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                         <div className="flex items-center justify-between">
                              <div>
                                   <CardTitle className="text-lg text-primary">Required Tests</CardTitle>
                                   <CardDescription>Input the results and remarks for each requested test below.</CardDescription>
                              </div>
                              {request.status === "pending" && (
                                   <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={handleMarkInProgress}
                                        disabled={submitting}
                                   >
                                        Mark In Progress
                                   </Button>
                              )}
                         </div>
                    </CardHeader>
                    <CardContent className="p-0 divide-y divide-muted/30">
                         {request.items.map((item, index) => (
                              <div key={item.id} className="p-6 space-y-4 bg-background">
                                   <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                             {index + 1}
                                        </div>
                                        <h3 className="font-bold text-lg">{item.testTypeName}</h3>
                                   </div>
                                   
                                   <div className="grid gap-4 md:grid-cols-2 pl-8">
                                        <div className="space-y-2">
                                             <label className="text-sm font-bold text-foreground">Result Value <span className="text-destructive">*</span></label>
                                             <Input 
                                                  placeholder="e.g. 5.4 mmol/L, Positive, Negative" 
                                                  value={resultsData[item.id]?.result || ""}
                                                  onChange={(e) => handleResultChange(item.id, 'result', e.target.value)}
                                                  disabled={request.status === "completed"}
                                             />
                                        </div>
                                        <div className="space-y-2">
                                             <label className="text-sm font-bold text-foreground">Remarks / Observations</label>
                                             <Textarea 
                                                  placeholder="Add any technical remarks or interpretations..." 
                                                  className="resize-none h-10"
                                                  value={resultsData[item.id]?.remarks || ""}
                                                  onChange={(e) => handleResultChange(item.id, 'remarks', e.target.value)}
                                                  disabled={request.status === "completed"}
                                             />
                                        </div>
                                   </div>
                              </div>
                         ))}
                         {request.items.length === 0 && (
                              <div className="p-12 text-center text-muted-foreground">
                                   <p>No specific test items were attached to this request.</p>
                              </div>
                         )}
                    </CardContent>
                    
                    {request.status !== "completed" && (
                         <div className="p-6 bg-muted/10 border-t border-muted/40 flex justify-end">
                              <Button 
                                   size="lg" 
                                   onClick={handleSubmitResults}
                                   disabled={submitting || request.items.length === 0 || request.items.some(i => !(resultsData[i.id]?.result?.trim()))}
                                   className="gap-2"
                              >
                                   <HugeiconsIcon icon={Tick01Icon} className="w-5 h-5" />
                                   {submitting ? "Submitting..." : "Submit & Complete Request"}
                              </Button>
                         </div>
                    )}
               </Card>
          </motion.div>
     )
}
