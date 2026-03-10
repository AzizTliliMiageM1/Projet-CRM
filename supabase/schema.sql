-- Schéma multi-tenant sécurisé pour le CRM SaaS (à exécuter dans Supabase)

-- =============================================================
-- 1. Organisations (tenant)
-- =============================================================

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- =============================================================
-- 2. Profils utilisateurs (rôles + appartenance organisation)
-- =============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('admin', 'sales', 'user')),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_organization_id_idx on public.profiles(organization_id);
create index if not exists profiles_id_organization_id_idx on public.profiles(id, organization_id);

-- =============================================================
-- 3. Tables métier multi-tenant
-- =============================================================

-- Invitations pour rejoindre une organisation
create table if not exists public.org_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin', 'sales', 'user')),
  token text not null unique,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists org_invitations_email_idx on public.org_invitations(email);
create index if not exists org_invitations_org_idx on public.org_invitations(organization_id);

-- Entreprises (par organisation)
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  domain text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists companies_organization_id_idx on public.companies(organization_id);

-- Contacts (par organisation)
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  company_id uuid references public.companies(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists contacts_email_key on public.contacts(email);
create index if not exists contacts_company_id_idx on public.contacts(company_id);
create index if not exists contacts_organization_id_idx on public.contacts(organization_id);

-- Leads (par organisation)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  status text not null default 'new' check (
    status in ('new', 'qualified', 'proposal', 'negotiation', 'won', 'lost')
  ),
  value numeric(12,2) not null default 0 check (value >= 0),
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  owner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_owner_idx on public.leads(owner_id);
create index if not exists leads_organization_id_idx on public.leads(organization_id);
create index if not exists leads_org_owner_idx on public.leads(organization_id, owner_id);

-- Tâches liées aux leads (par organisation)
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  title text not null,
   assigned_to uuid references auth.users(id) on delete set null,
  due_date date,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_due_date_idx on public.tasks(due_date);
create index if not exists tasks_organization_id_idx on public.tasks(organization_id);
create index if not exists tasks_assigned_to_idx on public.tasks(assigned_to);
create index if not exists tasks_org_assigned_idx on public.tasks(organization_id, assigned_to);

-- Historique des emails (par organisation)
create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  to_email text not null,
  subject text not null,
  status text not null default 'sent' check (status in ('sent', 'failed')),
  error_message text,
  sent_at timestamptz not null default now()
);

create index if not exists email_logs_organization_id_idx on public.email_logs(organization_id);

-- =============================================================
-- 4. Fonctions helpers pour RLS
-- =============================================================

-- Retourne l'organisation courante de l'utilisateur connecté
create or replace function public.current_user_org()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select organization_id
  from public.profiles
  where id = auth.uid();
$$;

-- Retourne le rôle applicatif de l'utilisateur connecté
create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role
  from public.profiles
  where id = auth.uid();
$$;

-- =============================================================
-- 5. Trigger de création automatique de profil + organisation
-- =============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_role text;
  v_inv_id uuid;
begin
  -- Si une invitation existe pour cet email et n'est pas expirée, rattache à l'organisation invitante
  select oi.organization_id, oi.role, oi.id
    into v_org_id, v_role, v_inv_id
  from public.org_invitations oi
  where oi.email = new.email
    and oi.accepted_at is null
    and oi.expires_at > now()
  order by oi.expires_at desc
  limit 1;

  if v_org_id is not null then
    -- Marque l'invitation comme acceptée
    update public.org_invitations
    set accepted_at = now()
    where id = v_inv_id;

    -- Crée le profil dans l'organisation existante avec le rôle prévu
    insert into public.profiles (id, full_name, role, organization_id)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', new.email),
      coalesce(v_role, 'user'),
      v_org_id
    );
  else
    -- Sinon, crée une nouvelle organisation dédiée pour ce nouvel utilisateur
    insert into public.organizations (name)
    values (coalesce(new.raw_user_meta_data->>'company', new.email || ' org'))
    returning id into v_org_id;

    -- Crée le profil associé dans cette nouvelle organisation
    insert into public.profiles (id, full_name, role, organization_id)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', new.email),
      'user',
      v_org_id
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================================
-- 6. RLS (Row Level Security) multi-tenant fort
-- =============================================================

-- Active RLS sur toutes les tables
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.contacts enable row level security;
alter table public.leads enable row level security;
alter table public.tasks enable row level security;
alter table public.email_logs enable row level security;

alter table public.org_invitations enable row level security;

-- Par défaut, aucune ligne n'est visible/écrivable sans policy explicite

-- ========================
-- 6.1. Organizations
-- ========================

drop policy if exists organizations_select_own on public.organizations;
create policy organizations_select_own
  on public.organizations
  for select
  using (id = public.current_user_org());

-- Pas d'insert/update/delete sur organizations via API publique

-- ========================
-- 6.2. Profiles
-- ========================

-- Lecture :
--  - chaque utilisateur peut lire son propre profil
--  - un admin peut lire tous les profils de son organisation
drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self
  on public.profiles
  for select
  using (id = auth.uid());

drop policy if exists profiles_select_admin_org on public.profiles;
create policy profiles_select_admin_org
  on public.profiles
  for select
  using (
    organization_id = public.current_user_org()
    and public.current_user_role() = 'admin'
  );

-- Modification du profil : uniquement par l'utilisateur lui-même ou un admin de l'organisation
drop policy if exists profiles_update_self_or_admin on public.profiles;
create policy profiles_update_self_or_admin
  on public.profiles
  for update
  using (
    organization_id = public.current_user_org()
    and (
      id = auth.uid()
      or public.current_user_role() = 'admin'
    )
  )
  with check (
    organization_id = public.current_user_org()
  );

-- Pas de delete via API publique

-- ========================
-- 6.3. Companies
-- ========================

-- Lecture : tout utilisateur de l'organisation
drop policy if exists companies_select_same_org on public.companies;
create policy companies_select_same_org
  on public.companies
  for select
  using (organization_id = public.current_user_org());

-- Ecriture : uniquement admin ou sales de l'organisation
drop policy if exists companies_write_admin_or_sales on public.companies;
create policy companies_write_admin_or_sales
  on public.companies
  for all
  using (
    organization_id = public.current_user_org()
    and public.current_user_role() in ('admin', 'sales')
  )
  with check (
    organization_id = public.current_user_org()
  );

-- ========================
-- 6.4. Contacts
-- ========================

drop policy if exists contacts_select_same_org on public.contacts;
create policy contacts_select_same_org
  on public.contacts
  for select
  using (organization_id = public.current_user_org());

drop policy if exists contacts_write_admin_or_sales on public.contacts;
create policy contacts_write_admin_or_sales
  on public.contacts
  for all
  using (
    organization_id = public.current_user_org()
    and public.current_user_role() in ('admin', 'sales')
  )
  with check (
    organization_id = public.current_user_org()
  );

-- ========================
-- 6.5. Leads
-- ========================

-- Lecture :
--  - admin : tous les leads de l'organisation
--  - sales : seulement ses leads (owner_id = auth.uid()) dans l'organisation
--  - user : lecture très restreinte, ici aucun lead par défaut (peut être adapté)
drop policy if exists leads_select_by_role on public.leads;
create policy leads_select_by_role
  on public.leads
  for select
  using (
    organization_id = public.current_user_org()
    and (
      public.current_user_role() = 'admin'
      or (
        public.current_user_role() = 'sales'
        and owner_id = auth.uid()
      )
    )
  );

-- Ecriture :
--  - admin : tous les leads de l'organisation
--  - sales : uniquement ses propres leads (owner_id = auth.uid())
drop policy if exists leads_write_by_role on public.leads;
create policy leads_write_by_role
  on public.leads
  for all
  using (
    organization_id = public.current_user_org()
    and (
      public.current_user_role() = 'admin'
      or (
        public.current_user_role() = 'sales'
        and owner_id = auth.uid()
      )
    )
  )
  with check (
    organization_id = public.current_user_org()
  );

-- ========================
-- 6.6. Tasks
-- ========================

-- Lecture :
--  - admin : toutes les tâches de l'organisation
--  - sales : uniquement les tâches qui lui sont assignées
drop policy if exists tasks_select_by_role on public.tasks;
create policy tasks_select_by_role
  on public.tasks
  for select
  using (
    organization_id = public.current_user_org()
    and (
      public.current_user_role() = 'admin'
      or (
        public.current_user_role() = 'sales'
        and assigned_to = auth.uid()
      )
    )
  );

-- Ecriture :
--  - admin : toutes les tâches de l'organisation
--  - sales : uniquement sur les tâches qui lui sont assignées
drop policy if exists tasks_write_by_role on public.tasks;
create policy tasks_write_by_role
  on public.tasks
  for all
  using (
    organization_id = public.current_user_org()
    and (
      public.current_user_role() = 'admin'
      or (
        public.current_user_role() = 'sales'
        and assigned_to = auth.uid()
      )
    )
  )
  with check (
    organization_id = public.current_user_org()
  );

-- ========================
-- 6.8. Org invitations
-- ========================

-- Lecture / écriture des invitations réservées aux admins de l'organisation
drop policy if exists org_invitations_select_admin on public.org_invitations;
create policy org_invitations_select_admin
  on public.org_invitations
  for select
  using (
    organization_id = public.current_user_org()
    and public.current_user_role() = 'admin'
  );
drop policy if exists org_invitations_write_admin on public.org_invitations;
create policy org_invitations_write_admin
  on public.org_invitations
  for all
  using (
    organization_id = public.current_user_org()
    and public.current_user_role() = 'admin'
  )
  with check (
    organization_id = public.current_user_org()
  );

-- ========================
-- 6.7. Email logs
-- ========================

drop policy if exists email_logs_select_same_org on public.email_logs;
create policy email_logs_select_same_org
  on public.email_logs
  for select
  using (
    organization_id = public.current_user_org()
    and public.current_user_role() in ('admin', 'sales')
  );
drop policy if exists email_logs_write_admin_or_sales on public.email_logs;
create policy email_logs_write_admin_or_sales
  on public.email_logs
  for all
  using (
    organization_id = public.current_user_org()
    and public.current_user_role() in ('admin', 'sales')
  )
  with check (
    organization_id = public.current_user_org()
  );

-- =============================================================
-- 7. Contraintes supplémentaires & cohérence
-- =============================================================

-- Notes :
--  - Tous les champs organization_id sont NOT NULL et reliés à organizations(id).
--  - La valeur monétaire des leads est contrainte à value >= 0.
--  - Les deletes en cascade sur organizations suppriment les données associées
--    (isolation forte par tenant, pas de fuite cross-org possible).
--  - Les policies RLS garantissent que toutes les requêtes doivent respecter
--    organization_id = current_user_org(), aucun filtrage n'est laissé au frontend.

-- =============================================================
-- 8. RPC pour accepter une invitation d'organisation
-- =============================================================

create or replace function public.accept_invitation(p_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inv public.org_invitations%rowtype;
  v_current_org uuid;
begin
  if auth.uid() is null then
    return false;
  end if;

  select *
    into v_inv
  from public.org_invitations
  where token = p_token
    and accepted_at is null
    and expires_at > now()
  for update;

  if not found then
    return false;
  end if;

   -- Empêche de changer d'organisation si le profil est déjà rattaché à une autre org
  select organization_id
    into v_current_org
  from public.profiles
  where id = auth.uid();

  if v_current_org is not null and v_current_org <> v_inv.organization_id then
    return false;
  end if;

  -- Met à jour le profil de l'utilisateur pour rejoindre l'organisation
  update public.profiles
  set organization_id = v_inv.organization_id,
      role = v_inv.role,
      updated_at = now()
  where id = auth.uid();

  -- Marque l'invitation comme acceptée
  update public.org_invitations
  set accepted_at = now()
  where id = v_inv.id;

  return true;
end;
$$;

-- Verrouillage supplémentaire de la table organizations (pas d'écriture directe via rôles API)
revoke all on table public.organizations from public;
revoke all on table public.organizations from anon;
revoke all on table public.organizations from authenticated;
