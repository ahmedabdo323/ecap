import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin ---
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@ecap.com" },
    update: {},
    create: {
      email: "admin@ecap.com",
      password: hashedPassword,
      name: "Admin",
    },
  });

  // --- Countries ---
  const countries = [
    { slug: "saudi-arabia", nameEn: "Saudi Arabia", nameAr: "المملكة العربية السعودية", nameFr: "Arabie saoudite" },
    { slug: "uae", nameEn: "United Arab Emirates", nameAr: "الإمارات العربية المتحدة", nameFr: "Émirats arabes unis" },
    { slug: "egypt", nameEn: "Egypt", nameAr: "مصر", nameFr: "Égypte" },
    { slug: "jordan", nameEn: "Jordan", nameAr: "الأردن", nameFr: "Jordanie" },
    { slug: "kuwait", nameEn: "Kuwait", nameAr: "الكويت", nameFr: "Koweït" },
    { slug: "qatar", nameEn: "Qatar", nameAr: "قطر", nameFr: "Qatar" },
    { slug: "bahrain", nameEn: "Bahrain", nameAr: "البحرين", nameFr: "Bahreïn" },
    { slug: "oman", nameEn: "Oman", nameAr: "عُمان", nameFr: "Oman" },
    { slug: "lebanon", nameEn: "Lebanon", nameAr: "لبنان", nameFr: "Liban" },
    { slug: "morocco", nameEn: "Morocco", nameAr: "المغرب", nameFr: "Maroc" },
    { slug: "tunisia", nameEn: "Tunisia", nameAr: "تونس", nameFr: "Tunisie" },
    { slug: "iraq", nameEn: "Iraq", nameAr: "العراق", nameFr: "Irak" },
    { slug: "algeria", nameEn: "Algeria", nameAr: "الجزائر", nameFr: "Algérie" },
    { slug: "libya", nameEn: "Libya", nameAr: "ليبيا", nameFr: "Libye" },
    { slug: "sudan", nameEn: "Sudan", nameAr: "السودان", nameFr: "Soudan" },
    { slug: "palestine", nameEn: "Palestine", nameAr: "فلسطين", nameFr: "Palestine" },
    { slug: "syria", nameEn: "Syria", nameAr: "سوريا", nameFr: "Syrie" },
    { slug: "yemen", nameEn: "Yemen", nameAr: "اليمن", nameFr: "Yémen" },
    { slug: "other", nameEn: "Other", nameAr: "أخرى", nameFr: "Autre" },
  ];

  const countryMap: Record<string, string> = {};
  for (const c of countries) {
    const record = await prisma.country.upsert({
      where: { slug: c.slug },
      update: { nameEn: c.nameEn, nameAr: c.nameAr, nameFr: c.nameFr },
      create: c,
    });
    countryMap[c.slug] = record.id;
  }

  // --- Industries ---
  const industries = [
    { slug: "fashion", nameEn: "Fashion", nameAr: "الأزياء", nameFr: "Mode", color: "purple" },
    { slug: "home-living", nameEn: "Home & Living", nameAr: "المنزل والمعيشة", nameFr: "Maison & Déco", color: "amber" },
    { slug: "electronics", nameEn: "Electronics", nameAr: "الإلكترونيات", nameFr: "Électronique", color: "blue" },
    { slug: "fmcg", nameEn: "FMCG", nameAr: "السلع الاستهلاكية", nameFr: "Grande consommation", color: "teal" },
    { slug: "gifting-flowers", nameEn: "Gifting & Flowers", nameAr: "الهدايا والزهور", nameFr: "Cadeaux & Fleurs", color: "pink" },
    { slug: "sports-wellness", nameEn: "Sports & Wellness", nameAr: "الرياضة والعافية", nameFr: "Sport & Bien-être", color: "green" },
    { slug: "food-beverage", nameEn: "Food & Beverage", nameAr: "الأغذية والمشروبات", nameFr: "Alimentation & Boissons", color: "orange" },
    { slug: "beauty-cosmetics", nameEn: "Beauty & Cosmetics", nameAr: "التجميل ومستحضرات التجميل", nameFr: "Beauté & Cosmétiques", color: "rose" },
    { slug: "health-pharma", nameEn: "Health & Pharma", nameAr: "الصحة والأدوية", nameFr: "Santé & Pharmacie", color: "red" },
    { slug: "education", nameEn: "Education", nameAr: "التعليم", nameFr: "Éducation", color: "indigo" },
    { slug: "travel-tourism", nameEn: "Travel & Tourism", nameAr: "السفر والسياحة", nameFr: "Voyage & Tourisme", color: "sky" },
    { slug: "logistics", nameEn: "Logistics & Delivery", nameAr: "الخدمات اللوجستية والتوصيل", nameFr: "Logistique & Livraison", color: "slate" },
    { slug: "other", nameEn: "Other", nameAr: "أخرى", nameFr: "Autre", color: "gray" },
  ];

  const industryMap: Record<string, string> = {};
  for (const i of industries) {
    const record = await prisma.industry.upsert({
      where: { slug: i.slug },
      update: { nameEn: i.nameEn, nameAr: i.nameAr, nameFr: i.nameFr, color: i.color },
      create: i,
    });
    industryMap[i.slug] = record.id;
  }

  // --- Projects (logoEn/logoAr/logoFr left empty — admin uploads them) ---
  const projects = [
    {
      nameEn: "LuxDecor Home", nameAr: "لوكس ديكور هوم", nameFr: "LuxDecor Maison",
      descEn: "Premium sustainable home furnishings and artisan decor delivered across the GCC.",
      descAr: "مفروشات منزلية مستدامة فاخرة وديكور حرفي يتم توصيله عبر دول الخليج.",
      descFr: "Mobilier durable haut de gamme et décoration artisanale livrés dans le GCC.",
      website: "www.luxdecor-home.com", email: "contact@luxdecor.ae", phone: "+971 4 123 4567",
      countryId: countryMap["uae"], industryId: industryMap["home-living"],
    },
    {
      nameEn: "SwiftGrocer", nameAr: "سويفت جروسر", nameFr: "SwiftGrocer",
      descEn: "Next-hour grocery delivery service specializing in fresh organic produce.",
      descAr: "خدمة توصيل البقالة خلال ساعة متخصصة في المنتجات العضوية الطازجة.",
      descFr: "Service de livraison d'épicerie spécialisé dans les produits biologiques frais.",
      website: "www.swiftgrocer.shop", email: "support@swiftgrocer.sa", phone: "+966 11 987 6543",
      countryId: countryMap["saudi-arabia"], industryId: industryMap["fmcg"],
    },
    {
      nameEn: "TechWave Electronics", nameAr: "تك ويف للإلكترونيات", nameFr: "TechWave Électronique",
      descEn: "Innovative consumer electronics and smart home solutions provider.",
      descAr: "مزود حلول إلكترونيات استهلاكية مبتكرة وحلول المنزل الذكي.",
      descFr: "Fournisseur innovant d'électronique grand public et de solutions pour maison connectée.",
      website: "www.techwave.io", email: "sales@techwave.jo", phone: "+962 6 789 0123",
      countryId: countryMap["jordan"], industryId: industryMap["electronics"],
    },
    {
      nameEn: "ModaVibe", nameAr: "مودا فايب", nameFr: "ModaVibe",
      descEn: "Curated collection of regional designer apparel and fashion accessories.",
      descAr: "مجموعة مختارة من الملابس والإكسسوارات من مصممين إقليميين.",
      descFr: "Collection organisée de vêtements de créateurs régionaux et d'accessoires de mode.",
      website: "www.modavibe.fashion", email: "hello@modavibe.com.eg", phone: "+20 2 2345 6789",
      countryId: countryMap["egypt"], industryId: industryMap["fashion"],
    },
    {
      nameEn: "PurePetals", nameAr: "بيور بتالز", nameFr: "PurePetals",
      descEn: "Luxury floral arrangements and bespoke gift hampers for all occasions.",
      descAr: "تنسيقات زهور فاخرة وسلال هدايا مخصصة لجميع المناسبات.",
      descFr: "Arrangements floraux de luxe et paniers-cadeaux sur mesure pour toutes les occasions.",
      website: "www.purepetals.me", email: "order@purepetals.kw", phone: "+965 2 234 5678",
      countryId: countryMap["kuwait"], industryId: industryMap["gifting-flowers"],
    },
    {
      nameEn: "FitTrack Middle East", nameAr: "فيت تراك الشرق الأوسط", nameFr: "FitTrack Moyen-Orient",
      descEn: "The region's leading distributor of smart fitness equipment and supplements.",
      descAr: "الموزع الرائد في المنطقة لمعدات اللياقة البدنية الذكية والمكملات الغذائية.",
      descFr: "Le principal distributeur régional d'équipements de fitness intelligents et de suppléments.",
      website: "www.fittrack.me", email: "info@fittrack.qa", phone: "+974 4455 6677",
      countryId: countryMap["qatar"], industryId: industryMap["sports-wellness"],
    },
    {
      nameEn: "GulfGourmet", nameAr: "جلف جورميه", nameFr: "GulfGourmet",
      descEn: "Premium artisanal food products sourced from local farms across the Gulf region.",
      descAr: "منتجات غذائية حرفية فاخرة من المزارع المحلية عبر منطقة الخليج.",
      descFr: "Produits alimentaires artisanaux premium provenant de fermes locales du Golfe.",
      website: "www.gulfgourmet.com", email: "info@gulfgourmet.bh", phone: "+973 1234 5678",
      countryId: countryMap["bahrain"], industryId: industryMap["food-beverage"],
    },
    {
      nameEn: "GlowUp Beauty", nameAr: "جلو أب بيوتي", nameFr: "GlowUp Beauté",
      descEn: "Natural and organic beauty products crafted with Middle Eastern botanicals.",
      descAr: "منتجات تجميل طبيعية وعضوية مصنوعة من نباتات شرق أوسطية.",
      descFr: "Produits de beauté naturels et biologiques élaborés avec des plantes du Moyen-Orient.",
      website: "www.glowupbeauty.com", email: "hello@glowupbeauty.om", phone: "+968 9876 5432",
      countryId: countryMap["oman"], industryId: industryMap["beauty-cosmetics"],
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  console.log(`Seed completed: 1 admin, ${countries.length} countries, ${industries.length} industries, ${projects.length} projects`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
