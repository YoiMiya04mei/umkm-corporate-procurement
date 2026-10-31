import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Seed Admin User
  const adminPasswordHash = await bcrypt.hash("AdminCorporate2026!", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@perusahaan.co.id" },
    update: {
      passwordHash: adminPasswordHash,
      name: "Administrator Utama",
      role: "ADMIN",
    },
    create: {
      email: "admin@perusahaan.co.id",
      passwordHash: adminPasswordHash,
      name: "Administrator Utama",
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user seeded: ${adminUser.email}`);

  // 2. Seed Company Settings
  await prisma.companySetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "PT MITRA KARYA PRATAMA",
      legalName: "PT Mitra Karya Pratama Mandiri",
      tagline: "Solusi Terpercaya Pengadaan Barang dan Layanan Jasa Terpadu",
      logoUrl: "",
      faviconUrl: "",
      description:
        "PT Mitra Karya Pratama adalah perusahaan penyedia pengadaan barang (supplier) dan penyedia layanan jasa (service provider) terkemuka untuk segmen B2B (korporasi swasta) dan B2G (instansi pemerintah). Kami berkomitmen mengutamakan integritas, transparansi harga, kepatuhan spesifikasi teknis, serta ketepatan waktu pengiriman.",
      history:
        "Didirikan dengan semangat memberikan efisiensi rantai pasok bagi sektor industri dan instansi di Indonesia, PT Mitra Karya Pratama berawal dari penyedia peralatan teknik dan umum. Seiring perkembangan pesat dan kepercayaan mitra strategis, kini perusahaan telah bertransformasi menjadi vendor terpadu pengadaan multi-kategori dan kontraktor jasa pemeliharaan bersertifikasi.",
      vision:
        "Menjadi mitra pengadaan barang dan penyedia jasa pilihan utama di Indonesia yang unggul dalam keandalan, profesionalisme, dan efisiensi operasional.",
      mission: JSON.stringify([
        "Menjamin ketersediaan produk berkualitas tinggi yang sesuai standar industri dengan penawaran harga terbaik.",
        "Menyediakan tim teknis profesional dan responsif untuk setiap ruang lingkup pengerjaan jasa.",
        "Membangun rantai pasok yang transparan, akuntabel, dan patuh terhadap regulasi pengadaan nasional.",
        "Menciptakan kemitraan strategis jangka panjang yang saling menguntungkan dengan seluruh klien korporasi.",
      ]),
      coreValues: JSON.stringify([
        {
          title: "Integritas & Kepatuhan",
          desc: "Menjunjung tinggi transparansi, akuntabilitas dokumen legalitas, dan etika bisnis terpercaya.",
        },
        {
          title: "Kualitas Berstandar",
          desc: "Setiap barang bergaransi resmi dan setiap pekerjaan jasa melalui quality control ketat.",
        },
        {
          title: "Ketepatan Jadwal (On-Time SLA)",
          desc: "Menghormati timeline klien dengan komitmen pengiriman dan serah terima proyek sesuai kesepakatan.",
        },
        {
          title: "Kemitraan Solutif",
          desc: "Proaktif memberikan rekomendasi teknis dan alternatif produk yang paling cost-effective.",
        },
      ]),
      serviceCommitments: JSON.stringify([
        "Jaminan 100% Produk Original & Bergaransi Pabrik",
        "Respon Permintaan Penawaran (RFQ) Maksimal 1x24 Jam Kerja",
        "Dukungan Purna Jual & Layanan Service Berkala",
        "Kelengkapan Dokumen Faktur Pajak & Surat Jalan Resmi",
      ]),
      nib: "0220101234567 [DEMO / DAPAT DIUBAH]",
      npwp: "01.234.567.8-012.000 [DEMO / DAPAT DIUBAH]",
      aktaPendirian: "Akta Notaris No. 25 Tanggal 15 Januari 2018 [DEMO]",
      skKemenkumham: "AHU-0012345.AH.01.01.TAHUN 2018 [DEMO]",
      certifications: JSON.stringify([
        "Sertifikat Standar KBLI 4659 (Perdagangan Besar Mesin & Peralatan)",
        "Sertifikat Standar KBLI 6199 (Aktivitas Telekomunikasi Lainnya)",
        "Sistem Manajemen K3 (SMK3) Terverifikasi",
        "ISO 9001:2015 Quality Management Compliant",
      ]),
      address: "Jl. Raya Industri Utama No. 88, Kawasan Niaga Terpadu",
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      postalCode: "12340",
      phone: "(021) 7890-1234",
      whatsapp: "6281234567890",
      email: "procurement@perusahaan.co.id",
      operationalHours: "Senin - Jumat: 08:30 - 17:30 WIB | Sabtu: 09:00 - 14:00 WIB",
      googleMapsEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.2858169222!2d106.75628586392348!3d-6.229569450371485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e49fe3dd05%3A0x6b245cb5797d10e!2sJakarta%20Selatan!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
      socialLinkedin: "https://linkedin.com/company/mitrakaryapratama",
      socialInstagram: "https://instagram.com/mitrakaryapratama",
      socialFacebook: "https://facebook.com/mitrakaryapratama",
      socialYoutube: "https://youtube.com/@mitrakaryapratama",
      statProjects: 185,
      statClients: 92,
      statProducts: 450,
      statYears: 8,
    },
  });
  console.log("✅ Company settings seeded.");

  // 3. Seed Categories
  const categoriesData = [
    // Product Categories
    {
      name: "Pengadaan Barang & Alat Berat",
      slug: "pengadaan-barang-alat-berat",
      type: "PRODUCT",
      description: "Peralatan industrial, genset, kompresor, dan armada alat berat untuk proyek.",
      icon: "Truck",
      sortOrder: 1,
    },
    {
      name: "IT, Komputer & Jaringan",
      slug: "it-komputer-jaringan",
      type: "PRODUCT",
      description: "Server, PC workstation, laptop, switch, router, dan perangkat keras jaringan kantor.",
      icon: "Server",
      sortOrder: 2,
    },
    {
      name: "Elektrikal & Mekanikal",
      slug: "elektrikal-mekanikal",
      type: "PRODUCT",
      description: "Panel listrik, kabel berstandar SPLN, trafo, motor listrik, dan instrumen kontrol.",
      icon: "Zap",
      sortOrder: 3,
    },
    {
      name: "Safety & APD Industri",
      slug: "safety-apd-industri",
      type: "PRODUCT",
      description: "Alat Pelindung Diri (APD), helm safety, sepatu boots, harness, dan safety signage.",
      icon: "ShieldAlert",
      sortOrder: 4,
    },
    {
      name: "Peralatan Kantor & General Trading",
      slug: "peralatan-kantor-general-trading",
      type: "PRODUCT",
      description: "Furniture kantor ergonomis, ATK korporasi, paper shredder, dan perlengkapan inventaris.",
      icon: "Briefcase",
      sortOrder: 5,
    },

    // Service Categories
    {
      name: "Jasa Instalasi & Pemeliharaan Jaringan IT",
      slug: "jasa-instalasi-jaringan-it",
      type: "SERVICE",
      description: "Pemasangan kabel LAN/Fiber Optic, instalasi server rack, firewall, dan sistem Wi-Fi enterprise.",
      icon: "Network",
      sortOrder: 1,
    },
    {
      name: "Jasa Mekanikal & Elektrikal (M&E)",
      slug: "jasa-mekanikal-elektrikal",
      type: "SERVICE",
      description: "Instalasi daya listrik gedung, maintenance genset, panel ATS, dan sistem HVAC/AC Sentral.",
      icon: "Wrench",
      sortOrder: 2,
    },
    {
      name: "Jasa Pemeliharaan Fasilitas & Gedung",
      slug: "jasa-pemeliharaan-gedung",
      type: "SERVICE",
      description: "Facility maintenance, perbaikan sipil ringan, waterproofing, dan sanitasi berkala.",
      icon: "Building2",
      sortOrder: 3,
    },
    {
      name: "Jasa Konsultasi & Manajemen Pengadaan",
      slug: "jasa-konsultasi-pengadaan",
      type: "SERVICE",
      description: "Bantuan penyusunan Bill of Quantity (BoQ), HPS/OE, dan audit spesifikasi teknis barang.",
      icon: "FileSpreadsheet",
      sortOrder: 4,
    },

    // Portfolio Categories
    {
      name: "Pengadaan Sektor B2B Korporasi",
      slug: "portfolio-b2b",
      type: "PORTFOLIO",
      description: "Proyek pengadaan untuk pabrik, gedung perkantoran, dan perusahaan swasta nasional.",
      icon: "Factory",
      sortOrder: 1,
    },
    {
      name: "Pengadaan Sektor B2G Pemerintahan",
      slug: "portfolio-b2g",
      type: "PORTFOLIO",
      description: "Proyek pemenuhan kebutuhan logistik dan perlengkapan dinas dan BUMN.",
      icon: "Landmark",
      sortOrder: 2,
    },
    {
      name: "Instalasi Infrastruktur & IT",
      slug: "portfolio-it-infra",
      type: "PORTFOLIO",
      description: "Pekerjaan instalasi data center, CCTV perkantoran, dan fiber optic campus.",
      icon: "Cpu",
      sortOrder: 3,
    },

    // Article Categories
    {
      name: "Wawasan Pengadaan (Procurement Insights)",
      slug: "artikel-wawasan-pengadaan",
      type: "ARTICLE",
      description: "Strategi tender, manajemen vendor, dan efisiensi anggaran pengadaan barang/jasa.",
      icon: "TrendingUp",
      sortOrder: 1,
    },
    {
      name: "Teknik & Industri",
      slug: "artikel-teknik-industri",
      type: "ARTICLE",
      description: "Panduan pemeliharaan mesin, standar K3, dan perkembangan teknologi mekanikal.",
      icon: "Cog",
      sortOrder: 2,
    },
    {
      name: "Regulasi & Standar",
      slug: "artikel-regulasi-standar",
      type: "ARTICLE",
      description: "Update regulasi LKPP, TKDN, sertifikasi ISO, dan kepatuhan hukum.",
      icon: "BookOpen",
      sortOrder: 3,
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, icon: cat.icon, sortOrder: cat.sortOrder },
      create: cat,
    });
    categoryMap.set(cat.slug, record.id);
  }
  console.log(`✅ ${categoriesData.length} Categories seeded.`);

  // 4. Seed Featured & Standard Products
  const productsData = [
    {
      title: "[DEMO] Genset Silent Diesel 50 kVA Perkins Engine",
      slug: "demo-genset-silent-diesel-50-kva-perkins",
      sku: "GEN-PKN-050",
      brand: "Perkins / Stamford",
      categorySlug: "pengadaan-barang-alat-berat",
      shortDesc: "Genset silent diesel kapasitas 50 kVA 3-phase dengan kanopi peredam kebisingan dan panel AMF/ATS otomatis.",
      description:
        "Genset diesel Silent Type 50 kVA menggunakan mesin Perkins original bergaransi resmi. Dirancang khusus untuk kebutuhan suplai daya cadangan pada gedung perkantoran, rumah sakit, pusat data, maupun lokasi proyek konstruksi. Dilengkapi kanopi kedap suara dengan tingkat desibel rendah (< 70 dB pada jarak 7 meter) serta panel digital controller terintegrasi.",
      specifications: JSON.stringify([
        { key: "Tipe Mesin", value: "Perkins 1103A-33TG1 (3 Cylinder In-line)" },
        { key: "Alternator", value: "Stamford PI144J / 50 kVA / 40 kW" },
        { key: "Tegangan", value: "380 / 220 Volt, 3 Phase, 50 Hz" },
        { key: "Kapasitas Tangki Solar", value: "120 Liter (Operasi ~8-10 Jam)" },
        { key: "Sistem Pendingin", value: "Water-cooled Radiator with Fan" },
        { key: "Dimensi (P x L x T)", value: "2.250 x 950 x 1.250 mm" },
        { key: "Garansi", value: "1 Tahun atau 2.000 Jam Kerja (Mana yang tercapai dulu)" },
      ]),
      price: 165000000,
      showPrice: false, // B2B typically requests quotation
      availability: "READY_STOCK",
      isFeatured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80",
      ]),
    },
    {
      title: "[DEMO] Server Rack Enterprise 42U with Dual PDU & Cable Management",
      slug: "demo-server-rack-enterprise-42u",
      sku: "IT-RCK-042",
      brand: "APC / ServerMax",
      categorySlug: "it-komputer-jaringan",
      shortDesc: "Rack server standard 19-inch 42U dengan pintu perforated ventilasi tinggi, kunci digital, dan dual vertical PDU 16A.",
      description:
        "Rak server industri 42U berkualitas tinggi yang memenuhi standar internasional EIA-310-D. Konstruksi baja SPCC cold-rolled ekstra tebal dengan kapasitas beban statis hingga 1.200 kg. Pintu depan mesh berventilasi 80% untuk sirkulasi udara optimal pada data center dan server room korporasi.",
      specifications: JSON.stringify([
        { key: "Ukuran Standar", value: "19 inch Rackmount (42U)" },
        { key: "Dimensi Eksternal", value: "600 x 1000 x 2050 mm" },
        { key: "Material", value: "SPCC Cold Rolled Steel tebal 2.0mm" },
        { key: "PDU Terpasang", value: "2x 8-Outlet German/C13 PDU with Surge Protection" },
        { key: "Sistem Pendingin", value: "Roof Fan Tray with 4x High CFM Fans" },
        { key: "Aksesoris Termasuk", value: "Cage nuts, grounding kit, castors, leveling feet" },
      ]),
      price: 18500000,
      showPrice: false,
      availability: "READY_STOCK",
      isFeatured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80",
      ]),
    },
    {
      title: "[DEMO] Switch Managed Core 24-Port 10G SFP+ Layer 3",
      slug: "demo-switch-managed-core-24-port-10g",
      sku: "NET-SW-L3-24",
      brand: "Cisco Catalyst / Aruba",
      categorySlug: "it-komputer-jaringan",
      shortDesc: "Enterprise L3 Managed Switch dengan 24-port Gigabit Ethernet dan 4-port 10G SFP+ uplink berkecepatan tinggi.",
      description:
        "Solusi jaringan backbone terandal untuk kantor multinasional, universitas, maupun pabrik modern. Dilengkapi kemampuan routing statis dan dinamis OSPF/BGP, Quality of Service (QoS), redundansi daya ganda (redundant power supply), dan manajemen cloud.",
      specifications: JSON.stringify([
        { key: "Port Interface", value: "24x 10/100/1000BASE-T RJ45" },
        { key: "Uplink", value: "4x 1G/10G SFP+ Slot" },
        { key: "Switching Capacity", value: "128 Gbps Non-blocking" },
        { key: "Forwarding Rate", value: "95.2 Mpps" },
        { key: "Fitur Manajemen", value: "Web GUI, CLI, SNMP v1/v2c/v3, RMON" },
        { key: "Power Supply", value: "Dual Hot-swappable AC 100-240V" },
      ]),
      price: 34500000,
      showPrice: false,
      availability: "READY_STOCK",
      isFeatured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80",
      ]),
    },
    {
      title: "[DEMO] Panel Distribusi Listrik LVMDP 400A Standar SNI / SPLN",
      slug: "demo-panel-distribusi-listrik-lvmdp-400a",
      sku: "ELC-LVMDP-400",
      brand: "Schneider Electric / ABB Component",
      categorySlug: "elektrikal-mekanikal",
      shortDesc: "Low Voltage Main Distribution Panel (LVMDP) 400A dengan breaker ACB/MCCB, metering digital, dan proteksi lonjakan petir.",
      description:
        "Panel distribusi utama daya tegangan rendah dirancang khusus untuk membagi dan mengontrol distribusi daya listrik pada pabrik, mall, atau gedung bertingkat. Dirakit oleh teknisi bersertifikasi dengan pengujian ketat dielectric withstand voltage dan insulation resistance.",
      specifications: JSON.stringify([
        { key: "Main Breaker", value: "MCCB 400 Ampere 3-Pole 50 kA" },
        { key: "Busbar", value: "Tembaga Murni Cu ETP 99.9% dilapisi heat shrink" },
        { key: "Box Enclosure", value: "Plat Besi tebal 2.0mm Powder Coating RAL 7032 (IP54)" },
        { key: "Power Meter", value: "Digital Multi-Function Power Meter (V, A, Hz, kW, kWh, PF)" },
        { key: "Surge Arrester", value: "Type 2 SPD 40 kA 3P+N" },
      ]),
      price: null,
      showPrice: false,
      availability: "INDENT",
      isFeatured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80",
      ]),
    },
    {
      title: "[DEMO] Paket Safety APD Lengkap Industri & Konstruksi (Set 50 Pax)",
      slug: "demo-paket-safety-apd-lengkap-50-pax",
      sku: "SFT-PAKET-050",
      brand: "DeltaPlus / 3M / Cheetah",
      categorySlug: "safety-apd-industri",
      shortDesc: "Paket lengkap Alat Pelindung Diri untuk 50 pekerja proyek, mencakup helm putar, rompi scotlite, kacamata safety, dan sarung tangan.",
      description:
        "Memenuhi kepatuhan regulasi K3 Depnaker dan standar internasional ANSI/OSHA. Dibuat dari material tahan benturan dan nyaman digunakan sepanjang jam kerja di lapangan terbuka.",
      specifications: JSON.stringify([
        { key: "Isi Paket", value: "50x Helm Safety V-Gard, 50x Rompi Jaring Scotlite 4 Strip, 50x Kacamata UV Protection, 50 Pasang Sarung Tangan Nitrile" },
        { key: "Standar Helm", value: "SNI ISO 3873 & ANSI Z89.1 Type 1 Class E" },
        { key: "Visibilitas Rompi", value: "High-Visibility Fluorescent Orange / Green dengan Scotchlite 3M" },
        { key: "Kemasan", value: "Kardus Master Packing bersegel QC" },
      ]),
      price: 12500000,
      showPrice: false,
      availability: "READY_STOCK",
      isFeatured: false,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80",
      ]),
    },
    {
      title: "[DEMO] Forklift Diesel 3.5 Ton Mast 4.5 Meter High Performance",
      slug: "demo-forklift-diesel-3-5-ton-mast-4-5m",
      sku: "EQP-FL-3500",
      brand: "Komatsu / Toyota Material Handling",
      categorySlug: "pengadaan-barang-alat-berat",
      shortDesc: "Unit forklift diesel kapasitas 3.5 ton dengan mast duplex/triplex 4.5 meter untuk logistik gudang dan pelabuhan.",
      description:
        "Forklift tangguh dengan konsumsi bahan bakar hemat dan emisi rendah. Cocok untuk bongkar muat kontainer, pabrik pengolahan, dan gudang distribusi.",
      specifications: JSON.stringify([
        { key: "Kapasitas Angkat", value: "3.500 kg (Load Center 500 mm)" },
        { key: "Ketinggian Angkat (Mast)", value: "4.500 mm (Triplex Full Free Lift Mast)" },
        { key: "Transmisi", value: "Automatic Powershift Transmission" },
        { key: "Ban", value: "Solid Rubber Heavy Duty Tires" },
        { key: "Fitur Keselamatan", value: "Operator Presence Sensing System (OPSS) & Backup Alarm" },
      ]),
      price: null,
      showPrice: false,
      availability: "INDENT",
      isFeatured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
      ]),
    },
  ];

  for (const prod of productsData) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) continue;

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        title: prod.title,
        sku: prod.sku,
        brand: prod.brand,
        categoryId,
        shortDesc: prod.shortDesc,
        description: prod.description,
        specifications: prod.specifications,
        price: prod.price,
        showPrice: prod.showPrice,
        availability: prod.availability,
        isFeatured: prod.isFeatured,
        images: prod.images,
      },
      create: {
        title: prod.title,
        slug: prod.slug,
        sku: prod.sku,
        brand: prod.brand,
        categoryId,
        shortDesc: prod.shortDesc,
        description: prod.description,
        specifications: prod.specifications,
        price: prod.price,
        showPrice: prod.showPrice,
        availability: prod.availability,
        isFeatured: prod.isFeatured,
        images: prod.images,
      },
    });
  }
  console.log(`✅ ${productsData.length} Products seeded.`);

  // 5. Seed Services
  const servicesData = [
    {
      title: "[DEMO] Jasa Instalasi & Penggelaran Jaringan Fiber Optic & Data Center",
      slug: "demo-jasa-instalasi-fiber-optic-data-center",
      categorySlug: "jasa-instalasi-jaringan-it",
      shortDesc: "Pekerjaan penarikan kabel FO, splicing, sertifikasi OTDR Fluke, dan setup rack server terintegrasi untuk kantor dan pabrik.",
      description:
        "Layanan instalasi terstruktur untuk jaringan telekomunikasi dan sistem data korporasi. Didukung oleh teknisi tersertifikasi FOA (Fiber Optic Association) dengan peralatan splicing mutakhir dan alat ukur OTDR terkalibrasi untuk menjamin insertion loss seminimal mungkin.",
      icon: "Network",
      scopeOfWork: JSON.stringify([
        "Site survey jalur kabel (indoor / outdoor / underground conduit)",
        "Penggelaran kabel FO Core 24/48/96 Single Mode",
        "Fusion Splicing pada ODF (Optical Distribution Frame) dan Roset",
        "Pengujian dan sertifikasi loss menggunakan OTDR Fluke Networks",
        "Pemberian label numbering dan dokumentasi as-built drawing AutoCAD",
        "Masa retensi dan garansi sambungan 12 bulan",
      ]),
      processSteps: JSON.stringify([
        { step: 1, title: "Survey & Analisis Kebutuhan", desc: "Tim engineer melakukan inspeksi fisik jalur, topologi, dan elevasi gedung." },
        { step: 2, title: "Penyusunan Rencana Kerja (RKS)", desc: "Menyerahkan Bill of Quantity (BoQ), jadwal kerja, dan dokumen safety K3." },
        { step: 3, title: "Eksekusi Instalasi & Splicing", desc: "Pengerjaan fisik oleh teknisi berpengalaman dengan pengawasan ketat." },
        { step: 4, title: "Testing, Commissioning & Serah Terima", desc: "Uji performa OTDR, serah terima BAST resmi, dan pelatihan staf operasional." },
      ]),
      advantages: JSON.stringify([
        "Teknisi Bersertifikat Resmi Industri",
        "Laporan Hasil Uji OTDR Digital Lengkap",
        "Kepatuhan K3 Standar Internasional",
        "Dukungan Penanganan Gangguan Darurat (On-call SLA)",
      ]),
      isFeatured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80",
      ]),
    },
    {
      title: "[DEMO] Jasa Maintenance & Overhaul Genset Berkala",
      slug: "demo-jasa-maintenance-overhaul-genset",
      categorySlug: "jasa-mekanikal-elektrikal",
      shortDesc: "Layanan servis rutin, penggantian oli/filter, tune-up injector, dan load bank testing berkala untuk generator diesel korporasi.",
      description:
        "Program pemeliharaan preventif dan korektif untuk memastikan genset darurat gedung selalu siap beroperasi 100% saat listrik PLN padam. Kami menangani berbagai merek ternama seperti Perkins, Cummins, Caterpillar, Volvo, dan Mitsubishi.",
      icon: "Wrench",
      scopeOfWork: JSON.stringify([
        "Pemeriksaan berkala bulanan (level oli, coolant radiator, kondisi baterai aki)",
        "Penggantian filter oli, filter solar, dan filter udara secara berkala",
        "Tune-up, kalibrasi nozzle injector, dan pembersihan tangki solar",
        "Load bank testing hingga 100% kapasitas untuk menguji ketahanan beban",
        "Pemeriksaan panel kontrol AMF/ATS dan modul sinkronisasi",
      ]),
      processSteps: JSON.stringify([
        { step: 1, title: "Audit Kondisi Awal", desc: "Pengukuran resistansi isolasi alternator dan pencatatan riwayat running hours." },
        { step: 2, title: "Servis & Penggantian Suku Cadang", desc: "Penggantian komponen aus dengan parts original resmi pabrik." },
        { step: 3, title: "Uji Beban & Simulasi Blackout", desc: "Uji nyala otomatis ATS saat simulasi padam daya." },
        { step: 4, title: "Penerbitan Checklist & Sertifikat Uji", desc: "Penyerahan laporan servis teknis untuk kepatuhan audit internal." },
      ]),
      advantages: JSON.stringify([
        "Ketersediaan Spare Parts Original Terjamin",
        "Peralatan Uji Load Bank Mandiri",
        "Pilihan Kontrak Service Tahunan (SLA Fleksibel)",
      ]),
      isFeatured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
      ]),
    },
    {
      title: "[DEMO] Jasa Manajemen & Konsultansi Pengadaan (Procurement Advisory)",
      slug: "demo-jasa-manajemen-konsultansi-pengadaan",
      categorySlug: "jasa-konsultasi-pengadaan",
      shortDesc: "Pendampingan profesional penyusunan dokumen BoQ, Kerangka Acuan Kerja (KAK), dan estimasi HPS untuk tender pengadaan.",
      description:
        "Membantu departemen procurement perusahaan swasta maupun instansi dalam merumuskan spesifikasi teknis yang tepat sasaran, efisien, dan objektif. Menghindarkan risiko kesalahan spesifikasi barang serta inefisiensi anggaran.",
      icon: "FileSpreadsheet",
      scopeOfWork: JSON.stringify([
        "Penyusunan Kerangka Acuan Kerja (KAK / ToR) komprehensif",
        "Market survey harga acuan pasar dan kalkulasi Harga Perkiraan Sendiri (HPS)",
        "Review spesifikasi teknis agar sesuai regulasi TKDN dan standar SNI",
        "Penyusunan kriteria evaluasi teknis dan scoring vendor",
      ]),
      processSteps: JSON.stringify([
        { step: 1, title: "Briefing Objektif", desc: "Diskusi mendalam mengenai kebutuhan operasional dan batasan anggaran." },
        { step: 2, title: "Market Intelligence", desc: "Riset ketersediaan barang dan perbandingan harga distributor utama." },
        { step: 3, title: "Drafting Dokumen Pengadaan", desc: "Penyusunan dokumen teknis berstandar baku industri." },
        { step: 4, title: "Finalisasi & Pendampingan", desc: "Penyelarasan bersama panitia pengadaan klien." },
      ]),
      advantages: JSON.stringify([
        "Efisiensi Biaya Pengadaan hingga 15-25%",
        "Mitigasi Risiko Hukum & Kegagalan Spesifikasi",
        "Analisis Data Rantai Pasok Independen",
      ]),
      isFeatured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
      ]),
    },
  ];

  for (const srv of servicesData) {
    const categoryId = categoryMap.get(srv.categorySlug);
    if (!categoryId) continue;

    await prisma.service.upsert({
      where: { slug: srv.slug },
      update: {
        title: srv.title,
        categoryId,
        shortDesc: srv.shortDesc,
        description: srv.description,
        icon: srv.icon,
        scopeOfWork: srv.scopeOfWork,
        processSteps: srv.processSteps,
        advantages: srv.advantages,
        isFeatured: srv.isFeatured,
        images: srv.images,
      },
      create: {
        title: srv.title,
        slug: srv.slug,
        categoryId,
        shortDesc: srv.shortDesc,
        description: srv.description,
        icon: srv.icon,
        scopeOfWork: srv.scopeOfWork,
        processSteps: srv.processSteps,
        advantages: srv.advantages,
        isFeatured: srv.isFeatured,
        images: srv.images,
      },
    });
  }
  console.log(`✅ ${servicesData.length} Services seeded.`);

  // 6. Seed Portfolio Projects
  const portfolioData = [
    {
      title: "[DEMO] Pengadaan & Instalasi 3 Unit Genset 150 kVA Kawasan Industri KIIC",
      slug: "demo-pengadaan-instalasi-genset-kiic",
      categorySlug: "portfolio-b2b",
      clientName: "PT Manufaktur Otomotif Presisi [DEMO]",
      location: "Karawang, Jawa Barat",
      completionYear: 2025,
      shortDesc: "Penyediaan 3 unit genset silent type 150 kVA lengkap dengan sinkronisasi panel paralel dan perpipaan bahan bakar solar bawah tanah.",
      description:
        "Proyek turn-key pengadaan sistem cadangan daya darurat untuk pabrik komponen otomotif seluas 4 hektar. Pekerjaan mencakup pondasi peredam getaran (spring isolator), sistem knalpot peredam residu, instalasi kabel daya NYY 4x185mm², dan uji beban bersama pihak PLN.",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
      ]),
      isFeatured: true,
    },
    {
      title: "[DEMO] Revitalisasi Infrastruktur Data Center & Jaringan Fiber Optic 10G",
      slug: "demo-revitalisasi-data-center-fo-10g",
      categorySlug: "portfolio-it-infra",
      clientName: "Menara Perkantoran Sudirman Central [DEMO]",
      location: "Jakarta Pusat",
      completionYear: 2025,
      shortDesc: "Penggelaran 2.400 meter kabel fiber optic backbone, penataan 14 unit rak server 42U, dan sistem monitoring suhu lingkungan.",
      description:
        "Peremajaan total sistem perkabelan terstruktur (structured cabling) pada gedung perkantoran 32 lantai. Pekerjaan selesai tepat waktu dalam 45 hari kalender tanpa mengganggu aktivitas bisnis para penyewa lantai perkantoran.",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80",
      ]),
      isFeatured: true,
    },
    {
      title: "[DEMO] Pengadaan Perlengkapan Safety K3 & Alat Pelindung Diri 1.500 Set",
      slug: "demo-pengadaan-safety-k3-1500-set",
      categorySlug: "portfolio-b2g",
      clientName: "Balai Prasarana Transportasi Wilayah [DEMO]",
      location: "Semarang, Jawa Tengah",
      completionYear: 2024,
      shortDesc: "Penyediaan logistik APD bersertifikat SNI dan ANSI untuk personil lapangan perawatan jalan dan jembatan nasional.",
      description:
        "Pemenang tender e-katalog pengadaan 1.500 paket APD lengkap. Seluruh barang lolos uji laboratorium bahan dan diserahkan 10 hari lebih cepat dari jadwal kontrak yang ditentukan.",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80",
      ]),
      isFeatured: true,
    },
  ];

  for (const pf of portfolioData) {
    const categoryId = categoryMap.get(pf.categorySlug);
    if (!categoryId) continue;

    await prisma.portfolio.upsert({
      where: { slug: pf.slug },
      update: {
        title: pf.title,
        categoryId,
        clientName: pf.clientName,
        location: pf.location,
        completionYear: pf.completionYear,
        shortDesc: pf.shortDesc,
        description: pf.description,
        images: pf.images,
        isFeatured: pf.isFeatured,
      },
      create: {
        title: pf.title,
        slug: pf.slug,
        categoryId,
        clientName: pf.clientName,
        location: pf.location,
        completionYear: pf.completionYear,
        shortDesc: pf.shortDesc,
        description: pf.description,
        images: pf.images,
        isFeatured: pf.isFeatured,
      },
    });
  }
  console.log(`✅ ${portfolioData.length} Portfolio projects seeded.`);

  // 7. Seed Articles
  const articlesData = [
    {
      title: "[DEMO] Strategi Mengoptimalkan Efisiensi Pengadaan Barang & Jasa untuk Korporasi Modern",
      slug: "demo-strategi-efisiensi-pengadaan-korporasi",
      categorySlug: "artikel-wawasan-pengadaan",
      author: "Tim Riset Pengadaan Mitra Karya",
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
      excerpt: "Pelajari bagaimana standardisasi Bill of Quantity (BoQ) dan seleksi vendor terakreditasi mampu memangkas lead-time pengadaan hingga 30%.",
      content: `
        <h2>Tantangan Terbesar dalam Siklus Pengadaan</h2>
        <p>Dalam dunia korporasi dan operasional industri, keterlambatan pengadaan barang atau ketidaksesuaian spesifikasi suku cadang dapat berakibat fatal pada lini produksi. Oleh karena itu, membangun kemitraan strategis dengan supplier terpercaya (one-stop procurement vendor) adalah salah satu langkah mitigasi risiko paling efektif.</p>
        
        <h3>1. Standardisasi Deskripsi Teknis</h3>
        <p>Hindari penulisan spesifikasi yang ambigu. Cantumkan parameter kunci seperti voltase, toleransi dimensi, standar pengujian (SNI/JIS/ASTM), serta sertifikat garansi resmi.</p>
        
        <h3>2. Manfaatkan Skema RFQ Terstruktur</h3>
        <p>Dengan formulir Request for Quotation (RFQ) yang detail, calon supplier dapat langsung memberikan penawaran harga kompetitif tanpa membuang waktu dalam bolak-balik klarifikasi teknis.</p>
        
        <h3>3. Evaluasi Total Cost of Ownership (TCO)</h3>
        <p>Harga awal yang murah sering kali berujung pada biaya perawatan tinggi di kemudian hari jika barang tidak memiliki dukungan purna jual. Selalu pertimbangkan ketersediaan suku cadang dan jaminan servis.</p>
      `,
      seoTitle: "Strategi Efisiensi Pengadaan Barang & Jasa B2B Korporasi",
      seoDescription: "Panduan praktis mengoptimalkan proses procurement pengadaan barang dan layanan jasa untuk efisiensi anggaran dan operasional bisnis.",
    },
    {
      title: "[DEMO] Mengenal Standar K3 dan Kelayakan Peralatan Elektrikal di Lingkungan Pabrik",
      slug: "demo-standar-k3-kelayakan-peralatan-elektrikal",
      categorySlug: "artikel-teknik-industri",
      author: "Ir. Hendra Wijaya (Lead M&E Specialist)",
      thumbnail: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80",
      excerpt: "Pentingnya audit kelayakan panel distribusi listrik dan sertifikasi teknisi untuk mencegah risiko kebakaran dan trip daya.",
      content: `
        <h2>Keamanan Instalasi Listrik Pabrik</h2>
        <p>Peralatan listrik tegangan rendah dan menengah di kawasan industri memerlukan pengawasan khusus. Standar SNI dan SPLN menetapkan batasan ketat mengenai kenaikan temperatur busbar dan ketahanan arus hubung singkat (short circuit current).</p>
        <p>Pastikan setiap panel listrik LVMDP dirakit menggunakan material berstandar dan dilengkapi proteksi pemutus sirkuit terkalibrasi.</p>
      `,
      seoTitle: "Standar K3 dan Kelayakan Panel Elektrikal Pabrik",
      seoDescription: "Ulasan teknis standar keselamatan instalasi panel listrik industri dan pemeliharaan berkala.",
    },
  ];

  for (const art of articlesData) {
    const categoryId = categoryMap.get(art.categorySlug);
    if (!categoryId) continue;

    await prisma.article.upsert({
      where: { slug: art.slug },
      update: {
        title: art.title,
        categoryId,
        author: art.author,
        thumbnail: art.thumbnail,
        excerpt: art.excerpt,
        content: art.content,
        seoTitle: art.seoTitle,
        seoDescription: art.seoDescription,
      },
      create: {
        title: art.title,
        slug: art.slug,
        categoryId,
        author: art.author,
        thumbnail: art.thumbnail,
        excerpt: art.excerpt,
        content: art.content,
        seoTitle: art.seoTitle,
        seoDescription: art.seoDescription,
      },
    });
  }
  console.log(`✅ ${articlesData.length} Articles seeded.`);

  // 8. Seed Sample RFQ Requests for Admin Testing
  const sampleRfqs = [
    {
      rfqNumber: "RFQ-20261031-0001",
      customerName: "Bpk. Rahmat Hidayat",
      companyName: "PT Cipta Sarana Industri [DEMO]",
      email: "rahmat.hidayat@ciptasarana.co.id",
      whatsapp: "6281298765432",
      requestType: "BARANG",
      targetItem: "Genset Silent Diesel 50 kVA Perkins Engine",
      quantity: "2 Unit",
      specifications: "Kebutuhan backup listrik pabrik baru di Cikarang. Termasuk kabel power NYY 50 meter dan tangki solar harian 500 liter. Franco Cikarang.",
      deliveryLocation: "Kawasan Industri MM2100, Cikarang Barat, Bekasi",
      targetDate: "15 November 2026",
      status: "NEW",
      internalNotes: "Permintaan masuk via web. Perlu di-follow up teknisi untuk cek akses jalan trailer ke lokasi gardu pabrik.",
    },
    {
      rfqNumber: "RFQ-20261030-0002",
      customerName: "Ibu Dian Sastro",
      companyName: "Klinik Medika Utama Nusantara [DEMO]",
      email: "dian.s@medikautama.com",
      whatsapp: "6281122334455",
      requestType: "KEDUANYA",
      targetItem: "Instalasi Rack Server & Switch Jaringan 24-Port",
      quantity: "1 Paket",
      specifications: "Perakitan 1 unit server rack 42U, pemasangan 2 unit switch L3, pengkabelan LAN Cat6 48 titik kamar rawat inap.",
      deliveryLocation: "Jl. Margonda Raya No. 45, Depok, Jawa Barat",
      targetDate: "30 November 2026",
      status: "REVIEWED",
      internalNotes: "Sudah dihubungi via WhatsApp. Klien mengirimkan denah lantai (floorplan) via email.",
    },
    {
      rfqNumber: "RFQ-20261028-0003",
      customerName: "Bpk. Agus Salim",
      companyName: "CV Sumber Berkah Mandiri [DEMO]",
      email: "agus.salim@sumberberkah.com",
      whatsapp: "6281345678901",
      requestType: "JASA",
      targetItem: "Jasa Maintenance & Overhaul Genset Berkala",
      quantity: "1 Kegiatan",
      specifications: "Overhaul genset Cummins 250 kVA yang sudah beroperasi 3.500 running hours.",
      deliveryLocation: "Tangerang, Banten",
      targetDate: "05 November 2026",
      status: "QUOTATION_PREPARED",
      internalNotes: "Surat penawaran harga resmi (SPH No. SPH-MKP-2026/10/089) senilai Rp 48.500.000 sudah dikirim ke email.",
    },
  ];

  for (const rfq of sampleRfqs) {
    await prisma.rfqRequest.upsert({
      where: { rfqNumber: rfq.rfqNumber },
      update: rfq,
      create: rfq,
    });
  }
  console.log(`✅ ${sampleRfqs.length} Sample RFQ requests seeded.`);

  // 9. Seed Testimonials
  const testimonialsData = [
    {
      clientName: "Bambang Soediro",
      clientCompany: "PT Megah Nusantara Logistik",
      clientPosition: "Head of General Affairs & Procurement",
      feedback:
        "Pelayanan PT Mitra Karya Pratama sangat memuaskan. Permintaan RFQ genset direspons dalam hitungan jam dengan rincian teknis yang sangat transparan. Pengiriman ke plant kami di Karawang tepat waktu dan lolos commissioning tanpa kendala.",
      rating: 5,
    },
    {
      clientName: "Sarah Agustina",
      clientCompany: "PT Data Optima Solusindo",
      clientPosition: "IT Infrastructure Manager",
      feedback:
        "Pengerjaan instalasi kabel fiber optic dan penataan rack data center dikerjakan sangat rapi oleh teknisi berlisensi. Dokumentasi as-built drawing dan hasil tes OTDR Fluke sangat lengkap untuk kebutuhan audit kami.",
      rating: 5,
    },
    {
      clientName: "Hj. Ridwan Kamil",
      clientCompany: "Koperasi Pegawai Sarana Prima",
      clientPosition: "Ketua Pengadaan Barang",
      feedback:
        "Sebagai mitra pengadaan perlengkapan safety dan ATK kantor, Mitra Karya selalu memberikan harga terbaik dengan legalitas faktur yang tertib. Sangat direkomendasikan untuk vendor rekanan korporasi.",
      rating: 5,
    },
  ];

  for (const tm of testimonialsData) {
    const existing = await prisma.testimonial.findFirst({
      where: { clientName: tm.clientName },
    });
    if (!existing) {
      await prisma.testimonial.create({ data: tm });
    }
  }
  console.log(`✅ ${testimonialsData.length} Testimonials seeded.`);

  // 10. Seed Client Partners
  const clientPartnersData = [
    { name: "Kawasan Industri Surya Cipta [DEMO]", logoUrl: "https://placehold.co/180x60/101D32/C8A96B?text=Surya+Cipta" },
    { name: "PT Petro Chemika Mandiri [DEMO]", logoUrl: "https://placehold.co/180x60/101D32/C8A96B?text=Petro+Chemika" },
    { name: "Logistik Prima Internasional [DEMO]", logoUrl: "https://placehold.co/180x60/101D32/C8A96B?text=Logistik+Prima" },
    { name: "Menara Perkantoran Sudirman [DEMO]", logoUrl: "https://placehold.co/180x60/101D32/C8A96B?text=Sudirman+Tower" },
    { name: "Mega Beton Konstruksi [DEMO]", logoUrl: "https://placehold.co/180x60/101D32/C8A96B?text=Mega+Beton" },
  ];

  for (const cp of clientPartnersData) {
    const existing = await prisma.clientPartner.findFirst({
      where: { name: cp.name },
    });
    if (!existing) {
      await prisma.clientPartner.create({ data: cp });
    }
  }
  console.log(`✅ ${clientPartnersData.length} Client partners seeded.`);

  console.log("🌟 Seeding successfully completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
