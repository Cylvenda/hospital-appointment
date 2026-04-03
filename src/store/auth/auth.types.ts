
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

export type User = {
     uuid: string
     first_name: string
     last_name: string
     email: string
     phone: string 
     username: string 
     role: string
     is_active: boolean
     is_admin: boolean
     is_staff: boolean
}

export type AccountActivation = {
     uid: string
     token: string
}
