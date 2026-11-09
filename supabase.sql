-- =====================================================================
--  La Guilde des SES : sauvegarde de la progression par code secret
--
--  À lancer dans Supabase (SQL Editor → Run). Le script est relançable
--  sans risque : il crée ce qui manque et conserve les sauvegardes.
--  Tout est préfixé « guilde_ » : il peut cohabiter avec une autre
--  application dans le même projet Supabase.
--
--  Principe : pas de compte, pas d'e-mail. Le navigateur tire au sort un
--  code de 16 caractères ; la base ne stocke que son empreinte SHA-256.
--  La table est fermée (RLS sans politique) : on n'y accède que par les
--  trois fonctions guilde_lire, guilde_enregistrer, guilde_enregistrer_atelier.
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.guilde_progression (
  empreinte  text primary key,                    -- SHA-256 du code (le code n'est jamais stocké)
  etat       jsonb not null default '{}'::jsonb,  -- progression, écus, personnage, quêtes, hauts faits
  maj        bigint not null default 0,           -- horodatage (ms) de la dernière modification côté navigateur
  atelier    jsonb not null default '[]'::jsonb,  -- dernières copies de l'Atelier de rédaction et leurs corrections
  cree_le    timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);
alter table public.guilde_progression enable row level security;
revoke all on table public.guilde_progression from anon, authenticated;
create index if not exists guilde_progression_cree_le on public.guilde_progression (cree_le);

-- Empreinte d'un code valide : 16 caractères parmi 32 (sans I, O, 0, 1), tirets et espaces ignorés.
create or replace function public.guilde_empreinte(p_code text) returns text
language plpgsql immutable set search_path = '' as $$
declare
  c text := upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
begin
  if c !~ '^[A-HJ-NP-Z2-9]{16}$' then
    raise exception 'Code de sauvegarde invalide' using errcode = '22023';
  end if;
  return encode(extensions.digest(c, 'sha256'), 'hex');
end $$;

-- Lire une sauvegarde (null si le code n'existe pas).
create or replace function public.guilde_lire(p_code text) returns json
language plpgsql security definer set search_path = '' as $$
declare
  r public.guilde_progression;
begin
  select * into r from public.guilde_progression where empreinte = public.guilde_empreinte(p_code);
  if not found then return null; end if;
  return json_build_object('etat', r.etat, 'maj', r.maj, 'atelier', r.atelier, 'modifie_le', r.modifie_le);
end $$;

-- Enregistrer la progression. N'écrase jamais une sauvegarde plus récente :
-- renvoie ok = false si un autre appareil a enregistré après (le navigateur relit alors).
create or replace function public.guilde_enregistrer(p_code text, p_etat jsonb, p_maj bigint) returns json
language plpgsql security definer set search_path = '' as $$
declare
  e text := public.guilde_empreinte(p_code);
  r public.guilde_progression;
begin
  if p_etat is null or jsonb_typeof(p_etat) <> 'object' then
    raise exception 'Sauvegarde invalide' using errcode = '22023';
  end if;
  if octet_length(p_etat::text) > 150000 then
    raise exception 'Sauvegarde trop volumineuse' using errcode = '22023';
  end if;
  -- garde-fous pour la base partagée : nombre total de sauvegardes et créations par heure
  if not exists (select 1 from public.guilde_progression where empreinte = e) then
    if (select count(*) from public.guilde_progression) >= 2000
       or (select count(*) from public.guilde_progression where cree_le > now() - interval '1 hour') >= 60 then
      raise exception 'Trop de nouvelles sauvegardes en ce moment : réessayez plus tard' using errcode = '53400';
    end if;
  end if;
  insert into public.guilde_progression as g (empreinte, etat, maj)
  values (e, p_etat, coalesce(p_maj, 0))
  on conflict (empreinte) do update
    set etat = excluded.etat, maj = excluded.maj, modifie_le = now()
    where g.maj <= excluded.maj
  returning * into r;
  if not found then
    select * into r from public.guilde_progression where empreinte = e;
    return json_build_object('ok', false, 'maj', r.maj);
  end if;
  return json_build_object('ok', true, 'maj', r.maj);
end $$;

-- Enregistrer l'historique de l'Atelier (le code doit déjà exister).
create or replace function public.guilde_enregistrer_atelier(p_code text, p_atelier jsonb) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  e text := public.guilde_empreinte(p_code);
begin
  if p_atelier is null or jsonb_typeof(p_atelier) <> 'array' then
    raise exception 'Historique invalide' using errcode = '22023';
  end if;
  if octet_length(p_atelier::text) > 100000 then
    raise exception 'Historique trop volumineux' using errcode = '22023';
  end if;
  update public.guilde_progression set atelier = p_atelier, modifie_le = now() where empreinte = e;
  return found;
end $$;

revoke all on function public.guilde_empreinte(text) from public, anon, authenticated;
-- seules ces trois fonctions sont appelables depuis le site (rôle anon, clé publique)
revoke all on function public.guilde_lire(text) from public, authenticated;
revoke all on function public.guilde_enregistrer(text, jsonb, bigint) from public, authenticated;
revoke all on function public.guilde_enregistrer_atelier(text, jsonb) from public, authenticated;
grant execute on function public.guilde_lire(text) to anon;
grant execute on function public.guilde_enregistrer(text, jsonb, bigint) to anon;
grant execute on function public.guilde_enregistrer_atelier(text, jsonb) to anon;
