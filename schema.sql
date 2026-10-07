-- À coller dans Supabase > SQL Editor > Run
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(8,2) not null,
  description text,
  image_url text,
  created_at timestamptz default now()
);

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null default 'client'
);

create function handle_new_user() returns trigger as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end; $$ language plpgsql security definer;
create trigger on_signup after insert on auth.users
  for each row execute procedure handle_new_user();

alter table products enable row level security;
alter table profiles enable row level security;

create policy "Lecture publique" on products for select using (true);
create policy "Admin écrit" on products for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Lire son profil" on profiles for select using (id = auth.uid());

-- Bucket public pour les photos + droits d'upload pour l'admin
insert into storage.buckets (id, name, public) values ('products', 'products', true);
create policy "Photos visibles" on storage.objects for select using (bucket_id = 'products');
create policy "Admin upload" on storage.objects for all using (
  bucket_id = 'products' and
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- APRÈS ta propre inscription sur le site, remplace TON_EMAIL puis exécute :
-- update profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'TON_EMAIL');
