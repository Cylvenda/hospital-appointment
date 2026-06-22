export interface LabTestTypeApi {
    uuid: string;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface LabRequestItemApi {
    uuid: string;
    test_type_uuid: string;
    test_type_name: string;
    created_at: string;
    updated_at: string;
}

export interface LabRequestApi {
    uuid: string;
    consultation_uuid: string;
    doctor_uuid: string;
    doctor_name: string;
    patient_uuid: string;
    patient_name: string;
    status: LabRequestStatus;
    requested_at: string;
    updated_at: string;
    items: LabRequestItemApi[];
}

export interface LabResultApi {
    uuid: string;
    request_item_uuid: string;
    test_name: string;
    result: string;
    remarks: string;
    verified_by_uuid: string;
    verified_by_name: string;
    verified_at: string;
    created_at: string;
    updated_at: string;
}

// Store Models
export interface LabTestType {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LabRequestItem {
    id: string;
    testTypeId: string;
    testTypeName: string;
    createdAt: string;
    updatedAt: string;
}

export interface LabRequest {
    id: string;
    consultationId: string;
    doctorId: string;
    doctorName: string;
    patientId: string;
    patientName: string;
    status: LabRequestStatus;
    requestedAt: string;
    updatedAt: string;
    items: LabRequestItem[];
}

export interface LabResult {
    id: string;
    requestItemId: string;
    testName: string;
    result: string;
    remarks: string;
    verifiedById: string;
    verifiedByName: string;
    verifiedAt: string;
    createdAt: string;
    updatedAt: string;
}

export type LabRequestStatus = "pending" | "sample_collected" | "processing" | "completed";
