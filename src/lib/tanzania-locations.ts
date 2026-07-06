import districtsData from "@/data/tanzania/districts.json"
import regionsData from "@/data/tanzania/regions.json"
import wardsData from "@/data/tanzania/wards.json"

export type TanzaniaRegion = {
  name: string
  slug: string
}

export type TanzaniaDistrict = {
  name: string
  slug: string
  region_slug: string
}

export type TanzaniaWard = {
  name: string
  slug: string
  district_slug: string
  region_slug: string
  postcode: string
}

export const TANZANIA_REGIONS = regionsData as TanzaniaRegion[]

const TANZANIA_DISTRICTS = districtsData as TanzaniaDistrict[]
const TANZANIA_WARDS = wardsData as TanzaniaWard[]

const regionSlugByName = new Map(
  TANZANIA_REGIONS.map((region) => [region.name, region.slug])
)

export function getTanzaniaDistricts(regionName: string): TanzaniaDistrict[] {
  const regionSlug = regionSlugByName.get(regionName)
  if (!regionSlug) return []

  return TANZANIA_DISTRICTS.filter(
    (district) => district.region_slug === regionSlug
  )
}

export function getTanzaniaWards(
  regionName: string,
  districtName: string
): TanzaniaWard[] {
  const regionSlug = regionSlugByName.get(regionName)
  if (!regionSlug) return []

  const district = TANZANIA_DISTRICTS.find(
    (item) => item.region_slug === regionSlug && item.name === districtName
  )
  if (!district) return []

  return TANZANIA_WARDS.filter(
    (ward) =>
      ward.region_slug === regionSlug &&
      ward.district_slug === district.slug
  )
}
