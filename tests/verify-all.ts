import { prisma } from "../src/lib/prisma";
import { verifyPassword, hashPassword, createToken, verifyToken } from "../src/lib/auth";
import { generateRfqNumber } from "../src/lib/utils";
import { rfqSchema, contactSchema, productSchema } from "../src/lib/validations";

async function runAcceptanceTests() {
  console.log("==================================================");
  console.log("🚀 STARTING ACCEPTANCE TESTING & VERIFICATION SUITE");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // TEST 1: Database Seed Verification
  console.log("\n[1] Verifying Database Seeding & Persistence...");
  const admin = await prisma.user.findUnique({
    where: { email: "admin@perusahaan.co.id" },
  });
  assert(admin !== null, "Admin user exists in database");

  const companySettings = await prisma.companySetting.findUnique({
    where: { id: "default" },
  });
  assert(companySettings !== null, "Company settings record exists");
  assert(companySettings?.name === "PT MITRA KARYA PRATAMA", "Company name correctly loaded");
  assert(companySettings?.statProjects !== undefined, "Dynamic statistics loaded");

  const catCount = await prisma.category.count();
  assert(catCount > 0, `Categories seeded (found ${catCount})`);

  const prodCount = await prisma.product.count();
  assert(prodCount > 0, `Products seeded (found ${prodCount})`);

  const srvCount = await prisma.service.count();
  assert(srvCount > 0, `Services seeded (found ${srvCount})`);

  const pfCount = await prisma.portfolio.count();
  assert(pfCount > 0, `Portfolios seeded (found ${pfCount})`);

  const artCount = await prisma.article.count();
  assert(artCount > 0, `Articles seeded (found ${artCount})`);

  // TEST 2: Authentication & Password Security
  console.log("\n[2] Verifying Authentication, Passwords & JWT...");
  const isCorrectPass = await verifyPassword("AdminCorporate2026!", admin!.passwordHash);
  assert(isCorrectPass, "Correct admin password verifies via bcrypt");

  const isWrongPass = await verifyPassword("WrongPassword123!", admin!.passwordHash);
  assert(!isWrongPass, "Incorrect password fails verification");

  const testPayload = {
    userId: admin!.id,
    email: admin!.email,
    name: admin!.name,
    role: admin!.role,
  };
  const token = await createToken(testPayload);
  assert(typeof token === "string" && token.length > 20, "JWT token created successfully");

  const decoded = await verifyToken(token);
  assert(decoded?.email === admin!.email, "JWT token verified and decoded accurately");

  // TEST 3: RFQ Creation & Lifecycle
  console.log("\n[3] Verifying RFQ Workflow & State Management...");
  const testRfqNumber = generateRfqNumber();
  assert(testRfqNumber.startsWith("RFQ-"), `RFQ Number format valid (${testRfqNumber})`);

  const validRfqInput = {
    customerName: "Bpk. Hendra Gunawan",
    companyName: "PT Sentosa Mandiri Logistik",
    email: "hendra@sentosalogistik.com",
    whatsapp: "6281234567890",
    requestType: "BARANG" as const,
    targetItem: "Genset Silent 50 kVA",
    quantity: "2 Unit",
    specifications: "Backup power plant Cikarang dengan automatic transfer switch (ATS)",
    deliveryLocation: "Cikarang Barat",
  };
  const rfqValidation = rfqSchema.safeParse(validRfqInput);
  assert(rfqValidation.success, "RFQ Zod validation succeeds on valid input");

  const createdRfq = await prisma.rfqRequest.create({
    data: {
      rfqNumber: testRfqNumber,
      ...validRfqInput,
      status: "NEW",
    },
  });
  assert(createdRfq.id !== undefined, "RFQ saved to database");

  // Update status and internal notes
  const updatedRfq = await prisma.rfqRequest.update({
    where: { id: createdRfq.id },
    data: {
      status: "QUOTATION_PREPARED",
      internalNotes: "SPH No. 102/SPH-MKP/2026 telah dikirimkan via email.",
    },
  });
  assert(updatedRfq.status === "QUOTATION_PREPARED", "RFQ status updated to QUOTATION_PREPARED");
  assert(updatedRfq.internalNotes?.includes("SPH No. 102"), "Internal notes persisted");

  // Clean up test RFQ
  await prisma.rfqRequest.delete({ where: { id: createdRfq.id } });
  assert(true, "Test RFQ cleaned up");

  // TEST 4: Contact Inquiry Submission
  console.log("\n[4] Verifying Contact Message Processing...");
  const contactInput = {
    name: "Ibu Maya Sari",
    company: "PT Mitra Sejahtera",
    email: "maya@sejahtera.com",
    whatsapp: "628987654321",
    subject: "Konsultasi Pengadaan APD",
    message: "Mohon info katalog dan surat penawaran harga APD lengkap untuk 100 orang.",
  };
  const contactValidation = contactSchema.safeParse(contactInput);
  assert(contactValidation.success, "Contact input Zod validation passes");

  const createdMsg = await prisma.contactMessage.create({
    data: contactInput,
  });
  assert(createdMsg.id !== undefined, "Contact message saved to database");
  await prisma.contactMessage.delete({ where: { id: createdMsg.id } });

  // TEST 5: Product CRUD Operations
  console.log("\n[5] Verifying Product CRUD Flow...");
  const firstCategory = await prisma.category.findFirst({ where: { type: "PRODUCT" } });
  const testProduct = await prisma.product.create({
    data: {
      title: "Test Unit Alat Berat Kompresor",
      slug: `test-kompresor-${Date.now()}`,
      sku: `TEST-COMP-${Date.now().toString().slice(-4)}`,
      brand: "Atlas Copco",
      categoryId: firstCategory!.id,
      shortDesc: "Unit kompresor angin industri tekanan tinggi",
      description: "Kompresor industri handal untuk pabrik manufaktur otomotif.",
      specifications: JSON.stringify([{ key: "Tekanan", value: "8 Bar" }]),
      price: 45000000,
      showPrice: false,
      availability: "READY_STOCK",
      isFeatured: false,
      isPublished: true,
      images: JSON.stringify(["https://placehold.co/600x400"]),
    },
  });
  assert(testProduct.id !== undefined, "Test product created");

  const fetchedProduct = await prisma.product.findUnique({
    where: { id: testProduct.id },
  });
  assert(fetchedProduct?.title === "Test Unit Alat Berat Kompresor", "Product queried successfully");

  await prisma.product.delete({ where: { id: testProduct.id } });
  assert(true, "Test product deleted cleanly");

  console.log("\n==================================================");
  console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runAcceptanceTests()
  .catch((e) => {
    console.error("Test execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

