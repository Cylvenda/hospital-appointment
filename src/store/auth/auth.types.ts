
// export type User = {
//      uuid: string | number,
//      firstName: string
//      lastName: string
//      username: string 
//      email: string 
//      phone: string 
//      isActive: boolean
//      isAdmin: boolean
//      isStaff: boolean
// }

export type NextOfKin = {
     name: string
     phone: string
     relationship: string
}

export type PatientProfile = {
     uuid: string
     patient_id?: string
     dob?: string
     gender?: string
     education?: string
     country: string
     religion?: string
     tribe?: string
     marital_status?: string
     occupation?: string
     veo_name?: string
     region?: string
     district?: string
     ward?: string
     residence?: string
     blood_group?: string
     insurance_provider?: string
     insurance_number?: string
     nida_number?: string
     is_profile_complete: boolean
     next_of_kin?: NextOfKin
}

export type User = {
     uuid: string
     first_name: string
     middle_name?: string
     last_name: string
     email: string
     phone: string 
     username: string 
     role: string
     is_active: boolean
     is_admin: boolean
     is_staff: boolean
     patient_profile?: PatientProfile
}

type NullablePartial<T> = {
     [K in keyof T]?: T[K] | null
}

export type UserUpdatePayload = NullablePartial<Omit<User, "patient_profile">> & {
     patient_profile?: NullablePartial<Omit<PatientProfile, "next_of_kin">> & {
          next_of_kin?: NullablePartial<NextOfKin>
     }
}

export type AccountActivation = {
     uid: string
     token: string
}
