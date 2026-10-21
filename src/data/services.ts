import { T, type L10n } from "@/lib/i18n";

export type ServiceId = "dcs" | "plc" | "commissioning" | "ic" | "training" | "staffing" | "support";

export interface Service {
  id: ServiceId;
  /** Real PAT site photo (public/images/site). */
  photo: string;
  title: L10n;
  summary: L10n;
  bullets: L10n[];
}

export const services: Service[] = [
  {
    id: "dcs",
    photo: "/images/site/dcs-cabinet.jpg",
    title: T("DCS Engineering & Commissioning", "هندسة وتشغيل أنظمة DCS"),
    summary: T(
      "Installation supervision, software and hardware configuration and commissioning of distributed control systems — mainly Emerson Ovation — in power and industrial plants.",
      "الإشراف على تركيب أنظمة التحكم الموزعة DCS — وخاصة Emerson Ovation — وضبط برمجياتها وأجهزتها وتشغيلها في محطات الطاقة والمنشآت الصناعية.",
    ),
    bullets: [
      T("Removal of old panels and supervision of the new DCS installation", "إزالة اللوحات القديمة والإشراف على تركيب نظام DCS الجديد"),
      T("Software and hardware modifications and system configuration", "تعديلات البرمجيات والأجهزة وضبط إعدادات النظام"),
      T("Database, logic and graphics engineering ready for FAT", "هندسة قواعد البيانات والمنطق والرسومات الجاهزة لاختبار القبول FAT"),
      T("Powering up the system and handing it over for plant commissioning", "تشغيل النظام وتسليمه لمرحلة تشغيل المحطة"),
    ],
  },
  {
    id: "plc",
    photo: "/images/site/io-wiring.jpg",
    title: T("PLC Programming & Integration", "برمجة ودمج وحدات PLC"),
    summary: T(
      "Engineering, installation and commissioning of PLC-based systems, including Siemens S7, and troubleshooting of PLC controls.",
      "هندسة وتركيب وتشغيل الأنظمة المبنية على وحدات PLC — ومنها Siemens S7 — وحل مشكلات منظومات التحكم بها.",
    ),
    bullets: [
      T("PLC engineering, software and hardware installation and commissioning", "هندسة وحدات PLC وتركيب برمجياتها وأجهزتها وتشغيلها"),
      T("Siemens S7 IO loop and device checks", "فحص حلقات IO والأجهزة على أنظمة Siemens S7"),
      T("Troubleshooting of PLCs, switchgear and emergency systems", "حل مشكلات وحدات PLC ولوحات التوزيع وأنظمة الطوارئ"),
    ],
  },
  {
    id: "commissioning",
    photo: "/images/site/control-room-startup.jpg",
    title: T("Commissioning & Start-up", "التشغيل التجريبي والتسليم"),
    summary: T(
      "Commissioning teams for gas turbines, steam turbines, boilers, HRSGs and balance of plant, helping EPC contractors deliver the plant faster, safer and at optimum cost.",
      "فرق تشغيل تجريبي للتوربينات الغازية والبخارية والغلايات وHRSG ومنظومات BOP، تساعد مقاولي EPC على تسليم المحطة أسرع وأكثر أمانًا وبأفضل تكلفة.",
    ),
    bullets: [
      T("GT, ST, boiler, HRSG and BOP commissioning and start-up staff", "كوادر التشغيل التجريبي والتسليم للتوربينات والغلايات وHRSG وBOP"),
      T("Commissioning procedures prepared and implemented for each plant", "إعداد وتنفيذ إجراءات التشغيل التجريبي المناسبة لكل محطة"),
      T("Reliability tests and return of units to commercial operation", "اختبارات الاعتمادية وإعادة الوحدات إلى التشغيل التجاري"),
      T("Guarantee-period support when included in the scope", "دعم فترة الضمان عند إدراجها في نطاق العمل"),
    ],
  },
  {
    id: "ic",
    photo: "/images/site/marshalling-cabinet.jpg",
    title: T("I&C and Electrical Commissioning", "تشغيل أنظمة القياس والتحكم والكهرباء"),
    summary: T(
      "Loop checks, device tests and calibration for instrumentation and control systems, plus electrical commissioning, to ensure safe and efficient operation.",
      "فحص حلقات التحكم واختبار الأجهزة ومعايرتها في أنظمة القياس والتحكم، وتشغيل الأنظمة الكهربائية لضمان تشغيل آمن وفعّال.",
    ),
    bullets: [
      T("IO cold and hot loop tests", "اختبارات حلقات IO على البارد والساخن"),
      T("Plant device functional tests", "الاختبارات الوظيفية لأجهزة المحطة"),
      T("Field instrument calibration", "معايرة أجهزة القياس الحقلية"),
      T("Electrical engineers and electricians for commissioning", "مهندسون وفنيو كهرباء لأعمال التشغيل التجريبي"),
    ],
  },
  {
    id: "training",
    photo: "/images/site/ovation-workstation.jpg",
    title: T("Training & Development", "التدريب والتطوير"),
    summary: T(
      "Customized operation and maintenance training for owner staff, including DCS operation and simulator instruction.",
      "برامج تدريب مخصصة على التشغيل والصيانة لفرق المالك، تشمل تشغيل أنظمة DCS والتدريب على المحاكيات.",
    ),
    bullets: [
      T("Owner staff courses on DCS plant operation and maintenance", "دورات لفرق المالك على تشغيل وصيانة أنظمة DCS"),
      T("Training instructors for power plants and DCS simulators", "مدربون لمحطات الطاقة ولمحاكيات أنظمة DCS"),
      T("Training academy set-up and course material for utility engineers and technicians", "إنشاء أكاديميات تدريب وإعداد مواد الدورات لمهندسي وفنيي شركات المرافق"),
    ],
  },
  {
    id: "staffing",
    photo: "/images/site/team-crane.jpg",
    title: T("Technical Staffing & Manpower", "الكوادر الفنية وتوفير العمالة"),
    summary: T(
      "Screened engineers and technicians placed with contractors and owners on a contractual basis — part-time or full-time, for short or extended periods.",
      "مهندسون وفنيون مؤهلون يتم اختيارهم بعناية وتوفيرهم للمقاولين والملاك بعقود، بدوام جزئي أو كامل ولفترات قصيرة أو ممتدة.",
    ),
    bullets: [
      T("DCS Ovation hardware and software engineers", "مهندسو برمجيات وأجهزة DCS Ovation"),
      T("Field instrument engineers, fitters and technicians", "مهندسو وفنيو وميكانيكيو أجهزة القياس الحقلية"),
      T("Mechanical, electrical and I&C commissioning engineers", "مهندسو التشغيل الميكانيكي والكهربائي وأنظمة القياس والتحكم"),
      T("Desk and field operator engineers", "مهندسو التشغيل في غرفة التحكم وفي الموقع"),
    ],
  },
  {
    id: "support",
    photo: "/images/site/team-night.jpg",
    title: T("Troubleshooting & Emergency Support", "حل المشكلات والدعم الطارئ"),
    summary: T(
      "Rapid support for routine and critical problems that affect your facility, available 24/7.",
      "دعم سريع للمشكلات الاعتيادية والحرجة التي تؤثر على منشأتك، متاح على مدار الساعة.",
    ),
    bullets: [
      T("DCS Ovation and DeltaV troubleshooting alongside the vendor team", "حل مشكلات أنظمة DCS Ovation وDeltaV بالتعاون مع فريق المورّد"),
      T("Gas turbine start-up and operation troubleshooting", "حل مشكلات بدء تشغيل وتشغيل التوربينات الغازية"),
      T("Generator, switchgear and PLC troubleshooting", "حل مشكلات المولدات ولوحات التوزيع ووحدات PLC"),
    ],
  },
];

export const serviceById = (id: ServiceId): Service => services.find((s) => s.id === id)!;
