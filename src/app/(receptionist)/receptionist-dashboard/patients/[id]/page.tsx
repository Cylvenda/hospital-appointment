import { StaffPatientProfile } from "@/components/staff-patient-profile"

export default async function ReceptionistPatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <StaffPatientProfile patientUuid={id} role="receptionist" />
}
