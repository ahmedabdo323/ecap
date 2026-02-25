export interface Admin {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Country {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  nameFr: string;
}

export interface Industry {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  nameFr: string;
  color: string;
}

export interface Project {
  id: string;
  nameEn: string;
  nameAr: string;
  nameFr: string;
  descEn: string;
  descAr: string;
  descFr: string;
  website: string;
  email: string;
  phone: string;
  countryId: string;
  industryId: string;
  country: Country;
  industry: Industry;
  logoEn: string;
  logoAr: string;
  logoFr: string;
}
