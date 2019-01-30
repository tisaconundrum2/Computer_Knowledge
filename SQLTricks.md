# Only get the first 10 rows
```
select * from something fetch first 10 rows only
```

# Getting the username/password for Globalship login screen
```
select * from app.users where code = 'ADMIN';
```

# Getting <commodityitemcode>
```
select * from app.commodity_items where code="123456789"
```

# Finding Packages
```
select * from live.package_details where package_tracking_number like '123456789'
select * from live.package_details where package_tracking_number like '123456%'
select * from archive.package_details where package_tracking_number like '123456%'
```
# Are they shipping on their server
```
select
        SHIPMENT_ID,
        SHIPPED,
        CARRIER_CODE,
        PACKAGE_CARRIER
from live.package_details
fetch first 10 rows only
-- This will display most recent package
```

# Finding Package after a particular manifested date
```
select * from live.package_details where date(manifested) > '2019-01-01'

select * from archive.package_details where date(manifested) > '2019-01-01'
```

# Best way to tell if machine is a Dev
```
select * from ups.commission_info where description like 'Book%'
-- Book number values will begin with 2
```

# Find the Version of Globalship
```
select * from app.application_parameters
```

# getting a meter numbers from SQL
```
select * from app.carrier_parameters where carrier_code = 'FDX-OHEXP-F'
```

# Open and Close manifests
```
-- Run each separately

CALL APP.INIT_SESSION();
CALL APP.OPEN_CARRIER('{CARRIER}','{DATE:YYYY-MM-DD}');
select * from session.errors;

-- Run each separately

CALL APP.INIT_SESSION();
CALL APP.CLOSE_CARRIER('{CARRIER}','{DATE:YYYY-MM-DD}');
SELECT * FROM SESSION.ERRORS;
```

# Joining tables together in DB2
```
select  s.id, s.reference_number_5, p.package_created, p.manifested
from
    live.shipments s, live.package_details p
where
    s.id=p.shipment_id
```

# Selecting multiple items instead of UNION
```
select * from live.shipments where LEFT(reference_number_5, 10) in 
                                                                  ('0030184608',
                                                                   '0030183910',
                                                                   '0030183843',
                                                                   '0030183843',
                                                                   '0030183738')

select * from live.shipments where reference_number_5 like '0030183745%'
union
select * from live.shipments where reference_number_5 like '0030183740%'
union
select * from live.shipments where reference_number_5 like '0030183739%'
union
select * from live.shipments where reference_number_5 like '0030183740%'
union
select * from live.shipments where reference_number_5 like '0030183742%'
union
select * from live.shipments where reference_number_5 like '0030183738%'

-- The above two sql queries do the same thing.
```

#Display the min and max hours of each day of shipping
```
-- This script can give us an idea of what the hourly shipping is
-- Mostly guidelines than actual hard rule of when things are being shipped

select distinct date(package_created) as package_created, 
	min(hour(package_created)) as min_hour, 
	max(hour(package_created)) as max_hour
from live.package_details
group by date(package_created)
fetch first 100 rows only
```

# Display results between a certain time
```
select * from archive.package_details where carrier_code = '<code>'
and timestamp(package_created) between '2019-01-22 07:00:00.000' and '2019-01-22 8:00:00.000'
```

# Search without worrying about case
```
select * from history.package_details where UPPER(DEST_CONTACT) like UPPER('Michael Long')
```

# Recommission a carrier
```
select * from ups.vw_commission_script
where carrier_code = '{code}'

-- This will give you a script that you will need to run again.
```

# Finding Manifest Upload errors
```
select * from app.carrier_edi where status_code <> 0 order by created desc
```

