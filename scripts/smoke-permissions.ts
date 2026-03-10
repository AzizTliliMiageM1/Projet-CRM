/*
  Script de smoke test des permissions.

  Ce script utilise Supabase directement (RLS) pour vérifier :
  - qu un admin peut créer une company,
  - qu un sales peut créer un lead mais ne peut pas modifier un lead qui ne lui appartient pas,
  - qu un user simple ne peut pas créer de company.

  Les identifiants des comptes de test sont lus depuis les variables d environnement :
    TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD
    TEST_SALES_EMAIL, TEST_SALES_PASSWORD
    TEST_USER_EMAIL, TEST_USER_PASSWORD

  À exécuter avec :
    npx ts-node scripts/smoke-permissions.ts
*/

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Charge les variables depuis .env.local pour les scripts Node
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("SUPABASE_URL ou ANON_KEY manquant dans l'environnement");
  process.exit(1);
}

interface TestResult {
  name: string;
  ok: boolean;
  details?: string;
}

async function signIn(email: string, password: string) {
  const client = createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    throw new Error(`Échec connexion pour ${email}: ${error?.message ?? "unknown"}`);
  }
  return client;
}

async function run() {
  const results: TestResult[] = [];

  const adminEmail = process.env.TEST_ADMIN_EMAIL as string;
  const adminPassword = process.env.TEST_ADMIN_PASSWORD as string;
  const salesEmail = process.env.TEST_SALES_EMAIL as string;
  const salesPassword = process.env.TEST_SALES_PASSWORD as string;
  const userEmail = process.env.TEST_USER_EMAIL as string;
  const userPassword = process.env.TEST_USER_PASSWORD as string;

  if (!adminEmail || !adminPassword || !salesEmail || !salesPassword || !userEmail || !userPassword) {
    console.error("Variables TEST_* manquantes. Voir docs/QA_CHECKLIST.md pour la configuration.");
    process.exit(1);
  }

  // 1) Admin peut créer une company
  try {
    const adminClient = await signIn(adminEmail, adminPassword);
    const { error } = await adminClient.from("companies").insert({
      name: "SmokeTest Co",
    });

    results.push({
      name: "Admin peut créer une company",
      ok: !error,
      details: error ? error.message : undefined,
    });
  } catch (error) {
    results.push({
      name: "Admin peut créer une company",
      ok: false,
      details: error instanceof Error ? error.message : String(error),
    });
  }

  // 2) Sales peut créer un lead
  let foreignLeadId: string | null = null;
  try {
    const salesClient = await signIn(salesEmail, salesPassword);
    const { data, error } = await salesClient
      .from("leads")
      .insert({ title: "Lead smoke test", value: 100 })
      .select("id")
      .single();

    results.push({
      name: "Sales peut créer un lead",
      ok: !error && !!data,
      details: error ? error.message : undefined,
    });

    // Créer un lead "extérieur" via l admin pour tester l interdiction de modification
    const adminClient = await signIn(adminEmail, adminPassword);
    const { data: foreignLead, error: foreignError } = await adminClient
      .from("leads")
      .insert({ title: "Foreign lead", value: 50 })
      .select("id")
      .single();

    if (!foreignError && foreignLead) {
      foreignLeadId = foreignLead.id as string;
    }
  } catch (error) {
    results.push({
      name: "Sales peut créer un lead",
      ok: false,
      details: error instanceof Error ? error.message : String(error),
    });
  }

  // 3) Sales ne peut pas modifier un lead qui ne lui appartient pas
  try {
    if (!foreignLeadId) {
      throw new Error("foreignLeadId manquant – création du lead externe échouée");
    }

    const salesClient = await signIn(salesEmail, salesPassword);
    const { error } = await salesClient
      .from("leads")
      .update({ title: "Hacked by sales" })
      .eq("id", foreignLeadId);

    // On s attend à une erreur RLS
    results.push({
      name: "Sales ne peut PAS modifier un lead étranger",
      ok: !!error,
      details: error ? undefined : "Mise à jour autorisée – problème de RLS",
    });
  } catch (error) {
    results.push({
      name: "Sales ne peut PAS modifier un lead étranger",
      ok: true,
      details: `Erreur attendue: ${error instanceof Error ? error.message : String(error)}`,
    });
  }

  // 4) User simple ne peut pas créer une company
  try {
    const userClient = await signIn(userEmail, userPassword);
    const { error } = await userClient.from("companies").insert({
      name: "Should not be created",
    });

    // On s attend à une erreur RLS
    results.push({
      name: "User simple ne peut PAS créer une company",
      ok: !!error,
      details: error ? undefined : "Insertion autorisée – problème de RLS",
    });
  } catch (error) {
    results.push({
      name: "User simple ne peut PAS créer une company",
      ok: true,
      details: `Erreur attendue: ${error instanceof Error ? error.message : String(error)}`,
    });
  }

  // Affichage du résumé
  console.log("\n=== Résultats smoke permissions ===");
  for (const r of results) {
    console.log(`${r.ok ? "[OK]" : "[FAIL]"} ${r.name}${r.details ? ` -> ${r.details}` : ""}`);
  }

  const allOk = results.every((r) => r.ok);
  process.exit(allOk ? 0 : 1);
}

run().catch((error) => {
  console.error("Erreur inattendue dans le script de smoke permissions", error);
  process.exit(1);
});
