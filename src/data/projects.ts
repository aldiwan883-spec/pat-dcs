import { T, type L10n } from "@/lib/i18n";
import type { ServiceId } from "./services";

/**
 * Single source of truth for the project library.
 * Origin: the PAT project reference list (PAT_WS9). To add a project, append an
 * entry here — its page, listing card, filters, sitemap entry and structured
 * data are generated from it. `images` are optional paths under /public.
 */

export type CountryId = "egypt" | "saudi-arabia" | "oman";
export type PlatformId = "ovation" | "deltav" | "emerson" | "siemens" | "alstom" | "other";

export interface Project {
  no: number;
  slug: string;
  name: L10n;
  type: L10n;
  country: CountryId;
  start: number;
  end?: number;
  /** Capacity exactly as written in the reference list. */
  capacity?: string;
  /** Big number on the project tile. */
  figure: { value: string; unit: L10n };
  platform: PlatformId;
  /** Contractors / OEMs PAT worked with on this project. */
  partners: string[];
  services: ServiceId[];
  summary: L10n;
  scope: L10n[];
  featured?: boolean;
  images?: { src: string; alt: L10n }[];
}

const MW = T("MW", "ميجاوات");
const unit = (en: string, ar: string) => T(en, ar);

/* Reusable scope lines (kept identical across projects). */
const trainOwner = T(
  "Owner staff training courses on DCS plant operation and maintenance",
  "دورات تدريبية لفريق المالك على تشغيل وصيانة نظام DCS",
);
const normalize = T(
  "Commissioning and start-up, returning the DCS units to commercial operation",
  "التشغيل التجريبي والتسليم وإعادة وحدات نظام DCS إلى التشغيل التجاري",
);
const ioDevice = T("Plant IO loop and device checks", "فحص حلقات IO والأجهزة في المحطة");
const dcsInstallSupervision = T(
  "Supervision of the new DCS installation and software installation",
  "الإشراف على تركيب نظام DCS الجديد وتثبيت البرمجيات",
);
const gtReady = T(
  "Powering up the DCS and making it ready for gas turbine commissioning and start-up",
  "تشغيل نظام DCS وتجهيزه لمرحلة التشغيل التجريبي وبدء تشغيل التوربينات الغازية",
);
const gtLoopCommission = T(
  "Gas turbine IO loop and device checks, plant commissioning and normalizing the units after the reliability test",
  "فحص حلقات IO والأجهزة للتوربينات الغازية وتشغيل المحطة وإعادة الوحدات إلى وضعها الطبيعي بعد اختبار الاعتمادية",
);

export const projects: Project[] = [
  {
    no: 1,
    slug: "ataka-power-plant-dcs-retrofit",
    name: T("Ataka Power Plant 2×300 + 2×150 MW", "محطة كهرباء عتاقة 2×300 + 2×150 ميجاوات"),
    type: T("DCS retrofit", "تحديث نظام DCS"),
    country: "egypt",
    start: 2004,
    capacity: "2×300 + 2×150 MW",
    figure: { value: "900", unit: MW },
    platform: "ovation",
    partners: ["Emerson"],
    services: ["dcs", "commissioning", "training"],
    featured: false,
    summary: T(
      "DCS retrofit of a steam power plant: old panels removed, new DCS installed and units returned to commercial operation.",
      "تحديث نظام DCS لمحطة بخارية: إزالة اللوحات القديمة وتركيب النظام الجديد وإعادة الوحدات إلى التشغيل التجاري.",
    ),
    scope: [
      T("Removal of the old panels and supervision of the new DCS installation and replacement", "إزالة اللوحات القديمة والإشراف على تركيب واستبدال نظام DCS الجديد"),
      normalize,
      trainOwner,
    ],
  },
  {
    no: 2,
    slug: "damietta-ccpp-1230mw-dcs-migration",
    name: T("Damietta CCPP 1,230 MW", "محطة دمياط للدورة المركبة 1230 ميجاوات"),
    type: T("DCS migration", "ترحيل نظام DCS"),
    country: "egypt",
    start: 2006,
    capacity: "1,230 MW",
    figure: { value: "1,230", unit: MW },
    platform: "ovation",
    partners: ["Emerson"],
    services: ["dcs", "commissioning", "training"],
    featured: true,
    summary: T(
      "Migration of the plant DCS from Westinghouse WDPF to Emerson Ovation, with commissioning, start-up and owner training.",
      "ترحيل نظام DCS للمحطة من Westinghouse WDPF إلى Emerson Ovation، مع التشغيل التجريبي والتسليم وتدريب فريق المالك.",
    ),
    scope: [
      T("Installation and commissioning of the new DCS parts", "تركيب وتشغيل أجزاء نظام DCS الجديدة"),
      normalize,
      trainOwner,
    ],
  },
  {
    no: 3,
    slug: "new-talkha-el-kurimat-ii-ccpp-dcs",
    name: T("New Talkha & El Kurimat II CCPP 750 MW (two projects)", "محطتا طلخا الجديدة والكريمات 2 للدورة المركبة 750 ميجاوات (مشروعان)"),
    type: T("DCS installation & commissioning", "تركيب وتشغيل نظام DCS"),
    country: "egypt",
    start: 2007,
    end: 2009,
    capacity: "750 MW",
    figure: { value: "750", unit: MW },
    platform: "ovation",
    partners: ["Emerson"],
    services: ["dcs", "commissioning", "training"],
    summary: T(
      "DCS installation, hardware and software modifications and configuration for normal operation on two 750 MW combined-cycle plants.",
      "تركيب نظام DCS وتعديلات الأجهزة والبرمجيات وضبطه للتشغيل الطبيعي في محطتين للدورة المركبة بقدرة 750 ميجاوات.",
    ),
    scope: [
      T("DCS installation, hardware and software modifications, configuring the DCS for normal operation", "تركيب نظام DCS وتعديل الأجهزة والبرمجيات وضبط النظام للتشغيل الطبيعي"),
      T("Commissioning, start-up activities and powering up the system", "التشغيل التجريبي وأنشطة بدء التشغيل وتغذية النظام بالكهرباء"),
      trainOwner,
    ],
  },
  {
    no: 4,
    slug: "new-talkha-el-kurimat-ii-bop-commissioning",
    name: T("New Talkha & El Kurimat II CCPP 750 MW — BOP", "طلخا الجديدة والكريمات 2 للدورة المركبة 750 ميجاوات — منظومات BOP"),
    type: T("BOP commissioning & start-up", "التشغيل التجريبي لمنظومات BOP"),
    country: "egypt",
    start: 2007,
    end: 2009,
    capacity: "750 MW",
    figure: { value: "750", unit: MW },
    platform: "other",
    partners: ["Skoda"],
    services: ["commissioning", "staffing"],
    summary: T(
      "BOP plant commissioning, start-up and operation team for Skoda (Czech Republic) on two 750 MW combined-cycle projects.",
      "فريق التشغيل التجريبي وبدء التشغيل والتشغيل لمنظومات BOP لصالح Skoda (التشيك) في مشروعين للدورة المركبة بقدرة 750 ميجاوات.",
    ),
    scope: [T("BOP plant commissioning, start-up and operation team", "فريق التشغيل التجريبي وبدء التشغيل والتشغيل لمنظومات BOP")],
  },
  {
    no: 5,
    slug: "new-talkha-el-kurimat-ii-hrsg-commissioning",
    name: T("New Talkha & El Kurimat II CCPP 750 MW — HRSG", "طلخا الجديدة والكريمات 2 للدورة المركبة 750 ميجاوات — غلايات HRSG"),
    type: T("HRSG commissioning & start-up", "التشغيل التجريبي لغلايات HRSG"),
    country: "egypt",
    start: 2007,
    end: 2009,
    capacity: "750 MW",
    figure: { value: "750", unit: MW },
    platform: "other",
    partners: ["CMI"],
    services: ["commissioning", "staffing"],
    summary: T(
      "HRSG boiler commissioning, start-up and operation team for CMI (Belgium) on two 750 MW combined-cycle projects.",
      "فريق التشغيل التجريبي وبدء التشغيل والتشغيل لغلايات HRSG لصالح CMI (بلجيكا) في مشروعين للدورة المركبة بقدرة 750 ميجاوات.",
    ),
    scope: [T("HRSG boiler commissioning, start-up and operation team", "فريق التشغيل التجريبي وبدء التشغيل والتشغيل لغلايات HRSG")],
  },
  {
    no: 6,
    slug: "suez-sokhna-sugar-plc-commissioning",
    name: T("Suez Sokhna Port United Sugar Project", "مشروع السكر المتحد بميناء السخنة، السويس"),
    type: T("PLC commissioning", "تشغيل أنظمة PLC"),
    country: "egypt",
    start: 2009,
    figure: { value: "S7", unit: unit("Siemens PLC", "وحدات Siemens PLC") },
    platform: "siemens",
    partners: ["Savola"],
    services: ["plc", "ic"],
    summary: T(
      "IO loop and device checks and commissioning of a Siemens S7 PLC system for Savola (Saudi Arabia).",
      "فحص حلقات IO والأجهزة وتشغيل نظام PLC من Siemens S7 لصالح Savola (السعودية).",
    ),
    scope: [T("Siemens S7 PLC IO loop and device checks and commissioning", "فحص حلقات IO والأجهزة وتشغيل نظام Siemens S7 PLC")],
  },
  {
    no: 7,
    slug: "new-talkha-ccpp-cwp-commissioning",
    name: T("New Talkha CCPP 750 MW — CWP", "محطة طلخا الجديدة للدورة المركبة 750 ميجاوات — CWP"),
    type: T("CWP commissioning & start-up", "التشغيل التجريبي لمنظومة CWP"),
    country: "egypt",
    start: 2009,
    capacity: "750 MW",
    figure: { value: "750", unit: MW },
    platform: "other",
    partners: ["INITEC"],
    services: ["commissioning", "staffing"],
    summary: T(
      "CWP commissioning, start-up and operation scope for INITEC (Spain) at the New Talkha combined-cycle plant.",
      "نطاق التشغيل التجريبي وبدء التشغيل والتشغيل لمنظومة CWP لصالح INITEC (إسبانيا) في محطة طلخا الجديدة للدورة المركبة.",
    ),
    scope: [T("CWP commissioning, start-up and operation scope", "التشغيل التجريبي وبدء التشغيل وتشغيل منظومة CWP")],
  },
  {
    no: 8,
    slug: "shoaiba-st-pp-dcs-retrofit",
    name: T("Shoaiba ST Power Plant 3×250 MW", "محطة الشعيبة البخارية 3×250 ميجاوات"),
    type: T("DCS retrofit", "تحديث نظام DCS"),
    country: "saudi-arabia",
    start: 2009,
    end: 2010,
    capacity: "3×250 MW",
    figure: { value: "750", unit: MW },
    platform: "emerson",
    partners: ["Emerson"],
    services: ["dcs", "ic", "commissioning"],
    summary: T(
      "DCS retrofit of a steam power plant: IO loop and device checks, commissioning and start-up, returning the units to commercial operation.",
      "تحديث نظام DCS لمحطة بخارية: فحص حلقات IO والأجهزة والتشغيل التجريبي وبدء التشغيل وإعادة الوحدات إلى التشغيل التجاري.",
    ),
    scope: [
      ioDevice,
      T("Commissioning and start-up, normalizing the system and returning to commercial operation", "التشغيل التجريبي وبدء التشغيل وإعادة النظام إلى وضعه الطبيعي والتشغيل التجاري"),
    ],
  },
  {
    no: 9,
    slug: "pp4-riyadh-gt-dcs-retrofit",
    name: T("PP4 Riyadh Power Plant — GE gas turbines 2×25 MW", "محطة الرياض PP4 — توربينات غازية GE بقدرة 2×25 ميجاوات"),
    type: T("DCS retrofit", "تحديث نظام DCS"),
    country: "saudi-arabia",
    start: 2009,
    capacity: "2×25 MW",
    figure: { value: "50", unit: MW },
    platform: "ovation",
    partners: ["Emerson"],
    services: ["dcs", "ic", "commissioning", "training"],
    summary: T(
      "GE gas turbine loop and device checks, commissioning and start-up, plus DCS Ovation operation training for owner staff.",
      "فحص حلقات IO والأجهزة للتوربينات الغازية GE والتشغيل التجريبي وبدء التشغيل، إضافة إلى تدريب فريق المالك على تشغيل DCS Ovation.",
    ),
    scope: [
      T("GE gas turbine loop and device checks, commissioning and start-up", "فحص حلقات IO والأجهزة للتوربينات الغازية GE والتشغيل التجريبي وبدء التشغيل"),
      T("DCS Ovation operation training for owner staff", "تدريب فريق المالك على تشغيل DCS Ovation"),
      trainOwner,
    ],
  },
  {
    no: 10,
    slug: "el-kurimat-iii-io-loop-commissioning",
    name: T("El Kurimat III 750 MW", "محطة الكريمات 3 بقدرة 750 ميجاوات"),
    type: T("I&C commissioning", "تشغيل أنظمة القياس والتحكم"),
    country: "egypt",
    start: 2010,
    capacity: "750 MW",
    figure: { value: "750", unit: MW },
    platform: "alstom",
    partners: ["INITEC"],
    services: ["ic", "commissioning"],
    summary: T(
      "IO loop and I&C device commissioning team for the Alstom DCS, working for INITEC (Spain).",
      "فريق تشغيل حلقات IO وأجهزة القياس والتحكم لنظام Alstom DCS، بالعمل لصالح INITEC (إسبانيا).",
    ),
    scope: [T("Alstom DCS IO loop and I&C device commissioning team", "فريق تشغيل حلقات IO وأجهزة القياس والتحكم لنظام Alstom DCS")],
  },
  {
    no: 11,
    slug: "shoaiba-lime-water-plant-dcs-engineering",
    name: T("Shoaiba lime water plant", "محطة مياه الجير بالشعيبة"),
    type: T("DCS engineering for FAT", "هندسة DCS لاختبار FAT"),
    country: "saudi-arabia",
    start: 2010,
    figure: { value: "FAT", unit: unit("Engineering", "هندسة") },
    platform: "emerson",
    partners: ["Emerson"],
    services: ["dcs"],
    summary: T(
      "Engineering of the database, logic and graphics software, ready for the factory acceptance test.",
      "هندسة قاعدة البيانات والمنطق والرسومات البرمجية الجاهزة لاختبار القبول بالمصنع FAT.",
    ),
    scope: [T("Engineering of database, logic and graphics software ready for FAT", "هندسة قاعدة البيانات والمنطق والرسومات الجاهزة لاختبار FAT")],
  },
  {
    no: 12,
    slug: "rabigh-4x300mw-dcs-upgrade",
    name: T("Rabigh Power Plant 4×300 MW", "محطة رابغ 4×300 ميجاوات"),
    type: T("DCS upgrade", "ترقية نظام DCS"),
    country: "saudi-arabia",
    start: 2009,
    end: 2011,
    capacity: "4×300 MW",
    figure: { value: "1,200", unit: MW },
    platform: "emerson",
    partners: ["Emerson"],
    services: ["dcs", "ic", "commissioning", "training"],
    summary: T(
      "DCS software and hardware installation and programming, commissioning and start-up, ending with hand-over to the owner's staff.",
      "تركيب وبرمجة نظام DCS (برمجيات وأجهزة) والتشغيل التجريبي وبدء التشغيل، وصولًا إلى التسليم لفريق المالك.",
    ),
    scope: [
      T("DCS software and hardware installation and programming, commissioning, start-up and powering up", "تركيب وبرمجة نظام DCS (برمجيات وأجهزة) والتشغيل التجريبي وبدء التشغيل وتغذية النظام"),
      T("Plant IO loop and device checks, commissioning and start-up, units normalized and handed over to the owner for commercial operation", "فحص حلقات IO والأجهزة والتشغيل التجريبي وبدء التشغيل وتسليم الوحدات لفريق المالك للتشغيل التجاري"),
      trainOwner,
    ],
  },
  {
    no: 13,
    slug: "al-arish-stpp-dcs-migration",
    name: T("Al Arish STPP 2×30 MW", "محطة العريش البخارية 2×30 ميجاوات"),
    type: T("DCS migration", "ترحيل نظام DCS"),
    country: "egypt",
    start: 2011,
    end: 2012,
    capacity: "2×30 MW",
    figure: { value: "60", unit: MW },
    platform: "emerson",
    partners: ["Emerson"],
    services: ["dcs", "ic", "commissioning", "training"],
    summary: T(
      "Complete DCS removal and installation scope and migration activities on a steam power plant.",
      "نطاق كامل لإزالة وتركيب نظام DCS وأعمال الترحيل في محطة بخارية.",
    ),
    scope: [
      T("Complete DCS removal and installation scope and migration activities", "نطاق كامل لإزالة وتركيب نظام DCS وأنشطة الترحيل"),
      T("Plant device check and test, commissioning of plant systems and return to normal operation", "فحص واختبار أجهزة المحطة وتشغيل أنظمتها وإعادتها إلى التشغيل الطبيعي"),
      trainOwner,
    ],
  },
  {
    no: 14,
    slug: "old-talkha-210mw-tcs-retrofit",
    name: T("Old Talkha 210 MW — TCS Unit 2", "محطة طلخا القديمة 210 ميجاوات — وحدة TCS رقم 2"),
    type: T("DCS retrofit", "تحديث نظام DCS"),
    country: "egypt",
    start: 2011,
    capacity: "210 MW",
    figure: { value: "210", unit: MW },
    platform: "ovation",
    partners: ["Emerson"],
    services: ["dcs"],
    summary: T(
      "Removal of the old TCS control cabinets and complete installation of a new Ovation DCS on Unit 2.",
      "إزالة كابينات التحكم TCS القديمة والتركيب الكامل لنظام Ovation DCS جديد على الوحدة رقم 2.",
    ),
    scope: [T("Removal of the old TCS control cabinets and complete installation scope of the new Ovation DCS", "إزالة كابينات التحكم TCS القديمة والتركيب الكامل لنظام Ovation DCS الجديد")],
  },
  {
    no: 15,
    slug: "solar-energy-kurimat-commissioning",
    name: T("Solar Energy Kurimat Power Plant", "محطة الكريمات للطاقة الشمسية"),
    type: T("Plant commissioning & start-up", "التشغيل التجريبي وبدء التشغيل"),
    country: "egypt",
    start: 2011,
    figure: { value: "Solar", unit: unit("Commissioning", "تشغيل تجريبي") },
    platform: "other",
    partners: ["Iberdrola"],
    services: ["commissioning", "staffing"],
    summary: T(
      "Plant commissioning, start-up and operation within Iberdrola's scope.",
      "التشغيل التجريبي وبدء التشغيل والتشغيل ضمن نطاق عمل Iberdrola.",
    ),
    scope: [T("Plant commissioning, start-up and operation within the Iberdrola scope", "التشغيل التجريبي للمحطة وبدء التشغيل والتشغيل ضمن نطاق Iberdrola")],
  },
  {
    no: 16,
    slug: "sec4a-al-jouf-gt-dcs-upgrade",
    name: T("SEC4A Al Jouf — Fiat gas turbines 7×35 MW", "SEC4A الجوف — توربينات غازية Fiat بقدرة 7×35 ميجاوات"),
    type: T("DCS upgrade", "ترقية نظام DCS"),
    country: "saudi-arabia",
    start: 2009,
    end: 2012,
    capacity: "7×35 MW",
    figure: { value: "245", unit: MW },
    platform: "emerson",
    partners: ["Emerson"],
    services: ["dcs", "ic", "commissioning", "training"],
    summary: T(
      "New DCS installation supervision and software installation, then gas turbine IO loop checks, commissioning and a guarantee-period scope.",
      "الإشراف على تركيب نظام DCS جديد وتثبيت برمجياته، ثم فحص حلقات IO للتوربينات والتشغيل التجريبي ونطاق فترة الضمان.",
    ),
    scope: [
      dcsInstallSupervision,
      gtReady,
      gtLoopCommission,
      T("Guarantee period within PAT's scope", "فترة الضمان ضمن نطاق عمل PAT"),
      trainOwner,
    ],
  },
  {
    no: 17,
    slug: "sec4a-al-quryat-gt-dcs-upgrade",
    name: T("SEC4A Al Quryat — BBC gas turbines 2×22 MW", "SEC4A القريات — توربينات غازية BBC بقدرة 2×22 ميجاوات"),
    type: T("DCS upgrade", "ترقية نظام DCS"),
    country: "saudi-arabia",
    start: 2013,
    capacity: "2×22 MW",
    figure: { value: "44", unit: MW },
    platform: "emerson",
    partners: ["Emerson"],
    services: ["dcs", "ic", "commissioning"],
    summary: T(
      "New DCS installation supervision and software installation, then gas turbine IO loop checks and commissioning.",
      "الإشراف على تركيب نظام DCS جديد وتثبيت برمجياته، ثم فحص حلقات IO للتوربينات والتشغيل التجريبي.",
    ),
    scope: [dcsInstallSupervision, gtReady, gtLoopCommission],
  },
  {
    no: 18,
    slug: "sur-ipp-ccpp-2000mw-oman",
    name: T("Sur IPP-CCPP 2,000 MW", "محطة صور للدورة المركبة 2000 ميجاوات (IPP)"),
    type: T("Ovation DCS — APS check & commissioning", "Ovation DCS — فحص APS والتشغيل"),
    country: "oman",
    start: 2014,
    capacity: "2,000 MW",
    figure: { value: "2,000", unit: MW },
    platform: "ovation",
    partners: ["Emerson", "Daewoo"],
    services: ["dcs", "commissioning"],
    featured: true,
    summary: T(
      "Check and modification of the Automatic Plant Start (APS) software on the new Ovation DCS so the plant starts as one power block.",
      "فحص وتعديل برنامج البدء الآلي للمحطة (APS) على نظام Ovation DCS الجديد ليعمل بدء التشغيل كوحدة طاقة واحدة.",
    ),
    scope: [
      T("Check, troubleshooting and modification of the APS (Automatic Plant Start) software so it works as one power block plant start", "فحص وحل مشكلات وتعديل برنامج APS (البدء الآلي للمحطة) ليعمل بدء التشغيل كوحدة طاقة واحدة"),
      T("Plant systems commissioning and start-up", "التشغيل التجريبي وبدء تشغيل أنظمة المحطة"),
    ],
  },
  {
    no: 19,
    slug: "rabigh-ii-dcs-modernization",
    name: T("Rabigh II 2×300 MW", "محطة رابغ 2 بقدرة 2×300 ميجاوات"),
    type: T("DCS modernization", "تحديث نظام DCS"),
    country: "saudi-arabia",
    start: 2014,
    capacity: "2×300 MW",
    figure: { value: "600", unit: MW },
    platform: "emerson",
    partners: ["Emerson"],
    services: ["dcs", "ic", "commissioning"],
    summary: T(
      "IO loop and device checks, commissioning and start-up after the DCS modernization, ending with hand-over to the owner.",
      "فحص حلقات IO والأجهزة والتشغيل التجريبي وبدء التشغيل بعد تحديث نظام DCS، وصولًا إلى التسليم للمالك.",
    ),
    scope: [
      ioDevice,
      T("Commissioning and start-up, units normalized and returned to commercial operation by the owner (Saudi Electricity)", "التشغيل التجريبي وبدء التشغيل وإعادة الوحدات إلى وضعها الطبيعي لتعود للتشغيل التجاري لدى المالك (السعودية للكهرباء)"),
    ],
  },
  {
    no: 20,
    slug: "marafiq-yanbu-ii-new-dcs",
    name: T("Marafiq Yanbu II 3×270 MW", "مرافق ينبع 2 بقدرة 3×270 ميجاوات"),
    type: T("New DCS", "نظام DCS جديد"),
    country: "saudi-arabia",
    start: 2014,
    end: 2017,
    capacity: "3×270 MW",
    figure: { value: "810", unit: MW },
    platform: "emerson",
    partners: ["Emerson", "Hanwha"],
    services: ["dcs", "ic", "commissioning"],
    summary: T(
      "DCS hardware and software modifications and system configuration, IO loop and device checks, commissioning and start-up, with warranty-period coverage by a PAT engineer.",
      "تعديلات أجهزة وبرمجيات DCS وضبط النظام وفحص حلقات IO والأجهزة والتشغيل التجريبي، مع تغطية فترة الضمان بمهندس من PAT.",
    ),
    scope: [
      T("DCS hardware and software modifications and system configuration", "تعديلات أجهزة وبرمجيات DCS وضبط إعدادات النظام"),
      T("Plant IO loop and device checks, commissioning and start-up", "فحص حلقات IO والأجهزة والتشغيل التجريبي وبدء التشغيل"),
      T("Warranty period covered by a PAT engineer", "تغطية فترة الضمان بمهندس من PAT"),
    ],
  },
  {
    no: 21,
    slug: "el-kurimat-i-dcs-migration",
    name: T("El Kurimat I 2×650 MW", "محطة الكريمات 1 بقدرة 2×650 ميجاوات"),
    type: T("DCS migration", "ترحيل نظام DCS"),
    country: "egypt",
    start: 2015,
    end: 2016,
    capacity: "2×650 MW",
    figure: { value: "1,300", unit: MW },
    platform: "emerson",
    partners: ["Emerson"],
    services: ["dcs", "ic", "commissioning", "training"],
    featured: true,
    summary: T(
      "Site management and supervision of the DCS replacement on a very tight schedule, through start-up and return to commercial operation.",
      "إدارة الموقع والإشراف على استبدال نظام DCS في جدول زمني ضيق جدًا، وصولًا إلى بدء التشغيل والعودة إلى التشغيل التجاري.",
    ),
    scope: [
      T("Site management and supervision, inspecting and checking out the removal of the old DCS parts and the installation of the new DCS, on a very tight schedule", "إدارة الموقع والإشراف وفحص أعمال إزالة أجزاء DCS القديمة وتركيب النظام الجديد في جدول زمني ضيق جدًا"),
      T("Start-up and commissioning of the new DCS, powering up and configuring it for normal operation", "التشغيل التجريبي وبدء تشغيل النظام الجديد وتغذيته وضبطه للتشغيل الطبيعي"),
      T("Plant device checks and tests (database, graphics, logic) and hardware and software modifications", "فحص واختبار أجهزة المحطة (قواعد البيانات والرسومات والمنطق) وتعديلات الأجهزة والبرمجيات"),
      T("Cold and hot tests of plant devices and return of the DCS to normal commercial operation", "اختبارات بارد وساخن لأجهزة المحطة وإعادة النظام إلى التشغيل التجاري الطبيعي"),
      T("Owner training courses on DCS plant operation and maintenance", "دورات تدريبية للمالك على تشغيل وصيانة نظام DCS"),
    ],
  },
  {
    no: 22,
    slug: "makkah-gt-dcs-upgrade",
    name: T("Makkah Power Plant — GE gas turbines 6×65 MW", "محطة مكة — توربينات غازية GE بقدرة 6×65 ميجاوات"),
    type: T("DCS upgrade — GT3 troubleshooting", "ترقية نظام DCS — حل مشكلات GT3"),
    country: "saudi-arabia",
    start: 2016,
    capacity: "6×65 MW",
    figure: { value: "390", unit: MW },
    platform: "emerson",
    partners: ["Emerson"],
    services: ["dcs", "support"],
    summary: T(
      "GT3 start-up, operation troubleshooting and solution during the DCS upgrade of a GE gas turbine plant.",
      "بدء تشغيل GT3 وحل مشكلات التشغيل خلال ترقية نظام DCS لمحطة توربينات غازية GE.",
    ),
    scope: [T("GT3 start-up, operation troubleshooting and solution", "بدء تشغيل GT3 وحل مشكلات التشغيل")],
  },
  {
    no: 23,
    slug: "al-qaseem-gt9-valve-upgrade",
    name: T("Al Qaseem Power Station — Westinghouse gas turbines 9×50 MW", "محطة القصيم — توربينات غازية Westinghouse بقدرة 9×50 ميجاوات"),
    type: T("GT9 valve replacement & commissioning", "استبدال صمامات GT9 والتشغيل"),
    country: "saudi-arabia",
    start: 2017,
    capacity: "9×50 MW",
    figure: { value: "GT9", unit: unit("Valve upgrade", "ترقية الصمامات") },
    platform: "other",
    partners: ["Saudi FAL"],
    services: ["ic", "commissioning"],
    summary: T(
      "Supervision of the new FCV installation (GT9 FCV, OST and HP/LP valves replaced with new REGZA valves), software installation and commissioning.",
      "الإشراف على تركيب صمامات FCV الجديدة (استبدال صمامات GT9 وOST والضغط العالي والمنخفض بصمامات REGZA)، وتثبيت البرمجيات والتشغيل التجريبي.",
    ),
    scope: [
      T("Supervision of the new FCV installation and software installation, ready for gas turbine commissioning and start-up", "الإشراف على تركيب صمامات FCV الجديدة وتثبيت البرمجيات وتجهيز التوربين للتشغيل التجريبي وبدء التشغيل"),
      T("GT9 IO loop and device checks, plant commissioning and normalizing the unit after the reliability test", "فحص حلقات IO والأجهزة لـ GT9 وتشغيل المحطة وإعادة الوحدة إلى وضعها الطبيعي بعد اختبار الاعتمادية"),
    ],
  },
  {
    no: 24,
    slug: "west-damietta-ccpp-ic-commissioning",
    name: T("West Damietta Power Station CCPP — GT 4×125 + 1×250 MW", "محطة غرب دمياط للدورة المركبة — توربينات 4×125 + 1×250 ميجاوات"),
    type: T("I&C commissioning", "تشغيل أنظمة القياس والتحكم"),
    country: "egypt",
    start: 2017,
    capacity: "4×125 + 1×250 MW",
    figure: { value: "750", unit: MW },
    platform: "other",
    partners: ["GE", "Orascom"],
    services: ["ic", "commissioning"],
    summary: T(
      "I&C commissioning scope for four HRSGs, BOP, STG and ACC plants: cold and hot IO loop tests and plant device functional tests.",
      "نطاق تشغيل أنظمة القياس والتحكم لأربع غلايات HRSG ومنظومات BOP وSTG وACC: اختبارات حلقات IO على البارد والساخن والاختبارات الوظيفية للأجهزة.",
    ),
    scope: [
      T("I&C commissioning scope for 4 HRSG, BOP, STG and ACC plants", "نطاق تشغيل أنظمة القياس والتحكم لأربع غلايات HRSG ومنظومات BOP وSTG وACC"),
      T("IO cold and hot loop tests", "اختبارات حلقات IO على البارد والساخن"),
      T("Plant device functional tests", "الاختبارات الوظيفية لأجهزة المحطة"),
    ],
  },
  {
    no: 25,
    slug: "marafiq-yanbu-training-academy",
    name: T("Yanbu I & II — Marafiq training academy", "ينبع 1 و2 — أكاديمية التدريب لدى مرافق"),
    type: T("Consulting & training", "استشارات وتدريب"),
    country: "saudi-arabia",
    start: 2019,
    figure: { value: "HCD", unit: unit("Consulting", "استشارات") },
    platform: "other",
    partners: ["Leoron"],
    services: ["training"],
    summary: T(
      "HCD senior consultant for Marafiq's utility and engineering practice: improved work-flow procedures and established a training academy.",
      "مستشار أول للتطوير (HCD) لقطاع المرافق والهندسة لدى مرافق: تحسين إجراءات سير العمل وتأسيس أكاديمية للتدريب.",
    ),
    scope: [
      T("Work-flow procedure improvements", "تحسين إجراءات سير العمل"),
      T("Established an academy for the Marafiq training center", "تأسيس أكاديمية لمركز التدريب لدى مرافق"),
      T("Created training course material for engineers, supervisors and technicians on operation and maintenance", "إعداد مواد دورات تدريبية للمهندسين والمشرفين والفنيين في التشغيل والصيانة"),
    ],
  },
  {
    no: 26,
    slug: "el-esraa-tanker-troubleshooting",
    name: T("El Esraa petroleum tanker ship, Alexandria", "ناقلة البترول الإسراء، الإسكندرية"),
    type: T("Electrical & PLC troubleshooting", "حل مشكلات الكهرباء وPLC"),
    country: "egypt",
    start: 2020,
    figure: { value: "10", unit: unit("days", "أيام") },
    platform: "other",
    partners: [],
    services: ["support", "plc"],
    summary: T(
      "Troubleshooting of generator systems, switchgear, emergency systems and PLCs; the ship was handed over to the first engineer within 10 days after standing idle for years.",
      "حل مشكلات أنظمة المولدات ولوحات التوزيع وأنظمة الطوارئ ووحدات PLC، وتسليم السفينة للمهندس الأول خلال 10 أيام بعد توقفها لسنوات.",
    ),
    scope: [
      T("Troubleshooting of the electrical generator systems, switchgear, emergency systems and PLCs", "حل مشكلات أنظمة المولدات الكهربائية ولوحات التوزيع وأنظمة الطوارئ ووحدات PLC"),
      T("Task completed and the ship handed over to the first engineer within 10 days, after being stopped for years", "إنجاز المهمة وتسليم السفينة للمهندس الأول خلال 10 أيام بعد توقفها لسنوات"),
    ],
  },
  {
    no: 27,
    slug: "shoaiba-stage-1-dcs-rehabilitation",
    name: T("Shoaiba Power Plant, Stage I Phase 1", "محطة الشعيبة، المرحلة 1 — الفاز 1"),
    type: T("DCS rehabilitation — ABB to Emerson Ovation", "إعادة تأهيل DCS — من ABB إلى Emerson Ovation"),
    country: "saudi-arabia",
    start: 2021,
    end: 2022,
    figure: { value: "Ovation", unit: unit("from ABB", "بدلًا من ABB") },
    platform: "ovation",
    partners: ["Emerson", "Giza Systems"],
    services: ["dcs", "ic", "commissioning", "support"],
    featured: false,
    summary: T(
      "DCS rehabilitation from ABB to Emerson Ovation on a very tight schedule: IO loop checks, device tests and commissioning of boiler, turbine, BOP, desalination and demi water.",
      "إعادة تأهيل نظام DCS من ABB إلى Emerson Ovation في جدول زمني ضيق جدًا: فحص حلقات IO واختبار الأجهزة وتشغيل الغلايات والتوربينات وBOP والتحلية والمياه منزوعة المعادن.",
    ),
    scope: [
      T("IO loop checks, device tests and commissioning of the boiler, turbine, BOP, desalination and demi water systems", "فحص حلقات IO واختبار الأجهزة وتشغيل أنظمة الغلايات والتوربينات وBOP والتحلية والمياه منزوعة المعادن"),
      T("Troubleshooting of the Ovation DCS together with the Emerson team", "حل مشكلات نظام Ovation DCS بالتعاون مع فريق Emerson"),
      T("Comprehensive support throughout the project on a tight construction schedule to return the plant to commercial operation", "دعم شامل طوال المشروع ضمن جدول إنشاءات ضيق لإعادة المحطة إلى التشغيل التجاري"),
    ],
  },
  {
    no: 28,
    slug: "abqaiq-dcs-upgrade-aramco",
    name: T("Abqaiq plants — DCS upgrade, PIB-2 to PIB-18 (Aramco)", "محطات بقيق — ترقية نظام DCS، من PIB-2 إلى PIB-18 (أرامكو)"),
    type: T("DCS upgrade — DeltaV", "ترقية DCS — DeltaV"),
    country: "saudi-arabia",
    start: 2022,
    end: 2023,
    figure: { value: "12", unit: unit("PIBs", "مبانٍ PIB") },
    platform: "deltav",
    partners: ["Emerson", "Saudi FAL", "KBR"],
    services: ["dcs", "ic", "commissioning", "support"],
    featured: true,
    summary: T(
      "DCS upgrade across twelve PIBs: document review, cabinet staging checks before FAT, construction supervision and hot and cold tests for each PIB shutdown.",
      "ترقية نظام DCS في اثني عشر مبنى PIB: مراجعة الوثائق الهندسية وفحص تجهيز الكابينات قبل FAT والإشراف على الإنشاءات واختبارات بارد وساخن لكل إيقاف.",
    ),
    scope: [
      T("Engineering document review and verification of cabinet and marshalling staging before FAT", "مراجعة الوثائق الهندسية والتحقق من تجهيز الكابينات ولوحات التجميع قبل FAT"),
      T("Supervision of construction activities", "الإشراف على أعمال الإنشاءات"),
      T("Hot and cold test commissioning for each PIB shutdown", "تشغيل واختبارات بارد وساخن عند كل إيقاف لمبنى PIB"),
      T("Troubleshooting of the DeltaV system with the Emerson team", "حل مشكلات نظام DeltaV بالتعاون مع فريق Emerson"),
      T("Work carried out with the Saudi FAL / Emerson team in collaboration with the design company KBR", "عمل بالتعاون مع فريق Saudi FAL وEmerson وبالتنسيق مع شركة التصميم KBR"),
    ],
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

export const period = (p: Pick<Project, "start" | "end">) =>
  p.end && p.end !== p.start ? `${p.start}–${p.end}` : `${p.start}`;

export const countryIds: CountryId[] = ["egypt", "saudi-arabia", "oman"];

export const projectStats = {
  total: projects.length,
  countries: new Set(projects.map((p) => p.country)).size,
};

/** Newest first, then by reference number. */
export const sortedProjects = [...projects].sort(
  (a, b) => (b.end ?? b.start) - (a.end ?? a.start) || b.no - a.no,
);

export const featuredProjects = projects.filter((p) => p.featured);
