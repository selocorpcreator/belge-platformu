import { z } from "zod";

// Ortak şemalar
const idSchema = z.string().trim().min(1, "Gerekli").optional();
const fullNameSchema = z.string().trim().min(3, "Ad soyad en az 3 karakter");
const phoneSchema = z.string().trim().min(10, "Geçerli telefon numarası girin");
const addressSchema = z.string().trim().min(5, "Adres en az 5 karakter");

export const personSchema = z.object({
  fullName: fullNameSchema,
  idNumber: idSchema,
  phone: phoneSchema,
  address: addressSchema,
});

export type Person = z.infer<typeof personSchema>;

// ============ İBRANAME ============

export const ibraNamesSchema = z.object({
  releasingParty: personSchema,
  releasedParty: personSchema,
  subject: z.string().trim().min(10, "Konu en az 10 karakter"),
  amount: z.coerce.number().positive("Tutar 0'dan büyük olmalı"),
  description: z.string().trim().min(20, "Açıklama en az 20 karakter"),
  rights: z.array(z.string()).optional(),
  date: z.string().min(1, "Tarih seçin"),
});

export type IbraNamesData = z.infer<typeof ibraNamesSchema>;

export const IBRA_NAMES_DEFAULTS: IbraNamesData = {
  releasingParty: { fullName: "", idNumber: "", phone: "", address: "" },
  releasedParty: { fullName: "", idNumber: "", phone: "", address: "" },
  subject: "",
  amount: 0,
  description: "",
  rights: [],
  date: "",
};

// ============ İHTARNAME ============

export const ihtarnameSchema = z.object({
  warningIssuedBy: personSchema,
  warningSubject: personSchema,
  subject: z.string().trim().min(10, "Konu en az 10 karakter"),
  details: z.array(z.object({ text: z.string().min(5) })),
  demand: z.string().trim().min(10, "Talep en az 10 karakter"),
  deadline: z.coerce.number().int().min(1, "En az 1 gün").max(365, "En fazla 365 gün"),
  notificationMethod: z.enum(["elden", "posta", "diger"]),
});

export type IhtarnameData = z.infer<typeof ihtarnameSchema>;

export const IHTARNAME_DEFAULTS: IhtarnameData = {
  warningIssuedBy: { fullName: "", idNumber: "", phone: "", address: "" },
  warningSubject: { fullName: "", idNumber: "", phone: "", address: "" },
  subject: "",
  details: [{ text: "" }],
  demand: "",
  deadline: 15,
  notificationMethod: "posta",
};

// ============ TİCARİ ANLAŞMA ============

export const ticariAnlasmaSchema = z.object({
  serviceProvider: z.object({
    companyName: z.string().min(3),
    taxId: z.string().min(5),
    authority: z.string().min(3),
    representative: personSchema,
  }),
  serviceRecipient: z.object({
    companyName: z.string().min(3),
    taxId: z.string().min(5),
    authority: z.string().min(3),
    representative: personSchema,
  }),
  serviceScope: z.string().min(20),
  amount: z.coerce.number().positive(),
  paymentSchedule: z.string().min(10),
  duration: z.object({
    startDate: z.string().min(1),
    endDate: z.string().min(1),
  }),
  ipRights: z.string().optional(),
  confidentiality: z.boolean().default(true),
  terminationConditions: z.string().optional(),
});

export type TicariAnlasmaData = z.infer<typeof ticariAnlasmaSchema>;

// ============ AIRBNB/KIRALAMA ============

export const airbnbSchema = z.object({
  hostName: z.string().min(3),
  hostId: idSchema,
  guestName: z.string().min(3),
  guestId: idSchema,
  guestPassport: z.string().optional(),
  
  propertyAddress: addressSchema,
  propertyType: z.enum(["apartman", "ev", "studio", "diger"]),
  
  checkInDate: z.string().min(1),
  checkInTime: z.string().optional(),
  checkOutDate: z.string().min(1),
  checkOutTime: z.string().optional(),
  
  nightlyRate: z.coerce.number().positive(),
  totalNights: z.coerce.number().int().positive(),
  cleaningFee: z.coerce.number().min(0).optional(),
  depositAmount: z.coerce.number().positive(),
  
  furnishings: z.array(z.string()).optional(),
  rules: z.array(z.string()).optional(),
  
  cancelationPolicy: z.enum(["flexible", "moderate", "strict"]),
  date: z.string().min(1),
});

export type AirbnbData = z.infer<typeof airbnbSchema>;
