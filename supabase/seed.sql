insert into public.supplier_profiles(name,slug,trade_category,city,state,service_area,description,source_name,external_id) values
('Northline Concrete Co.','northline-concrete','Concrete','Athens','AL','North Alabama','Residential concrete supplier serving builders across North Alabama.','TradeStak Seed','seed-1'),
('Summit Roofing Supply','summit-roofing-supply','Roofing','Huntsville','AL','North Alabama','Roofing material supplier for residential and light commercial construction.','TradeStak Seed','seed-2'),
('Redstone Plumbing Partners','redstone-plumbing-partners','Plumbing','Madison','AL','Huntsville Metro','Plumbing supply and trade partner serving the Huntsville market.','TradeStak Seed','seed-3'),
('Tennessee Valley Millwork','tennessee-valley-millwork','Millwork','Decatur','AL','Tennessee Valley','Millwork, doors, trim, and finish carpentry supply.','TradeStak Seed','seed-4') on conflict do nothing;
